import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/dragonBoat.less')

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

var drewJudge = true

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/dragonBoat.html'

new Vue({
    el: '#app',
    data: {
        modArrOne: [],
        modArrTwo: [],
        modArrThi: [],
        modArrFor: [],
        modArrFiv: [],
        modTopArr: [],
        modArrOneLen: 0,
        modArrTwoLen: 0,
        modArrThiLen: 0,
        modArrForLen: 0,
        modArrFivLen: 0,
        topOnePosi: 0,
        userArr: [],
        myUserArr: [],
        myModArr: [],
        buyBox: false,
        sureBox: false,
        buyTips: false,
        tabCon: true,
        rule: false,
        goodId: null, // 商品id
        perMoney: 0, // 单价
        buyTotal: 0, // 总价
        buyText: '',
        svgPlayer: false,
        scrollLock1: false,
        scrollLock2: false,
        scrollLock3: false,
        scrollLock4: false,
        scrollLock5: false,
        scrollLock6: false,
        modPageOne: 2,
        modPageTwo: 2,
        modPageThi: 2,
        modPageFor: 2,
        modPageFiv: 2,
        userPage: 1,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/DragonBoat/userInfo')
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

        // 数据获取
        axios.get('/DragonBoat/initRank')
            .then(res => {
                let data = res.data
                this.modArrOne = data.data.rank.level1
                this.modArrTwo = data.data.rank.level2
                this.modArrThi = data.data.rank.level3
                this.modArrFor = data.data.rank.level4
                this.modArrFiv = data.data.rank.level5
                this.modArrOneLen = this.modArrOne.length
                this.modArrTwoLen = this.modArrTwo.length
                this.modArrThiLen = this.modArrThi.length
                this.modArrForLen = this.modArrFor.length
                this.modArrFivLen = this.modArrFiv.length
                this.topOnePosi = data.data.top1InLevel
                // top3
                this.modTopArr = data.data.top3

                // 我的排名
                this.myModArr = data.data.myRank

                // 处理显示
                if (this.topOnePosi > 0) {
                    $('.step' + this.topOnePosi + ' ').children('h3').attr({
                        class: 'show-h3'
                    })
                    $('.step' + this.topOnePosi + ' ').children('h3').find('i').text('收起')
                    $('.step' + this.topOnePosi + ' ').children('.step-con').show()
                } else {
                    $('.step1').children('h3').attr({
                        class: 'show-h3'
                    })
                    $('.step1').children('h3').find('i').text('收起')
                    $('.step1').children('.step-con').show()
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 用户
        axios.get('/DragonBoat/DragonRank?type=user&pageNo=1&pageSize=15')
            .then(res => {
                let data = res.data
                this.userArr = data.data.data
            })
            .catch(err => {
                console.log(err)
            })

        // 我的用户排名
        axios.get('/DragonBoat/myrank?type=user')
            .then(res => {
                let data = res.data
                this.myUserArr = data.data
            })
            .catch(err => {
                console.log(err)
            })
    },

    mounted: function () {
        this.initScrollLoad1()
        this.initScrollLoad2()
        this.initScrollLoad3()
        this.initScrollLoad4()
        this.initScrollLoad5()
        this.initScrollLoadUser()
    },

    methods: {
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

        // ajax获取赛段
        getListRankOne (modPageOne) {
            const that = this
            axios.get('/DragonBoat/DragonRank?type=mod&pageSize=15&level=1', {
                params: {
                    pageNo: modPageOne
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    console.log(data)
                    if (data.length > 0) {
                        that.modArrOne = that.modArrOne.concat(data)
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoad1 () {
            const that = this
            that.scrollLoad('.step1 > .step-con', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPageOne++
                that.getListRankOne(that.modPageOne)
            })
        },

        // ajax获取赛段
        getListRankTwo (modPageTwo) {
            const that = this
            axios.get('/DragonBoat/DragonRank?type=mod&pageSize=15&level=2', {
                params: {
                    pageNo: modPageTwo
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    console.log(data)
                    if (data.length > 0) {
                        that.modArrTwo = that.modArrTwo.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoad2 () {
            const that = this
            that.scrollLoad('.step2 > .step-con', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.modPageTwo++
                that.getListRankTwo(that.modPageTwo)
            })
        },

        // ajax获取赛段
        getListRankThi (modPageThi) {
            const that = this
            axios.get('/DragonBoat/DragonRank?type=mod&pageSize=15&level=3', {
                params: {
                    pageNo: modPageThi
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    console.log(data)
                    if (data.length > 0) {
                        that.modArrThi = that.modArrThi.concat(data)
                        that.scrollLock3 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoad3 () {
            const that = this
            that.scrollLoad('.step3 > .step-con', 150, function () {
                if (that.scrollLock3) return
                that.scrollLock3 = true
                that.modPageThi++
                that.getListRankThi(that.modPageThi)
            })
        },

        // ajax获取赛段
        getListRankFor (modPageFor) {
            const that = this
            axios.get('/DragonBoat/DragonRank?type=mod&pageSize=15&level=4', {
                params: {
                    pageNo: modPageFor
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    console.log(data)
                    if (data.length > 0) {
                        that.modArrFor = that.modArrFor.concat(data)
                        that.scrollLock4 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoad4 () {
            const that = this
            that.scrollLoad('.step4 > .step-con', 150, function () {
                if (that.scrollLock4) return
                that.scrollLock4 = true
                that.modPageFor++
                that.getListRankFor(that.modPageFor)
            })
        },

        // ajax获取赛段
        getListRankFiv (modPageFiv) {
            const that = this
            axios.get('/DragonBoat/DragonRank?type=mod&pageSize=15&level=5', {
                params: {
                    pageNo: modPageFiv
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    if (data.length > 0) {
                        that.modArrFiv = that.modArrFiv.concat(data)
                        that.scrollLock5 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoad5 () {
            const that = this
            that.scrollLoad('.step5 > .step-con', 150, function () {
                if (that.scrollLock5) return
                that.scrollLock5 = true
                that.modPageFiv++
                that.getListRankFiv(that.modPageFiv)
            })
        },

        // ajax用户
        getListRankUser (userPage) {
            const that = this
            axios.get('/DragonBoat/DragonRank?type=user&pageSize=15', {
                params: {
                    pageNo: userPage
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    console.log(data)
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock6 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.other-out', 150, function () {
                if (that.scrollLock6) return
                that.scrollLock6 = true
                that.userPage++
                that.getListRankUser(that.userPage)
            })
        },

        // 关注
        love (e, index) {
            if (!this.uid) {
                return common.goLogin()
            } else {
                axios.get('/DragonBoat/Attention', {
                    params: {
                        mid: e.target.getAttribute('data-id')
                    }
                })
                    .then(res => {
                        if (typeof data === 'string') {
                            data = JSON.parse(data)
                        }
                        let _data = res.data
                        console.log(_data)
                        if (_data.errno == 0) {
                            this.modTopArr[index]['isLoved'] = true
                        } else if (!this.uid) {
                            return common.goLogin()
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
            common.goRoom(rid) // 主播房间id //主播用户id
        },

        // remove svg
        removeSvg () {
            this.svgPlayer = !this.svgPlayer
            var doc = $('.svg-con').find('div')
            doc.remove()
        },

        // svg
        doLoveSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/dragonBoat/boat/data.json')
            // setTimeout(()=>{
            //     var doc = $('.svg-con').find('div');
            //     doc.remove();
            //     this.svgPlayer = !this.svgPlayer;
            // }, 6000)
        },
        doTianShiSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/dragonBoat/dwhappy/data.json')
            // setTimeout(()=>{
            //     var doc = $('.svg-con').find('div');
            //     doc.remove();
            //     this.svgPlayer = !this.svgPlayer;
            // }, 8000)
        },
        // 购买
        buy (e) {
            if (!this.uid) {
                return common.goLogin()
            } else {
                // 购买判断
                axios.get('/DragonBoat/canBuy')
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

        buySeven () {
            if (!this.uid) {
                return common.goLogin()
            } else {
                // 购买判断
                axios.get('/DragonBoat/canBuy')
                    .then(res => {
                        let data = res.data.data
                        if (data.canBuy) {
                            this.sureBox = !this.sureBox
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

        sureBuyIt () {
            axios.get('/DragonBoat/BuyProduct?productId=' + 521 + '&num=' + 7)
                .then(res => {
                    let data = res.data
                    this.sureBox = !this.sureBox
                    this.buyTips = !this.buyTips
                    this.buyText = data.msg
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
                axios.get('/DragonBoat/BuyProduct?productId=' + this.goodId + '&num=' + num)
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
        }
    }
})

function tab () {
    $('.step-all').find('h3').on('click', function () {
        if ($(this).hasClass('hide-h3')) {
            $(this).attr({
                class: 'show-h3'
            })
            $(this).find('i').text('收起')
            $(this).siblings('.step-con').show()
        } else {
            $(this).attr({
                class: 'hide-h3'
            })
            $(this).find('i').text('展开排名')
            $(this).siblings('.step-con').hide()
        }
    })
}tab()

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

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var moveCanvas = document.getElementById('move-canvas')
var ctxMoveCanvas = moveCanvas.getContext('2d')

var scaleRate = 3 // canvas缩放的比率
ctx.translate(0, 50 * scaleRate)
ctxMoveCanvas.translate(0, 50)

var runner = []
var runway = [] // 各个线段的节点集合
var distance = 0 // 已经移动的距离
var sumLineDistance = 0 // 当前作用的线段及以前经过的线段的长度和
var sumMoney = 0
var currentLineMoney = 0 //
var rateLine = [] // 各个线段(5段) 克拉/长度 的比率
var rateIndex = 0
var finallyX = 0 // 终点
var finallyY = 0 // 终点

var headAvator
var headLongAvator
var xheadAvator
var xheadLongAvator
var dogGif = []
var dogGifBack = []
var directAvator = true

var avatorPosition = {x: 0, y: 0} // 上一个头像坐标位置
var avatorPositionLock = true

var pointArr = [] // 每个头像的圆点的xy坐标

var screenRate = 320 / 1080 // app的比率

function init (runnerArr) {
    initSprite()
    generateRunner(runnerArr)
    readyMove()
    // drawImage();
    canvasClick()
}

function initSprite () {
    headAvator = new Image()
    headAvator.src = require('../../img/activity/dragonBoat/head.png')
    xheadAvator = new Image()
    xheadAvator.src = require('../../img/activity/dragonBoat/xhead.png')
    headLongAvator = new Image()
    headLongAvator.src = require('../../img/activity/dragonBoat/head.png')
    xheadLongAvator = new Image()
    xheadLongAvator.src = require('../../img/activity/dragonBoat/xhead.png')

    var avatorMove0 = new Image()
    avatorMove0.src = require('../../img/activity/dragonBoat/c0.png')
    dogGif[0] = avatorMove0
    var avatorMove1 = new Image()
    avatorMove1.src = require('../../img/activity/dragonBoat/c0.png')
    dogGif[1] = avatorMove1
    var avatorMove2 = new Image()
    avatorMove2.src = require('../../img/activity/dragonBoat/c0.png')
    dogGif[2] = avatorMove2

    var avatorMove0 = new Image()
    avatorMove0.src = require('../../img/activity/dragonBoat/c10.png')
    dogGifBack[0] = avatorMove0
    var avatorMove1 = new Image()
    avatorMove1.src = require('../../img/activity/dragonBoat/c10.png')
    dogGifBack[1] = avatorMove1
    var avatorMove2 = new Image()
    avatorMove2.src = require('../../img/activity/dragonBoat/c10.png')
    dogGifBack[2] = avatorMove2
}

/**
 * [drawImage canvas加载背景图]
 */
function drawImage () {
    var img = new Image()
    img.onload = function () {
        ctx.drawImage(img, 0, 0, 320, 378)
    }
    img.src = require('../../img/activity/dragonBoat/sd.png')
}

/**
 * [readyMove 准备移动并生成数据]
 */
function readyMove () {
    runway = generateRoute() // => [x:number,y:number][]
    rateLine = getRateLine(runway) // => number[]
    moveST()
}

var unit = 4

var prevPoint = {} // 上一个坐标
var currentPoint = {x: 0, y: 0} // 当前坐标

var lineLength = 0 // 当前段的长度
var currentLineDistance = 0 // 当前线段移动的距离

var raf = 0

/**
 * [jumpPoint 判断当前作用线段]
 */
function jumpPoint () {
    if (distance < sumLineDistance) return // 如果移动的距离小于已经剪切线段的长度 则return

    // 移动至当前线段尾节点
    if (runway[0].length === 0) {
        directAvator = !directAvator
        rateIndex++
        runway.splice(0, 1)
        sumMoney = [0, 50000, 100000, 200000, 400000, 800000][rateIndex]
        if (runway.length === 0) {
            finallyRunner()
            clearTimeTask(raf)
            return
        }
    }
    sumMoney += currentLineMoney
    prevPoint = currentPoint

    currentPoint = runway[0].splice(0, 1)[0] // => {x:x,y:y}
    if (!prevPoint.x) {
        prevPoint = currentPoint
        ctx.moveTo(prevPoint.x, prevPoint.y)
        return
    }
    lineLength = +Math.sqrt(Math.pow((currentPoint.x - prevPoint.x), 2) + Math.pow((currentPoint.y - prevPoint.y), 2)).toFixed(3)
    sumLineDistance += lineLength
    currentLineDistance = 0
    currentLineMoney = 0
}

/**
 * [moveST 帧操作]
 */
function moveST () {
    currentLineDistance += unit
    distance += unit
    currentLineMoney = currentLineDistance * rateLine[rateIndex]

    raf = setTimeTask(moveST)
    jumpPoint()
    var diffX = lineLength !== 0 ? currentLineDistance * Math.abs(currentPoint.x - prevPoint.x) / lineLength : 0
    var diffY = lineLength !== 0 ? currentLineDistance * Math.abs(currentPoint.y - prevPoint.y) / lineLength : 0
    var x = prevPoint.x < currentPoint.x ? prevPoint.x + diffX : prevPoint.x - diffX
    var y = prevPoint.y < currentPoint.y ? prevPoint.y + diffY : prevPoint.y - diffY
    finallyX = x
    finallyY = y
    if (calculatError(sumMoney + currentLineMoney)) return
    avatorStop(sumMoney + currentLineMoney, x, y)
    lineTo(x, y)
}

function calculatError (num) {
    var space = [0, 50000, 100000, 200000, 400000, 800000]
    return num > space[rateIndex + 1]
}

var dogGifIndex = 0
function lineTo (x, y) {
    ctxMoveCanvas.clearRect(0, 0, 1322, 900)
    if (directAvator) {
        ctxMoveCanvas.drawImage(dogGif[~~(dogGifIndex / 10)], x - (60 / 2), y - (44 / 2), 60, 44)
    } else {
        ctxMoveCanvas.drawImage(dogGifBack[~~(dogGifIndex / 10)], x - (60 / 2), y - (44 / 2), 60, 44)
    }
    dogGifIndex++
    if (dogGifIndex >= 30) dogGifIndex = 0
}

function finallyRunner () {
    var len = runner.length
    if (len === 0) {
        $('#move-canvas').css({
            'opacity': 0
        })
        return
    }
    while (len) {
        avatorStop(8888888888, finallyX, finallyY)
        len--
        $('#move-canvas').css({
            'opacity': 0
        })
    }
}

function avatorStop (num, x, y) {
    var x = x * scaleRate
    var y = y * scaleRate
    if (typeof runner[0] !== 'undefined' && runner[0].money <= num) {
        var imgObj = runner.splice(0, 1)[0]
        var img = new Image()
        var rate = 0.5 * scaleRate
        var bigRate = 0.3 * scaleRate
        img.onload = function () {
            ctx.beginPath()
            ctx.save()
            if (x - avatorPosition.x < 40 && y - avatorPosition.y < 20 && avatorPositionLock) {
                avatorPositionLock = false
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headAvator, x - 106 * bigRate, y - 241 * bigRate + 5, 190 * bigRate, 241 * bigRate)
                    ctx.translate(x - 8, y - 168 * bigRate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 145 * bigRate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (131 / 2) * bigRate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 126 * bigRate, 126 * bigRate)
                } else {
                    ctx.drawImage(xheadAvator, x - 30 * rate, y - 140 * rate + 5, 80 * rate, 140 * rate)
                    ctx.translate(x + 14, y - 100 * rate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 50 * rate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (70 / 2) * rate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 70 * rate, 70 * rate)
                }
            } else {
                // 头像2
                avatorPositionLock = true
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headAvator, x - 80 * bigRate, y - 241 * bigRate + 5, 190 * bigRate, 241 * bigRate)
                    ctx.translate(x + 16, y - 168 * bigRate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 145 * bigRate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (131 / 2) * bigRate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 126 * bigRate, 126 * bigRate)
                } else {
                    ctx.drawImage(xheadAvator, x - 30 * rate, y - 140 * rate + 5, 80 * rate, 140 * rate)
                    ctx.translate(x + 14, y - 100 * rate + 5) // 头像的原点
                    pointArr.push({
                        x: x / scaleRate,
                        y: y / scaleRate + 50 - 50 * rate / scaleRate + 5,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    var r = (70 / 2) * rate
                    ctx.arc(0, 0, r, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -r, -r, 70 * rate, 70 * rate)
                }
            }

            ctx.restore()
            ctx.closePath()

            avatorPosition.x = x
            avatorPosition.y = y
        }
        img.src = imgObj.src
    }
}

/**
 * [getRateLine 得到各个节点的比率]
 * @param  {[x:number,y:number][]} wayArr [轨道节点]
 * @return {number[]}        [各个节点的比率]
 */
function getRateLine (wayArr) {
    var result = []
    var money = [50000, 50000, 100000, 200000, 400000]
    for (var i = 0, len = wayArr.length; i < len; i++) {
        var distance = 0
        for (var j = 0, jLen = wayArr[i].length; j < jLen; j++) {
            if (j === 0) continue
            distance += +Math.sqrt(Math.pow(wayArr[i][j]['x'] - wayArr[i][j - 1]['x'], 2) + Math.pow(wayArr[i][j]['y'] - wayArr[i][j - 1]['y'], 2)).toFixed(3)
        }
        result.push(money[i] / distance) // => 单位距离的克拉
    }
    return result // => 单位距离的克拉数组集
}
/**
 * [generateRunner 得到主播的信息数组]
 */
var raceIndex = 0
function generateRunner (runnerArr) {
    if (runnerArr.length === 0) return
    for (var i = 1; i <= 5; i++) {
        var len = runnerArr[i].length
        runnerArr[i].forEach(function (value, index) {
            runner.push({
                src: value['headPic'],
                rid: value['rid'],
                mid: value['id'],
                money: value['score'],
                top: ++raceIndex
            })
        })
    }
}

/**
 * [generateRoute 得到路径点数组]
 * @returns {[x:number,y:number][]} [轨道的坐标点]
 */
function generateRoute () {
    var point = []
    point[0] = [{'x': 179, 'y': 158}, {'x': 291, 'y': 164}, {'x': 427, 'y': 165}, {'x': 643, 'y': 165}, {'x': 742, 'y': 170}, {'x': 788, 'y': 175}, {'x': 835, 'y': 192}, {'x': 875, 'y': 213}, {'x': 926, 'y': 239}, {'x': 956, 'y': 263}, {'x': 954, 'y': 298}]

    point[1] = [{'x': 944, 'y': 337}, {'x': 932, 'y': 369}, {'x': 900, 'y': 398}, {'x': 847, 'y': 418}, {'x': 769, 'y': 430}, {'x': 717, 'y': 436}, {'x': 663, 'y': 438}, {'x': 579, 'y': 438}, {'x': 510, 'y': 434}, {'x': 386, 'y': 436}, {'x': 331, 'y': 446}, {'x': 297, 'y': 450}, {'x': 250, 'y': 459}, {'x': 200, 'y': 481}, {'x': 134, 'y': 505}, {'x': 110, 'y': 534}, {'x': 102, 'y': 570}]

    point[2] = [{'x': 106, 'y': 594}, {'x': 128, 'y': 635}, {'x': 150, 'y': 666}, {'x': 224, 'y': 683}, {'x': 282, 'y': 695}, {'x': 333, 'y': 699}, {'x': 398, 'y': 702}, {'x': 562, 'y': 692}, {'x': 698, 'y': 692}, {'x': 801, 'y': 698}, {'x': 857, 'y': 714}, {'x': 905, 'y': 748}, {'x': 912, 'y': 771}, {'x': 940, 'y': 803}]

    point[3] = [{'x': 966, 'y': 851}, {'x': 958, 'y': 891}, {'x': 950, 'y': 900}, {'x': 800, 'y': 922}, {'x': 706, 'y': 928}, {'x': 494, 'y': 936}, {'x': 300, 'y': 942}, {'x': 246, 'y': 950}, {'x': 192, 'y': 967}, {'x': 169, 'y': 1012}, {'x': 88, 'y': 1053}, {'x': 78, 'y': 1088}]

    point[4] = [{'x': 68, 'y': 1116}, {'x': 106, 'y': 1154}, {'x': 166, 'y': 1185}, {'x': 222, 'y': 1206}, {'x': 306, 'y': 1221}, {'x': 377, 'y': 1229}, {'x': 444, 'y': 1234}, {'x': 530, 'y': 1233}, {'x': 640, 'y': 1228}, {'x': 801, 'y': 1214}, {'x': 894, 'y': 1206}]

    point.forEach(function (value, index) {
        var temp = []
        value.forEach(function (val, idx) {
            temp.push({
                x: val['x'] * screenRate,
                y: val['y'] * screenRate
            })
        })
        point[index] = temp
    })

    return point
}

function canvasClick () {
    var canvas = document.querySelector('#move-canvas')
    canvas.addEventListener('click', function (event) {
        var clientX = event.clientX
        var clientY = event.clientY
        var obj = canvas.getBoundingClientRect()
        var offsetX = clientX - obj.left
        var offsetY = clientY - obj.top
        console.log(offsetY)
        goRoom(offsetX, offsetY)
    })
}

function goRoom (x, y) {
    var len = pointArr.length
    for (var i = len; i > 0; i--) {
        if (x < pointArr[i - 1]['x'] + 28 && x > pointArr[i - 1]['x'] - 28 && y < pointArr[i - 1]['y'] + 28 && y > pointArr[i - 1]['y'] - 28) {
            common.goRoom(pointArr[i - 1]['rid'], 2)
            break
        }
    }
}

var setTimeTask = (function () {
    return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
              setTimeout(callback, 1000 / 60)
          }
})()

var clearTimeTask = (function () {
    return window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.clearTimeout
})()

var initCanvasLock = false
var raceList
// 跑道
function generateRace (data) {
    init(data)
}

function scrollFoo () {
    $(document).scroll(function () {
        if ($('.gb-gift').offset().top - $(window).scrollTop() <= 0) {
            if (initCanvasLock || typeof raceList === 'undefined') return
            initCanvasLock = true
            generateRace(raceList)
        }
    })

    if ($('.gb-gift').offset().top - $(window).scrollTop() <= 0) {
        if (initCanvasLock || typeof raceList === 'undefined') return
        initCanvasLock = true
        generateRace(raceList)
    }
}

function initXHR () {
    $.ajax({
        type: 'get',
        url: '/DragonBoat/RaceList',
        dataType: 'json',
        success: function (data) {
            var _data = data.data
            raceList = _data
            scrollFoo()
        },
        error: function (err) {

        }
    })
}
initXHR()
