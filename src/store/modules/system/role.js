/*
 * 角色
 */
import _ from 'lodash';
import { defineStore } from 'pinia';

export const useRoleStore = defineStore({
  id: 'role',
  state: () => ({
    checkedData: [],
    buttonsCheckedData: [],
    treeMap: new Map(),
  }),

  actions: {
    // 初始化权限树选中数据
    initCheckedData(data) {
      this.checkedData = [...new Set(data)];
    },
    // 初始化按钮树选中数据
    initButtonsCheckedData(data) {
      this.buttonsCheckedData = [...new Set(data)];
    },
    // 选中
    addCheckedData(data) {
      if (this.checkedData.some((e) => e === data)) {
        return;
      }
      this.checkedData.push(data);
    },
    addButtonsCheckedData(data) {
      if (this.buttonsCheckedData.some((e) => e === data)) {
        return;
      }
      this.buttonsCheckedData.push(data);
    },
    // 选中本级以及子级
    addCheckedDataAndChildren(data) {
      let findIndex = this.checkedData.findIndex((val) => val === data.id);
      let buttonsFindIndex = this.buttonsCheckedData.findIndex((val) => val === data.id);
      if (data.id && findIndex === -1) {
        this.addCheckedData(data.id);
      }
      if (data.id && buttonsFindIndex === -1) {
        this.addButtonsCheckedData(data.id);
      }
      // if (data.children) {
      //   data.children.forEach((item) => {
      //     this.addCheckedDataAndChildren(item);
      //   });
      // }
      // if (data.buttons) {
      //   data.buttons.forEach((item) => {
      //     this.addCheckedDataAndChildren(item);
      //   });
      // }
    },
    // 取消选中
    deleteCheckedData(index) {
      this.checkedData.splice(index, 1);
    },
    deleteButtonsCheckedData(index) {
      this.buttonsCheckedData.splice(index, 1);
    },
    // 取消选中本级以及子级
    deleteCheckedDataAndChildren(data) {
      let findIndex = this.checkedData.findIndex((val) => val === data.id);
      let buttonsFindIndex = this.buttonsCheckedData.findIndex((val) => val === data.id);
      if (findIndex !== -1) {
        this.deleteCheckedData(findIndex);
      }
      if (buttonsFindIndex !== -1) {
        this.deleteButtonsCheckedData(buttonsFindIndex);
      }
      // if (data.children) {
      //   data.children.forEach((item) => {
      //     this.deleteCheckedDataAndChildren(item);
      //   });
      // }
      // if (data.buttons) {
      //   data.buttons.forEach((item) => {
      //     this.deleteCheckedDataAndChildren(item);
      //   });
      // }
    },
    // 初始化权限树对象
    initTreeMap(tree) {
      for (let treeElement of tree) {
        if (!treeElement.id) {
          continue;
        }
        this.treeMap.set(treeElement.id, treeElement);

        if (treeElement.buttons && !_.isEmpty(treeElement.buttons)) {
          treeElement.buttons.forEach(button =>{
            this.treeMap.set(button.id, button);
          })
        }
        if (treeElement.children && !_.isEmpty(treeElement.children)) {
          this.initTreeMap(treeElement.children);
        }
      }
    },
    // 选中上一级
    selectUpperLevel(module) {
      // 拿到上级key
      let parentId = module.parentId;
      let menuId = module.menuId;
      if (!parentId && !menuId) {
        return;
      }
      // 从权限树对象 获取该父级对象
      let parentModule = this.treeMap.get(parentId);
      let menuModule = this.treeMap.get(menuId);
      if (!parentModule && !menuModule) {
        return;
      }
      let pId = parentModule.id;
      if(!parentModule ){
        pId = menuModule.id
      }
      // 选中父级
      let parentIndex = this.checkedData.findIndex((e) => pId === e);
      if (pId && parentIndex === -1) {
        this.addCheckedData(pId);
      }
      // 如果上级还有上级 则进行递归
      if (parentModule.parentId) {
        this.selectUpperLevel(parentModule);
      }
    },
  },
});
