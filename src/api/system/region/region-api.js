import { getRequest, postRequest, getRequestBlob, postRequestBlob } from '/src/lib/axios';

export const regionApi = {
  /**
   * 添加行政区域
   */
  addRegion: (param) => {
    return postRequest('/system/region/save', param);
  },

  /**
   * 更新行政区域
   */
  updateRegion: (param) => {
    return postRequest('/system/region/update', param);
  },

  /**
   * 删除行政区域
   */
  deleteRegion: (param) => {
    return postRequest('/system/region/delete', param);
  },

  /**
   * 行政区域分页列表
   */
  regionPage: (params) => {
    return getRequest('/system/region/page', params);
  },

  /**
   * 行政区域列表
   */
  regionList: (params) => {
    return getRequest('/system/region/list', params);
  },

  /**
   * 行政区域详情
   */
  getRegion: (params) => {
    return getRequest('/system/region/get', params);
  },

  /**
   * 导出数据
   * @param params
   */
  exportRegionData: (params) => {
    return postRequestBlob('/system/region/export', params);
  },

  /**
   * 下载导入模板
   */
  downloadRegionTemplate: () => {
    return getRequestBlob('/system/region/downloadTemplate');
  },
  /**
   * 异步加载获取行政区域集合
   */
  asyncLoading: (params) => {
    return getRequest('/system/region/asyncLoading', params);
  },
  /**
   * 获取行政区域格式化树形结构
   */
  regionTreeFormat: (params) => {
    return getRequest('/system/region/treeFormat', params);
  },
  /**
   * 修改状态
   * @param params
   */
  updateStatus: (params) => {
    return postRequest('/system/region/updateStatus', params);
  },
};
