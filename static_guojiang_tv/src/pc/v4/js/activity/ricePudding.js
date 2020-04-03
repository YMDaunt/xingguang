import axios from 'axios'
import vue from 'vue'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import Snow from '../component/gj.snow.js'

import FillBg from './vue/widget/fillBg.vue'
import CoverBg from './vue/widget/coverBg.vue'
import Box from './vue/widget/box.vue'
import textDiv from './vue/widget/textDiv.vue'
import sortBg from './vue/ricePudding/sortBg.vue'
import borderImg from './vue/ricePudding/borderImg.vue'
import ruleGift from './vue/ricePudding/ruleGift.vue'

require('../../css/activity/ricePudding.less')

document.body.addEventListener('touchstart', function () {})

new Snow({
    level: 5,
    imgBox: [
        '//static.guojiang.tv/pc/v4/img/activity/ricePudding/2.png',
        '//static.guojiang.tv/pc/v4/img/activity/ricePudding/2.png',
        '//static.guojiang.tv/pc/v4/img/activity/ricePudding/1.png'
    ]
})

var ruleEnity
var prizeEnity

var isIE9Bool = false
var isIEAttr = window.ActiveXObject || 'ActiveXObject' in window
if (isIEAttr) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    var userAgent = navigator.userAgent
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion == 9) {
        isIE9Bool = true
    }
}

const vm = new vue({
    el: '#app',
    components: {
        FillBg,
        CoverBg,
        Box,
        sortBg,
        textDiv,
        borderImg,
        ruleGift
    },
    data: {
        bf: 108,
        imgUrl: '//static.guojiang.tv/pc/v4/img/activity/ricePudding/',

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

        scrollLock: false,
        scrollUserLock: false,
        entity: null,

        isIE: isIE9Bool
    },
    created () {
        this.getModRank()
        this.getUserRank()
        this.getRecommend()
        this.getLastSweet()
    },
    mounted () {
        // IE
        if ((window.ActiveXObject || 'ActiveXObject' in window)) {
            document.querySelector('.sort-lists-wrap').style.zIndex = 2
        }
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
                bar: {
                    background: 'rgba(0,0,0,0.6)'
                },
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
                    if (_data.uid === '0000') {
                        return document.querySelector('.login').click()
                    }
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
                })
		    .catch(err => console.log(err))
        },
        // 实时
        caclTime () {
            if (this.currentTime < (+new Date('2018/01/22 12:00:00')) || this.currentTime > (+new Date('2018/01/27 23:59:59'))) {
                return this.restTime = ['-', '-', ':', '-', '-', ':', '-', '-']
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
                prizeEnity && prizeEnity.refresh()
                if (!prizeEnity) {
                    vue.nextTick(() => {
                        prizeEnity = new PolyfillScroll({
                            scrollWrap: '.prize-log .box-body',
                            scrollContent: '.prize-log .rules-block',
                            bar: {
                                background: 'rgba(0,0,0,0.6)'
                            }
                        })
                    })
                }
            }
        },
        // 规则
        toggleRule () {
            this.rulesStatus = !this.rulesStatus
            if (!ruleEnity) {
                ruleEnity = new PolyfillScroll({
                    scrollWrap: '.rule-wrap .box-body',
                    scrollContent: '.rule-wrap .rules-block',
                    bar: {
                        background: 'rgba(0,0,0,0.6)'
                    }
                })
            }
        },
        // goroom
        goRoom (id) {
            if (!this.changeAct) {
                window.open('/' + id)
            }
        }
    }
})
