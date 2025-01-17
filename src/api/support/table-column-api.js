export const tableColumnApi = {
    // 修改表格列
    // updateTableColumn: (param) => {
    //   return postRequest('/support/tableColumn/update', param);
    // },

    // // 查询表格列
    // getColumns: (tableId) => {
    //   return getRequest(`/support/tableColumn/getColumns/${tableId}`);
    // },

    // // 删除表格列
    // deleteColumns: (tableId) => {
    //   return getRequest(`/support/tableColumn/delete/${tableId}`);
    // },


    // 查询表格列
    getColumns: (tableId) => {
        return new Promise((resolve, reject) => {
            const res = {
                code: 200,
                msg: '查询成功',
                data: null
            }
            resolve(res)
        });
    },

    // 修改表格列
    updateTableColumn: (param) => {
        return new Promise((resolve, reject) => {
            const res = {
                code: 200,
                msg: '查询成功',
                data: null
            }
            resolve(res)
        });
    },
    // 删除表格列
    deleteColumns: (tableId) => {
        return new Promise((resolve, reject) => {
            const res = {
                code: 200,
                msg: '查询成功',
                data: null
            }
            resolve(res)
        });
    },
};
