/*
 * 权限
 */

import { useUserStore } from '/@/store/modules/system/user';

export function privilegeDirective(el, binding) {
  // 超级管理员
  // if (useUserStore().isSys) {
  //   return true;
  // }
  // 获取功能点权限
  let userPointsList = useUserStore().getPointList;
  if (!userPointsList) {
    return false;
  }
  if (Array.isArray(binding.value)) {
    let b = false;
    binding.value.forEach((item) => {
      if (userPointsList.includes(item)) {
        b = true;
      }
    });
    // 如果有权限，删除节点
    if (!b) {
      el.parentNode.removeChild(el);
    }
  } else {
    // 如果有权限，删除节点
    if (!userPointsList.includes(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }

  return true;
}
