/*
 *  ajax请求
 */
import { message, Modal } from 'ant-design-vue';
import axios from 'axios';
import { localClear, localRead } from '/@/utils/local-util';
import { decryptData, encryptData } from './encrypt';
import { DATA_TYPE_ENUM } from '../constants/common-const';
import _ from 'lodash';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import qs from 'qs';

// token的消息头
const TOKEN_HEADER = 'Authorization';
const DEFAULT_TOKEN = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0';

// 创建axios对象
const smartAxios = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});
const DEFAULT_HEADERS = {
    'Tenant-Id': '000000',
};

// 退出系统
function logout() {
    localClear();
    location.href = '/';
}

// ================================= 请求拦截器 =================================

smartAxios.interceptors.request.use(
    (config) => {
        config.headers = { ...config.headers, ...DEFAULT_HEADERS };
        // 在发送请求之前消息头加入token token
        const token = localRead(LocalStorageKeyConst.USER_TOKEN);
        config.headers[TOKEN_HEADER] = token ? `Bearer ${token}` : DEFAULT_TOKEN;
        const identityId = localRead(LocalStorageKeyConst.IDENTITY_ID);
        if (identityId) {
            config.headers['Identity-Id'] = identityId;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// ================================= 响应拦截器 =================================

// 添加响应拦截器
smartAxios.interceptors.response.use(
    async (response) => {
        // 根据content-type ，判断是否为 json 数据
        let contentType = response.headers['content-type'] ? response.headers['content-type'] : response.headers['Content-Type'];
        if (contentType.indexOf('application/json') === -1) {
            return Promise.resolve(response);
        }
        let res = response.data;
        // 如果是json数据
        if (response.data && response.data instanceof Blob) {
            const json = JSON.parse(await response.data.text());
            if (json.code === 200) {
                return Promise.resolve(response);
            } else {
                res.code = json.code;
                res.msg = json.msg;
            }
        }

        // 如果是加密数据
        if (response.data.dataType === DATA_TYPE_ENUM.ENCRYPT.value) {
            response.data.encryptData = response.data.data;
            let decryptStr = decryptData(response.data.data);
            if (decryptStr) {
                response.data.data = JSON.parse(decryptStr);
            }
        }

        if (res.code && res.code !== 200) {
            // // `token` 过期或者账号已在别处登录
            // if (res.code === 30007 || res.code === 30008) {
            //     message.destroy();
            //     message.error('您没有登录，请重新登录');
            //     setTimeout(logout, 300);
            //     return Promise.reject(response);
            // }
            //
            // // 等保安全的登录提醒
            // if (res.code === 30010 || res.code === 30011) {
            //     Modal.error({
            //         title: '重要提醒',
            //         content: res.msg,
            //     });
            //     return Promise.reject(response);
            // }
            //
            // // 长时间未操作系统，需要重新登录
            // if (res.code === 30012) {
            //     Modal.error({
            //         title: '重要提醒',
            //         content: res.msg,
            //         onOk: logout,
            //     });
            //     setTimeout(logout, 3000);
            //     return Promise.reject(response);
            // }
            message.destroy();
            message.error(res.msg);
            return Promise.reject(response);
        } else {
            return Promise.resolve(res);
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.response.status === 401) {
            if (document.getElementsByClassName('401-modal').length === 0) {
                // 认证失败
                message.destroy();
                Modal.error({
                    class: '401-modal',
                    title: '登陆超时提醒',
                    content: '登录超时，请重新登录',
                    okText: '确认',
                    onOk() {
                        logout();
                    },
                });
            }
            return;
        } else if (error.response.status === 404) {
            message.error(`请求路径错误 ${error.response.data.path}`);
        } else {
            message.destroy();
            message.error(error.message);
        }
        return Promise.reject(error);
    }
);

// ================================= 对外提供请求方法：通用请求，get， post, 下载download等 =================================

/**
 * get请求
 */
export const getRequest = (url, params) => {
    if (params && typeof params === 'object') {
        // 移除值为空的字段
        const keys = Object.keys(params);
        keys.forEach((key) => {
            if (params[key] === undefined || params[key] === null) {
                delete params[key];
            }
        });
    }
    if (url && url.includes('?')) {
        url = url + '&' + qs.stringify(params);
    }
    if (url && !url.includes('?')) {
        url = url + '?' + qs.stringify(params);
    }
    return request({ url, method: 'get' });
};

/**
 * get请求Blob
 */
export const getRequestBlob = (url, params) => {
    if (params && typeof params === 'object') {
        // 移除值为空的字段
        const keys = Object.keys(params);
        keys.forEach((key) => {
            if (params[key] === undefined || params[key] === null) {
                delete params[key];
            }
        });
    }
    if (url && url.includes('?')) {
        url = url + '&' + qs.stringify(params);
    }
    if (url && !url.includes('?')) {
        url = url + '?' + qs.stringify(params);
    }
    return request({ url, method: 'get', responseType: 'blob' });
};

/**
 * 通用请求封装
 * @param config
 */
export const request = (config) => {
    return smartAxios.request(config);
};

/**
 * post请求
 */
export const postRequest = (url, data) => {
    return request({
        data,
        url,
        method: 'post',
    });
};

/**
 * post请求Blob
 */
export const postRequestBlob = (url, data) => {
    return request({
        data,
        url,
        method: 'post',
        responseType: 'blob',
    });
};
// ================================= 加密 =================================

/**
 * 加密请求参数的post请求
 */
export const postEncryptRequest = (url, data) => {
    return request({
        data: { encryptData: encryptData(data) },
        url,
        method: 'post',
    });
};

// ================================= 下载 =================================

export const postDownload = function (url, data) {
    request({
        method: 'post',
        url,
        data,
        responseType: 'blob',
    })
        .then((data) => {
            handleDownloadData(data);
        })
        .catch((error) => {
            handleDownloadError(error);
        });
};

/**
 * 文件下载
 */
export const getDownload = function (url, params) {
    request({
        method: 'get',
        url,
        params,
        responseType: 'blob',
    })
        .then((data) => {
            handleDownloadData(data);
        })
        .catch((error) => {
            handleDownloadError(error);
        });
};

function handleDownloadError(error) {
    if (error instanceof Blob) {
        const fileReader = new FileReader();
        fileReader.readAsText(error);
        fileReader.onload = () => {
            const msg = fileReader.result;
            const jsonMsg = JSON.parse(msg);
            message.destroy();
            message.error(jsonMsg.msg);
        };
    } else {
        message.destroy();
        message.error('网络发生错误', error);
    }
}

function handleDownloadData(response) {
    if (!response) {
        return;
    }

    // 获取返回类型
    let contentType = _.isUndefined(response.headers['content-type']) ? response.headers['Content-Type'] : response.headers['content-type'];

    // 构建下载数据
    let url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;

    // 从消息头获取文件名
    let str = _.isUndefined(response.headers['content-disposition'])
        ? response.headers['Content-Disposition'].split(';')[1]
        : response.headers['content-disposition'].split(';')[1];

    let filename = _.isUndefined(str.split('fileName=')[1]) ? str.split('filename=')[1] : str.split('fileName=')[1];
    link.setAttribute('download', decodeURIComponent(filename));

    // 触发点击下载
    document.body.appendChild(link);
    link.click();

    // 下载完释放
    document.body.removeChild(link); // 下载完成移除元素
    window.URL.revokeObjectURL(url); // 释放掉blob对象
}
