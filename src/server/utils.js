export function toughCookie(key,value,maxAge=null){ //MaxAge is in seconds
    return "__Host-" + key + "=" + value + "; path=/; Secure; HttpOnly; SameSite=Strict" + (maxAge ? ("; Max-Age=" + maxAge.toString()) : '');
}
//in order to cancel use value '' and maxAge -1

export function getCookie(context,key){
    const cookies = context.req.header('Cookie')
    if(!cookies){return null}
    const cookiesList = cookies.split(';')
    const trimmedList = cookiesList.map(x=>x.trim())
    const derivedKey = "__Host-" + key
    const item = trimmedList.find(x=>x.startsWith(derivedKey))
    if(!item){return null}
    return item.split('=')[1]
}

export function verifyCookieValue(context,key,value){
    const foundValue = getCookie(context,key);
    return foundValue===value;
}