const OPERA = 'opera'
const FIREFOX = 'firefox'
const CHROME = 'chrome'
const SAFARI = 'safari'
const IE = 'ie'

function getBrowserInfo () {
    const ua = navigator.userAgent.toLowerCase()
    let version, browserName

	if (ua.indexOf("opera") > -1) {
        // Opera
        browserName = 'opera'
        ua.match(/version\/([0-9\.]+)/i)
        version = RegExp.$1
    } else if (ua.indexOf("firefox") > -1) {
		// firefox
        browserName = 'firefox'
        ua.match(/firefox\/([0-9\.]+)/i)
        version = RegExp.$1
	} else if (ua.indexOf("chrome") > -1) {
        // chrome
        browserName = 'chrome'
        ua.match(/chrome\/([0-9\.]+)/i)
        version = RegExp.$1
    } else if (ua.indexOf("safari") > -1) {
        // safari
        browserName = 'safari'
        ua.match(/version\/([0-9\.]+)/i)
        version = RegExp.$1
    } else if (ua.indexOf("msie") > -1 || ua.indexOf("rv:11") > -1) {
        // ie
        browserName = 'ie'
        if (ua.indexOf("msie") > -1) {
            // ie6-ie10
            ua.match(/msie ([0-9\.]+)/i)
            version = RegExp.$1
        } else {
            ua.match(/rv:([0-9]+)/i)
            version = RegExp.$1
        }
    }

    return {
        name: browserName,
        version,
    }
}

getBrowserInfo.OPERA = OPERA
getBrowserInfo.FIREFOX = FIREFOX
getBrowserInfo.CHROME = CHROME
getBrowserInfo.SAFARI = SAFARI
getBrowserInfo.IE = IE

export default getBrowserInfo