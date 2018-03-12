// export default (scope, floatNum) => {
//     let r = Math.random()
//     let type = typeof scope
//     let num = 0
//     if (floatNum && typeof floatNum !== 'number') {
//         throw new Error('浮点位数量类型错误')
//     }
//     if (type === 'undefined') {
//         return r
//     } else if (type === 'number') {
//         num = r + scope
//     } else if (type === 'object' && scope.length === 2) {
//         num = r * (scope[1] - scope[0]) + scope[0]
//     } else {
//         throw new Error('参数错误')
//     }

//     // let numInt = parseInt(num)
//     // let numFloat = parseFloat(num)
//     // if (floatNum && numInt !== numFloat) {
//     //     num = numInt + parseInt((numFloat - numInt) * floatNum) / floatNum
//     // }
//     if (floatNum) {
//         num = num.toFixed(floatNum)
//     }
//     return num
// }

export default () => {
    var num = ''
    var i = 32
    while (i) {
        num += parseInt(Math.random() * 16).toString(16)
        --i
    }
    return num
}