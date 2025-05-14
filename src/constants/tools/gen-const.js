export const QUERY_TYPE_ENUM = {
  EQ: {
    value: 'EQ',
    desc: '等于',
  },
  LIKE: {
    value: 'LIKE',
    desc: '模糊查询',
  },
  NE: {
    value: 'NE',
    desc: '不等于',
  },
  GT: {
    value: 'GT',
    desc: '大于',
  },
  GE: {
    value: 'GE',
    desc: '大于等于',
  },
  LT: {
    value: 'LT',
    desc: '小于',
  },
  LE: {
    value: 'LE',
    desc: '小于等于',
  },
  BETWEEN: {
    value: 'BETWEEN',
    desc: '区间查询',
  },
  IN: {
    value: 'IN',
    desc: '介于',
  },
  NOT_IN: {
    value: 'NOT_IN',
    desc: '不介于',
  },
  LIKE_IN_AND: {
    value: 'LIKE_IN_AND',
    desc: '且包含',
  },
  LIKE_IN_OR: {
    value: 'LIKE_IN_OR',
    desc: '或包含',
  },
};
export const COMPONENTS_ENUM = {
  INPUT: {
    value: 'INPUT',
    desc: '文本框',
  },
  'INPUT-NUMBER': {
    value: 'INPUT-NUMBER',
    desc: '数字输入框',
  },
  TEXTAREA: {
    value: 'TEXTAREA',
    desc: '多行文本框',
  },
  SELECT: {
    value: 'SELECT',
    desc: '选择器',
  },
  CASCADER: {
    value: 'CASCADER',
    desc: '级联选择器',
  },
  'TREE-SELECT': {
    value: 'TREE-SELECT',
    desc: '树形选择器',
  },
  CHECKBOX: {
    value: 'CHECKBOX',
    desc: '复选框',
  },
  RADIO: {
    value: 'RADIO',
    desc: '单选框',
  },
  DATEPICKER: {
    value: 'DATEPICKER',
    desc: '日期选择',
  },
  TIMEPICKER: {
    value: 'TIMEPICKER',
    desc: '时间选择',
  },
  SWITCH: {
    value: 'SWITCH',
    desc: '开关',
  },
  FILE_UPLOAD: {
    value: 'FILE-UPLOAD',
    desc: '文件上传',
  },
  IMAGE_UPLOAD: {
    value: 'IMAGE-UPLOAD',
    desc: '图片上传',
  },
  EDITOR: {
    value: 'EDITOR',
    desc: '富文本',
  },
};
export default {
  QUERY_TYPE_ENUM,
  COMPONENTS_ENUM,
};
