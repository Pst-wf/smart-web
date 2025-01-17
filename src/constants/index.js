/*
 * 所有常量入口
 */
import menu from './system/menu-const';
import scope from './system/scope-const';
import dept from './system/dept-const';
import redis from './system/redis-const';
import instance from './flow/instance-const.js';
import task from './flow/task-const.js';
import log from './system/logs-const.js';
import gen from './tools/gen-const.js';
import notice from './notice/notice-const.js';
import taskGroup from './task/task-group-const.js';
import taskJob from './task/task-job-const.js';
import { LOGIN_DEVICE_ENUM } from './system/login-device-const';
import { FLAG_NUMBER_ENUM, GENDER_ENUM, USER_TYPE_ENUM, STATUS_ENUM } from './common-const';
import { LAYOUT_ENUM } from './layout-const';
import file from './support/file-const';
import changeLogConst from './support/change-log-const';

export default {
  FLAG_NUMBER_ENUM,
  LOGIN_DEVICE_ENUM,
  GENDER_ENUM,
  USER_TYPE_ENUM,
  LAYOUT_ENUM,
  STATUS_ENUM,
  ...gen,
  ...notice,
  ...scope,
  ...taskGroup,
  ...taskJob,
  ...menu,
  ...log,
  ...dept,
  ...redis,
  ...file,
  ...changeLogConst,
  ...instance,
  ...task,
};
