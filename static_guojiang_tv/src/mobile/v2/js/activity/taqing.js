import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'

require('../../css/activity/taqing.less')

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

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/taqing.html'

new Vue({
    el: '#app',
    data: {
        tabCon: true,
        showRule: false,
        showTj: false,
        modArr: [],
        userArr: [],
        nowTj: [],
        passTj: [],
        playTj: [],
        scrollLock1: false,
        scrollLock2: false,
        modPage: 1,
        userPage: 1,
        restTime: ['-', '-', ':', '-', '-', ':', '-', '-'], // 抢榜时间还剩
        currentTime: 0,
        judgeTime: true,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/TaqingActivity/userInfo')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.id
                    if (!this.uid) {
                        return common.goLogin()
                    }
                    this.userMesArr = data.data.userMes
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 主播榜单
        axios.get('/TaqingActivity/getRank?tag=m')
            .then(res => {
                let data = res.data
                this.modArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })

        // 用户榜单
        axios.get('/TaqingActivity/getRank?tag=u')
            .then(res => {
                let data = res.data
                this.userArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })

        // 当前推荐
        this.getRecommend()

        // 往期上榜
        axios.get('/TaqingActivity/getLastSweetAwards')
            .then(res => {
                let data = res.data
                this.passTj = data.data
            })
            .catch(err => {
                console.log(err)
            })

        // 主播推荐
        axios.get('/TaqingActivity/GetRecs')
            .then(res => {
                let data = res.data
                this.playTj = data.data
            })
            .catch(err => {
                console.log(err)
            })
    },

    mounted: function () {
        // 滚动加载
        this.initScrollLoadMod()
        this.initScrollLoadUser()
    },

    methods: {
        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        rule () {
            this.showRule = !this.showRule
        },

        tj () {
            this.showTj = !this.showTj
        },

        closeWin () {
            if (this.showRule) {
                this.showRule = !this.showRule
            }
            if (this.showTj) {
                this.showTj = !this.showTj
            }
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            common.goRoom(rid) // 主播房间id //主播用户id
        },

        // 当前推荐
        getRecommend () {
            let string = new Date().getSeconds()
            axios.get('/TaqingActivity/getCurrentSweetRank?=' + string + '')
                .then(res => {
                    const data = res.data.data
                    this.nowTj = data.result
                    this.currentTime = data.time * 1000 // 单位/ms
                    this.judgeTime = data.actRunning
                    this.caclTime()
                })
                .catch(err => console.log(err))

            // 往期上榜
            axios.get('/TaqingActivity/getLastSweetAwards')
                .then(res => {
                    let data = res.data
                    this.passTj = data.data
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 实时
        caclTime () {
            if (!this.judgeTime) {
                return this.restTime = ['-', '-', ':', '-', '-', ':', '-', '-']
            }
            let restMin = 59 - (new Date(this.currentTime)).getMinutes()
            let restSec = 59 - (new Date(this.currentTime)).getSeconds()
            if (restMin <= 0 && restSec <= 0) {
                return this.getRecommend()
            }

            let tempTimeArr = ['0', '0', ':']
            if (restMin < 10) tempTimeArr = [].concat(tempTimeArr, [0, restMin])
            else tempTimeArr = [].concat(tempTimeArr, String(restMin).split(''))
            tempTimeArr.push(':')
            if (restSec < 10) tempTimeArr = [].concat(tempTimeArr, [0, restSec])
            else tempTimeArr = [].concat(tempTimeArr, String(restSec).split(''))
            this.restTime = tempTimeArr

            setTimeout(() => {
                this.currentTime += 1000
                this.caclTime()
            }, 1000)
        },

        // 关注1
        attention (e, index) {
            axios.get('/TaqingActivity/Attention', {
                params: {
                    mid: e.target.getAttribute('data-id')
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        this.modArr[index]['is_attention'] = true
                    } else if (!this.uid) {
                        return common.goLogin()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 关注2
        attention2 (e, index) {
            axios.get('/TaqingActivity/Attention', {
                params: {
                    mid: e.target.getAttribute('data-id')
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        this.playTj[index]['is_attention'] = true
                    } else if (!this.uid) {
                        return common.goLogin()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
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

        // 主播榜滚动加载
        initScrollLoadMod () {
            const that = this
            that.scrollLoad('.other-mod', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.modPage)
            })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.other-user', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.userPage++
                that.getUserRank(that.userPage)
            })
        },

        // ajax获取主播列表
        getModRank (modPage) {
            const that = this
            axios.get('/TaqingActivity/getRank?tag=m', {
                params: {
                    page: modPage
                }
            })
                .then(res => {
                    let data = res.data.data.ranks
                    if (data.length > 0) {
                        that.modArr = that.modArr.concat(data)
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取用户列表
        getUserRank (userPage) {
            const that = this
            axios.get('/TaqingActivity/getRank?tag=u', {
                params: {
                    page: userPage
                }
            })
                .then(res => {
                    let data = res.data.data.ranks
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

// 控制规则显示
function controlRule () {
    $(document).scroll(function () {
        var scrollVal = $(document).scrollTop()
        var distance = $('.rank-con').offset().top
        if (scrollVal >= distance) {
            $('.rule-btn').hide(0)
        } else {
            $('.rule-btn').show(0)
        }
    })
} controlRule()
