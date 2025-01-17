/**
 *
 * @param {Blob} data 文件二进制流
 * @param {*} headers 响应头
 * @description 文件下载
 */
export const exportFile = (data, headers) => {
    const fileReader = new FileReader()
    fileReader.onload = function () {
        // 下载正常处理
        let fileName = headers['content-disposition']
        // 获取文件名
        if (fileName && fileName.length >= 2) {
            fileName = fileName.split('=')[1]
            // 移除双引号
            const reg = /^["|'](.*)["|']$/g
            fileName = fileName.replace(reg, '$1')
        }
        fileName = decodeURIComponent(fileName)
        // 兼容ie11
        if (window.navigator.msSaveOrOpenBlob) {
            try {
                const blobObject = new Blob([data])
                window.navigator.msSaveOrOpenBlob(blobObject, fileName)
            } catch (e) {
                console.log(e)
            }
            return
        }
        // a标签实现下载
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
    }
    fileReader.readAsText(new Blob([data])) // FileReader的API
}
