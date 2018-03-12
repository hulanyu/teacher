import Vue from 'vue'
import axios from 'axios'
import qs from 'qs';
import {Message} from 'element-ui'
import store from '@/store/'
import config from '@/config'
import router from './router/'

class HTTP {
    constructor () {
        // this._init()
    }
    _init () {
        // axios.defaults.withCredentials = true
    }
    _log (method, url, data) {
        console.log(`${HTTP.BASEURL + url}, method: ${method}, data: ${JSON.stringify(data)}`)
    }
    _send (method, url, data={}, options={}) {
        this._log(method, url, data)

        method = method.toUpperCase()
        let showError = true
        let showLoading = true
        let showSuccess = false
        // 是否显示错误消息
        if (options.showError === false) {
            showError = false
        }
        // 是否显示loading
        if (options.showLoading === false) {
            showLoading = false
        }
        // 是否显示成功信息
        if (options.showSuccess === true) {
            showSuccess = true
        }

        if (showLoading) {
            store.commit('startLoad')
        }

        let reqObj = {}
        if (method === HTTP.POST) {
            reqObj['method'] = method
            reqObj['url'] = url
            reqObj['data'] = qs.stringify(data)
        } else if (method === HTTP.GET) {
            reqObj['method'] = method
            reqObj['url'] = url + '?' + qs.stringify(data)
        }
        
        return HTTP.h.request(reqObj)
        .then(res => {
            // 关闭loading
            if (showLoading) {
                store.commit('endLoad')
            }
            if (res.data.status == HTTP.RES_STATUS_SUCCESS) {
                return {
                    res: res.data,
                    status: HTTP.RES_STATUS_SUCCESS,
                }
            } else if (res.data.status == HTTP.RES_STATUS_FAIL) {
                return Promise.reject({
                    res: res.data,
                    status: HTTP.RES_STATUS_FAIL,
                })
            } else if (res.data.status == HTTP.RES_STATUS_LOGIN) {
                return Promise.reject({
                    res: res.data,
                    status: HTTP.RES_STATUS_LOGIN,
                })
            }
        })
        .then(obj => {
            // 成功提示
            if (showSuccess) {
                Message.success(obj.res.info ? `${obj.res.info}` : '请求成功')
            }
            return obj
        })
        .catch(obj => {
            // 关闭loading
            if (showLoading) {
                store.commit('endLoad')
            }
            // 错误提示
            if (obj.status === HTTP.RES_STATUS_FAIL) {
                if (showError) {
                    Message.error(obj.res.info ? `${obj.res.info}` : '请求失败')
                }
            } else if (obj.status === HTTP.RES_STATUS_LOGIN) {
                // 跳登录
                if (showError) {
                    Message.error('请求重新登录')
                }
                router.push({
                    name: 'Login'
                })
            } else {
                Message.error('未知操作')
            }
            return Promise.reject(obj)
        })
    }
    async request (url, options={}) {
        if (!url) {
            throw new Error('请输入url')
        }
        options = Object.assign({
            method: 'GET',
            data: {}
        }, options)
        return await this._send(options.method, url, options.data)
    }
    async _handleSend (method, url, data, options) {
        let t;
        try {
            t = await this._send(method, url, data, options)
        } catch (err) {
            t = err
        }
        if (t.status === HTTP.RES_STATUS_SUCCESS) {
            return t.res
        } else {
            return Promise.reject(t.res)
        }
    }
    bind (callback=()=>{}) {
        callback((method, args) => {
            return this._handleSend.call(this, method, ...args)
        })
    }
}
// 默认baseUrl
// if (process.env.NODE_ENV === 'development') {
//     //
// }
HTTP.BASEURL = config.BASEURL
HTTP.GET = 'GET'
HTTP.POST = 'POST'
HTTP.RES_STATUS_SUCCESS = 1
HTTP.RES_STATUS_FAIL = 0
HTTP.RES_STATUS_LOGIN = 101
HTTP.h = axios.create({
    baseURL: HTTP.BASEURL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})

export default HTTP