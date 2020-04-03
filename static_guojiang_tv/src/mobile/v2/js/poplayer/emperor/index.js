/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:52:22
 */
/* eslint-disable */
import '../../../css/poplayer/emperor/index.less'
import {triggle} from './fun/triggle.js'

let svgContainer = document.getElementById('svgContainer')

!(function () {
    // 触发移动端touch active状态
    document.querySelector('body').addEventListener('touchstart', function () {})
})()

// webview调用函数
window.showWebviewAnimation = function (data) {
    let parseData = JSON.parse(data)
    if (parseData.activityId == '129') {
        triggle(parseData)
    }
}

// svg图
alert(1)
