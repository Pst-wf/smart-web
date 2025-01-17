/**
 * 排序工具封装
 */
export const tableUtil = {
    /**
     * 排序
     * @param fn 函数
     * @param sorter  排序
     * @param queryForm 查询条件
     * @param columns 列
     */
    tableChange(fn, sorter, queryForm, columns) {
        const {field, order} = sorter || {};
        if (field) {
            columns.forEach(column => {
                column.sortOrder = null
            })
            const format = columns.filter(item => item.dataIndex === field);
            format.forEach(item => {
                item.sortOrder = order;
            });
            const params = {
                sortField: null,
                sortOrder: null
            }
            if (order) {
                let sortField = field;
                if (format && format.length > 0 && format[0].sortIndex) {
                    sortField = format[0].sortIndex;
                }
                params.sortField = sortField;
                if (order === 'ascend') {
                    params.sortOrder = 'ASC';
                } else {
                    params.sortOrder = 'DESC';
                }
            }
            Object.assign(queryForm, params);
            fn.apply();
        }
    }
}

