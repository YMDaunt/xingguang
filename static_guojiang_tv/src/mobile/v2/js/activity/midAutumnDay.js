'use strict'

import Vue from 'vue'
import axios from 'axios'
import { goRecharge, goRoom, goLogin } from 'common'
import bodymovin from '../component/bodymovin.min.js'

import '../../css/activity/midAutumnDay.less'

var playSvg = function (path) {
    var svgContainer = document.querySelector('.svg-container')
    return bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: true,
        autoplay: true,
        path: path
    })
}

var svgCurrentIns = null
var svgFlowerIns = null
var svgMoonIns = null

var svgFlowerPath = '//static.guojiang.tv/app/gift/pc_animation/4999/data.json'
var svgMoonPath = '//static.guojiang.tv/src/pc/img/room/svg/mount/30/data.json'

var giftFlowerPid = '2000'

var arrDelete = function (arr, target, attr) {
    if (target[attr] === undefined || target[attr] === null) return arr
    var findi = 0
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i][attr] === target[attr]) {
            findi = i
        }
    }
    return arr.slice(0, findi).concat(arr.slice(findi + 1))
}

const service = {
    state: { // 用于防止接口重复请求
        getInitData: false,
        getLottery: false,
        getUserNameById: false,
        getUserNameByIdTimer: null,
        sendCard: false,
        askCard: false,
        cashFor: false,
        getZhuboList: false,
        getUserList: false,
        cardRequest: false,
        attention: false,
        buyGifts: false,
        getMsgList: false
    },
    _errHandler (data) { // 默认捕获 非200状态码
        if (data.status === 200) {
            return data.data
        } else {
            console.log('ajax net error catcher: ', data.msg)
            throw new Error(data.msg)
        }
    },
    _apiHander (data) { // 默认处理 data.errno !== 0 的情况
        if (data.errno === 0) {
            return data
        } else {
            console.log('ajax api error catcher: ', data.msg)
            throw new Error(data.msg)
        }
    },
    _defaultMsg: {
        errno: -999,
        msg: '您点的太快了~',
        data: {}
    },
    getInitData () { // 初始化
        if (this.state.getInitData) return
        this.state.getInitData = true

        return axios.get('/autumn/initinfo').then(data => {
            this.state.getInitData = false
            return data
        }).then(this._errHandler).then(this._apiHander)
    },
    // getInitZikuai () { // 初始化字块
    //     return axios.get('/autumn/maindata')
    //         .then(this._errHandler).then(this._apiHander)
    // },
    getAcceptRecord (page, limit) { // 收到字块记录
        return axios.get('/autumn/acceptRecord', {
            params: {
                page, rows: limit
            }
        }).then(this._errHandler).then(this._apiHander)
    },
    getAskRecord (page, limit) { // 索要字块记录
        return axios.get('/autumn/askInfo', {
            params: {
                page, rows: limit
            }
        }).then(this._errHandler).then(this._apiHander)
    },
    getPresentRecord (page, limit) { // 赠送字块记录
        return axios.get('/autumn/presentRecord', {
            params: {
                page, rows: limit
            }
        }).then(this._errHandler).then(this._apiHander)
    },
    getLottery (type) { // 字块领取
        if (this.state.getLottery) return Promise.resolve(service._apiHander)
        this.state.getLottery = true

        let numsType = {
            'one': 1,
            'ten': 10
        }

        return axios.get('/autumn/awardBlock', {
            params: {
                num: numsType[type] || 0
            }
        }).then(data => {
            this.state.getLottery = false
            return data
        }).then(this._errHandler)
    },
    getUserNameByIdBounce (id, cb) { // 防抖 - 根据用户id获取昵称
        console.log('getUserNameByIdBounce')
        this.state.getUserNameByIdTimer && clearTimeout(this.state.getUserNameByIdTimer)
        this.state.getUserNameByIdTimer = setTimeout(() => {
            this.getUserNameById(id).then(this._errHandler).then(cb)
        }, 400)
    },
    getUserNameById (id) { // 根据用户id获取昵称
        console.log('getUserNameById')
        if (this.state.getUserNameById) return
        this.state.getUserNameById = true

        return axios.get('/autumn/getNameById', {
            params: {
                nameId: id
            }
        }).then(data => {
            this.state.getUserNameById = false
            return data
        })
    },
    sendCard (uid, type) { // 赠送卡片
        if (this.state.sendCard) return Promise.resolve(service._apiHander)
        this.state.sendCard = true

        return axios.get('/autumn/presentBlock', {
            params: {
                uid, blockId: type
            }
        }).then(data => {
            this.state.sendCard = false
            return data
        }).then(this._errHandler)
    },
    askCard (uid, type) { // 索要卡片
        if (this.state.askCard) return Promise.resolve(service._apiHander)
        this.state.askCard = true

        return axios.get('/autumn/askBlock', {
            params: {
                uid, blockId: type
            }
        }).then(data => {
            this.state.askCard = false
            return data
        }).then(this._errHandler)
    },
    cashFor () { // 兑换座驾
        if (this.state.cashFor) return Promise.resolve(service._apiHander)
        this.state.cashFor = true

        return axios.get('/autumn/exchange')
            .then(data => {
                this.state.cashFor = false
                return data
            }).then(this._errHandler)
    },
    getZhuboList (page, limit) { // 获取主播榜单
        if (this.state.getZhuboList) return
        this.state.getZhuboList = true

        return axios.get('/Autumn/GetRank', {
            params: {
                type: 'mod',
                pageNo: page,
                pageSize: limit
            }
        }).then(data => {
            this.state.getZhuboList = false
            return data
        }).then(this._errHandler).then(this._apiHander)
    },
    getUserList (page, limit) { // 获取用户榜单
        if (this.state.getUserList) return
        this.state.getUserList = true
        return axios.get('/Autumn/GetRank', {
            params: {
                type: 'user',
                pageNo: page,
                pageSize: limit
            }
        }).then(data => {
            this.state.getUserList = false
            return data
        }).then(this._errHandler).then(this._apiHander)
    },
    cardRequest (id, type) { // 赠送或拒绝 "索要" 字块
        if (this.state.cardRequest) return Promise.resolve(service._apiHander)
        this.state.cardRequest = true

        return axios.get('/autumn/handleAsk', {
            params: {
                askId: id,
                result: type
            }
        }).then(data => {
            this.state.cardRequest = false
            return data
        }).then(this._errHandler)
    },
    attention (id) { // 关注主播
        if (this.state.attention) return Promise.resolve(service._apiHander)
        this.state.attention = true

        return axios.get('/chenChen/attention', {
            params: {
                mid: id
            }
        }).then(data => {
            this.state.attention = false
            return data
        }).then(this._errHandler).then(this._apiHander)
    },
    buyGifts (pid, num) { // 购买礼物
        if (this.state.buyGifts) return Promise.resolve(service._apiHander)
        this.state.buyGifts = true

        return axios.get('/autumn/buyProduct', {
            params: {
                pid, num
            }
        }).then(data => {
            this.state.buyGifts = false
            return data
        }).then(this._errHandler)
    },
    getMsgList () { // 获取滚动信息栏数据
        if (this.state.getMsgList) return
        this.state.getMsgList = true
        return axios.get('/autumn/exchangeMsg').then(data => {
            this.state.getMsgList = false
            return data
        }).then(this._errHandler).then(this._apiHander)
    }
}

new Vue({
    el: '#app',
    data: {
        constVar: { // 常量类型
            boardTabType: {
                'zhubo': true,
                'user': true
            },
            cardsTabType: {
                'take': true,
                'give': true,
                'ask': true
            },
            contType: {
                'one': 1,
                'ten': 10
            }
        },
        ui: {
            modalShow: false,
            modalShowType: '',
            boardTabType: 'zhubo', // 'user'
            cardsTabType: 'take', // 'take' 'give' 'ask'
            lotteryType: 'one', // 抽一次/十次
            svgShow: false,
            toastShow: false,
            toastMsg: '',
            toastTimer: null,
            fixedMsgBox: false,
            bodyCanScroll: true
        },
        contribute: {
            contProress: 0, // 贡献值进度条
            contTotal: 5000, // 进度条总值
            contValue: 0, // 贡献值
            contDraw: 0, // 领取次数
            contLeft: 0, // 剩余领取次数
            // packages: [0, 0, 0, 0, 0] // 字块数量 'zhong', 'qiu', 'jie', 'kuai', 'le'
            packages: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                length: 5
            } // 字块数量 'zhong', 'qiu', 'jie', 'kuai', 'le'
        },
        msglist: [], // 滚动消息栏
        zhuboList: { // 主播榜
            list: [],
            hasNext: true,
            currPage: 0,
            loading: false
        },
        userList: { // 用户榜
            list: [],
            hasNext: true,
            currPage: 0,
            loading: false
        },
        zhuboMe: {
            // 主播信息栏
            rank: '未上榜',
            pairInfos: [{ // 我的排名展示的信息对
                name: '榜单排名',
                value: 0
            }, {
                name: '团圆值',
                value: 0
            }, {
                name: '距离上榜还差',
                value: 0
            }, {
                name: '领先后一名',
                value: 0
            }],
            uid: '',
            headPic: '',
            nickname: '',
            rid: '',
            isPlaying: false
        },
        userMe: {
            // 用户信息栏
            rank: '未上榜',
            pairInfos: [{ // 我的排名展示的信息对
                name: '榜单排名',
                value: 0
            }, {
                name: '团圆值',
                value: 0
            }, {
                name: '距离上榜还差',
                value: 0
            }, {
                name: '领先后一名',
                value: 0
            }],
            uid: '',
            headPic: '',
            nickname: '',
            rid: ''
        },
        cardsCenter: { // 字块中心
            take: {
                hasNew: false,
                list: [],
                hasNext: true,
                currPage: 0,
                loading: false
            },
            ask: {
                hasNew: false,
                list: [],
                hasNext: true,
                currPage: 0,
                loading: false
            },
            give: {
                list: [],
                hasNext: true,
                currPage: 0,
                loading: false
            }
        },
        lottery: { // 抽奖的结果
            list: []
        },
        userInput: { // 用户输入数据集
            giveInput: '',
            giveInputTips: '*请确认用户ID是否正确', // *请确认用户ID是否正确
            giveInputName: '',
            giveInputState: false,
            askInput: '',
            askInputTips: '*请确认用户ID是否正确', // *请确认用户ID是否正确
            askInputName: '',
            askInputState: false,
            currentGiveType: '',
            currentAskType: ''
        },
        buyInfo: {
            payMoney: '',
            buyPrice: 6666,
            buyInputNum: ''
        },
        userInfo: {
            uid: '123456',
            nickname: ''
        },
        times: {
            canExchange: false,
            canBuy: false
        },
        skeletonli: [0, 1, 2, 3, 4, 5, 6],
        skeletonliStateZhubo: false,
        skeletonliStateUser: false,
        // cardsCenterHasNews: false,
        user: {
            islogined: false
        }
    },
    computed: {
        'hasASeries': function () {
            var hasASeries = true
            for (let i = 0, len = this.contribute.packages.length; i < len; i++) {
                if (this.contribute.packages[i] === 0) {
                    hasASeries = false
                    break
                }
            }
            return hasASeries
        }
        // 'cardsCenterHasNews': function () {
        //     return this.cardsCenter.take.hasNew || this.cardsCenter.ask.hasNew
        // }
    },
    watch: {
        'buyInfo.buyInputNum': function (value) {
            value = +value
            if (Number.isNaN(value) || value === 0 || (value + '').indexOf('.') > -1 || value > 9999) {
                this.buyInfo.payMoney = '请输入正确的购买数量'
            } else {
                this.buyInfo.payMoney = value * this.buyInfo.buyPrice + '克拉'
            }
        }
        // 'ui.bodyCanScroll': function (value) {
        //     // var rootEle = document.documentElement || document.body
        //     var html = document.querySelector('html')
        //     var body = document.querySelector('body')
        //     if (value) {
        //         html.style.height = 'auto'
        //         body.style.height = 'auto'
        //         html.style.overflowY = 'auto'
        //         body.style.overflowY = 'auto'
        //     } else {
        //         html.style.height = '100%'
        //         body.style.height = '100%'
        //         html.style.overflowY = 'hidden'
        //         body.style.overflowY = 'hidden'
        //     }
        // }
    },
    mounted: function () {
        this.adaptation()

        this.initPage()

        this.initList()

        // var _self = this
        document.addEventListener('touchmove', (e) => {
            console.log(123)
            if (e._isScroll === false) {
                e.preventDefault()
            }
        }, {
            passive: false
        })
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
        /* UI */
        // scrollMsgBox () {
        //     var top = document.documentElement.scrollTop
        //     if (top >= 1260) {
        //         this.ui.fixedMsgBox = true
        //     } else {
        //         this.ui.fixedMsgBox = false
        //     }
        // },
        goRecharge () { // 立即充值
            if (!this.checkLogin()) return
            goRecharge()
        },
        showModal (type) { // 显示对话框
            if (!type) return
            this.ui.modalShow = true
            this.ui.modalShowType = type
            this.ui.bodyCanScroll = false
        },
        closeModal () { // 关闭对话框
            this.ui.modalShow = false
            this.ui.bodyCanScroll = true
        },
        closeCardsCenterModal () { // 关闭字块中心对话框
            this.closeModal()
        },
        inputFocus (evt) { // fastclick input focus
            evt.target.focus()
        },
        goCheckRange () { // 查看返利区间
            this.showModal('range')
        },
        preview (type) { // type ['flower', 'moon'] 预览
            if (type === 'flower') {
                this.ui.svgShow = true
                if (svgFlowerIns) {
                    svgFlowerIns.play()
                } else {
                    svgFlowerIns = playSvg(svgFlowerPath)
                }
                svgCurrentIns = svgFlowerIns
            }
            if (type === 'moon') {
                this.ui.svgShow = true
                if (svgMoonIns) {
                    svgMoonIns.play()
                } else {
                    svgMoonIns = playSvg(svgMoonPath)
                }
                svgCurrentIns = svgMoonIns
            }
        },
        stopSvg () { // 停止svg动画
            this.ui.svgShow = false
            if (svgCurrentIns) {
                svgCurrentIns.stop()
                svgCurrentIns = null
            }
        },
        purchase (type) { // type ['flower'] 购买
            if (!this.checkLogin()) return
            if (!this.times.canBuy) return
            this.buyInfo.buyInputNum = 1
            this.$refs.buyInput.value = 1
            this.showModal('buy')
        },
        givePresent (index) { // index 0,1,2,3,4 ['zhong', 'qiu', 'jie', 'kuai', 'le'] 赠送
            if (!this.checkLogin()) return
            if (!this.contribute.packages[index]) return // index<0 || index>4 || value===0

            this.showModal('give')
            this.userInput.giveInput = ''
            this.$refs.giveInput.value = ''
            // this.userInput.giveInputTips = ''
            this.userInput.giveInputName = ''
            this.userInput.currentGiveType = index + 1 // ['zhong', 'qiu', 'jie', 'kuai', 'le'][index]
        },
        askPresent (index) { // index 0,1,2,3,4 ['zhong', 'qiu', 'jie', 'kuai', 'le'] 索要
            if (!this.checkLogin()) return
            this.showModal('ask')
            this.userInput.askInput = ''
            this.$refs.askInput.value = ''
            // this.userInput.askInputTips = ''
            this.userInput.askInputName = ''
            this.userInput.currentAskType = index + 1
        },
        tabChange (type) { // type ['zhubo', 'user'] 排行榜切换
            if (!this.constVar.boardTabType[type]) return
            if (this.ui.boardTabType === type) return
            this.ui.boardTabType = type
        },
        tabChangeOfCards (type) { // type ['take', 'give', 'ask'] 排行榜切换
            if (!this.constVar.cardsTabType[type]) return
            if (this.ui.cardsTabType === type) return

            this.ui.cardsTabType = type

            // 进入当前tab时触发阅读消息
            if (this.cardsCenter[type].currPage === 0) { // 初始化第一页数据
                switch (type) {
                case 'take': this.getCardsTakeList()
                    break
                case 'ask': this.getCardsAskList()
                    break
                case 'give': this.getCardsPresentList()
                    break
                }
            }
        },
        checkLogin () {
            if (!this.user.islogined) {
                goLogin()
                return false
            }
            return true
        },
        attent (index) { // id 主播id 关注
            if (!this.checkLogin()) return
            if (this.zhuboList.list[index].isLoved) return
            service.attention(this.zhuboList.list[index].id)
                .then(data => {
                    this.zhuboList.list[index].isLoved = true
                })
        },
        goRules () { // 查看活动规则
            this.showModal('rules')
        },
        goCards () { // 查看字块中心
            // 进入字块中心时触发阅读消息

            this.ui.cardsTabType = 'take' // 默认显示

            if (this.cardsCenter.take.currPage === 0) {
                this.getCardsTakeList()
            }

            // if (this.ui.cardsTabType === 'take' && this.cardsCenter.take.currPage === 0) {
            //     this.getCardsTakeList()
            // }
            // if (this.ui.cardsTabType === 'give' && this.cardsCenter.give.currPage === 0) {
            //     this.getCardsPresentList()
            // }

            this.showModal('mywords')
        },
        goRoom (item) { // 点击主播头像跳转
            if (!item) return

            item.rid && goRoom(item.rid)
        },
        getLottery (type) { // 领取1次、10次
            if (!this.checkLogin()) return
            this.goLottery(type)
        },
        lotteryConfirm () { // 点击抽奖弹窗的朕知道了
            this.closeModal()
            this.lottery.list = []
        },
        rechargeCancel () { // 点击去充值的"不了"
            this.closeModal()
        },
        buyConfirm () { // 确认购买
            if (this.buyInfo.buyInputNum === '' || this.buyInfo.buyInputNum === 0) {
                this.toast('请输入正确的购买数量')
                return
            }
            service.buyGifts(giftFlowerPid, this.buyInfo.buyInputNum)
                .then(data => {
                    if (data.errno === 0) {
                        this.toast('礼物已放至您的背包，请注意查收！')
                        this.closeModal()
                    } else {
                        if (data.msg === '余额不足，请充值再来！') {
                            this.showModal('recharge')
                        } else {
                            this.toast(data.msg)
                        }
                    }
                })
        },
        refuse (item) { // 索要卡片 - 拒绝
            if (!item || !item.askId) return
            service.cardRequest(item.askId, 2)
                .then(data => {
                    if (data.errno === 0 || data.errno === 105) {
                        this.cardsCenter.ask.list = arrDelete(this.cardsCenter.ask.list, item, 'askId')
                    } else {
                        this.toast(data.msg)
                    }
                })
        },
        calcType (info) { // 根据string计算该字块
            var target = info.split('font')[1]
            if (!target) {
                return null
            }
            if (info.indexOf('中') !== -1) {
                return 0
            }
            if (info.indexOf('秋') !== -1) {
                return 1
            }
            if (info.indexOf('节') !== -1) {
                return 2
            }
            if (info.indexOf('快') !== -1) {
                return 3
            }
            if (info.indexOf('乐') !== -1) {
                return 4
            }
            return null
        },
        agree (item) { // 索要卡片 - 同意赠送
            if (!item || !item.askId) return
            service.cardRequest(item.askId, 1)
                .then(data => {
                    // if (data.errno === 0 || data.errno === 105) {
                    //     this.cardsCenter.ask.list = arrDelete(this.cardsCenter.ask.list, item, 'askId')

                    //     if (data.errno === 0) { // 赠送成功
                    //         var type = this.calcType(item.info)
                    //         if (type === null) {
                    //             console.log(item.info, '不包含字块')
                    //             return
                    //         }
                    //         this.contribute.packages[type] -= 1
                    //         this.refreshCardsGiveList()
                    //         this.toast('字块已成功送出！')
                    //     } else {
                    //         this.toast('您也没有这张哦！')
                    //     }
                    // } else {
                    //     this.toast(data.msg)
                    // }

                    if (data.errno === 0) {
                        this.cardsCenter.ask.list = arrDelete(this.cardsCenter.ask.list, item, 'askId')

                        var type = this.calcType(item.info)
                        if (type === null) {
                            console.log(item.info, '不包含字块')
                            return
                        }
                        this.contribute.packages[type] -= 1
                        this.refreshCardsGiveList()
                        this.toast('字块已成功送出！')
                    } else if (data.errno === 105) {
                        this.toast('您也没有这张哦！')
                    } else {
                        this.toast(data.msg)
                    }
                })
        },
        runMsg () { // 跑马灯 - 无限滚动
            this.$nextTick(() => {
                var msgWrapper = this.$refs.msgwrap
                var allWidth = this.$refs.msgwrap.scrollWidth
                var cWidth = this.$refs.msgwrap.clientWidth

                if (allWidth <= cWidth) {
                    return
                }

                // 不使用css3 animation (在小部分旧机型上动画显示很卡顿)
                var left = 0
                var step = 0.8

                var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

                function run () { // eslint-disable-line
                    left -= step
                    msgWrapper.style.transform = 'translate3d(' + left + 'px, 0px, 0px)'
                    msgWrapper.style.webkitTransform = 'translate3d(' + left + 'px, 0px, 0px)'

                    if (Math.abs(left) > (allWidth / 2)) {
                        left = 0
                    }

                    requestAnimationFrame(run)
                }

                requestAnimationFrame(run)
            })
        },
        buyInput (evt) { // 购买输入限制
            var value = evt.target.value
            if (value === '') {
                this.buyInfo.buyInputNum = ''
                evt.target.value = ''
                return
            }
            var num = value.replace(/[^0-9]+/g, '')
            num = +num
            if (num > 9999) {
                this.buyInfo.buyInputNum = 9999
                evt.target.value = 9999
                return
            }
            if (num < 0) {
                this.buyInfo.buyInputNum = 1
                evt.target.value = 1
                return
            }
            this.buyInfo.buyInputNum = num
            evt.target.value = num
        },
        idGiveInput (evt) {
            var value = evt.target.value
            this.userInput.giveInputName = ''
            if (value === '') {
                this.userInput.giveInput = ''
                evt.target.value = ''
                return
            }
            var num = value.replace(/[^0-9]+/g, '').slice(0, 8) // 最多八位数
            this.userInput.giveInput = num
            evt.target.value = num

            // 函数防抖 - 触发ID -> nickname搜索
            service.getUserNameByIdBounce(num, (data) => {
                if (data.errno === 0) {
                    this.userInput.giveInputName = data.data.name
                    this.userInput.giveInputState = true
                } else {
                    this.userInput.giveInputName = data.msg
                    // this.userInput.giveInputTips = data.msg || '*请确认用户ID是否正确'
                    this.userInput.giveInputState = false
                }
            })
        },
        idAskInput (evt) {
            var value = evt.target.value
            this.userInput.askInputName = ''
            if (value === '') {
                this.userInput.askInput = ''
                evt.target.value = ''
                return
            }
            var num = value.replace(/[^0-9]+/g, '').slice(0, 8) // 最多八位数
            this.userInput.askInput = num
            evt.target.value = num

            // 函数防抖 - 触发ID -> nickname搜索
            service.getUserNameByIdBounce(num, (data) => {
                if (data.errno === 0) {
                    this.userInput.askInputName = data.data.name
                    this.userInput.askInputState = true
                } else {
                    console.log(data.msg)
                    this.userInput.askInputName = data.msg
                    // this.userInput.askInputTips = data.msg || '*请确认用户ID是否正确'
                    this.userInput.askInputState = false
                }
            })
        },
        toast (msg) { // toast
            if (!msg) return
            this.ui.toastTimer && clearTimeout(this.ui.toastTimer)
            this.ui.toastShow = true
            this.ui.toastMsg = msg
            this.ui.toastTimer = setTimeout(() => {
                this.ui.toastShow = false
                this.ui.toastTimer = null
            }, 2000)
        },
        /* service Ajax 数据交互 */
        initPage () { // ajax - 初始化页面数据
            service.getInitData().then((data) => {
                data = data.data

                this.user.islogined = data.isLogin
                this.times.canExchange = data.canExchange
                this.times.canBuy = data.canBuy
                // })

                // service.getInitZikuai().then((data) => { // 我的字块
                // data = data.data

                if (data.block) {
                    let packages = this.contribute.packages
                    packages[0] = data.block['1']
                    packages[1] = data.block['2']
                    packages[2] = data.block['3']
                    packages[3] = data.block['4']
                    packages[4] = data.block['5']
                }

                this.contribute.contValue = data.info ? data.info.score : 0
                this.contribute.contDraw = data.info ? data.info.received : 0
                this.contribute.contLeft = data.info ? data.info.receive : 0
                this.contribute.contProress = this.contribute.contValue % this.contribute.contTotal

                // this.cardsCenterHasNews = data.newInfo

                this.cardsCenter.take.hasNew = data.msg.receive
                this.cardsCenter.ask.hasNew = data.msg.ask
            })

            service.getMsgList().then(data => {
                data = data.data
                this.msglist = data
                this.runMsg()
            })
        },
        goLottery (type) { // ajax - 领取卡片
            service.getLottery(type).then((data) => {
                if (data.errno === 0) {
                    data = data.data

                    let list = []
                    let cardsType = ['zhong', 'qiu', 'jie', 'kuai', 'le']
                    Object.keys(data).forEach(value => {
                        list.push({
                            type: cardsType[value - 1],
                            num: data[value]
                        })

                        this.contribute.packages[value - 1] += data[value]
                    })

                    this.lottery.list = list

                    var num = this.constVar.contType[type]
                    this.contribute.contDraw += num
                    this.contribute.contLeft -= num

                    this.ui.lotteryType = type
                    this.showModal('lottery')
                } else {
                    this.toast(data.msg)
                }
            })
        },
        giveCard () { // 确认赠送卡片
            if (this.userInput.giveInput === '') {
                this.toast('用户id不能为空！')
                return
            }

            if (!this.userInput.currentGiveType || !this.userInput.giveInputState) return

            if (this.userInput.giveInput === this.userInfo.uid) {
                this.toast('您不能送给自己哦！')
                return
            }

            service.sendCard(this.userInput.giveInput, this.userInput.currentGiveType)
                .then((data) => {
                    if (data.errno === 0) {
                        this.toast('字块已成功送出！')

                        this.contribute.packages[this.userInput.currentGiveType - 1] -= 1
                        this.refreshCardsGiveList()
                        this.closeModal()
                    } else {
                        this.toast(data.msg)
                    }
                })
        },
        askCard () { // 确认索要卡片
            if (this.userInput.askInput === '') {
                this.toast('用户id不能为空！')
                return
            }

            if (!this.userInput.currentAskType || !this.userInput.askInputState) return

            if (this.userInput.askInput === this.userInfo.uid) {
                this.toast('您不能向自己索要哦! ')
                return
            }

            service.askCard(this.userInput.askInput, this.userInput.currentAskType)
                .then((data) => {
                    if (data.errno === 0) {
                        this.toast('请求已成功发送至对方，祝好运！')
                        this.closeModal()
                    } else {
                        console.log(data.msg)
                        this.toast(data.msg)
                    }
                })
        },
        cashFor () { // 兑换座驾
            if (!this.times.canExchange) return
            if (!this.checkLogin()) return
            if (!this.hasASeries) return

            var ajax = service.cashFor()
            ajax && ajax.then(data => {
                if (data.errno === 0) {
                    [0, 1, 2, 3, 4].forEach(value => {
                        this.contribute.packages[value] -= 1
                    })
                    this.times.canExchange = false
                    this.toast('您已经成功兑换月满中秋座驾，快去背包查看吧！')
                } else {
                    console.log(data.msg)
                    this.toast(data.msg)
                }
            })
        },
        initList () { // 初始化列表加载
            var scrollBox = function (ele, cb, ctx) {
                var bh = 150
                var _self = ctx
                var scrollEle = ele

                scrollEle.addEventListener('scroll', function (e) {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH < bh) {
                        cb.call(_self)
                    }

                    return false
                }, false)
            }

            var preventBodyScroll = function (ele) {
                var scrollEle = ele
                scrollEle.addEventListener('touchstart', function (e) {
                    var top = scrollEle.scrollTop
                    var totolScroll = scrollEle.scrollHeight
                    var currentScroll = top + scrollEle.offsetHeight

                    if (top === 0) {
                        scrollEle.scrollTop = 1
                    } else if (currentScroll === totolScroll) {
                        scrollEle.scrollTop = top - 1
                    }
                })

                scrollEle.addEventListener('touchmove', function (e) {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH !== 0) {
                        e._isScroll = true
                    } else {
                        e._isScroll = false
                    }
                })
            }

            // 1. 主播榜单
            this.skeletonliStateZhubo = true
            this.getZhuboList()
            scrollBox(this.$refs.zhuboList, this.getZhuboList, this)

            // 2. 用户榜单
            this.skeletonliStateUser = true
            this.getUserList()
            scrollBox(this.$refs.userList, this.getUserList, this)

            // 3. 字块中心 -> 收到字块
            scrollBox(this.$refs.cardsTake, this.getCardsTakeList, this)

            // 4. 字块中心 -> 索要信息
            scrollBox(this.$refs.cardsAsk, this.getCardsAskList, this)

            // 5. 字块中心 -> 赠送记录
            scrollBox(this.$refs.cardsGive, this.getCardsPresentList, this)

            // 阻止弹窗的滚动
            preventBodyScroll(this.$refs.cardsTake)
            preventBodyScroll(this.$refs.cardsAsk)
            preventBodyScroll(this.$refs.cardsGive)
            preventBodyScroll(this.$refs.rules)
            // preventBodyScroll(this.$refs.modal)

            this.$refs.modal.addEventListener('touchmove', function (e) {
                if (e._isScroll === undefined) {
                    e._isScroll = false
                }
            })
        },
        getZhuboList () { // 获取主播榜单数据
            if (!this.zhuboList.hasNext) {
                console.log('主播榜单 - 没有下一页了')
                return
            }
            if (this.zhuboList.loading) {
                console.log('正在加载下一页 - 主播榜 - 请稍后')
                return
            }

            this.zhuboList.loading = true
            service.getZhuboList(this.zhuboList.currPage + 1, 15)
                .then(res => {
                    this.zhuboList.list = this.zhuboList.list.concat(res.data.data)

                    this.zhuboList.hasNext = res.data.hasNext
                    // if (res.data.data.length === 0) {
                    //     this.zhuboList.hasNext = false
                    // }

                    this.zhuboList.currPage += 1
                    this.zhuboList.loading = false

                    if (this.zhuboList.currPage === 1) {
                        this.skeletonliStateZhubo = false
                        this.zhuboMe = res.data.myRank
                    }
                })
        },
        getUserList () { // 获取用户榜单数据
            if (!this.userList.hasNext) {
                console.log('用户榜单 - 没有下一页了')
                return
            }
            if (this.userList.loading) {
                console.log('正在加载下一页 - 用户榜 - 请稍后')
                return
            }

            this.userList.loading = true
            service.getUserList(this.userList.currPage + 1, 15)
                .then(res => {
                    this.userList.list = this.userList.list.concat(res.data.data)

                    this.userList.hasNext = res.data.hasNext
                    // if (res.data.data.length === 0) {
                    //     this.userList.hasNext = false
                    // }

                    this.userList.currPage += 1
                    this.userList.loading = false

                    if (this.userList.currPage === 1) {
                        this.skeletonliStateUser = false
                        this.userMe = res.data.myRank
                    }
                })
        },
        getCardsTakeList () { // 获取字块中心 - 收到字块
            let take = this.cardsCenter.take
            if (take.currPage === 0 && take.hasNew) {
                this.getList(this.cardsCenter.take, 'getAcceptRecord', '收到字块').then(res => {
                    if (res.errno === 0) {
                        take.hasNew = false
                    }
                })
            } else {
                this.getList(this.cardsCenter.take, 'getAcceptRecord', '收到字块')
            }
        },
        getCardsAskList () { // 获取字块中心 - 索要信息
            let ask = this.cardsCenter.ask

            if (ask.currPage === 0 && ask.hasNew) {
                this.getList(this.cardsCenter.ask, 'getAskRecord', '索要信息').then(res => {
                    if (res.errno === 0) {
                        ask.hasNew = false
                    }
                })
            } else {
                this.getList(this.cardsCenter.ask, 'getAskRecord', '索要信息')
            }
        },
        getCardsPresentList () { // 获取字块中心 - 赠送记录
            this.getList(this.cardsCenter.give, 'getPresentRecord', '赠送记录')
        },
        getList (target, ajaxFn, info) { // 字块中心列表工厂函数
            if (!target.hasNext) {
                console.log(`${info} - 没有下一页了`)
                return
            }
            if (target.loading) {
                console.log(`正在加载下一页 - ${info} - 请稍后`)
                return
            }

            target.loading = true
            return service[ajaxFn](target.currPage + 1, 15)
                .then(res => {
                    target.list = target.list.concat(res.data)

                    if (res.data.length === 0) {
                        target.hasNext = false
                    }

                    target.currPage += 1
                    target.loading = false

                    return res
                })
        },
        refreshCardsGiveList () { // 刷新赠送记录
            this.cardsCenter.give.list = []
            this.cardsCenter.give.hasNext = true
            this.cardsCenter.give.currPage = 0
            this.cardsCenter.give.loading = false
        }
    }
})
