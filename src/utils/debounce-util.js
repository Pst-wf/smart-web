/**
 * 防抖
 *
 * @param fn 函数
 * @param delay 等待时长 毫秒
 * @param isImmediate 为true，debounce会在delay时间间隔的开始时立即调用这个函数
 */
export function debounce(fn, delay, isImmediate) {
    let timer = null;  //初始化timer，作为计时清除依据
    return () => {
        const context = this;  //获取函数所在作用域this
        const args = arguments;  //取得传入参数
        clearTimeout(timer);
        if(isImmediate && timer === null) {
            //时间间隔外立即执行
            fn.apply(context,args);
            timer = 0;
            return;
        }
        timer = setTimeout(function() {
            fn.apply(context,args);
            timer = null;
        }, delay);
    }
}

/**
 * 防抖
 *
 * @param func 函数
 * @param wait 等待时长 毫秒
 * @param immediate 为true，debounce会在delay时间间隔的开始时立即调用这个函数
 */
export function debounceAsync(func, wait, immediate) {
    let timeout;
    return async function(...args) {
        const context = this;
        const later = async () => {
            timeout = null;
            if (!immediate) await func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) await func.apply(context, args);
    };
}
