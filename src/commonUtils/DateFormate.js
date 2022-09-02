export function formatDate (d) {
    let date = new Date(d)
    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
}