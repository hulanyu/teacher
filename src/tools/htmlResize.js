/*
监听window大小变化
返回 width,height的变化状态
{
    w: true,
    h: true,
}
*/
function html_resize () {
    let list = []

    const node = window.getComputedStyle(window.document.getElementsByTagName('html')[0])
    let oldHeight = parseInt(node.height)
    let newHeight = oldHeight
    let oldWidth = parseInt(node.width)
    let newWidth = oldWidth

    const timeStep = 100
    let oldTime = (new Date()).getTime()
    let newTime = oldTime
    window.onresize = () => {
        let node = window.getComputedStyle(window.document.getElementsByTagName('html')[0])
        newTime = (new Date()).getTime()

        newHeight = parseInt(node.height)
        newWidth = parseInt(node.width)

        if (newTime - oldTime >= timeStep) {
            let result = {
                w: false,
                h: false,
            };
            // height变化
            if (newHeight !== oldHeight) {
                result.h = true
                oldHeight = newHeight
            }
            // width变化
            if (newWidth !== oldWidth) {
                result.w = true
                oldWidth = newWidth
            }
            oldTime = newTime
            list.forEach((item) => {
                item(result)
            })
        }
    }
    return function (callback) {
        if (!callback) {
            throw new Erro('callback不存在')
        }
        list.push(callback)
    }
}

let container = html_resize()
export default (callback) => {
    container(callback)
}