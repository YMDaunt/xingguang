import axios from 'axios'
import vue from 'vue'
import common from 'common'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import Snow from '../component/gj.snow.js'
import $ from 'webpack-zepto'

import FillBg from './vue/widget/fillBg.vue'
import Box from './vue/widget/box.vue'
import textDiv from './vue/widget/textDiv.vue'
import sortBg from './vue/ricePudding/sortBg.vue'
import borderImg from './vue/ricePudding/borderImg.vue'
import ruleGift from './vue/ricePudding/ruleGift.vue'

require('../../css/activity/ricePudding.less')

document.body.addEventListener('touchstart', function () {})

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

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/ricePudding.html'

new Snow({
    level: 5,
    imgBox: [
        '//static.guojiang.tv/mobile/v2/img/activity/ricePudding/2.png',
        '//static.guojiang.tv/mobile/v2/img/activity/ricePudding/2.png',
        '//static.guojiang.tv/mobile/v2/img/activity/ricePudding/1.png'
    ]
})

let bodyScrollEnity
let prizeScrollEnity

const vm = new vue({
    el: '#app',
    components: {
        FillBg,
        Box,
        sortBg,
        textDiv,
        borderImg,
        ruleGift
    },
    data: {
        bf: 108,
        imgUrl: '//static.guojiang.tv/mobile/v2/img/activity/ricePudding/',

        activityId: 320,
        modPage: 0,
        modLists: [],
        userPage: 0,
        userLists: [],
        currentIdx: 0,
        currentLists: [],

        recommendLists: [],
        lastSweetLists: {},

        prizeLogStatus: false,
        rulesStatus: false,

        restTime: ['-', '-', 'dotted', '-', '-', 'dotted', '-', '-'], // 抢榜时间还剩
        currentTime: 0,
        timeArr: [],

        scrollLock: false,
        scrollUserLock: false,
        entity: null

    },
    created () {
        this.getModRank()
        this.getUserRank()
        this.getRecommend()
        this.getLastSweet()
    },
    mounted () {
        bodyScrollEnity = new PolyfillScroll({
            scrollWrap: '.wrapper',
            scrollContent: '.app-content',
            bar: {
                width: '2px',
                height: '40px',
                background: 'rgba(0,0,0,0.4)',
                right: '2px'
            }
        })

        new PolyfillScroll({
            scrollWrap: '.rule-wrap .rules-block',
            scrollContent: '.rules-content',
            bar: {
                width: '2px',
                height: '40px',
                background: 'rgba(0,0,0,0.4)',
                right: '2px'
            }
        })
    },
    methods: {
        // 主播榜单
        getModRank () {
            const that = this
            axios.get('/RicePudding/GetModRank', {
                params: {
                    activityId: this.activityId,
                    page: this.modPage
                }
            })
		    .then(res => {
                    const _data = res.data.data
                    if (_data.ranks.length === 0) return
                    this.modPage++
                    this.modLists = [].concat(this.modLists, _data.ranks)
                    if (this.currentIdx === 0) this.currentLists = this.modLists
                    this.scrollLock = false
                    if (this.modPage === 1) {
                        vue.nextTick(function () {
                            that.scrollLoad()
                        })
                    }
                })
		    .catch(err => console.log(err))
        },
        // 用户榜单
        getUserRank () {
            axios.get('/RicePudding/GetUserRank', {
                params: {
                    activityId: this.activityId,
                    page: this.userPage
                }
            })
		    .then(res => {
                    const _data = res.data.data
                    if (_data.ranks.length === 0) return
                    this.userPage++
                    this.userLists = [].concat(this.userLists, _data.ranks)
                    if (this.currentIdx === 1) this.currentLists = this.userLists
                    this.scrollUserLock = false
                })
		    .catch(err => console.log(err))
        },
        scrollLoad () {
            const that = this
            let scrollWrap = document.querySelector('.sort-table')
            let scrollContent = document.querySelector('.sort-table ul')
            let scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))
            this.entity = new PolyfillScroll({
                scrollWrap: '.sort-table',
                scrollContent: '.sort-table ul',
                cb (distance) {
                    console.log(distance)
                    const contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                    if (contentHeight - distance - scrollWrapHeight < 150) {
                        if (that.currentIdx === 0) {
                            if (that.scrollLock) return
                            that.scrollLock = true
                            that.getModRank()
                        } else {
                            if (that.scrollUserLock) return
                            that.scrollUserLock = true
                            that.getUserRank()
                        }
                    }
                }
            })
        },
        storeTap (idx, ...arg) {
            if (this.currentIdx !== idx) {
                this.entity.refresh()
                this.currentIdx = idx
                this.currentLists = this.currentIdx === 0 ? this.modLists : this.userLists
            }
        },
        // 关注
        addLoveHandle (id) {
            axios.get('/RicePudding/AddLove', {
                params: {
                    id
                }
            })
		    .then(res => {
                    const _data = res.data.data
                    if (_data.uid === '0000') return common.goLogin()
                    if (_data.attResult) {
                        for (let i = 0; i < 3; i++) {
                            if (this.currentLists[i].id == id) {
                                this.currentLists[i].is_attention = true
                                break
                            }
                        }
                        this.currentLists = [].concat(this.currentLists)
                    }
                })
		    .catch(err => console.log(err))
        },
        // 当前推荐
        getRecommend () {
            axios.get('/RicePudding/GetCurrentSweet')
		    .then(res => {
                    const _data = res.data.data
                    this.recommendLists = _data.result
                    this.currentTime = _data.time * 1000 // 单位/ms
                    this.caclTime()
                    vue.nextTick(() => {
                        bodyScrollEnity.refresh(88888)
                    })
                })
		    .catch(err => console.log(err))
        },
        // 实时
        caclTime () {
            if (this.currentTime < (new Date('2018/01/22 12:00:00').getTime()) || this.currentTime > (new Date('2018/01/27 23:59:59').getTime())) {
                this.restTime = ['-', '-', ':', '-', '-', ':', '-', '-']
                return
            }
            let restMin = 59 - (new Date(this.currentTime)).getMinutes()
            let restSec = 59 - (new Date(this.currentTime)).getSeconds()
            if (restMin === 0 && restSec === 0) {
                return this.getRecommend()
            }

            let tempTimeArr = ['0', '0', 'dotted']
            if (restMin < 10) tempTimeArr = [].concat(tempTimeArr, [0, restMin])
            else tempTimeArr = [].concat(tempTimeArr, String(restMin).split(''))
            tempTimeArr.push('dotted')
            if (restSec < 10) tempTimeArr = [].concat(tempTimeArr, [0, restSec])
            else tempTimeArr = [].concat(tempTimeArr, String(restSec).split(''))
            this.restTime = tempTimeArr

            setTimeout(() => {
                this.currentTime += 1000
                this.caclTime()
            }, 1000)
        },
        // 往期记录
        getLastSweet () {
            axios.get('/RicePudding/GetLastSweet')
		    .then(res => {
                    const _data = res.data.data
                    this.lastSweetLists = _data.result
                })
		    .catch(err => console.log(err))
        },
        // 查看往期记录
        toggleLog () {
            this.prizeLogStatus = !this.prizeLogStatus
            if (this.prizeLogStatus) {
                this.getLastSweet()
                vue.nextTick(() => {
                    prizeScrollEnity = new PolyfillScroll({
                        scrollWrap: '.prize-log .rules-block',
                        scrollContent: '.prize-content',
                        bar: {
                            width: '2px',
                            height: '40px',
                            background: 'rgba(0,0,0,0.4)',
                            right: '2px'
                        }
                    })
                })
            }
        },
        // 规则
        toggleRule () {
            this.rulesStatus = !this.rulesStatus
        },
        // goroom
        goRoom (id) {
            if (!this.changeAct) {
                common.goRoom(id, 2)
            }
        }
    }
})

const ruleELement = document.querySelectorAll('.rule-close')
for (let i = 0, len = ruleELement.length; i < len; i++) {
    ruleELement[i].addEventListener('touchstart', function (e) {
        vm.$data.rulesStatus = false
        vm.$data.prizeLogStatus = false
    })
}
