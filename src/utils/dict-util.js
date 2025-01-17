import {dictApi} from "/@/api/system/dict-api.js";
import {flatArray} from "/@/utils/common-util.js";

/**
 * 获取字典
 *
 * @param codes 字典Code
 */
export async function dict(codes) {
    const res = await dictApi.getDictByCodes(codes);
    return res.data;
}

/**
 * 获取字典
 *
 * @param arr 字典数组
 * @param value 字典值
 */
export function getLabel(arr, value) {
    let res = []
    if (arr) {
        const format = flatArray(arr)
        if (value !== null ) {
            res = format.filter(x => value.toString().includes(x.dictValue)).map(x => x.dictName);
        }
    }
    return res
}

/**
 * 获取字典
 *
 * @param arr 字典数组
 * @param value 字典值
 */
export function getAncestors(arr, value) {
    let res = []
    if (arr) {
        const format = flatArray(arr)
        res.push(value);
        const dict = format.filter(x => value === x.dictValue);
        if(dict.length > 0) {
            getParentValue(format, dict[0], res)
        }

    }
    return res.reverse()
}

/**
 * 字典值回显
 * @param arr
 * @param dict
 * @param list
 */
function getParentValue(arr, dict, list) {
    if (dict.parentId !== '0') {
        arr.forEach(item => {
            if (item.id === dict.parentId) {
                list.push(item.dictValue)
                getParentValue(arr, item, list)
            }
        });
    }

}
