import Vue from 'vue'
import formatDate from './tools/formatDate'
import exportFile from './tools/exportFile'
import htmlResize from './tools/htmlResize'
import random from './tools/random'
import getToken from './tools/getToken'
import getSchoolID from './tools/getSchoolID'
import getMap from './tools/getMap'
import getBrowserInfo from './tools/getBrowserInfo'
import transformHTML from './tools/transformHTML'
import getUID from './tools/getUID'
import stringToDate from './tools/stringToDate'

/*
vue扩展
this.$tools.*
*/
function init () {
    return {
        formatDate,
        exportFile,
        htmlResize,
        random,
        getToken,
        getMap,
        getBrowserInfo,
        getSchoolID,
        getUserID: getUID,
        transformHTML,
        getUID,
        stringToDate,
    }
}
// 测试
window.tools = init()
export default{
    install(Vue, options) {
        Vue.prototype.$tools = init()
    }
}