'use strict'

import Vue from 'vue'
import axios from 'axios'
import user from 'user'
import common from 'common'
import bodymovin from '../component/bodymovin.min.js'
import '../component/jquery.slimscroll.js'

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
        uid: '',
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
    mounted: function () {
        this.scrollBarInit($('.rules-content'), '638px')
    },
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
                    this.uid = data.uid
                })
                .catch(err => {
                    console.warn(err)
                })
        },
        // 初始化滚动条
        scrollBarInit (ele, height) {
            ele.slimScroll({
                width: 'auto', // 可滚动区域宽度
                height: height, // 可滚动区域高度
                size: '10px', // 组件宽度
                color: '#fd728c', // 滚动条颜色
                position: 'right', // 组件位置：left/right
                distance: '0px', // 组件与侧边之间的距离
                start: 'top', // 默认滚动位置：top/bottom
                opacity: 1, // 滚动条透明度
                alwaysVisible: true, // 是否 始终显示组件
                disableFadeOut: false, // 是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
                railVisible: false, // 是否 显示轨道
                railColor: '#333', // 轨道颜色
                railOpacity: 0.2, // 轨道透明度
                railDraggable: true, // 是否 滚动条可拖动
                railClass: 'slimScrollRail', // 轨道div类名
                barClass: 'slimScrollBar', // 滚动条div类名
                wrapperClass: 'slimScrollDiv', // 外包div类名
                allowPageScroll: true, // 是否 使用滚轮到达顶端/底端时，滚动窗口
                wheelStep: 10, // 滚轮滚动量
                touchScrollStep: 200, // 滚动量当用户使用手势
                borderRadius: '5px', // 滚动条圆角
                railBorderRadius: '5px' // 轨道圆角
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
                            time: 3000
                        })
                    }
                })
        },
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
        subtraction () {
            this.purchaseNum--
            if (this.purchaseNum < 0) {
                this.purchaseNum = 0
            }
        },
        addition () {
            if (this.purchaseNum >= 9999) {
                this.purchaseNum = 9999
            } else {
                this.purchaseNum++
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
                        layer.msg(data.msg)
                        this.showPurchase = false
                    } else if (data.errno === 111) {
                        // 余额不足
                        let that = this
                        layer.open({
                            content: data.msg,
                            closeBtn: 0,
                            btn: ['充值', '不了'],
                            yes: function () {
                                window.open('/recharge/center', '_target')
                                layer.closeAll()
                                that.showPurchase = false
                                that.purchaseNum = 1
                            },
                            btn2: function () {
                                layer.closeAll()
                                that.showPurchase = false
                                that.purchaseNum = 1
                            }
                        })
                    } else if (data.errno === 112) {
                        // 未登录
                        user.showLoginPanel()
                    } else {
                        layer.msg(data.msg)
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
        },
        openPurchaseBox () {
            if (!this.uid) {
                user.showLoginPanel()
                return false
            }
            if (!this.isActivityStart) {
                layer.msg('2.12 12:00才可购买')
                return false
            }
            this.showPurchase = true
        },
        closePurchaseBox () {
            this.showPurchase = false
            this.purchaseNum = 1
        },
        goLiveRoom (id) {
            window.open('/' + id, '_target')
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
        }
    }
})
