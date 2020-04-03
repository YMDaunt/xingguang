import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import layer from 'layer'
import scroll from '../component/niceScroll.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import {scroxt} from '../component/gj.scroxt.js'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/dragonBoat.less')

var drewJudge = true
let ruleJudge = true

new Vue({
    el: '#app',
    data: {
        modArrOne: [],
        modArrTwo: [],
        modArrThi: [],
        modArrFor: [],
        modArrFiv: [],
        modTopArr: [],
        modArrOneLen: false,
        modArrTwoLen: false,
        modArrThiLen: false,
        modArrForLen: false,
        modArrFivLen: false,
        topOnePosi: 1,
        userArr: [],
        myUserArr: [],
        myModArr: [],
        showRule: false,
        buyBox: false,
        sureBox: false,
        buyTips: false,
        tabCon: true,
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
        transformEntity3: undefined,
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
                if (this.modArrOne.length > 0) {
                    this.modArrOneLen = true
                }
                if (this.modArrTwo.length > 0) {
                    this.modArrTwoLen = true
                }
                if (this.modArrThi.length > 0) {
                    this.modArrThiLen = true
                }
                if (this.modArrFor.length > 0) {
                    this.modArrForLen = true
                }
                if (this.modArrFiv.length > 0) {
                    this.modArrFivLen = true
                }
                this.topOnePosi = data.data.top1InLevel
                // top3
                this.modTopArr = data.data.top3

                // 我的排名
                this.myModArr = data.data.myRank

                // 处理显示
                Vue.nextTick(() => {
                    setTimeout(() => {
                        if (this.topOnePosi > 0) {
                            console.log(this.topOnePosi)
                            $('.step' + this.topOnePosi + ' ').children('h3').prop({
                                class: 'show-h3'
                            })
                            $('.step' + this.topOnePosi + ' ').children('h3').find('i').text('收起')
                            $('.step' + this.topOnePosi + ' ').find('.step-con').show()
                            console.log($('.step' + this.topOnePosi + ' '))
                        } else {
                            $('.step1').children('h3').prop({
                                class: 'show-h3'
                            })
                            $('.step1').children('h3').find('i').text('收起')
                            $('.step1').children('.step-con').show()
                        }
                    }, 300)
                })
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
                user.showLoginPanel()
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
            window.open('/' + rid) // 主播用户id
        },

        showRules () {
            let that = this
            this.showRule = !this.showRule
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-text')
                    that.transformEntity3 = new PolyfillScroll({
                        scrollWrap: '.rule-out',
                        scrollContent: '.rule-text',
                        bar: {
                            width: '8px',
                            height: '60px',
                            right: '6px',
                            'background': 'rgba(138, 221, 134,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
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
                user.showLoginPanel()
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
                user.showLoginPanel()
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
ctx.translate(0, 80)
ctxMoveCanvas.translate(0, 80)

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
        ctx.drawImage(img, 0, 0)
    }
    img.src = require('../../img/activity/dragonBoat/sd.png')
    // img.src='//static.guojiang.tv/pc/v4/img/activity/dragonBoat/runway.png';
}

/**
     * [readyMove 准备移动并生成数据]
     */
function readyMove () {
    runway = generateRoute() // => [x:number,y:number][]
    rateLine = getRateLine(runway) // => number[]
    moveST()
}

var unit = 8

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
    // 终点
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
    ctxMoveCanvas.clearRect(0, 0, 756, 910)
    if (directAvator) {
        ctxMoveCanvas.drawImage(dogGif[~~(dogGifIndex / 10)], x - (98 / 2), y - 122, 126, 84)
    } else {
        ctxMoveCanvas.drawImage(dogGifBack[~~(dogGifIndex / 10)], x - (98 / 2), y - 122, 126, 84)
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
    if (typeof runner[0] !== 'undefined' && runner[0].money <= num) {
        var imgObj = runner.splice(0, 1)[0]
        var img = new Image()
        img.onload = function () {
            ctx.beginPath()
            ctx.save()

            if (x - avatorPosition.x < 40 && y - avatorPosition.y < 20 && avatorPositionLock) {
                // 头像1
                avatorPositionLock = false
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headAvator, x - 60, y - 178, 82, 106)
                    ctx.translate(x - 19, y - 146) // 头像的原点
                    pointArr.push({
                        x: x,
                        y: y - 102 + 41,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, 56 / 2, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -56 / 2, -56 / 2, 56, 56)
                } else {
                    ctx.drawImage(xheadAvator, x - 30, y - 180, 64, 110)
                    ctx.translate(x + 2, y - 148) // 头像的原点
                    pointArr.push({
                        x: x + 6,
                        y: y - 90 + 30,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, 56 / 2, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -56 / 2, -56 / 2, 56, 56)
                }
            } else {
                // 短头像
                avatorPositionLock = true
                if (imgObj.top > raceIndex - 3) {
                    ctx.drawImage(headAvator, x - 47, y - 178, 82, 106)
                    ctx.translate(x - 6, y - 146) // 头像的原点
                    pointArr.push({
                        x: x,
                        y: y - 102 + 41,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, 56 / 2, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -56 / 2, -56 / 2, 56, 56)
                } else {
                    ctx.drawImage(xheadAvator, x - 30, y - 180, 64, 110)
                    ctx.translate(x + 2, y - 148) // 头像的原点
                    pointArr.push({
                        x: x + 6,
                        y: y - 90 + 30,
                        mid: imgObj.mid,
                        rid: imgObj.rid
                    })
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, 56 / 2, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, -56 / 2, -56 / 2, 56, 56)
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
            var temp = Math.sqrt(Math.pow(wayArr[i][j]['x'] - wayArr[i][j - 1]['x'], 2) + Math.pow(wayArr[i][j]['y'] - wayArr[i][j - 1]['y'], 2))
            distance += temp
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
    for (var i = 1; i <= 5; i++) {
        var len = runnerArr[i].length
        runnerArr[i].forEach(function (value, index) {
            runner.push({
                src: value['headPic'],
                rid: value['rid'],
                mid: value['mid'],
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
    var runway0 = [{'x': 145, 'y': 123}, {'x': 205, 'y': 124}, {'x': 255, 'y': 124}, {'x': 327, 'y': 127}, {'x': 396, 'y': 128}, {'x': 461, 'y': 131}, {'x': 535, 'y': 135}, {'x': 595, 'y': 139}, {'x': 646, 'y': 153}, {'x': 688, 'y': 199}]

    var runway1 = [{'x': 687, 'y': 227}, {'x': 683, 'y': 252}, {'x': 667, 'y': 274}, {'x': 645, 'y': 293}, {'x': 612, 'y': 306}, {'x': 580, 'y': 315}, {'x': 536, 'y': 315}, {'x': 499, 'y': 319}, {'x': 446, 'y': 318}, {'x': 384, 'y': 317}, {'x': 333, 'y': 317}, {'x': 279, 'y': 317}, {'x': 225, 'y': 316}, {'x': 170, 'y': 325}, {'x': 132, 'y': 331}, {'x': 88, 'y': 353}, {'x': 74, 'y': 378}, {'x': 70, 'y': 407}]

    var runway2 = [{'x': 72, 'y': 432}, {'x': 88, 'y': 462}, {'x': 134, 'y': 489}, {'x': 199, 'y': 500}, {'x': 259, 'y': 502}, {'x': 326, 'y': 504}, {'x': 388, 'y': 500}, {'x': 461, 'y': 499}, {'x': 534, 'y': 499}, {'x': 604, 'y': 503}, {'x': 657, 'y': 517}, {'x': 688, 'y': 553}, {'x': 690, 'y': 568}]

    var runway3 = [{'x': 692, 'y': 584}, {'x': 686, 'y': 611}, {'x': 658, 'y': 636}, {'x': 609, 'y': 654}, {'x': 534, 'y': 660}, {'x': 457, 'y': 661}, {'x': 390, 'y': 662}, {'x': 314, 'y': 662}, {'x': 255, 'y': 663}, {'x': 181, 'y': 671}, {'x': 126, 'y': 684}, {'x': 80, 'y': 706}, {'x': 63, 'y': 759}]

    var runway4 = [{'x': 65, 'y': 792}, {'x': 81, 'y': 820}, {'x': 115, 'y': 840}, {'x': 180, 'y': 860}, {'x': 244, 'y': 870}, {'x': 318, 'y': 873}, {'x': 394, 'y': 873}, {'x': 465, 'y': 869}, {'x': 536, 'y': 864}, {'x': 608, 'y': 860}, {'x': 670, 'y': 853}]

    return [runway0, runway1, runway2, runway3, runway4]
}

function canvasClick () {
    var canvas = document.querySelector('#move-canvas')
    canvas.addEventListener('click', function (event) {
        var clientX = event.clientX
        var clientY = event.clientY
        var obj = canvas.getBoundingClientRect()
        var offsetX = clientX - obj.left
        var offsetY = clientY - obj.top
        console.log(offsetX, offsetY)
        goRoom(offsetX, offsetY)
    })
}

function goRoom (x, y) {
    var len = pointArr.length
    for (var i = len; i > 0; i--) {
        if (x < pointArr[i - 1]['x'] + 28 && x > pointArr[i - 1]['x'] - 36 && y < pointArr[i - 1]['y'] + 28 && y > pointArr[i - 1]['y'] - 36) {
            window.open('/' + pointArr[i - 1]['mid'])
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

$(document).ready(function () {
    var change = true
    setInterval(() => {
        if (change) {
            $('.ban2').show()
            $('.ban1').hide()
            change = false
        } else {
            $('.ban1').show()
            $('.ban2').hide()
            change = true
        }
    }, 500)

    $('.step1 > .step-con').niceScroll({
        cursorwidth: 6,
        cursorcolor: '#8add86', // 设置滚动条滑块的颜色
        cursorborder: '1px solid #007d3c', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        horizrailenabled: false,
        hwacceleration: true,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })

    $('.step2 > .step-con').niceScroll({
        cursorwidth: 6,
        cursorcolor: '#8add86', // 设置滚动条滑块的颜色
        cursorborder: '1px solid #007d3c', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        hwacceleration: true,
        horizrailenabled: false,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })

    $('.step3 > .step-con').niceScroll({
        cursorwidth: 6,
        cursorcolor: '#8add86', // 设置滚动条滑块的颜色
        cursorborder: '1px solid #007d3c', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        horizrailenabled: false,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })

    $('.step4 > .step-con').niceScroll({
        cursorwidth: 6,
        cursorcolor: '#8add86', // 设置滚动条滑块的颜色
        cursorborder: '1px solid #007d3c', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        horizrailenabled: false,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })

    $('.step5 > .step-con').niceScroll({
        cursorwidth: 6,
        cursorcolor: '#8add86', // 设置滚动条滑块的颜色
        cursorborder: '1px solid #007d3c', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        horizrailenabled: false,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })

    $('.other-out').niceScroll({
        cursorwidth: 6,
        cursorcolor: '#8add86', // 设置滚动条滑块的颜色
        cursorborder: '1px solid #007d3c', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        horizrailenabled: false,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })
})
