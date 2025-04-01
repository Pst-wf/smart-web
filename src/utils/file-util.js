/**
 * 文件工具类
 */
export const fileUtil = {
    /**
     * url预处理
     * @param item 文件Url
     */
    fileUrlFormat(item) {
        if (item) {
            const baseURL = import.meta.env.VITE_APP_API_URL;
            return item.startsWith('http') || item.startsWith(`${baseURL}/`) ? item : `${baseURL}/${item}`;
        }
        return item;
    },
};
