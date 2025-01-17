/**
 * 文件工具类
 */
export const fileUtil = {
    /**
     * url预处理
     * @param item 文件Url
     */
    fileUrlFormat(item) {
        return item.startsWith('http') ? item : `${import.meta.env.VITE_APP_API_URL}/${item}`
    }
}

