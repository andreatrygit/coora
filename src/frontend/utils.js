import ky from "ky";
import { isSecret } from "../frontend&server/validation";

export function kyPost(path,thenCb,catchCb,json={}){
    const basePath = 'https://ti.coora.workers.dev/api';
    const finalPath = basePath + path;
    return ky.post(finalPath,{json:json, retry:0, timeout:4000}).json().then(thenCb).catch(catchCb);
}

export const appName = "coora"

const timeClockQrCodeBaseName = appName + '-timeclock-qrcode';
const sharedDeviceQrCodeBaseName = appName + '-shared-device-qrcode';
const qrCodeSep = '#'

export function isValidQrCode(code){
    if(typeof(code)!=='string'){return false}
    const codeTypes = [timeClockQrCodeBaseName,sharedDeviceQrCodeBaseName]
    codeParts = code.split(qrCodeSep)
    return codeParts.length===2
           && codeTypes.includes(codeParts[0])
           && isSecret(codeParts[1])
}

export function isValidTimeClockQrCode(code){
    return isValidQrCode(code) && code.startsWith(timeClockQrCodeBaseName)
}

export function isValideSharedDeviceQrCode(code){
    return isValidQrCode(code) && code.startsWith(sharedDeviceQrCodeBaseName)
}