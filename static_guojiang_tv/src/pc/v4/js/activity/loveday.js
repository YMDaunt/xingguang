import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import user from 'user'
import layer from 'layer'
import Snow from '../component/gj.snow.js'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/loveday.less')

new Snow({
    level: 2,
    imgBox: [
        '//static.guojiang.tv/pc/v4/img/activity/loveday/4.png',
        '//static.guojiang.tv/pc/v4/img/activity/loveday/3.png',
        '//static.guojiang.tv/pc/v4/img/activity/loveday/2.png',
        '//static.guojiang.tv/pc/v4/img/activity/loveday/1.png'
    ]
})

let ruleJudge = true
let passJudge = true

new Vue({
    el: '#app',
    data: {
        showRule: false,
        modArr: [],
        userArr: [],
        gaobaiArr: [],
        gaobaiLen: 0,
        passArr: [], // 往期记录
        code: false,
        other: false,
        buyBox: false,
        canBuy: true,
        goodId: null, // 商品id
        perMoney: 0, // 单价
        buyTotal: 0, // 总价
        buyTips: false, // 购买提示判断
        buyText: '', // 购买提示文字
        timer: null,
        svgPlayer: false,
        scrollLock1: false,
        scrollLock2: false,
        transformEntity1: undefined,
        transformEntity2: undefined,
        transformEntity3: undefined,
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
        this.initScrollLoad()
    },

    methods: {
        doLoveSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/pc/v4/img/activity/loveday/tianshi/data.json')
            setTimeout(() => {
                var doc = $('.svg-con').find('div')
                doc.remove()
                this.svgPlayer = !this.svgPlayer
            }, 8000)
        },
        doTianShiSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/pc/v4/img/activity/loveday/love/data.json')
            setTimeout(() => {
                var doc = $('.svg-con').find('div')
                doc.remove()
                this.svgPlayer = !this.svgPlayer
            }, 8000)
        },
        // 购买
        buy (e) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                // 购买判断
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

        // 展开
        show () {
            this.other = !this.other
            let that = this
            Vue.nextTick(() => {
                if (!that.transformEntity2) {
                    const sortWrapElement = document.querySelector('.other-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.ul-con')
                    that.transformEntity2 = new PolyfillScroll({
                        scrollWrap: '.other-out',
                        scrollContent: '.ul-con',
                        cb: function (distance) {
                            const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                            if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                if (that.scrollLock2) return
                                that.scrollLock2 = true
                                that.gbPage++
                                that.initScrollLoad(that.gbPage)
                            }
                        },
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '10px',
                            'background': 'rgba(255,149,180,1)'
                        }
                    })
                }
            })
        },

        // 规则
        rules () {
            this.showRule = !this.showRule
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.cover')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.cover-con')
                    that.transformEntity3 = new PolyfillScroll({
                        scrollWrap: '.cover',
                        scrollContent: '.cover-con',
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '10px',
                            'background': 'rgba(255,149,180,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        // 往期
        pass () {
            this.code = !this.code
            let that = this
            Vue.nextTick(() => {
                if (passJudge) {
                    const sortWrapElement = document.querySelector('.ul-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.ul-out-con')
                    that.transformEntity3 = new PolyfillScroll({
                        scrollWrap: '.ul-out',
                        scrollContent: '.ul-out-con',
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '38px',
                            'background': 'rgba(255,149,180,1)'
                        }
                    })
                    passJudge = false
                }
            })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
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
                        that.gaobaiLen = this.gaobaiArr.length
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 告白榜滚动加载
        initScrollLoad () {
            let that = this
            axios.get('/love/GetHeartRank', {
                params: {
                    page: that.gbPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addArr = data.data.ranks
                    if (addArr.length > 0) {
                        that.gaobaiArr = that.gaobaiArr.concat(addArr)
                        this.gaobaiLen = this.gaobaiArr.length
                        that.scrollLock2 = false
                    }
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
var scroxtVertical

window.onload = function () {
    $.ajax({
        url: '/love/BlessList',
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            var strArr = data.data
            codeLen = strArr.length
            var arr = []
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
            scroxtVertical = new window.scroxt.Vertical({
                target: '.scroll-out',
                data: arr,
                speed: -6
            })
            if (codeLen <= 3) {
                scroxtVertical.stopMove()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}
