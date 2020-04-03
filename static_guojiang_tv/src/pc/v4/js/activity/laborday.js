import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import user from 'user'

require('../../css/activity/laborday.less')

let ruleJudge = true
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
        transformEntity: undefined,
        transformEntity2: undefined,
        transformEntity3: undefined,
        restTime: ['-', '-', ':', '-', '-', ':', '-', '-'], // 抢榜时间还剩
        currentTime: 0,
        endTime: 0,
        judgeTime: true, // 活动时间
        listTime: true, // 抢榜时间段
        nextTime: 0, // 下个抢榜时段
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
            Vue.nextTick(() => {
                let that = this
                if (!that.transformEntity2) {
                    const sortWrapElement = document.querySelector('.user-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.other-user')
                    that.transformEntity2 = new PolyfillScroll({
                        scrollWrap: '.user-out',
                        scrollContent: '.other-user',
                        cb: function (distance) {
                            const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                            if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                if (that.scrollLock2) return
                                that.scrollLock2 = true
                                that.userPage++
                                that.initScrollLoadUser(that.userPage)
                            }
                        },
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '4px',
                            'background': 'rgba(246,246,246,1)'
                        }
                    })
                }
            })
        },

        closeWin () {
            if (this.showRule) {
                this.showRule = !this.showRule
            }
            if (this.showTj) {
                this.showTj = !this.showTj
            }
        },

        rule () {
            this.showRule = !this.showRule
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.cover')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-out')
                    that.transformEntity3 = new PolyfillScroll({
                        scrollWrap: '.cover',
                        scrollContent: '.rule-out',
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '10px',
                            'background': 'rgba(244,244,244,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // 神豪跳转直播间
        shinlive (e, index) {
            // 神豪
            var userid = e.target.getAttribute('data-userid')
            axios.get('/Labour/follow?uid=' + userid + '')
                .then(res => {
                    let data = res.data
                    var id = data.data.mid
                    if (id == '') {
                        id = e.target.getAttribute('data-rid')
                        window.open('/' + id) // 主播用户id
                    } else {
                        window.open('/' + id) // 主播用户id
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
            if (restHou <= 0) {
                restHou = 0
            }
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
                        user.showLoginPanel()
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
                        user.showLoginPanel()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 主播榜滚动加载
        initScrollLoadMod () {
            let that = this
            axios.get('/Labour/getRank?tag=m', {
                params: {
                    page: that.modPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addModArr = data.data.ranks
                    if (addModArr.length > 0) {
                        that.modArr = that.modArr.concat(addModArr)
                        that.scrollLock1 = false
                        if (!that.transformEntity) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.mod-out')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.other-mod')
                                that.transformEntity = new PolyfillScroll({
                                    scrollWrap: '.mod-out',
                                    scrollContent: '.other-mod',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                            if (that.scrollLock1) return
                                            that.scrollLock1 = true
                                            that.modPage++
                                            that.initScrollLoadMod(that.modPage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '60px',
                                        right: '4px',
                                        'background': 'rgba(246,246,246,1)'
                                    }
                                })
                            })
                        }
                    }
                })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            let that = this
            axios.get('/Labour/getRank?tag=u', {
                params: {
                    page: that.userPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addUserArr = data.data.ranks
                    if (addUserArr.length > 0) {
                        that.userArr = that.userArr.concat(addUserArr)
                        that.scrollLock2 = false
                    }
                })
        }
    }
})
