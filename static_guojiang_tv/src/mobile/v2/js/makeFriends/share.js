import axios from 'axios'
import { getPlatformType } from 'common'
import ClipboardJS from '../component/clipboard.min.js'
require('../../css/makeFriends/share.less')

import Vue from 'vue'

new Vue({
    el: '#app',
    data: {
        tabCon: true,
        ruleBox: false,
        tostBox: false,
        inviteCode: '',
        shareImgPath: '',
        type: '',
        money: 0,
        count: 0,
        rankList: [],
        inviteList: [],
        page: 0,
        scrollLock: false,
        clipboard: false,
        tostText: ''
    },
    created: function () {
        this.getInfo()
        this.getRank()
        this.getInviteList()

        // 获取平台类型
        const platform = getPlatformType()
        // ios
        if (platform === 'ios_webview') {
            this.type = 'ios'
        } else {
            // 安卓
            this.type = 'android'
        }
    },
    mounted: function () {
        var clipboard = new ClipboardJS('.copy')
        clipboard.on('success', (e) => {
            this.disapperTost(2500, '复制成功')
        })
        clipboard.on('error', (e) => {
            if(gBridge.inviteCodePatse(e.text)){
                this.disapperTost(2500, '复制成功')
            }else{
                this.disapperTost(2500, '复制失败')
            }
        })
        this.initScrollLoad()
    },
    methods: {
        tab (tabN) {
            if (tabN === 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        // 获取信息
        getInfo () {
            axios.get('/invite/socialInfo')
                .then(res => {
                    let data = res.data.data
                    this.inviteCode = data.inviteCode
                    this.money = data.money
                    this.count = data.count
                    this.shareImgPath = data.invitePic
                    if (!this.shareImgPath) {
                        this.getShareImg()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 调取生成分享图
        getShareImg () {
            axios.get('/invite/getInvitePic')
                .then(res => {
                    let data = res.data.data
                    this.shareImgPath = data.sharePic
                    console.log(this.shareImgPath)
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 邀请
        invite () {
            if (!this.shareImgPath) {
                this.disapperTost(2500, '分享图片获取失败！')
            } else {
                if (this.type === 'ios') {
                    gBridge.showInviteSharePage(this.shareImgPath)
                } else {
                    gBridge.inviteShare(this.shareImgPath)
                }
            }
        },

        // 获取赚钱排行
        getRank () {
            axios.get('/invite/inviteList?type=1')
                .then(res => {
                    let data = res.data.data
                    this.rankList = data
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 获取我的要请
        getInviteList () {
            axios.get('/invite/inviteList?type=2&page=' + this.page)
                .then(res => {
                    let data = res.data.data
                    if (data.length > 0) {
                        this.inviteList = this.inviteList.concat(data)
                        this.scrollLock = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // // 点击复制按钮
        // initCopy () {
        //     let that = this
        //     if (!this.inviteCode) {
        //         that.disapperTost(2500, '邀请码获取失败')
        //     } else {
        //         var clipboard = new ClipboardJS('.copy')
        //         clipboard.on('success', function (e) {
        //             that.disapperTost(2500, '复制成功')
        //         })
        //         clipboard.on('error', function (e) {
        //             that.disapperTost(2500, '复制失败')
        //         })
        //     }
        // },

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
        initScrollLoad () {
            const that = this
            that.scrollLoad('.detail', 150, function () {
                if (that.scrollLock) return
                that.scrollLock = true
                that.page++
                that.getInviteList()
            })
        },

        // tost计时器
        disapperTost (time, text) {
            this.tostBox = true
            this.tostText = text
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.tostBox = false
            }, time)
        }
    }
})
