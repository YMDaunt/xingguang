'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import bodymovin from '../../component/bodymovin.min.js'
import '../../../css/activity/qixi/qixi.less'

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

var scrollBox = function initScroll (ele, cb, ctx) {
    var bh = 150
    var _self = ctx
    var scrollEle = ele

    scrollEle.addEventListener('scroll', function () {
        var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
        if (toBottomH < bh) {
            cb.call(_self)
        }
    }, false)
}

var YUELAO_GIFT_PRICE = 2999
var YUELAO_GIFT_PID = 560
var SVG_INS = null
var SVG_YUELAO_INS = null
var SVG_QUEQIAO_INS = null
var SVG_INS_TIMER = null

var SVG_YUELAO_PATH = '//static.guojiang.tv/app/gift/pc_animation/1022/data.json'
var SVG_QUEQIAO_PATH = '//static.guojiang.tv/app/gift/pc_animation/qixi_bless/data.json'

new Vue({
    el: '#app',
    data: {
        constVar: {
            activityStage: 0,
            userLogin: false
        },
        ui: {
            appLoaded: {
                opacity: 0
            },
            boardActiveNav: 'love', // 'love' 情投意合榜 'user' 用户榜 'hours' 小时榜
            usersActiveNav: 'contribute', // 'contribute' 二级贡献榜 'dao' 二级补刀榜
            toastRules: false,
            toastBuy: {
                show: false,
                input: '1'
            },
            toastYuE: {
                show: false
            },
            toastInfo: {
                show: false,
                info: '礼物已放至您的背包，请注意查收！'
            },
            hours: {
                default: '抢榜时段：10:00-24:00',
                isCurr: false,
                min: 59,
                sec: 59
            },
            svgShow: false,
            tooltips: false,
            toast: {
                show: false,
                info: ''
            }
        },
        boardLove: [],
        boardLoveMe: {
            rank: false,
            rankComment: '距离上榜还差0积分',
            score: 0,
            uid: '',
            headPic: '',
            nickName: '',
            level: 0,
            rid: 0,
            isPlaying: false
        },
        boardUser: {
            clicked: false,
            contribute: [],
            conHasNextPage: true,
            conCurrPage: 0,
            conLoad: false,
            dao: [],
            daoHasNext: true,
            daoCurrPage: 0,
            daoLoad: false,
            daoClicked: false
        },
        boardUserConMe: {
            rank: false,
            rankComment: '距离上榜还差0贡献值',
            score: 0,
            uid: '',
            headPic: '',
            nickName: ''
        },
        boardUserDaoMe: {
            rank: false,
            rankComment: '距离上榜还差0补刀数',
            score: 0,
            uid: '',
            headPic: '',
            nickName: ''
        },
        boardHoursTop1: {},
        boardHours: {
            list: [],
            hasNext: true,
            currPage: 0,
            load: false,
            clicked: false
        },
        boardHoursMe: {},
        payMoney: YUELAO_GIFT_PRICE,
        countTime: 0,
        countStartTagTime: null
    },
    computed: {
        boardUserMe: function () {
            if (this.ui.usersActiveNav === 'contribute') {
                return this.boardUserConMe
            } else {
                return this.boardUserDaoMe
            }
        },
        boardLoveTop10: function () {
            if (this.boardLove.length > 10) {
                return res.slice(0, 10)
            }
            var res = this.boardLove.slice(0)
            while (res.length < 10) {
                res.push({})
            }
            return res
        }
    },
    watch: {
        'ui.toastBuy.input': function (value) {
            value = +value
            if (Number.isNaN(value) || value === 0 || (value + '').indexOf('.') > -1 || value > 9999) {
                this.payMoney = '请输入正确的购买数量'
            } else {
                this.payMoney = value * YUELAO_GIFT_PRICE + '克拉'
            }
        }
    },
    mounted: function () {
        // pc / mobile 重定向
        this.adaptation()

        this.initPage()
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
        /** ***************** UI交互部分 S *******************/
        // 显示弹框状态
        toast (type, showOrHide) {
            if (!type) {
                return
            }
            var show
            if (showOrHide === undefined) {
                show = true
            } else {
                show = showOrHide
            }

            if (type === 'rules') {
                this.ui.toastRules = show
                return
            }

            if (type === 'buy') {
                if (this.constVar.activityStage === 0) {
                    this.timerToast('活动未开始！', 2000)
                    return
                }
                if (this.constVar.activityStage >= 3) {
                    this.timerToast('活动已结束！', 2000)
                    return
                }
                if (!this.constVar.userLogin) {
                    common.goLogin()
                    return
                }
                this.ui.toastBuy.input = '1'
                this.ui.toastBuy.show = show
                return
            }

            if (type === 'yue') {
                this.ui.toastYuE.show = show
                return
            }

            if (type === 'info') {
                this.ui.toastInfo.show = show
            }
        },
        // 菜单栏切换
        navigate (navname, type) {
            if (type === 1) {
                this.ui.boardActiveNav = navname
                if (navname === 'hours' && !this.boardHours.clicked) {
                    this.boardHours.clicked = true
                    this.renderHoursBoard()
                }
                if (navname === 'user' && !this.boardUser.clicked) {
                    this.boardUser.clicked = true
                    this.renderUserContBoard()
                }
                return
            }
            if (type === 2) {
                if (this.constVar.activityStage < 2) {
                    // 第一阶段
                    this.timerToast('该阶段还未开始哦！', 2000)
                    return
                }
                if (navname === 'dao' && !this.boardUser.daoClicked) {
                    this.boardUser.daoClicked = true
                    this.renderUserDaoBoard()
                }
                this.ui.usersActiveNav = navname
            }
        },
        // 主播房间跳转
        gotoRoom (rid) {
            rid && common.goRoom(rid)
        },
        // 跳转充值
        charge () {
            // window.open('//m.kuaishouvideo.com/recharge', '_blank');
            common.goRecharge()
        },
        // 验证当前的购买值
        toastBuy () {
            if (this.ui.toastBuy.input === '' || this.ui.toastBuy.input === 0 || this.ui.toastBuy.input > 9999) {

            } else {
                console.log('购买礼物 - 月老结缘')
                var paynum = +this.ui.toastBuy.input
                this.buyGifts(YUELAO_GIFT_PID, paynum)
            }
        },
        // 弹出信息框
        toastInfo (info) {
            this.ui.toastInfo.show = true
            this.ui.toastInfo.info = info || '礼物已放至您的背包，请注意查收！'
        },
        // 小时榜倒计时
        timeCount () {
            // 每日10:00-24:00 整点倒计时

            var now = Date.now()
            var deltaSecond = now - this.countStartTagTime // 过去了多少ms
            var nowTime = this.countTime + deltaSecond // 当前时间

            var currentD = new Date(nowTime)

            this.ui.hours.min = 59 - currentD.getMinutes()
            this.ui.hours.sec = 59 - currentD.getSeconds()

            if (currentD.getHours() === 0) {
                // 进入第二天
                this.ui.hours.isCurr = false
            } else {
                // 依旧是当前时间倒计时
                setTimeout(() => {
                    this.timeCount()
                }, 1000)
            }
        },
        // 预览动效
        preview (type) {
            // type === 'yuelao'
            // type === 'queqiao'
            if (SVG_INS) {
                return
            }
            var svgTimeout
            if (type === 'yuelao') {
                if (SVG_YUELAO_INS) {
                    SVG_YUELAO_INS.play()
                } else {
                    SVG_YUELAO_INS = playSvg(SVG_YUELAO_PATH)
                }

                SVG_INS = SVG_YUELAO_INS
                svgTimeout = 8000
            }

            if (type === 'queqiao') {
                if (SVG_QUEQIAO_INS) {
                    SVG_QUEQIAO_INS.play()
                } else {
                    SVG_QUEQIAO_INS = playSvg(SVG_QUEQIAO_PATH)
                }
                SVG_INS = SVG_QUEQIAO_INS
                svgTimeout = 6500
            }

            this.ui.svgShow = true
            // SVG_INS_TIMER = setTimeout(()=>{
            //     // SVG_INS.destroy();
            //     SVG_INS.stop();
            //     this.ui.svgShow = false;
            //     SVG_INS = null;
            //     SVG_INS_TIMER = null;
            // }, svgTimeout);
        },
        // 终止动效 隐藏layer
        stopSvg (evt) {
            // if (evt.srcElement.className !== 'svg-layer') {
            //     return ;
            // }
            this.ui.svgShow = false
            if (SVG_INS) {
                // clearTimeout(SVG_INS_TIMER);
                SVG_INS.stop()
                // SVG_INS.destroy();
                SVG_INS = null
                SVG_INS_TIMER = null
            }
        },
        // 过滤输入框
        buyInput (evt) {
            var value = evt.target.value
            if (value === '') {
                this.ui.toastBuy.input = ''
                evt.target.value = ''
                return
            }
            var num = value.replace(/[^0-9]+/g, '')
            num = +num
            if (num > 9999) {
                this.ui.toastBuy.input = 9999
                evt.target.value = 9999
                return
            }
            if (num < 0) {
                this.ui.toastBuy.input = 1
                evt.target.value = 1
                return
            }
            // return num;
            this.ui.toastBuy.input = num
            evt.target.value = num
        },
        timerToast (info, time) {
            this.ui.toast.info = info
            this.ui.toast.show = true
            setTimeout(() => {
                this.ui.toast.info = ''
                this.ui.toast.show = false
            }, time || 2000)
        },
        globalClick (evt) {
            if (this.ui.tooltips) {
                this.ui.tooltips = false
                return
            }
            if (evt.target.className === 'icon-tips') {
                this.ui.tooltips = true
            }
        },
        /** ***************** UI交互部分 E *******************/
        /** ***************** 业务逻辑部分 S *******************/
        // 初始化
        initPage () {
            // 1. 加载页面判断活动阶段
            this.initBasicInfo()

            // 2. 加载默认列表页信息
            this.renderLoveBoard()
        },
        // 加载用户登录及活动阶段信息
        initBasicInfo () {
            axios.get('/magpie/initInfo')
                .then(res => {
                    var response = res.data
                    if (response.errno === 0) {
                        this.constVar.userLogin = response.data.isLogin
                        this.constVar.activityStage = response.data.stage
                    }
                    this.ui.appLoaded.opacity = 1
                })
        },
        // 初始化情投意合榜
        renderLoveBoard () {
            // 1. 渲染情投意合榜
            axios.get('/magpie/getRank?type=love&pageNo=1&pageSize=10')
                .then(res => {
                    var response = res.data
                    if (response.errno === 0) {
                        // 1. 渲染情投意合榜 只渲染前十条
                        this.boardLove = this.boardLove.concat(response.data.data)

                        // 2. 渲染底部我的数据
                        this.boardLoveMe = response.data.myRank
                    }
                })
        },
        // 初始化用户榜
        renderUserContBoard () {
            function loadList (loadMe) {
                if (!this.boardUser.conHasNextPage) {
                    console.log('用户贡献榜 - 没有下一页了')
                    return
                }
                if (this.boardUser.conLoad) {
                    console.log('正在加载下一页 - 贡献榜 - 请稍后')
                    return
                }

                this.boardUser.conLoad = true
                axios.get('/magpie/getRank?type=user&pageNo=' + (this.boardUser.conCurrPage + 1) + '&pageSize=10')
                    .then(res => {
                        var response = res.data
                        if (response.errno === 0) {
                            // 1. 渲染用户贡献榜
                            this.boardUser.contribute = this.boardUser.contribute.concat(response.data.data)
                            this.boardUser.conHasNextPage = response.data.hasNext
                            this.boardUser.conCurrPage = +response.data.pageNo
                            this.boardUser.conLoad = false

                            // 2. 渲染底部我的数据
                            if (loadMe) {
                                this.boardUserConMe = response.data.myRank
                            }
                        }
                    })
            }

            // 1. 渲染用户贡献榜
            loadList.call(this, true)

            // 2. 并初始化滚动加载
            // scrollBox(this.$refs.sCon, loadList, this);
        },
        // 初始化用户补刀榜
        renderUserDaoBoard () {
            function loadList (loadMe) {
                if (!this.boardUser.daoHasNext) {
                    console.log('用户补刀榜 - 没有下一页了')
                    return
                }
                if (this.boardUser.daoLoad) {
                    console.log('正在加载下一页 - 补刀榜 - 请稍后')
                    return
                }

                this.boardUser.daoLoad = true
                axios.get('/magpie/getRank?type=budao&pageNo=' + (this.boardUser.daoCurrPage + 1) + '&pageSize=10')
                    .then(res => {
                        var response = res.data
                        if (response.errno === 0) {
                            // 1. 渲染用户贡献榜
                            this.boardUser.dao = this.boardUser.dao.concat(response.data.data)
                            this.boardUser.daoHasNext = response.data.hasNext
                            this.boardUser.daoCurrPage = +response.data.pageNo
                            this.boardUser.daoLoad = false

                            // 2. 渲染底部我的数据
                            if (loadMe) {
                                this.boardUserDaoMe = response.data.myRank
                            }
                        }
                    })
            }

            // 1. 渲染用户补刀榜
            loadList.call(this, true)

            // 2. 并初始化滚动加载
            // scrollBox(this.$refs.sBudao, loadList, this);
        },
        // 初始化小时榜
        renderHoursBoard () {
            function loadList (loadFirst) {
                if (!this.boardHours.hasNext) {
                    console.log('小时榜 - 没有下一页了')
                    return
                }
                if (this.boardHours.load) {
                    console.log('正在加载下一页 - 小时榜 - 请稍后')
                    return
                }

                this.boardHours.load = true
                axios.get('/magpie/getRank?type=hour&pageNo=' + (this.boardHours.currPage + 1) + '&pageSize=15')
                    .then(res => {
                        var response = res.data
                        if (response.errno === 0) {
                            // 1. 渲染小时榜
                            this.boardHours.list = this.boardHours.list.concat(response.data.data)
                            this.boardHours.hasNext = response.data.hasNext
                            this.boardHours.currPage = +response.data.page
                            this.boardHours.load = false

                            if (loadFirst) {
                                // 1.1 渲染倒计时
                                if (response.data.time !== false) {
                                    this.ui.hours.isCurr = true

                                    this.countTime = response.data.time * 1000
                                    this.countStartTagTime = Date.now()

                                    this.timeCount()
                                } else {
                                    this.ui.hours.isCurr = false
                                }

                                // 2. 渲染底部我的数据
                                this.boardHoursMe = response.data.myRank

                                // 3. 渲染top1信息
                                this.boardHoursTop1 = response.data.top
                            }
                        }
                    })
            }

            // 1. 渲染小时榜单
            loadList.call(this, true)

            // 2. 并初始化滚动加载
            scrollBox(this.$refs.hours, loadList, this)
        },
        // 购买礼物
        buyGifts (pid, num) {
            // 购买礼物
            axios.get('/magpie/buyProduct?pid=' + pid + '&num=' + num)
                .then(res => {
                    var response = res.data
                    this.toast('buy', false)
                    if (response.errno === 0) {
                        this.toastInfo()
                    } else {
                        this.toastInfo(response.msg)
                    }
                })
        }
        /** ***************** 业务逻辑部分 E *******************/
    }
})
