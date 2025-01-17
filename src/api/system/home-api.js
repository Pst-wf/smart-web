/*
 * 首页api
 */
import { getRequest } from '/src/lib/axios';

export const homeApi = {
  /**
   * @description: 首页-金额统计（业绩、收款、订单数等）
   */
  homeAmountStatistics: () => {
    return getRequest('/home/amount/statistics');
  },
  /**
   * @description: 首页-待办信息
   */
  homeWaitHandle: () => {
    return getRequest('home/wait/handle');
  },
};
