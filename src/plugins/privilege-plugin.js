/*
 *  权限插件
 */
import { useUserStore } from '/@/store/modules/system/user';

const privilege = (value) => {
  // 超级管理员
  if (useUserStore().isSys) {
    return true;
  }
  // 获取功能点权限
  let userPointsList = useUserStore().getPointList;
  if (!userPointsList) {
    return false;
  }
  if (Array.isArray(value)) {
    let b = false;
    value.forEach((item) => {
      if (userPointsList.includes(item)) {
        b = true;
      }
    });
    return userPointsList && b;
  } else {
    return userPointsList && userPointsList.includes(value);
  }

};

export default {
  install: (app) => {
    app.config.globalProperties.$privilege = privilege;
  },
};
