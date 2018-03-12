class Draw{
    constructor (node, options={}) {
        // html结点
        this._node = node
        // 基础舞台
        this._baseStage = null
        this._baseStageW = 0
        this._baseStageH = 0
        // 基础容器
        this._baseContainer = null
        // 当前状态
        this._canvasStatus = ''
        // canvas状态
        this._STATUS_MOVE = 'move'
        this._STATUS_BIG = 'big'
        this._STATUS_SMALL = 'small'
        this._STATUS_DRAW = 'draw'
        this._STATUS_CLEARDRAW = 'clearDraw'
        this._STATUS_TEXT = 'text'
        this._STATUS_CLEARTEXT = 'clearText'
        this._STATUS_UPDATE = 'update'
        this._canvasStatusList = [
            // 移动
            { status: this._STATUS_MOVE, callback: this._statusMove.bind(this) }, 
            // 放大
            { status: this._STATUS_BIG, callback: this._statusBig.bind(this) }, 
            // 缩小
            { status: this._STATUS_SMALL, callback: this._statusSmall.bind(this) }, 
            // 绘画
            { status: this._STATUS_DRAW, callback: this._statusDraw.bind(this) }, 
            // 橡皮擦
            { status: this._STATUS_CLEARDRAW, callback: this._statusClearDraw.bind(this) }, 
            // 文字
            { status: this._STATUS_TEXT, callback: this._statusText.bind(this) }, 
            // 清除文字
            { status: this._STATUS_CLEARTEXT, callback: this._statusClearText.bind(this) }, 
             // 刷新
            { status: this._STATUS_UPDATE, callback: this._statusUpdate.bind(this) }, 
        ]
        // 状态对象
        this._statusObj = {
            offsetX: 0,
            offsetY: 0,
            // 点击的坐标 相对于当前元素
            pointX: 0,
            pointY: 0,
            // 缩放比例
            // 容器缩放比例
            scaleX: 1,
            scaleY: 1,
            // 原图缩放比例
            backgroundScaleX: 1,
            backgroundScaleY: 1,
        }

        // 背景容器
        this._backgroundContainer = null
        // 背景图片
        this._backgroundImage = options.backgroundImage

        // 图形容器
        this._shapeContainer = null
        // 图形列表
        this._shapeList = []

        // 文本容器
        this._textContainer = null
        // 文本列表
        this._textList = []
        this._init()
    }
    _init () {
        if (!this._node) {
            throw new Error('错误的结点')
        }
        this._baseStage = new createjs.Stage(this._node)
        this._baseContainer = new createjs.Container()
        this._backgroundContainer = new createjs.Container()
        this._shapeContainer = new createjs.Container()
        this._textContainer = new createjs.Container()

        this._baseContainer.addChild(
            this._backgroundContainer,
            this._shapeContainer,
            this._textContainer,
        )
        setTimeout(() => {
            console.log(3, this._node.width, this._node.height)
            this._baseStageW = this._node.width
            this._baseStageH = this._node.height
        }, 0)

        this._registerEvent()
        // 未知原因导致更新背景图片是无法清空背景容器
        // await this._setBackgroundImage()

        this._baseStage.addChild(this._baseContainer)
    }
    // 注册事件
    _registerEvent () {
        // 自动刷新
        createjs.Ticker.addEventListener("tick", e => {
            this._baseStage.update(e)
        })
        this._baseContainer.addEventListener('mousedown', e => {
            // console.log('mousedown', e.stageX, e.stageY)
            if (this._canvasStatus === this._STATUS_MOVE) {
                this._statusObj.pointX = e.stageX - this._statusObj.offsetX
                this._statusObj.pointY = e.stageY - this._statusObj.offsetY
            } else if (this._canvasStatus === this._STATUS_TEXT) {
                let inputNode = document.createElement('input')
                inputNode.type = 'text'
                inputNode.style.position = 'fixed'
                inputNode.style.zIndex = 9999
                inputNode.style.top = '50%'
                inputNode.style.left = '40%'
                inputNode.onkeydown = e => {
                    if (e.keyCode === 13) {
                        this._setText(inputNode.value, this._statusObj.pointX, this._statusObj.pointY)
                        inputNode.remove()
                    }
                }
                this._node.parentNode.appendChild(inputNode)
            }
            console.log('mousedown', JSON.stringify(this._statusObj))
        })
        this._baseContainer.addEventListener('pressmove', e => {
            // console.log('pressmove', e.stageX, e.stageY)
            if (this._canvasStatus === this._STATUS_MOVE) {
                this._baseContainer.x = e.stageX - this._statusObj.pointX
                this._baseContainer.y = e.stageY - this._statusObj.pointY

                // this._baseContainer.x = e.stageX - this._statusObj.pointX + this._statusObj.offsetX
                // this._baseContainer.y = e.stageY - this._statusObj.pointY + this._statusObj.offsetY
            } else if (this._canvasStatus === this._STATUS_DRAW) {
                this._setLine(e.stageX - this._statusObj.offsetX, e.stageY - this._statusObj.offsetY)
            }
        })
        this._baseContainer.addEventListener('pressup', e => {
            // console.log('pressup', e.stageX, e.stageY)
            if (this._canvasStatus === this._STATUS_MOVE) {
                this._statusObj.offsetX = e.stageX - this._statusObj.pointX
                this._statusObj.offsetY = e.stageY - this._statusObj.pointY
            }
            console.log('pressup', JSON.stringify(this._statusObj))
        })
    }
    // 设置背景
    // 并设置大小
    _setBackgroundImage () {
        return new Promise((resolve, reject) => {
            // 测试
            if (!this._backgroundImage) {
                console.warn('没有背景图片')
                reject()
            }
            let img = new Image()
            img.onload = () => {
                // img.width = img.width * this._statusObj.scaleX
                // img.height = img.height * this._statusObj.scaleY
    
                // console.log(123, this._baseStageW, this._baseStageH)
                // console.log(456, img.width, img.height)

                let bitMap = new createjs.Bitmap(img)
                const ws = this._baseStageW/img.width
                const hs = this._baseStageH/img.height
                this._statusObj.backgroundScaleX = ws
                this._statusObj.backgroundScaleY = hs
                let offsetX = this._statusObj.offsetX
                let offsetY = this._statusObj.offsetY
                if (ws <= hs) {
                    bitMap.scaleX = bitMap.scaleY = ws
                    offsetY = (this._baseStageH - img.height * ws) / 2
                } else {
                    bitMap.scaleX = bitMap.scaleY = hs
                    offsetX = (this._baseStageW - img.width * hs) / 2
                }
                bitMap.x = offsetX
                bitMap.y = offsetY
                
                this._backgroundContainer.addChild(bitMap)
                resolve()
                img = null
            }
            img.crossOrigin = "Anonymous"
            img.src = this._backgroundImage
        })
    }
    // 移动容器
    _moveContainer (container, x, y) {
        container.x = x
        container.y = y
    }
    // 设置线条
    _setLine (x, y) {
        var line = new createjs.Shape()
        line.graphics.beginStroke('#f00').beginFill('#f00').drawCircle(0, 0, 1).moveTo(0, 0).lineTo(1, 1)
        line.x = x
        line.y = y
        this._shapeList.push(line)
        this._shapeContainer.addChild(line)
    }
    // 文本
    _setText (text, x, y) {
        let t = new createjs.Text(text, "20px Arial", "#ff7700")
        t.x = x
        t.y = y
        t.textBaseline = "alphabetic";
        this._textContainer.addChild(t)
    }
    // status move
    _statusMove () {
        //
    }
    // status big
    _statusBig () {
        let newScale = this._statusObj.scaleX + 0.3
        this._statusObj.scaleX = this._statusObj.scaleY = newScale
        this._baseContainer.scaleX = this._baseContainer.scaleY = newScale
    }
    // status small
    _statusSmall () {
        if (this._statusObj.scaleX <= 1) {
            return
        }
        let newScale = this._statusObj.scaleX - 0.3
        this._statusObj.scaleX = this._statusObj.scaleY = newScale
        this._baseContainer.scaleX = this._baseContainer.scaleY = newScale
    }
    // status draw
    _statusDraw () {
        //
    }
    // status clearDraw
    _statusClearDraw () {
        // this._shapeList(item => {
        //     this._shapeContainer.removeChild(item)
        // })

        this._baseContainer.removeChild(this._shapeContainer)
        this._shapeContainer = new createjs.Container()
        this._baseContainer.addChild(this._shapeContainer)
    }
    // status text
    _statusText () {
        //
    }
    // status clearText
    _statusClearText () {
        this._baseContainer.removeChild(this._textContainer)
        this._textContainer = new createjs.Container()
        this._baseContainer.addChild(this._textContainer)
    }
    // status update
    _statusUpdate () {
        // 暂停使用
        // this._baseContainer.removeChild(this._backgroundContainer)
        // this._backgroundContainer = new createjs.Container()
        // this._baseContainer.addChild(this._backgroundContainer)
        // setTimeout(() => {
        //     this._setBackgroundImage()
        // }, 100)
    }
    // 清除背景
    // _clearBackgroundContainer () {
    //     this._backgroundContainer.removeAllChildren()
    // }
    /*
        设置状态
        移动 move
        放大 big
        缩小 small
        绘画 draw
        橡皮擦 clearDraw
        文字 text
        清除文字 clearText
        刷新 update
    */
    setStatus (status) {
        let result = false
        let callback = null
        this._canvasStatusList.forEach(item => {
            if (item.status === status) {
                result = true
                callback = item.callback
                this._canvasStatus = item.status
            }
        })
        if (!result) {
            console.warn('没有该状态')
            return
        }
        callback.call(this)
    }
    // 保存成base64
    save () {  
        var aNode = document.createElement('a')
        aNode.href = this._node.toDataURL('image/png');  
        aNode.download = 'test.png'
        aNode.click()
        return this._statusObj
    }
    // 设置背景图片
    setBackgroundImage (imageUrl) {
        setTimeout(() => {
            this._backgroundImage = imageUrl
            this._setBackgroundImage()
        }, 0)
    }
}

export default (node, options) => {
    return new Draw(node, options)
}