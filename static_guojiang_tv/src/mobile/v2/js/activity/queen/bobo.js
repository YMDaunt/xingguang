// 在loader里面完成less的编译
import '../../../css/activity/queen/bobo.less'

// 通用库类的引用
import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'

new Vue({
    el: '#app',
    data: {
        userRank: [],
        userPage: 0,
        scrollLock: false
    },
    created: function () {
    	axios.get('/BoboActivity/GetUserRank')
    	.then(res => {
                let data = res.data
               	this.userRank = data.data.useranks
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
    	this.initScrollLoadUser()
    },
    methods: {
    	// 跳转直播
    	inlive () {
    		var rid = 47416
            // var rid = '44445294';  // 测试
            common.goRoom(rid)
    	},

    	// 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele)
            var bH = bottomHeight || 100
            _ele.addEventListener('scroll', function () {
                var scrollTop = _ele.scrollTop

                var cliHeight = _ele.clientHeight

                var scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        },

        // 龙榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.other-cover', 120, function () {
                if (that.scrollLock) return
                that.scrollLock = true
                that.userPage++
                that.getUserRank(that.userPage)
            })
        },

        // ajax获取用户列表
        getUserRank (userPage) {
            const that = this
            axios.get('/BoboActivity/GetUserRank', {
                params: {
                    page: userPage
                }
            })
                .then(res => {
                	let data = res.data
                    let _data = data.data.useranks
                    if (_data.length > 0) {
                        that.userRank = that.userRank.concat(_data)
                        that.scrollLock = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

const os = (function () {
    var ua = navigator.userAgent

    var isWindowsPhone = /(?:Windows Phone)/.test(ua)

    var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone

    var isAndroid = /(?:Android)/.test(ua)

    var isFireFox = /(?:Firefox)/.test(ua)

    var isChrome = /(?:Chrome|CriOS)/.test(ua)

    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))

    var isPhone = /(?:iPhone)/.test(ua) && !isTablet

    var isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/queen/bobo.html'
