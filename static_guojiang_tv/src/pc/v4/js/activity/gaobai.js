'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import $ from 'jquery'
import user from 'user'
import polyfillScroll from '../component/gj.polyfillScroll.js'
import bodymovin from '../component/bodymovin.min.js'

import '../../css/activity/gaobai.less'

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
if (os.isPhone) location.href = 'https://m.kuaishouvideo.com/dist/activity/gaobai.html'

var ruleJudge = true
var gbJudge = true
var findJudge = true
new Vue({
    el: '#app',
    data: {
        uid: false,
        isMod: true, // 是否为主播
        tostBox: false,
        svgPlayer: false,
        showRule: false,
        times: 0, // 剩余告白次数
        withZan: false, // 是否点赞过
        status: 0, // 活动状态 0未开始 1进行中 2已结束
        buyBox: false, // 购买弹窗
        yeBox: false, // 余额不足弹窗
        buyTotal: 0,
        goodId: null, // 商品id
        perMoney: 0, // 单价
        buyTotal: 0, // 总价
        buyTips: false, // 购买提示判断
        tostText: '', // tost提示
        findBox: false, // 搜索弹窗
        gbBox: false, // 告白弹窗
        zanBox: false, // 点赞弹窗
        findName: '', // 搜索的名字
        modId: '', // 告白主播的id
        modName: '', // 告白主播的名字
        gbArr: [], // 告白墙
        gbModArr: [], // 告白过的主播信息
        gbTxtArr: [], // 告白语默认
        gbRankArr: [null, null, null, null, null, null, null, null, null, null], // 榜单
        searchArr: [], // 搜索的告白列表
        myModArr: [], // 我的信息
        textLen: 0, // 告白语长度
        transformEntity1: null,
        transformEntity2: null,
        transformEntity3: null
    },
    created: function () {
        axios.get('/sweetConfession/init')
            .then(res => {
                let data = res.data
                this.uid = data.data.userId
                this.status = data.data.activityStatus
                this.withZan = data.data.hasLikedToday
                this.times = data.data.confessionLeft
                this.goodId = data.data.productId
                this.perMoney = data.data.price
                this.isMod = data.data.isMod
                // 是主播的话则加载主播信息
                if (this.isMod) {
                    this.getmodMes()
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 读取正确搜索id
        var localSearchId = localStorage.getItem('searchId')
        if (localSearchId) {
            $('.search-id').attr({'value': localSearchId})
        }

        // 获取默认告白语
        this.getInitWord()

        // 获取告白墙数据
        this.getWall()

        // 获取榜单
        this.getRank()
    },
    methods: {
        // remove svg
        removeSvg () {
            this.svgPlayer = !this.svgPlayer
            var doc = $('.svg-con').find('div')
            doc.remove()
        },

        // svg
        doSvg1 () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/gaobai/tcdj/data.json')
        },
        doSvg2 () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/gaobai/book/data.json')
        },

        // 获取告白墙数据
        getWall () {
            axios.get('/sweetConfession/confessionWall')
                .then(res => {
                    let data = res.data
                    this.gbArr = data.data
                    Vue.nextTick(() => {
                        moveL('.wall', timerArr1)
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 获取告白榜
        getRank () {
            axios.get('/sweetConfession/confessionRanks')
                .then(res => {
                    let data = res.data
                    this.gbRankArr = data.data
                    for (var i = 0; i < 10; i++) {
                        if (!this.gbRankArr[i]) {
                            this.gbRankArr.push(null)
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 获取主播个人信息
        getmodMes () {
            axios.get('/sweetConfession/modRankInfo')
                .then(res => {
                    let data = res.data
                    this.myModArr = data.data
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 查找主播
        findMod (e) {
            this.modId = $('.gb-con').find('input').val()
            if (!this.modId) {
                this.disapperTost(2500, '请先输入ID，再点击搜索！')
            } else {
                axios.get('/sweetConfession/getNickname?id=' + this.modId)
                    .then(res => {
                        let data = res.data
                        if (!data.data.nickname) {
                            this.disapperTost(2500, '您输入的ID有误，请查证后再操作！')
                            this.modName = ''
                        } else {
                            this.modName = data.data.nickname

                            // 存储正确的搜索id
                            localStorage.setItem('searchModId', this.modId)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 改变输入
        changeId () {
            this.modName = ''
        },

        // 选择历史告白对象
        valueMes (e) {
            var hsMid = e.target.getAttribute('data-hsmid')
            var hsName = e.target.getAttribute('data-hsname')
            $('.gb-box').find('input').val(hsMid)
            this.modId = hsMid
            this.modName = hsName
        },

        // 告白
        showGbBox () {
            if (!this.uid) { return user.showLoginPanel() }
            if (this.status == 0) {
                this.disapperTost(2500, '活动还未开始！')
            } else
            if (this.status == 2) {
                this.disapperTost(2500, '活动已结束！')
            } else {
                // 先判断次数
                axios.get('/sweetConfession/getUserConfessionLeft?userId=' + this.uid)
                    .then(res => {
                        let data = res.data
                        if (data.data.confessionLeft <= 0) {
                            this.disapperTost(2500, '告白次数不足咯！')
                        } else {
                            let that = this
                            this.gbBox = true
                            Vue.nextTick(() => {
                                if (gbJudge) {
                                    const sortWrapElement = document.querySelector('.gb-cover')
                                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                    const sortListElement = document.querySelector('.gb-con')
                                    that.transformEntity2 = new polyfillScroll({
                                        scrollWrap: '.gb-cover',
                                        scrollContent: '.gb-con',
                                        bar: {
                                            width: '8px',
                                            height: '60px',
                                            right: '6px',
                                            'background': 'rgba(214, 57, 51,0.8)'
                                        }
                                    })
                                    gbJudge = false
                                }
                            })

                            // 获取最近告白过的主播列表
                            axios.get('/sweetConfession/recentConfessionMod')
                                .then(res => {
                                    let data = res.data
                                    this.gbModArr = data.data
                                })
                                .catch(err => {
                                    console.log(err)
                                })

                            // 读取上次告白的主播信息
                            var localmodId = localStorage.getItem('modId')
                            var localmodName = localStorage.getItem('modName')
                            if (localmodId && localmodName != '') {
                                $('.gb-box').find('input').attr({'value': localmodId})
                                this.modId = localmodId
                                this.modName = localmodName
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 发送告白
        sendGb () {
            var con = $('.input-word').find('textarea').val()
            // var tomodId = this.modId;
            this.modId = $('.gb-con').find('input').val()
            this.modName = $('.gb-con').find('.ud').text()
            if (this.modId == '' || this.modName == '') {
                this.disapperTost(2500, '操作无效~ 请先选择告白对象！')
            } else
            if (con == '') {
                this.disapperTost(2500, '操作无效~ 请填写告白语')
            } else {
                axios.get('/sweetConfession/confess?modId=' + this.modId + '&content=' + con)
                    .then(res => {
                        let data = res.data
                        if (data.data.confessionId) {
                            this.disapperTost(2500, '您已成功告白~')
                            this.times = data.data.confessionLeft
                            this.gbBox = false
                            // 刷新告白墙
                            this.gbArr = []
                            this.getWall()

                            // 存取主播ID 名字
                            localStorage.setItem('modId', this.modId)
                            localStorage.setItem('modName', this.modName)
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 获取/换一组默认告白语
        getInitWord () {
            axios.get('/sweetConfession/getRandConfession')
                .then(res => {
                    let data = res.data
                    this.gbTxtArr = data.data.confessions
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 使用告白语
        useWord (e) {
            var word = e.target.innerText
            var len = word.length
            this.textLen = len
            $('.input-word').find('textarea').val(word)
        },

        // 编辑告白语
        inputWord () {
            var num = $('.input-word').find('textarea').val()
            num = num.replace(/[\r\n\s]/g, '')
            if (num.length > 30) {
                num = num.substring(0, 30)
            }
            this.textLen = num.length
            $('.input-word').find('textarea').val(num)
        },

        // 告白语点赞
        zan (e, index, num) { // num表示不同地方的点赞
            if (!this.uid) {
                return user.showLoginPanel()
            } else {
                if (this.status == 0) {
                    this.disapperTost(2500, '活动还未开始哦！')
                } else
                if (this.status == 2) {
                    this.disapperTost(2500, '活动已经结束了哦！')
                } else
                if (this.withZan) {
                    this.disapperTost(2500, '每日只可点赞一次，请明日再来！')
                } else {
                    var listId = e.target.getAttribute('data-gbid')
                    axios.get('/sweetConfession/like?confessionId=' + listId)
                        .then(res => {
                            let data = res.data
                            if (data.errno == 0) {
                                if (num == 1) {
                                    this.gbArr[index]['liked'] = true
                                    this.gbArr[index]['likeNum']++
                                } else {
                                    this.searchArr[index]['liked'] = true
                                    this.searchArr[index]['likeNum']++
                                }
                                this.withZan = true
                            } else {
                                disapperTost(2500, data.msg)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }
        },

        // 购买
        buy () {
            // 购买判断
            if (!this.uid) {
                return user.showLoginPanel()
            } else {
                if (this.status == 0) {
                    this.disapperTost(2500, '活动还未开始哦！')
                } else
                if (this.status == 2) {
                    this.disapperTost(2500, '活动已经结束了哦！')
                } else {
                    $('#totalMoney').val(1)
                    this.buyBox = !this.buyBox
                    this.buyTotal = this.perMoney
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
            } else if (num == 0) {
                num = ''
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
                this.disapperTost(2000, '请输入正确购买个数')
            } else {
                axios.get('/sweetConfession/buyProduct?pid=' + this.goodId + '&num=' + num)
                    .then(res => {
                        let data = res.data
                        this.buyBox = !this.buyBox
                        if (data.errno == 0) {
                            this.disapperTost(2500, '礼物已放至您的背包，请注意查收！')
                        } else
                        if (data.errno == 111) {
                            this.yeBox = !this.yeBox
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 查找告白语
        searchWord (e) {
            var searchId = $('.search-id').val()
            if (!searchId) {
                this.disapperTost(2500, '请先输入ID，再点击搜索！')
            } else {
                axios.get('/sweetConfession/searchConfession?id=' + searchId)
                    .then(res => {
                        let data = res.data
                        if (data.data.length == 0) {
                            this.disapperTost(2500, '您输入的ID有误，请查证后再操作！')
                        } else {
                            this.searchArr = []
                            this.searchArr = data.data
                            this.findBox = false
                            this.zanBox = true
                            Vue.nextTick(() => {
                                if (findJudge) {
                                    const sortWrapElement = document.querySelector('.zan-out')
                                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                    const sortListElement = document.querySelector('.wall-list-posi')
                                    this.transformEntity3 = new polyfillScroll({
                                        scrollWrap: '.zan-out',
                                        scrollContent: '.wall-list-posi',
                                        bar: {
                                            width: '8px',
                                            height: '60px',
                                            right: '62px',
                                            'background': 'rgba(214, 57, 51,0.8)'
                                        }
                                    })
                                    findJudge = false
                                } else {
                                    this.transformEntity3.refresh()
                                }
                                moveL('.zan-out', timerArr2)
                            })

                            // 存储正确的搜索id
                            localStorage.setItem('searchId', searchId)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid)
        },

        // 规则
        rule () {
            let that = this
            this.showRule = true
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-con')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-out')
                    that.transformEntity1 = new polyfillScroll({
                        scrollWrap: '.rule-con',
                        scrollContent: '.rule-out',
                        bar: {
                            width: '8px',
                            height: '60px',
                            right: '6px',
                            'background': 'rgba(214, 57, 51,0.8)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        // 跳转充值
        charge () {
            window.open('/recharge/center')
        },

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
    },
    mounted: function () {
    }
})

var timerArr1 = []
var timerArr2 = [] // 给弹窗的用
function moveL (dom, array) {
    // 清空计时器，重置计时器数组
    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            clearInterval(array[i])
            array[i] = 0
        }
    }

    var len = $(dom).find('.wall-list').find('.wall-word').length
    var outWidth = $(dom).find('.wall-list').find('.wall-word').eq(0).width()
    for (var i = 0; i < len; i++) {
        var width = $(dom).find('.wall-list').find('.wall-word').eq(i).children('p').width();
        (function (i) {
            if (width > outWidth) {
                var leftValue = 0
                var limit = width - outWidth + 40 // 多预留点空间
                var timer = setInterval(() => {
                    leftValue++
                    $(dom).find('.wall-list').find('.wall-word').eq(i).scrollLeft(leftValue)
                    if (leftValue >= limit) {
                        leftValue = 0
                    }
                }, 40)
                array.push(timer)
            }
        })(i)
    }
}

// svg方法
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
