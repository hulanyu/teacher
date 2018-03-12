import {
    analysisDate,
    transformCommon,
} from './_common'

function formatDate(dateOrStr, fmt) {
    let time = analysisDate(dateOrStr)
    try {
        time = new Date(transformCommon(time))
    } catch (e) {
        return ""
    }
    // if (fmt==="timescamp") {
    //     return time.getTime() / 1000
    // }
    if (fmt === 'timescamp') {
        throw new Error('错误参数, 请使用this.$tools.stringToDate(data: dateString)进行转换')
    }
    if (!fmt) {
        fmt = "yyyy/MM/dd hh:mm:ss"
    }
    var o = {
        "M+": time.getMonth() + 1, //月份 
        "d+": time.getDate(), //日 
        "h+": time.getHours(), //小时 
        "m+": time.getMinutes(), //分 
        "s+": time.getSeconds(), //秒 
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
        "S": time.getMilliseconds() //毫秒 
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}
formatDate.transformCommon = transformCommon
export default formatDate