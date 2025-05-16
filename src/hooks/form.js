import { regular } from '/@/constants/regular-const.js';

export const patternRules = {
  userName: {
    pattern: regular.account,
    message: regular.accountDesc,
    trigger: 'blur',
  },
  url: {
    pattern: regular.linkUrl,
    message: regular.linkUrlDesc,
    trigger: 'blur',
  },
  phone: {
    pattern: regular.phone,
    message: regular.phoneDesc,
    trigger: 'blur',
  },
  pwd: {
    pattern: regular.pwd,
    message: regular.pwdDesc,
    trigger: 'blur',
  },
  idCard: {
    pattern: regular.idCard,
    message: regular.idCardDesc,
    trigger: 'blur',
  },
  code: {
    pattern: regular.account,
    message: regular.accountDesc,
    trigger: 'blur',
  },
  email: {
    pattern: regular.email,
    message: regular.emailDesc,
    trigger: 'blur',
  },
};
