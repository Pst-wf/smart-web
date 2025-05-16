import { tableUtil } from '/@/utils/table-util.js';
import { fileUtil } from '/@/utils/file-util.js';
import { patternRules } from '/@/hooks/form.js';

export default {
  install(app) {
    // 注册全局方法
    app.config.globalProperties.$sorterChange = (fn, sorter, queryForm, columns) => {
      tableUtil.tableChange(fn, sorter, queryForm, columns);
    };
    app.config.globalProperties.$previewImage = (item) => {
      return fileUtil.fileUrlFormat(item);
    };
    app.config.globalProperties.$patternRules = (item) => {
      return patternRules[item];
    };
    // 注册其他组件...
  },
};
