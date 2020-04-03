import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'

require('../../css/activity/laborday.less')

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

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/laborday.html'

new Vue({
    el: '#app',
    data: {
        tabCon: true,
        showRule: false,
        modArr: [],
        userArr: [],
        nowTj: [],
        richArr: [],
        scrollLock1: false,
        scrollLock2: false,
        modPage: 1,
        userPage: 1,
        restTime: ['-', '-', ':', '-', '-', ':', '-', '-'], // 抢榜时间还剩
        currentTime: 0,
        endTime: 0,
        judgeTime: true, // 活动时间
        listTime: true, // 抢榜时间段
        nextTime: '--:--:--', // 下个抢榜时段
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/Labour/userInfo')
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
        axios.get('/Labour/getRank?tag=m')
            .then(res => {
                let data = res.data
                this.modArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })

        // 用户榜单
        axios.get('/Labour/getRank?tag=u')
            .then(res => {
                let data = res.data
                this.userArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })

        // 当前抢榜
        this.getRecommend()

        // 神豪
        axios.get('/Labour/timerank?type=0')
            .then(res => {
                let data = res.data
                this.richArr = data.data.ranks
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

        // 神豪跳转直播间
        shinlive (e, index) {
            // 神豪
            var userid = e.target.getAttribute('data-userid')
            axios.get('/Labour/follow?uid=' + userid + '')
                .then(res => {
                    let data = res.data
                    var rid = data.data.rid
                    if (rid == '') {
                        rid = e.target.getAttribute('data-rid')
                        common.goRoom(rid) // 主播房间id //主播用户id
                    } else {
                        common.goRoom(rid) // 主播房间id //主播用户id
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 当前推荐
        getRecommend () {
            let string = new Date().getTime()
            axios.get('/Labour/timerank?type=1?=' + string + '')
                .then(res => {
                    const data = res.data.data
                    this.nowTj = data.ranks
                    this.judgeTime = data.is_activity
                    if (!data.now_time || !data.end_time) {
                        this.listTime = false
                        this.nextTime = data.next_stime + '-' + data.next_etime
                    }
                    if (!data.exp_time || !this.judgeTime) {
                        this.listTime = false
                        this.nextTime = '--:--:--'
                    } else {
                        this.currentTime = new Date(data.now_time).getTime() // 单位ms
                        this.endTime = new Date(data.end_time).getTime() // 单位ms
                        this.caclTime()
                    }
                })
                .catch(err => console.log(err))
        },

        // 实时
        caclTime () {
            if (!this.judgeTime) {
                return this.restTime = ['-', '-', ':', '-', '-', ':', '-', '-']
            }
            let restHou = (new Date(this.endTime).getHours()) - (new Date(this.currentTime).getHours()) - 1
            let restMin = 59 - (new Date(this.currentTime)).getMinutes()
            let restSec = 59 - (new Date(this.currentTime)).getSeconds()
            if (restHou <= 0 && restMin <= 0 && restSec <= 0) {
                return this.getRecommend()
            }

            let tempTimeArr = []
            if (restHou < 10) tempTimeArr = [].concat(tempTimeArr, [0, restHou])
            else tempTimeArr = [].concat(tempTimeArr, String(restHou).split(''))
            tempTimeArr.push(':')
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
            axios.get('/Labour/Attention', {
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
            axios.get('/Labour/Attention', {
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
                        this.nowTj[index]['is_attention'] = true
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
            axios.get('/Labour/getRank?tag=m', {
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
            axios.get('/Labour/getRank?tag=u', {
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
