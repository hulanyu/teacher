export default (map, key) => {
    if (!map || typeof map !== 'object') {
        throw new Error('请输入正确的map')
    }
    if (key === void 0 || key === null) {
        throw new Error('请输入正确的key')
    }
    let value = map[key]
    if (value === void 0) {
        value = '未知'
    }
    return value
}