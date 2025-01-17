/*
 * 项目启动入口方法
 */

import {createApp} from 'vue';
import Antd from 'ant-design-vue';
import * as antIcons from '@ant-design/icons-vue';
import lodash from 'lodash';
import JsonViewer from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import App from './App.vue';
import {loginApi} from '/src/api/system/login-api';
import constantsInfo from '/@/constants/index';
import {privilegeDirective} from '/@/directives/privilege';
import i18n from '/@/i18n/index';
import privilegePlugin from '/@/plugins/privilege-plugin';
import smartEnumPlugin from '/@/plugins/smart-enums-plugin';
import {buildRoutes, router} from '/@/router';
import {store} from '/@/store';
import {useUserStore} from '/@/store/modules/system/user';
import 'ant-design-vue/dist/reset.css';
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css';
import '/@/theme/index.less';
import {localRead, localSave} from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import {flatArray} from "/src/utils/common-util.js";


//引入依赖和语言
import 'highlight.js/styles/atom-one-dark.css'
import hljs from "highlight.js/lib/core";
import hljsVuePlugin from "@highlightjs/vue-plugin";
//按需引入语言
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import java from "highlight.js/lib/languages/java";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import html from "highlight.js/lib/languages/vbscript-html";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/json";
import {userConfigApi} from "/@/api/system/user-config-api.js";
import {useAppConfigStore} from "/@/store/modules/system/app-config.js";
import localStorageKeyConst from "/@/constants/local-storage-key-const.js";
import {appDefaultConfig} from "/@/config/app-config.js";
import localKey from "/@/constants/local-storage-key-const.js";
import GlobalMethods from './plugins/global-methods.js';

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", html);

/*
 * -------------------- ※ 着重 解释说明下main.js的初始化逻辑 begin ※ --------------------
 *
 * 1、在main.js里很多框架都是 直接调用初始化的vue方法，创建vue实例，然后挂载路由router、状态管理store等等，但是关于router这块是有问题的；
 * 2、因为现在大部分路由都是从后端接口返回的，如若直接初始化挂载路由，这时前端还没有从后端请求路由的数据，所以只能写到路由拦截器里，这样很绕很不清晰；
 *    正确的做法流程应该是：
 *      2.1）如果存在登录信息，则先ajax请求用户的所有路由，然后加载，再去创建vue实例和挂载路由
 *      2.2）如果不存在路由信息，则创建vue实例和挂载路由（此时的路由应该只有login页面，因为用户拥有哪些路由是登录之后才知道的）
 * 3、以上，在main.js里两个方法，一个是 获取登录信息getLoginInfo，另一个初始化vue: initVue，在最下的if操作里
 *
 * -------------------- ※ 着重 解释说明下main.js的初始化逻辑 end ※ --------------------
 */

/**
 * 获取用户信息和用户权限对应的路由，构建动态路由
 */
async function getUserInfo() {
    try {
        //获取登录用户信息
        const res = await loginApi.getUserInfo();
        const loginUser = res.data;
        localSave(LocalStorageKeyConst.USER_TOKEN, loginUser.accessToken ? loginUser.accessToken : '');
        localSave(LocalStorageKeyConst.IDENTITY_ID, loginUser.identityId ? loginUser.identityId : '');

        const routeRes = await loginApi.getUserRoutes();
        loginUser.userRoutes = routeRes.data.routes
        localSave(LocalStorageKeyConst.USER_INFO, loginUser ? JSON.stringify(loginUser) : '');
        localSave(LocalStorageKeyConst.ROUTERS, JSON.stringify(loginUser.userRoutes));
        //构建系统的路由
        let menuRouterList = flatArray(loginUser.userRoutes).filter(e => e.id)
        buildRoutes(menuRouterList);
        initVue();
        //更新用户信息到pinia
        useUserStore().setUserLoginInfo(loginUser);
        // 个人设置
        await setConfig()
    } catch (e) {
        // message.error(e.data ? e.data.msg : e.message);
        // smartSentry.captureError(e);
        const cache = localRead(LocalStorageKeyConst.ROUTERS);
        if (cache) {
            const routers = JSON.parse(cache);
            const format = flatArray(routers).filter(e => e.id);
            buildRoutes(format);
            initVue();
            useUserStore().setMenuTree(routers)
            useUserStore().setMenuRouterList(format)
        } else {
            initVue();
        }
    }
}
async function setConfig() {
    const res = await userConfigApi.getUserConfig()
    if(res.data && res.data.configValue){
        useAppConfigStore().setConfig(JSON.parse(res.data.configValue))
        localSave(localStorageKeyConst.APP_CONFIG, res.data.configValue);
    } else {
        useAppConfigStore().setConfig(appDefaultConfig)
        localSave(localStorageKeyConst.APP_CONFIG, JSON.stringify(appDefaultConfig));
    }
    if(res.data && res.data.quickEntryValue) {
        localSave(localKey.HOME_QUICK_ENTRY, res.data.quickEntryValue);
    }
}
function initVue() {
    let vueApp = createApp(App);
    let app = vueApp.use(router).use(store).use(i18n).use(Antd).use(smartEnumPlugin, constantsInfo).use(privilegePlugin).use(JsonViewer);
    //注入权限
    app.directive('privilege', {
        mounted(el, binding) {
            privilegeDirective(el, binding);
        },
    });
    // 使用全局插件
    app.use(GlobalMethods);
    // 注册图标组件
    Object.keys(antIcons).forEach((key) => {
        app.component(key, antIcons[key]);
    });
    //全局
    app.config.globalProperties.$antIcons = antIcons;
    app.config.globalProperties.$lodash = lodash;
    // highlight
    app.use(hljsVuePlugin)
    //挂载
    app.mount('#app');
}

//不需要获取用户信息、用户菜单、用户菜单动态路由，直接初始化vue即可
let token = localRead(LocalStorageKeyConst.USER_TOKEN);
if (!token) {
    initVue();
} else {
    getUserInfo();
}
