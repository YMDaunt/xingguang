/*
 * @Date: 2019-09-02 16:02:14
 * @LastEditors: Jesse
 * @LastEditTime: 2020-02-18 15:11:54
 */
require('../../css/activity/rebate.less')

import Vue from 'vue'

const os = (function () {
    const ua = navigator.userAgent
    const isWindowsPhone = /(?:Windows Phone)/.test(ua)
    const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
    const isAndroid = /(?:Android)/.test(ua)
    const isFireFox = /(?:Firefox)/.test(ua)
    const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
    const isPhone = /(?:iPhone)/.test(ua) && !isTablet
    const isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

if (os.isPhone) location.href = '//m.tuho.tv/dist/activity/rebate.html'

new Vue({
    el: '#app',
    data: {

    },
    created: function () {

    },

    mounted: function () {

    },

    methods: {
        // 充值
        goCz () {
            window.open('/recharge/center')
        }
    }
})
