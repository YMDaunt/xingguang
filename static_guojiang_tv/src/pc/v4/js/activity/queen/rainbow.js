// 在loader里面完成less的编译
import '../../../css/activity/queen/rainbow.less'

// 通用库类的引用
import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import user from 'user'
import scroll from '../../component/niceScroll.js'

new Vue({
    el: '#app',
    data: {
        uid: false,
        mid: '',
        rid: '',
        userRank: [],
        userPage: 1,
        isLove: false,
        scrollLock: false
    },
    created: function () {
        axios.get('/rainBow/userInfo')
            .then(res => {
                let data = res.data.data
                if (data.id) {
                    this.uid = true
                    console.log('已登录')
                }
            })
            .catch(err => {
                console.log(err)
            })

        axios.get('/rainBow/isAttention')
            .then(res => {
                let data = res.data.data
                this.isLove = data.isLoved
                this.mid = data.mid
                this.rid = data.rid
                console.log(this.isLove)
            })
            .catch(err => {
                console.log(err)
            })

    	axios.get('/rainBow/getrank?type=user')
    	.then(res => {
                let data = res.data
           	this.userRank = data.data.ranks
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
            window.open('https://www.kuaishouvideo.com/' + this.mid)
    	},

        // 关注
        love () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/rainBow/attention?mid=' + this.mid)
                    .then(res => {
                        let data = res.data
                        if (data.errno == 0) {
                            this.isLove = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
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

        // 滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.rank-list-other', 120, function () {
                if (that.scrollLock) return
                that.scrollLock = true
                that.userPage++
                that.getUserRank(that.userPage)
            })
        },

        // ajax获取用户列表
        getUserRank (userPage) {
            const that = this
            axios.get('/rainBow/getrank?type=user', {
                params: {
                    page: userPage
                }
            })
                .then(res => {
                	let data = res.data
                    let _data = data.data.ranks
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

$(document).ready(function () {
    $('.rank-list-other').niceScroll({
        cursorwidth: 10,
        cursorcolor: 'rgba(42, 199, 228,1)', // 设置滚动条滑块的颜色
        cursorborder: 'none', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        hwacceleration: true,
        horizrailenabled: false,
        railpadding: { top: 10, right: 10, left: 0, bottom: 0 }
    })
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

if (os.isPhone) location.href = '//m.kuaishouvideo.com/dist/activity/queen/rainbow.html'
