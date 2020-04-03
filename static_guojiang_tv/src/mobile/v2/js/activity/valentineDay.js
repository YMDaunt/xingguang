'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import bodymovin from '../component/bodymovin.min.js'

import '../../css/activity/valentineDay.less'

new Vue({
    el: '#app',
    data: {
        showRules: false,
        showSvg: false,
        showPurchase: false,
        svg: null,
        purchaseNum: 1, // 默认购买一个
        isActivityStart: true,
        isActivityEnd: false, 
        rank: [],
        pairInfos: [{}, {}, {}, {}],
        showPersonal: false,
        myRank: {} // 个人中心数据
    },
    computed: {
        sumPrice: function () {
            return 9999 * this.purchaseNum
        }
    },
    created: function () {
        this.init()
        this.adaption()
        this.getRank()
    },
    mounted: function () {},
    methods: {
        init () {
            axios.get('/valentine/init')
                .then(res => {
                    let data = res.data.data
                    if (data.now >= data.edate) {
                        this.isActivityEnd = true
                    }
                    if (data.now < data.sdate) {
                        this.isActivityStart = false
                    }
                })
                .catch(err => {
                    console.warn(err)
                })
        },
        /**
         *页面自适应跳转
         */
        adaption () {
            let href = window.location
            if (
                /Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(
                    navigator.userAgent
                )
            ) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href =
                        '//m.kuaishouvideo.com/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href =
                        '//www.kuaishouvideo.com' +
                        href.pathname.replace('/dist', '')
                }
            }
        },
        getRank () {
            axios
                .get('/valentine/ranks', {
                    params: {
                        pageSize: 15,
                        pageNo: 1
                    }
                })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.rank = data.data.data
                        if (data.data.myRank) {
                            this.myRank = data.data.myRank
                            this.pairInfos = data.data.myRank.pairInfos
                            this.showPersonal = true
                        }
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
        },
        // 前三过滤
        prevList () {
            return this.rank.filter((item, index) => {
                return index < 3
            })
        },
        // 第三名之后过滤
        lastList () {
            return this.rank.filter((item, index) => {
                return index >= 3
            })
        },
        goLiveRoom (rid) {
            common.goRoom(rid)
        },
        /**
         *预览动效
         * @param {*} name
         */
        preview (name) {
            let svgWrap = document.getElementById('svgContainer')
            let path = ''
            if (name === 'gift1') {
                path =
                    '//static.guojiang.tv/src/mobile/svg/activity/valentineDay/gift1/data.json'
            } else if (name === 'gift2') {
                path =
                    '//static.guojiang.tv/src/mobile/svg/activity/valentineDay/gift2/data.json'
            }
            this.svg = bodymovin.loadAnimation({
                wrapper: svgWrap,
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: path
            })
            this.showSvg = true
        },
        destory () {
            this.showSvg = false
            svgContainer.innerHTML = ''
        },
        openPurchaseBox () {
            if (!this.isActivityStart) {
                layer.open({
                    content: '2.12 12:00才可购买！',
                    time: 3
                })
                return false
            }
            this.showPurchase = true
        },
        closePurchaseBox () {
            this.showPurchase = false
            this.purchaseNum = 1
        },
        subtraction () {
            this.purchaseNum--
            if (this.purchaseNum < 0) {
                this.purchaseNum = 0
            }
        },
        addition () {
            if (this.purchaseNum !== 9999) {
                this.purchaseNum++
            } else {
                this.purchaseNum = 9999
            }
        },
        purchase () {
            axios
                .get('/valentine/buyProduct', {
                    params: {
                        pid: 1995,
                        num: this.purchaseNum
                    }
                })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                        // 刷新背包
                        common.refreshBackpack()
                        // 刷新余额
                        common.refreshCoin((this.purchaseNum) * 9999, false)
                        this.showPurchase = false
                    } else if (data.errno === 111) {
                        // 余额不足
                        let that = this
                        layer.open({
                            content: data.msg,
                            btn: ['充值', '不了'],
                            yes: function () {
                               common.goRecharge()
                            },
                            no: function () {
                                layer.closeAll()
                                that.showPurchase = false
                                that.purchaseNum = 1
                            }
                        })
                    } else if (data.errno === 112) {
                        // 未登录
                        common.goLogin()
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.warn(err)
                })
        },
        handleInput (e) {
            if (e.target.value >= 9999) {
                e.target.value = 9999
                this.purchaseNum = 9999
            } else {
                e.target.value = e.target.value.replace(/[^\d]/g, '')
                this.purchaseNum = e.target.value
            }
        }
    }
})
