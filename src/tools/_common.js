// 尝试解析
export function analysisDate (dateObj) {
    var t = Number(dateObj);
    if (!isNaN(dateObj)) {
        t = t * 1000
    } else {
        t = dateObj
        // 可能会出错
        if (t.split(' ').length === 1) {
            t += " 00:00:00"
        }
    }
    return t
}

// 转换成标准格式
export function transformCommon (time) {
    if (typeof time === 'string') {
        return time.replace(/-/g, '/')
    } else if (typeof time === 'number') {
        return time
    } else {
        throw new Error('time参数错误')
    }
}