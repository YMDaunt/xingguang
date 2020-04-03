require('../../css/activity/boss.less')

import Vue from 'vue'
import axios from 'axios'
import layer from 'layer'
Vue.prototype.axios = axios
// import common from 'common';
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import Rank from './components/Rank3.vue'

new Vue({
    el: '#app',
    data: {
        recordList: {}, // 我的打击记录榜
        isShowRules: false, // 活动规则
        trackInfo: {}, // boss追踪信息
        noBoss: false, // 此时刻是否有boss
        countDownTime: '00:00:00', // 倒计时
        intDiff: 0, // 倒计时差值
        ruleScrollBar: '',
        recordListScrollBar: ''
    },
    components: {
        Rank
    },
    computed: {
        attacked: function () {
            if (localStorage.attacked) {
                return true
            } else {
                return false
            }
        }
    },
    created: function () {
        this.getHitList()
        this.getTrackInfo()
    },
    mounted: function () {
        this.adaptation()
        this.countDown()
        // 执行倒计时
        setInterval(this.countDown, 1000)
        // 轮询请求boss位置信息
        setInterval(() => {
            this.getTrackInfo()
        }, 8000)
    },
    methods: {
        // 适配机型重定向
        adaptation () {
            let href = window.location
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
                }
            }
        },
        // 倒计时
        countDown () {
            let hour = 0,
                minute = 0,
                second = 0 // 时间默认值
            if (this.intDiff >= 0) {
                hour = Math.floor(this.intDiff / (60 * 60) % 24)
                minute = Math.floor(this.intDiff / 60 % 60)
                second = Math.floor(this.intDiff % 60)
            } else {
                return false
            }
            minute = minute < 10 ? '0' + minute : minute
            second = second < 10 ? '0' + second : second
            this.countDownTime = hour + ':' + minute + ':' + second
            this.intDiff--
        },
        // 我的击打记录
        getHitList () {
            axios.get('/boss/getHitList')
                .then(res => {
                    let data = res.data
                    // console.log('我的击打记录', data);
                    if (data.errno == 0) {
                        this.recordList = data.data
                        this.$nextTick(() => {
                            if (!this.recordListScrollBar && this.recordList.length > 0) {
                                // let scrollWrap = document.querySelector('.record-scroll-box');
                                // let scrollContent = document.querySelector('.record-list');
                                // let scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'));
                                this.recordListScrollBar = new PolyfillScroll({
                                    scrollWrap: '.record-scroll-box',
                                    scrollContent: '.record-list',
                                    bar: {
                                        width: '10px',
                                        height: '50px',
                                        right: '0',
                                        background: '#d6b675'
                                    }
                                })
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取最新boss信息
        getTrackInfo (callback) {
            axios.get('/boss/getTrackInfo?v=' + (+new Date()))
                .then(res => {
                    let data = res.data
                    // console.log('boss位置信息', data);
                    if (data.errno == 0) {
                        this.noBoss = false
                        this.trackInfo = data.data
                        this.intDiff = this.trackInfo.runAwayTime - this.trackInfo.nowTime
                        if (callback) { callback() }
                    } else if (data.errno == 203 || 204) {
                        this.noBoss = true
                        this.intDiff = 0
                        // console.log(this.intDiff);
                    } else if (data.errno == 201) {
                        layer.msg('活动未开始')
                    } else if (data.errno == 202) {
                        layer.msg('活动已结束')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        attack () {
            this.getTrackInfo(() => {
                localStorage.attacked = true
                window.open(location.origin + '/' + this.trackInfo.mid)
            })
        },
        showRules () {
            this.isShowRules = true
            if (!this.ruleScrollBar) {
                // let scrollWrap = document.querySelector('.rules-scroll-box');
                // let scrollContent = document.querySelector('.rules-scroll-box ul');
                // let scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'));
                this.ruleScrollBar = new PolyfillScroll({
                    scrollWrap: '.rules-scroll-box',
                    scrollContent: '.rules-scroll-box ul',
                    bar: {
                        width: '10px',
                        height: '50px',
                        right: '0',
                        background: '#d6b675'
                    }
                })
            }
        }
    }
})
