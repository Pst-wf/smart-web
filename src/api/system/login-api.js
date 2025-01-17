import { getRequest, postRequest } from '/src/lib/axios';

export const loginApi = {
  /**
   * 登录
   */
  login: (param) => {
    return postRequest('/oauth/token', param);
  },

  /**
   * 获取登录信息
   */
  getUserInfo: () => {
    return getRequest('/oauth/getUserInfo');
  },

  /**
   * 退出登录
   */
  logout: () => {
    return getRequest('/login/logout');
  },

  /**
   * 获取验证码
   */
  getCaptcha: () => {
    return getRequest('/oauth/captcha');
  },

  /**
   * 获取动态路由
   */
  getUserRoutes: () => {
    return getRequest('/route/getUserRoutes');
  },
  /**
   * 获取身份列表
   */
  getIdentityList: () => {
    return getRequest('/oauth/getIdentityList');
  },
};
