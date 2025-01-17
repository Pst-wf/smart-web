/*
 * 项目的配置信息
 */
import { defineStore } from 'pinia';
import { appDefaultConfig } from '/@/config/app-config';
import localStorageKeyConst from '/@/constants/local-storage-key-const';
import { smartSentry } from '/@/lib/smart-sentry';
import { localRead } from '/@/utils/local-util';

let state = { ...appDefaultConfig };

let appConfigStr = localRead(localStorageKeyConst.APP_CONFIG);
let language = appDefaultConfig.language;
if (appConfigStr) {
    try {
        state = JSON.parse(appConfigStr);
        language = state.language;
    } catch (e) {
        smartSentry.captureError(e);
    }
}

/**
 * 获取初始化的语言
 */
export const getInitializedLanguage = function () {
    return language;
};

export const useAppConfigStore = defineStore({
    id: 'appConfig',
    state: () => ({
        // 读取config下的默认配置
        ...state,
    }),
    actions: {
        reset() {
            for (const k in appDefaultConfig) {
                this[k] = appDefaultConfig[k];
            }
        },
        showHelpDoc() {
            this.helpDocExpandFlag = true;
        },
        hideHelpDoc() {
            this.helpDocExpandFlag = false;
        },
        setConfig(data) {
            this.language = data.language;
            this.layout = data.layout;
            this.sideMenuWidth = data.sideMenuWidth;
            this.sideMenuTheme = data.sideMenuTheme;
            this.colorIndex = data.colorIndex;
            this.pageWidth = data.pageWidth;
            this.borderRadius = data.borderRadius;
            this.pageTagFlag = data.pageTagFlag;
            this.pageTagStyle = data.pageTagStyle;
            this.breadCrumbFlag = data.breadCrumbFlag;
            this.footerFlag = data.footerFlag;
            this.helpDocFlag = data.helpDocFlag;
            this.helpDocExpandFlag = data.helpDocExpandFlag;
            this.watermarkFlag = data.watermarkFlag;
            this.websiteName = data.websiteName;
            this.primaryColor = data.primaryColor;
            this.compactFlag = data.compactFlag;
            this.tableTextAlign = data.tableTextAlign;
            this.animateMode = data.animateMode;
        },
        getConfig(){
            return {...state}
        }
    },
});
