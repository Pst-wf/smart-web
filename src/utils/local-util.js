/*
 * localStorage 相关操作
 */

import {useUserStore} from "/@/store/modules/system/user.js";

export const localSave = (key, value) => {
  localStorage.setItem(key, value);
};

export const localRead = (key) => {
  return localStorage.getItem(key) || '';
};

export const localRemove = (key) => {
  localStorage.removeItem(key);
};

export const localClear = () => {
  const username = localRead("login-username")
  const password = localRead("login-password")
  localStorage.clear();
  if( username !== '' && password !== '') {
    localSave("login-username", username);
    localSave("login-password", password);
  }
};
