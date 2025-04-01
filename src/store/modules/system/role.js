/*
 * 角色
 */
import _ from 'lodash';
import { defineStore } from 'pinia';

export const useRoleStore = defineStore({
  id: 'role',
  state: () => ({
    menuCheckedData: [],
    buttonsCheckedData: [],
    treeMap: new Map(),
  }),

  actions: {
    // 初始化权限树选中数据
    initMenuCheckedData(data) {
      this.menuCheckedData = [...new Set(data)];
    },
    // 初始化按钮树选中数据
    initButtonsCheckedData(data) {
      this.buttonsCheckedData = [...new Set(data)];
    },
    // 选中
    addMenuCheckedData(data) {
      if (this.menuCheckedData.some((e) => e === data)) {
        return;
      }
      this.menuCheckedData.push(data);
      const view1 = data+'-view_1';
      if (this.buttonsCheckedData.some((e) => e === view1)) {
        return;
      }
      this.buttonsCheckedData.push(view1);
    },
    addButtonsCheckedData(data) {
      if (this.buttonsCheckedData.some((e) => e === data)) {
        return;
      }
      this.buttonsCheckedData.push(data);
    },
    // 选中本级以及子级
    addCheckedDataAndChildren(data) {
      const menuId = data.menuId;
      if (menuId) {
        let buttonsFindIndex = this.buttonsCheckedData.findIndex((val) => val === data.id);
        if (data.id && buttonsFindIndex === -1) {
          this.addButtonsCheckedData(data.id);
        }
      } else {
        let findIndex = this.menuCheckedData.findIndex((val) => val === data.id);
        if (data.id && findIndex === -1) {
          this.addMenuCheckedData(data.id);
          if (data.children) {
            data.children.forEach((item) => {
              this.addCheckedDataAndChildren(item);
            });
          }
          if (data.buttons) {
            data.buttons.forEach((item) => {
              let buttonsFindIndex = this.buttonsCheckedData.findIndex((val) => val === item.id);
              if (buttonsFindIndex === -1) {
                this.addButtonsCheckedData(item.id);
              }
            });
          }
        }
      }
    },
    // 取消选中
    deleteMenuCheckedData(index) {
      this.menuCheckedData.splice(index, 1);
    },
    deleteButtonsCheckedData(index) {
      this.buttonsCheckedData.splice(index, 1);
    },
    // 取消选中本级以及子级
    deleteCheckedDataAndChildren(data) {
      const menuId = data.menuId;
      if (menuId) {
        let buttonsFindIndex = this.buttonsCheckedData.findIndex((val) => val === data.id);
        if (buttonsFindIndex !== -1) {
          this.deleteButtonsCheckedData(buttonsFindIndex);
        }
      } else {
        let findIndex = this.menuCheckedData.findIndex((val) => val === data.id);

        if (findIndex !== -1) {
          this.deleteMenuCheckedData(findIndex);
          if (data.children) {
            data.children.forEach((item) => {
              this.deleteCheckedDataAndChildren(item);
            });
          }
          if (data.buttons) {
            data.buttons.forEach((item) => {
              let buttonsFindIndex = this.buttonsCheckedData.findIndex((val) => val === item.id);
              if (buttonsFindIndex !== -1) {
                this.deleteButtonsCheckedData(buttonsFindIndex);
              }
            });
          }
        }
      }
    },
    // 初始化权限树对象
    initTreeMap(tree) {
      for (let treeElement of tree) {
        if (!treeElement.id) {
          continue;
        }
        this.treeMap.set(treeElement.id, treeElement);

        if (treeElement.buttons && !_.isEmpty(treeElement.buttons)) {
          treeElement.buttons.forEach((button) => {
            this.treeMap.set(button.id, button);
          });
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
      if (module.code) {
        parentId = module.menuId;
      }
      let menuId = module.id;
      if ((parentId === '0' || !parentId) && !menuId) {
        return;
      }
      // 从权限树对象 获取该父级对象
      let parentModule = this.treeMap.get(parentId);
      let menuModule = this.treeMap.get(menuId);
      if (!parentModule && !menuModule) {
        return;
      }
      let pId = parentModule?.id;
      if (!parentModule) {
        pId = menuModule.id;
      }
      // 选中父级
      let parentIndex = this.menuCheckedData.findIndex((e) => pId === e);
      if (pId && parentIndex === -1) {
        this.addMenuCheckedData(pId);
      }
      // 如果上级还有上级 则进行递归
      if (parentModule && parentModule.parentId && parentModule.parentId !== '0') {
        this.selectUpperLevel(parentModule);
      }
    },
    // 取消上级
    deleteUpperLevel(module) {
      // 拿到上级key
      let parentId = module.parentId;
      if (module.code) {
        parentId = module.menuId;
      }
      let menuId = module.id;
      if ((parentId === '0' || !parentId) && !menuId) {
        return;
      }
      // // 从权限树对象 获取该父级对象
      let parentModule = this.treeMap.get(parentId);
      if (!parentModule) {
        return;
      }
      let deleteParent = false;
      if (parentModule.buttons && parentModule.buttons.length > 0) {
        const filterData = parentModule.buttons.filter((one) => this.buttonsCheckedData.findIndex((val) => val === one.id) !== -1);
        if (filterData.length === 0) {
          deleteParent = true;
        }
      }
      if (parentModule.children && parentModule.children.length > 0) {
        const filterData = parentModule.children.filter((one) => this.menuCheckedData.findIndex((val) => val === one.id) !== -1);
        if (filterData.length === 0) {
          deleteParent = true;
        }
      }
      if (deleteParent) {
        let parentIndex = this.menuCheckedData.findIndex((e) => parentId === e);
        if (parentId && parentIndex !== -1) {
          this.deleteMenuCheckedData(parentIndex);
          // 如果上级还有上级 则进行递归
          if (parentModule.parentId && parentModule.parentId !== '0') {
            this.deleteUpperLevel(parentModule);
          }
        }
      }
    },
  },
});
