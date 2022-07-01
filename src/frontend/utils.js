import ky from "ky";

export function kyPost(path,thenCb,catchCb,json={}){
    const basePath = 'https://ti.coora.workers.dev/api';
    const finalPath = basePath + path;
    return ky.post(finalPath,{json:json, retry:0, timeout:4000}).json().then(thenCb).catch(catchCb);
}

export function isSecret(s){
    return (typeof(s)==='string' && /^[A-Za-z0-9_-]{21}$/.test(s)) //per nanoid definition
}

export function isValidQrCode(code){
    const codeTypes = ['']
}

export const appName = "coora"