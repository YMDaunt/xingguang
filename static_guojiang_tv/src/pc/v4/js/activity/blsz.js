import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import layer from 'layer'
import scroll from '../component/niceScroll.js'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/blsz.less')

var ruleJudge = true
new Vue({
    el: '#app',
    data: {
        uid: '',
        isPass: false,
        isMod: true,
        tabCon: true,
        ruleShow: false,
        buyBox: false,
        tostBox: false,
        svgPlayer: false,
        timer: null,
        changeBox: false,
        yeBox: false,
        codeBox: false,
        canBuy: true,
        buyTotal: 0,
        canBuy: true,
        canChange: true,
        changeName: '',
        changeId: null,
        changeNeed: 0,
        goodId: null, // 商品id
        perMoney: 0, // 单价
        buyTotal: 0, // 总价
        buyTips: false, // 购买提示判断
        tostText: '', // tost提示
        secChoose: 'newbie', // 二级选中
        dataDay: '', // 选中的日期
        mesArr: ['排名第1获得10碎片奖励', '排名第2获得8碎片奖励', '排名第3获得6碎片奖励', '排名第4获得5碎片奖励', '排名第5获得4碎片奖励'],

        dayArr: [], // 活动时间
        codeArr: [], // 兑换记录
        modArr: [],
        userArr: [],
        myModArr: [],
        myUserArr: [],
        myChangeArr: [],
        totalSp: 0,
        usedSp: 0,
        coinSp: 0,
        modPage: 1,
        userPage: 1,
        scrollLock1: false,
        scrollLock2: false,
        transformEntity1: undefined
    },
    created: function () {
        // 个人信息初始化
        axios.get('/summer/userInfo')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.id
                    if (!this.uid) {
                        user.showLoginPanel()
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 活动信息初始化
        axios.get('/summer/initInfo')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.dayArr = data.data.dateItems
                    this.canChange = data.data.canExchange
                    this.canBuy = data.data.canBuy
                    this.isMod = data.data.isModerator
                    var len = data.data.dateItems.length
                    if (data.data.dateItems[len - 1].status == -1 || data.data.dateItems[0].status == 1) {
                    // 过期活动||未开始都选择总榜
                        this.isPass = true
                        this.dataDay = 'all'
                    } else {
                        for (var i = 0; i < len; i++) {
                            if (data.data.dateItems[i].status == 0) {
                                this.dataDay = data.data.dateItems[i].date
                                break
                            }
                        }
                    }
                    this.getModRank(this.secChoose, this.dataDay)
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 用户榜单
        axios.get('/summer/GetRank?roleType=user')
            .then(res => {
                let data = res.data
                this.userArr = data.data.data
                this.myUserArr = data.data.myRank
                Vue.nextTick(() => {
                    $('.users').niceScroll({
                        cursorwidth: 10,
                        cursorcolor: 'rgba(42, 199, 228,1)', // 设置滚动条滑块的颜色
                        cursorborder: 'none', // CSS方式定义滚动条边框颜色
                        autohidemode: false,
                        cursorfixedheight: 60,
                        hwacceleration: true,
                        horizrailenabled: false,
                        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
                    })
                })
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
        this.adaptation()
        // 滚动加载
        this.initScrollLoadMod()
        this.initScrollLoadUser()
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

        // remove svg
        removeSvg () {
            this.svgPlayer = !this.svgPlayer
            var doc = $('.svg-con').find('div')
            doc.remove()
        },

        // svg
        doGanSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/pc/svg/activity/blsz/gan/data.json')
        },
        doSeaSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/pc/svg/activity/blsz/sea/data.json')
        },

        // 兑换记录
        showMyChnage () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/summer/exchangeRecords?' + new Date().getTime() + '')
                    .then(res => {
                        let that = this
                        let data = res.data
                        that.codeBox = !that.codeBox
                        that.myChangeArr = data.data.data
                        that.totalSp = data.data.total
                        that.usedSp = data.data.used
                        that.coinSp = data.data.coin
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        showRule () {
            this.ruleShow = !this.ruleShow
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-cover')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.out-cover')
                    that.transformEntity1 = new PolyfillScroll({
                        scrollWrap: '.rule-cover',
                        scrollContent: '.out-cover',
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '0px',
                            'background': 'rgba(42, 199, 228,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        // 购买
        buy (e) {
            // 购买判断
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                if (this.canBuy) {
                    this.goodId = e.target.getAttribute('data-id')
                    this.perMoney = e.target.getAttribute('data-value')
                    $('#totalMoney').val(1)
                    this.buyBox = !this.buyBox
                    this.buyTotal = this.perMoney
                } else {
                    this.buyTips = !this.buyTips
                    this.buyText = data.tip
                }
            }
        },

        // add
        add () {
            var num = $('#totalMoney').val()
            num++
            if (num >= 9999) {
                num = 9999
            }
            $('#totalMoney').val(num)
            this.buyTotal = this.perMoney * num
        },

        dev () {
            var num = $('#totalMoney').val()
            num--
            if (num <= 1) {
                num = 1
            }
            $('#totalMoney').val(num)
            this.buyTotal = this.perMoney * num
        },

        inputNumber () {
            var num = $('#totalMoney').val()
            num = num.replace(/[^0-9]+/g, '')
            if (num > 9999) {
                num = 9999
            } else if (num < 0) {
                num = 1
            }
            $('#totalMoney').val(num)
            this.buyTotal = this.perMoney * num
        },

        sureBuy () {
            var num = $('#totalMoney').val()
            if (num == '' || num == 0) {
                this.tostBox = !this.tostBox
                this.tostText = '请输入正确购买个数'
                this.disapperTost(2000)
            } else {
                axios.get('/summer/buyProduct?pid=' + this.goodId + '&num=' + num)
                    .then(res => {
                        let data = res.data
                        this.buyBox = !this.buyBox
                        if (data.errno == 0) {
                            this.tostBox = !this.tostBox
                            this.tostText = '礼物已放至您的背包，请注意查收！'
                            this.disapperTost(2500)
                        } else
                        if (data.errno == 111) {
                            this.yeBox = !this.yeBox
                        } else {
                            this.tostBox = !this.tostBox
                            this.tostText = data.msg
                            this.disapperTost(2500)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 兑换
        changeGift (e) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                this.changeId = e.target.getAttribute('data-giftid')
                this.changeNeed = e.target.getAttribute('data-giftnum')
                this.changeName = e.target.getAttribute('data-giftname')
                this.changeBox = !this.changeBox
            }
        },

        // 确认兑换
        sureChange () {
            axios.get('/summer/exchange?giftId=' + this.changeId + '')
                .then(res => {
                    let data = res.data
                    this.changeBox = !this.changeBox
                    this.tostBox = !this.tostBox
                    this.tostText = data.msg
                    this.disapperTost(2000)
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 二级主播榜选择
        modChoose (who) {
            let that = this
            this.secChoose = who
            // 重置modArr, modPage,dataDay,scrollLock1,获取目标日期
            that.modArr = []
            that.modPage = 1
            that.scrollLock1 = false
            // 重置三级日期
            $('.thi-choose').removeClass('thi-choose')
            var len = $('.thi-tit').children('div').length
            for (var i = 0; i < len; i++) {
                var data = $('.thi-tit').children('div').eq(i).data('status')
                if (data == 0) {
                    $('.thi-tit').children('div').eq(i).addClass('thi-choose')
                    that.dataDay = $('.thi-tit').children('div').eq(i).data('day')
                    break
                } else if (data == 2) {
                    $('#allRank').addClass('thi-choose')
                    that.dataDay = $('#allRank').data('day')
                    break
                }
            }
            that.getModRank(that.secChoose, that.dataDay)
        },

        // 三级日期选择
        dayChoose (e) {
            let that = this
            let dayStatus = e.target.getAttribute('data-status')
            // 非未到达的时间段
            if (dayStatus != 1) {
                $('.thi-choose').removeClass('thi-choose')
                e.target.setAttribute('class', 'thi-choose')
                // 重置modArr, modPage, scrollLock1,获取目标日期
                that.modArr = []
                that.modPage = 1
                that.scrollLock1 = false
                that.dataDay = e.target.getAttribute('data-day')
                that.getModRank(that.secChoose, that.dataDay)
            }
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // 跳转充值
        charge () {
            window.open('/recharge/center', '_blank')
        },

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
        initScrollLoadMod () {
            const that = this
            that.scrollLoad('.mods', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.secChoose, that.dataDay)
            })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.users', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.userPage++
                that.getUserRank(that.userPage, that.stageJudge)
            })
        },

        // ajax获取主播列表
        getModRank (modType, day) {
            const that = this
            axios.get('/summer/GetRank?modType=' + modType + '&date=' + day + '', {
                params: {
                    pageNo: this.modPage
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    that.myModArr = res.data.data.myRank
                    if (data.length > 0) {
                        that.modArr = that.modArr.concat(data)
                        that.scrollLock1 = false
                    }
                    Vue.nextTick(() => {
                        $('.mods').niceScroll({
                            cursorwidth: 10,
                            cursorcolor: 'rgba(42, 199, 228,1)', // 设置滚动条滑块的颜色
                            cursorborder: 'none', // CSS方式定义滚动条边框颜色
                            autohidemode: false,
                            cursorfixedheight: 60,
                            hwacceleration: true,
                            horizrailenabled: false,
                            railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取用户列表
        getUserRank (userPage, stage) {
            const that = this
            axios.get('/summer/GetRank?roleType=user', {
                params: {
                    pageNo: userPage
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        disapperTost (time) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.tostBox = !this.tostBox
            }, time)
        }
    }
})

// svg
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

$(document).ready(function () {
    $('.list-cover').niceScroll({
        cursorwidth: 10,
        cursorcolor: 'rgba(42, 199, 228,1)', // 设置滚动条滑块的颜色
        cursorborder: 'none', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        hwacceleration: true,
        horizrailenabled: false,
        railpadding: { top: 0, right: -28, left: 0, bottom: 0 }
    })
})
