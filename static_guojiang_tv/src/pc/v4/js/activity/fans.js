'use strict'

import Vue from 'vue'
import axios from 'axios'
import user from 'user'
import common from 'common'
import scroll from '../component/niceScroll.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'

import '../../css/activity/fans.less'

const os = (function () {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())
if (os.Phone) location.href = 'https://m.kuaishouvideo.com/dist/activity/fans.html'

var ruleJudge = true
new Vue({
    el: '#app',
    data: {
        uid: false,
        tostBox: false,
        tabMes: true,
        showRule: false,
        jfShow: false,
        showDay: false,
        jfId: 0,
        dayJfTxt: '',
        tostText: '', // tost提示
        userInfo: [],
        isMod: false,
        asMod: [],
        allCount: 0,
        isInvalid: false, // 是否被禁止参加
        asUser: [],
        modArr: [],
        myModArr: [],
        scoreArr: [],
        scoreList: [],
        tjArr: [],
        jdArr: [0, 10, 20, 30, 40],
        theDayJf: 0,
        presentVal: 0, // 进度条值
        isCareAny: false,
        modPage: 1,
        userPage: 1,
        scrollLock1: false,
        scrollLock2: false
    },
    created: function () {
        axios.get('/fanActivity/init')
            .then(res => {
                let data = res.data
                this.uid = data.data.isLogin
                if (!this.uid) {
                    user.showLoginPanel()
                } else {
                    this.userInfo = data.data.basicInfo
                    // 如果是主播
                    if (data.data.isModerator) {
                        this.isMod = true
                        this.asMod = data.data.modInfo
                        // 计算进度条
                        this.allCount = this.asMod.fan_count
                        if (this.asMod.fan_count >= 180) {
                            if (this.asMod.fan_count >= 200) {
                                this.asMod.fan_count = 200
                            }
                            this.jdArr = [160, 170, 180, 190, 200]
                        } else {
                            if (this.asMod.fan_count > 20) {
                                let contVal = this.asMod.fan_count % 10
                                let midVal = 0
                                if (contVal != 0) {
                                    let x = parseInt(this.asMod.fan_count / 10)
                                    // 算出中间值
                                    midVal = x * 10
                                } else {
                                    midVal = this.asMod.fan_count
                                }
                                this.jdArr[0] = midVal - 20
                                this.jdArr[1] = midVal - 10
                                this.jdArr[2] = midVal - 0
                                this.jdArr[3] = midVal + 10
                                this.jdArr[4] = midVal + 20
                            }
                        }
                        this.presentVal = Number(this.asMod.fan_count)
                    } else {
                        this.tabMes = false
                    }

                    // 用户数据(必有)
                    // 关注列表或者推荐
                    this.isInvalid = data.data.userInfo.isInvalid
                    if (data.data.userInfo.hasFanMedal) {
                        this.isCareAny = true
                        this.tjArr = data.data.userInfo.fansMedalList
                    } else {
                        this.tjArr = data.data.userInfo.top3List
                    }
                    Vue.nextTick(() => {
                        $('.with-fans').niceScroll({
                            cursorwidth: 8,
                            cursorcolor: 'rgba(155, 88, 255, 1)', // 设置滚动条滑块的颜色
                            cursorborder: 'none', // CSS方式定义滚动条边框颜色
                            autohidemode: false,
                            cursorfixedheight: 50,
                            hwacceleration: true,
                            horizrailenabled: false,
                            railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
                        })
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 获取榜单
        axios.get('/fanActivity/ranks')
            .then(res => {
                let data = res.data
                this.modArr = data.data.data
                this.myModArr = data.data.myRank
            })
            .catch(err => {
                console.log(err)
            })
    },
    methods: {
        tab (tabN) {
            if (tabN == 'choose') {
                this.tabMes = true
            } else {
                this.tabMes = false
            }
        },

        closeRule () {
            this.showRule = false
        },

        // 获取积分详情
        showJf (e) {
            this.jfShow = true
            var mid = e.target.getAttribute('data-mid')
            if (mid == this.jfId) {

            } else {
                this.jfId = mid
                axios.get('/fanActivity/detail?mid=' + mid)
                    .then(res => {
                        let data = res.data
                        this.scoreArr = data.data.profile
                        this.scoreList = data.data.lists
                        this.theDayJf = this.scoreList[this.scoreList.length - 1].all_score
                        this.dayJfTxt = this.scoreList[this.scoreList.length - 1].date_str + '真爱积分'
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        chooseDay (e, index) {
            this.dayJfTxt = e.target.textContent
            // 获取该日期的积分
            this.theDayJf = this.scoreList[index].all_score
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播房间id //主播用户id
        },

        ruleShow () {
            this.showRule = !this.showRule
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-cover')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-outer')
                    that.transformEntity1 = new PolyfillScroll({
                        scrollWrap: '.rule-cover',
                        scrollContent: '.rule-outer',
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '14px',
                            'background': 'rgba(155, 88, 255, 1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        // 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele)
            var bH = bottomHeight || 120
            _ele.addEventListener('scroll', function () {
                var scrollTop = _ele.scrollTop,
                    cliHeight = _ele.clientHeight,
                    scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        },

        // 主播榜滚动加载
        initScrollLoadMod () {
            const that = this
            that.scrollLoad('.mod-other', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.modPage, false)
            })
        },

        // ajax获取主播列表
        getModRank (page) {
            const that = this
            axios.get('/fanActivity/ranks?type=mod&pageNo=' + page)
                .then(res => {
                    let data = res.data.data.data
                    if (data.length > 0) {
                        that.modArr = that.modArr.concat(data)
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // Tost
        TostTxt (txt) {
            this.tostBox = true
            this.tostText = txt
        }
    },
    mounted: function () {
        // 滚动加载
        this.initScrollLoadMod()
    }
})

$('.mod-other').niceScroll({
    cursorwidth: 8,
    cursorcolor: 'rgba(155, 88, 255, 1)', // 设置滚动条滑块的颜色
    cursorborder: 'none', // CSS方式定义滚动条边框颜色
    autohidemode: false,
    cursorfixedheight: 50,
    hwacceleration: true,
    horizrailenabled: false,
    railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
})
