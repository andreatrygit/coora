export function isSecret(s){
    return (typeof(s)==='string' && /^[A-Za-z0-9_-]{21}$/.test(s)) //per nanoid definition
}