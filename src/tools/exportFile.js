import config from '@/config'
import req from 'axios'
import {Message} from 'element-ui'
import getBrowserInfo from './getBrowserInfo'
import nodeUrl from 'url'
import qs from 'qs';

const browserInfo = getBrowserInfo()
function remove (node) {
    if (browserInfo.name === getBrowserInfo.IE) {
        node.removeNode(true)
    } else {
        node.remove()
    }
}
export default (url, params={}, options) => {
    options = options || {}
    options = Object.assign({}, {
        type: 'post'
    }, options)
    let parseUrl = nodeUrl.parse(url, true, true)
    let URL;
    // 二种url类型
    if (Object.prototype.toString.call(url) === '[object Object]') {
        // 老方法
        // 弃用
        URL = (url.base || config.BASEURL) + (url.querystring || '')
    } else {
        // URL = config.BASEURL + url
        let t = ''
        if (!parseUrl.protocol) {
            if (!parseUrl.host) {
                t = config.BASEURL
            } else {
                t = `//${parseUrl.host}`
            }
        } else {
            t = `${parseUrl.protocol}//${parseUrl.host}`
        }
        t += parseUrl.pathname
        URL = t
    }
    // 查询接口情况
    // 如果为get方式直接使用window.open下载
    if (options.type.toUpperCase() === 'GET') {
        console.log(123, `${URL}?${qs.stringify(params)}`)
        window.open(`${URL}?${qs.stringify(params)}`)
    } else {
        req.request({
            method: 'HEAD',
            url: URL
        })
        .then(res => {
            if (res.status != 200) {
                Message.error('接口错误')
                return
            }
            var temp_form = document.createElement("form") 
            temp_form.action = URL
            temp_form.target = "_blank"
            temp_form.method = options.type 
            temp_form.style.display = "none"
            for (var x in params) { 
                var opt = document.createElement("textarea") 
                opt.name = x 
                opt.value = params[x] 
                temp_form.appendChild(opt) 
            }
            document.body.appendChild(temp_form) 
            temp_form.submit()
            remove(temp_form)
        })
        .catch(res => {
            Message.error('下载失败')
            console.error('下载失败', res)
        })
    }
}