import { getRequest, postRequest } from '/src/lib/axios';

export const userConfigApi = {
  /**
   * 保存配置
   */
  saveUserConfig: (param) => {
    return postRequest('/system/userConfig/save', param);
  },

  /**
   * 获取配置
   * @param params
   */
  getUserConfig: (params) => {
    return getRequest('/system/userConfig/get', params);
  },

  /**
   * 保存快捷入口
   */
  saveQuickEntry: (param) => {
    return postRequest('/system/userConfig/saveQuickEntry', param);
  },
};
