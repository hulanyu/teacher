export default (text) => {
    let cNode = document.createElement('div')
    cNode.innerHTML = text
    return cNode.innerText
}