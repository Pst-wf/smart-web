export const flatArray = (arr,key) => {
    if(key){
        return arr.flatMap(item => {
            if (Array.isArray(item.children)) {
                return [item[key], ...flatArray(item.children,key)];
            }
            return item[key]
        });
    } else {
        return arr.flatMap(item => {
            if (Array.isArray(item.children)) {
                return [item, ...flatArray(item.children,key)];
            }
            return item
        });
    }
}

/**
 * Get route name by route path
 *
 * @param routeName
 */
export function getRoutePathByRouteName(routeName) {
    return `/${routeName.replace(/_/g, '/')}`;
}

/**
 * 截取文件名
 *
 */
export function getFileNameSuffix(fileName) {
    if(fileName){
        return fileName.split('.').pop()
    } else {
        return null
    }
}

