import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import user from 'user'

require('../../css/activity/taqing.less')

var ruleJudge = true
var codeJudge = true

new Vue({
    el: '#app',
    data: {
        tabCon: true,
        showRule: false,
        showTj: false,
        scrollEnity: null,
        modArr: [],
        userArr: [],
        nowTj: [],
        passTj: [],
        playTj: [],
        scrollLock1: false,
        scrollLock2: false,
        modPage: 1,
        userPage: 1,
        transformEntity: undefined,
        transformEntity2: undefined,
        transformEntity3: undefined,
        transformEntity4: undefined,
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
                            'background': 'rgba(200,237,204,1)'
                        }
                    })
                }
            })
        },

        rule () {
            this.showRule = !this.showRule
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-coover')
                    that.transformEntity3 = new PolyfillScroll({
                        scrollWrap: '.rule-out',
                        scrollContent: '.rule-coover',
                        bar: {
                            width: '10px',
                            height: '40px',
                            right: '2px',
                            'background': 'rgba(200,237,204,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        tj () {
            this.showTj = !this.showTj
            let that = this
            Vue.nextTick(() => {
                if (codeJudge) {
                    const sortWrapElement = document.querySelector('.tj-list')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.tj-list-out')
                    that.transformEntity4 = new PolyfillScroll({
                        scrollWrap: '.tj-list',
                        scrollContent: '.tj-list-out',
                        bar: {
                            width: '10px',
                            height: '40px',
                            right: '2px',
                            'background': 'rgba(200,237,204,1)'
                        }
                    })
                    codeJudge = false
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

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // 当前推荐
        getRecommend () {
            // 创建随机数，利用时间戳解决IE缓存
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
            axios.get('/TaqingActivity/getLastSweetAwards?=' + string + '')
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
                        user.showLoginPanel()
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
            axios.get('/TaqingActivity/getRank?tag=m', {
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
                                        'background': 'rgba(200,237,204,1)'
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
            axios.get('/TaqingActivity/getRank?tag=u', {
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
