import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import Snow from '../component/gj.snow.js'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/loveday.less')

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

var numReg = /^[1-9]\d*$/

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/loveday.html'

new Snow({
    level: 3,
    imgBox: [
        '//static.guojiang.tv/mobile/v2/img/activity/loveday/4.png',
        '//static.guojiang.tv/mobile/v2/img/activity/loveday/3.png',
        '//static.guojiang.tv/mobile/v2/img/activity/loveday/2.png',
        '//static.guojiang.tv/mobile/v2/img/activity/loveday/1.png'
    ]
})

new Vue({
    el: '#app',
    data: {
        tabCon: true,
        showRule: false,
        modArr: [],
        userArr: [],
        gaobaiArr: [],
        gaobaiLen: 0,
        passArr: [], // 往期记录
        code: false,
        rule: false,
        other: false,
        buyBox: false,
        canBuy: true,
        goodId: null, // 商品id
        perMoney: 0, // 单价
        buyTotal: 0, // 总价
        buyTips: false, // 购买提示判断
        buyText: '', // 购买提示文字
        tips: '',
        timer: null,
        svgPlayer: false,
        scrollLock1: false,
        scrollLock2: false,
        gbPage: 1,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/love/userInfo')
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

        // 告白榜
        axios.get('/love/GetHeartRank')
            .then(res => {
                let data = res.data
                this.gaobaiArr = data.data.ranks
                this.gaobaiLen = this.gaobaiArr.length
            })
            .catch(err => {
                console.log(err)
            })

        // 主播用户榜
        axios.get('/love/GetTodayRank')
            .then(res => {
                let data = res.data
                this.modArr = data.data.mod
                this.userArr = data.data.user

                Vue.nextTick(() => {
                    var modOne = `
                        <div class="get-gift">第一名奖励<br />12小时活动推荐</div>
                        `
                    var modTwo = `
                        <div class="get-gift">第二名奖励<br />8小时活动推荐</div>
                        `
                    var modThi = `
                        <div class="get-gift">第三名奖励<br />5小时活动推荐</div>
                        `
                    $('.mod-rank').eq(0).find('li').eq(0).append(modOne)
                    $('.mod-rank').eq(0).find('li').eq(1).append(modTwo)
                    $('.mod-rank').eq(0).find('li').eq(2).append(modThi)

                    var userOne = `
                        <div class="get-gift">
                            第一名奖励<br />
                            <span>“520”</span><strong>*3</strong><br />
                            <span>“爱神”</span><strong>*3</strong><br />
                            <span>“广播卡”</span><strong>*3</strong>
                        </div>
                        `
                    var userTwo = `
                        <div class="get-gift">
                            第二名奖励<br />
                            <span>“520”</span><strong>*3</strong><br />
                            <span>“广播卡”</span><strong>*3</strong>
                        </div>
                        `
                    var userThi = `
                        <div class="get-gift">
                            第三名奖励<br />
                            <span>“爱神”</span><strong>*3</strong><br />
                            <span>“广播卡”</span><strong>*3</strong>
                        </div>
                        `
                    $('.user-rank').find('li').eq(0).append(userOne)
                    $('.user-rank').find('li').eq(1).append(userTwo)
                    $('.user-rank').find('li').eq(2).append(userThi)
                })
            })
            .catch(err => {
                console.log(err)
            })

        // 往期记录
        axios.get('/love/GetLastRank')
            .then(res => {
                let data = res.data
                this.passArr = data.data
            })
            .catch(err => {
                console.log(err)
            })
    },

    mounted: function () {
        // 滚动加载
        this.initScrollLoad()
    },

    methods: {
        doLoveSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/mobile/v2/img/activity/loveday/tianshis/data.json')
            setTimeout(() => {
                var doc = $('.svg-con').find('div')
                doc.remove()
                this.svgPlayer = !this.svgPlayer
            }, 8000)
        },
        doTianShiSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/mobile/v2/img/activity/loveday/loves/data.json')
            setTimeout(() => {
                var doc = $('.svg-con').find('div')
                doc.remove()
                this.svgPlayer = !this.svgPlayer
            }, 8000)
        },

        // 购买
        buy (e) {
            // // 购买判断
            axios.get('/love/canBuy')
                .then(res => {
                    let data = res.data.data
                    this.canBuy = data.canBuy
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
                })
                .catch(err => {
                    console.log(err)
                })
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
            if (num.length == 1) {
                num = num.replace(/[^1-9]/g, '')
            } else if (num.length >= 4) {
                num = num.substring(0, 4)
            } else {
                num = num.replace(/[^\d]/g, '')
            }
            $('#totalMoney').val(num)
            this.buyTotal = this.perMoney * num
        },

        sureBuy () {
            var num = $('#totalMoney').val()
            if (num == '') {
                this.buyTips = !this.buyTips
                this.buyText = '请输入正确购买个数'
            } else {
                axios.get('/love/BuyProduct?productId=' + this.goodId + '&num=' + num)
                    .then(res => {
                        let data = res.data
                        this.buyTips = !this.buyTips
                        this.buyBox = !this.buyBox
                        this.buyText = data.msg
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            common.goRoom(rid) // 主播房间id //主播用户id
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

        // ajax获取告白榜单
        getListRank (gbPage) {
            const that = this
            axios.get('/love/GetHeartRank', {
                params: {
                    page: gbPage
                }
            })
                .then(res => {
                    let data = res.data.data.ranks
                    if (data.length > 0) {
                        that.gaobaiArr = that.gaobaiArr.concat(data)
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 告白榜滚动加载
        initScrollLoad () {
            const that = this
            that.scrollLoad('.other-out', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.gbPage++
                that.getListRank(that.gbPage)
            })
        }
    }
})

function playSvg (path) {
    var svgContainer = document.querySelector('.svg-con')
    var giftSvg = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: false,
        autoplay: true,
        path: path
    })
}

// 告白滚动
var liHe = 0
var codeLen = 0
var arr = []
var scroxtVertical
var str = ''
window.onload = function () {
    $.ajax({
        url: '/love/BlessList',
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            var strArr = data.data
            codeLen = strArr.length
            for (var i = 0; i < codeLen; i++) {
                var str = `
                    <div class="per-card">
                        <div>
                            <strong>${strArr[i].user_nickname}</strong>
                            <b></b> 
                            <span>${strArr[i].mod_nickname}</span>
                        </div>
                        <p>${strArr[i].content}</p>
                        <div class="line"></div>
                    <div>
                    `
                arr.push(str)
            }
            if (os.isPhone) {
                scroxtVertical = new window.scroxt.Vertical({
                    target: '.scroll-out',
                    data: arr,
                    speed: -5
                })
            } else {
                scroxtVertical = new window.scroxt.Vertical({
                    target: '.scroll-out',
                    data: arr,
                    speed: -18
                })
            }
            if (codeLen <= 3) {
                scroxtVertical.stopMove()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}
