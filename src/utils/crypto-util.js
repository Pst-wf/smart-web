import CryptoJS from "crypto-js";
const key = '1234567890123456';
const iv = '1234567890123456';
/**
 * 解密
 *
 * @param word 加密内容
 */
export function encryptData(word) {
    if (word) {
        const base64 = CryptoJS.enc.Base64.parse(word);
        const str = CryptoJS.enc.Base64.stringify(base64);
        const decryptValue = CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return decryptValue.toString(CryptoJS.enc.Utf8);
    } else {
        return null
    }
}
