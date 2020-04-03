require('../../css/activity/nationalDay.less')

import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import layer from 'layer'
import PolyfillScroll from '../component/gj.polyfillScroll.js'

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

if (os.isPhone) location.href = '//m.kuaishouvideo.com/dist/activity/nationalDay.html'
var codeJudge = true

new Vue({
    el: '#app',
    data: {
        uid: false,
        codeBox: false,
        activityStatus: 0,
        signDay: 0,
        lastTime: 0,
        allJf: 0,
        drewTimer: null,
        canSign: true,
        canDrew: true,
        drewingJudge: false,
        tostBox: false,
        tostText: '',
        initArr: [],
        qdArr: [
            {'gq': 5, 'coins': 3}, {'gq': 5, 'coins': 4}, {'gq': 6, 'coins': 5}, {'gq': 6, 'coins': 6}, {'gq': 8, 'coins': 7}, {'gq': 10, 'coins': 7}, {'gq': 15, 'coins': 8}, {'gq': 20, 'coins': 10}
        ],
        drewArr: ['', '', '', '', '', '', '', ''],
        nowIndex: -1,
        broadArr: [],
        modArr: [],
        codeArr: [],
        drewNum: [],
        transformEntity: undefined
    },
    created: function () {
        // 初始化活动信息
        axios.get('/national/initInfo')
            .then(res => {
                let data = res.data
                this.initArr = data.data
                this.uid = this.initArr.isLogin
                this.signDay = this.initArr.signedDays
                this.canSign = this.initArr.canSign
                this.canDrew = this.initArr.canLottery
                this.allJf = this.initArr.score
            })
            .catch(err => {
                console.log(err)
            })

        // 广播
        axios.get('/national/awardMsg')
            .then(res => {
                let data = res.data
                this.broadArr = data.data
                if (this.broadArr.length == 0) {
                    this.broadArr = ['祝平台所有朋友们，国庆快乐！', '祝平台所有朋友们，国庆快乐！']
                }
                Vue.nextTick(() => {
                    var speed = 25
                    var scrollOut = $('.scroll-con')
                    var scrollEle1 = $('#scrollEle')
                    var scrollEle2 = $('#scrollEle2')
                    if (scrollEle1.find('span').length > 1) {
                        scrollEle2.html(scrollEle1.html())
                        function Marquee () {
                            if (scrollEle2[0].offsetWidth - scrollOut[0].scrollLeft <= 0) {
                                scrollOut[0].scrollLeft = 0
                            } else {
                                scrollOut[0].scrollLeft++
                            }
                        }
                        var timer = setInterval(Marquee, speed)
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })

        // 榜单
        axios.get('/national/GetRank?type=mod&pageNo=1&pageSize=10')
            .then(res => {
                let data = res.data
                this.modArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })
    },

    mounted: function () {

    },

    methods: {
        // 签到
        sign () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/national/sign')
                    .then(res => {
                        let data = res.data
                        if (data.errno == 0) {
                            this.signDay++
                            this.allJf = data.data.score
                            this.canSign = false
                        } else {
                            this.tostText = data.msg
                            this.tostBox = true
                            this.disapperTost(2500)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 抽奖方法
        drew () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                if (!this.drewingJudge) {
                    let that = this
                    this.drewingJudge = true
                    axios.get('/national/lottery')
                        .then(res => {
                            let data = res.data
                            if (data.errno == 0) {
                                this.canDrew = false
                                this.drewNum = data.data.ret
                                this.allJf = data.data.score
                                var baseNum = 0 // 圈数
                                var timeSpeed = 300 // 初始速度
                                this.nowIndex = 0
                                this.drewTimer = setInterval(move, timeSpeed)

                                function move () {
                                // 停止
                                    if (baseNum >= 8 && that.nowIndex === that.drewNum - 1) {
                                        clearInterval(that.drewTimer)
                                        // 延迟显示结果
                                        setTimeout(() => {
                                            that.tostText = data.msg
                                            that.tostBox = true
                                            that.disapperTost(3000)
                                            that.drewingJudge = false
                                            that.canDrew = true
                                        }, 500)
                                    }

                                    // 转圈控制
                                    else {
                                        that.nowIndex++
                                        if (that.nowIndex > 7) {
                                            that.nowIndex = 0
                                            baseNum++
                                        }
                                        // 速度控制
                                        if (baseNum <= 6) { // 加度
                                            timeSpeed -= 20
                                            if (timeSpeed < 40) {
                                                timeSpeed = 40 // 最高速度
                                            }
                                        } else {
                                            timeSpeed += 20 // 减度
                                            if (timeSpeed > 360) {
                                                timeSpeed = 360 // 最低速度
                                            }
                                        }
                                        if (that.drewTimer) {
                                            clearInterval(that.drewTimer)
                                        }
                                        that.drewTimer = setInterval(move, timeSpeed)
                                    }
                                }
                            } else {
                                that.drewingJudge = false
                                this.tostText = data.msg
                                this.tostBox = true
                                this.disapperTost(2500)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }
        },

        // 中奖纪录
        drewCode () {
            axios.get('/national/lotteryRecords')
                .then(res => {
                    let that = this
                    let data = res.data
                    this.codeArr = data.data
                    if (this.codeArr.length == 0) {
                        this.codeArr = false
                    }
                    this.codeBox = !this.codeBox
                    Vue.nextTick(() => {
                        if (codeJudge && this.codeArr.length > 0) {
                            const sortWrapElement = document.querySelector('.code-out')
                            const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                            const sortListElement = document.querySelector('.code-ul')
                            that.transformEntity = new PolyfillScroll({
                                scrollWrap: '.code-out',
                                scrollContent: '.code-ul',
                                bar: {
                                    width: '8px',
                                    height: '60px',
                                    right: '6px',
                                    'background': 'rgba(255, 238, 159,1)'
                                }
                            })
                            codeJudge = false
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // tost计时器
        disapperTost (time) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.tostBox = false
            }, time)
        }
    }
})

function playSvg (path) {
    var svgContainer = document.querySelector('.svg-con')
    var giftSvg = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: true,
        autoplay: true,
        path: path
    })
}
