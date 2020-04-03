'use strict'

import axios from 'axios'
import Loading from './components/Loading.vue'
import bodymovin from '../component/bodymovin.min.js'

let con = {
    toastTimer: null,
    toastDuration: 3000,
    svgIns: null,
    svgAniIns: null,
    svgAniPath: '//static.guojiang.tv/app/gift/pc_animation/4947/data.json'
}

var playSvg = function (path, type) {
    var svgContainer = document.querySelector('.svg-container')
    return bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: type || 'html',
        loop: true,
        autoplay: false,
        path: path
    })
}

let service = {
    apiHandler: function (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error('[service.apiHandler]:', res.message)
            throw new Error(res.message)
        }
    },
    dataHandler: function (data) {
        if (data.errno === 0) {
            return data.data
        } else {
            console.error('[service.dataHandler]:', data.msg)
            throw new Error(data.msg)
        }
    },
    // 购买
    buyGifts: function (gnum) {
        return axios.get('/fool/buyProduct', {
            params: {
                pid: 1994,
                num: gnum
            }
        }).then(this.apiHandler)
    },
    // 关注主播
    attend (id) {
        return axios.get('/chenChen/attention', {
            params: {
                mid: id
            }
        }).then(this.apiHandler)
    },
    // init - 初始化页面数据
    init () {
        return axios.get('/fool/init').then(this.apiHandler).then(this.dataHandler)
    },
    // 获取榜单数据
    getRanks (type, pageNo) {
        return axios.get('/fool/ranks', {
            params: {
                type,
                pageNo,
                pageSize: 15
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 获取用户top3数据
    getTopUser () {
        return axios.get('/fool/trickRanks').then(this.apiHandler).then(this.dataHandler)
    },
    // 抽奖
    drawLottery () {
        return axios.get('/fool/goLottery').then(this.apiHandler)
    }
}

let DecoBox = {
    name: 'DecoBox',
    template: document.querySelector('#deco-box')
}

let MyTable = {
    name: 'MyTable',
    template: document.querySelector('#cus-table'),
    props: {
        source: {
            type: Object,
            required: true
        }
    },
    data () {
        return { }
    },
    computed: {
        th () {
            return this.source.th
        },
        tdata () {
            return this.source.tdata
        }
    }
}

let commonMixins = {
    components: {
        'deco-box': DecoBox,
        'my-table': MyTable,
        'scroller': {
            template: `<div><slot/></div>`
        },
        Loading
    },
    filters: {
        calcRankComment (topMeCenter) {
            if (!topMeCenter || !topMeCenter.pairInfos) return ''

            if (topMeCenter.pairInfos[0].value === '未上榜') {
                return `距离登上整蛊大神还差${topMeCenter.pairInfos[2].value}个`
            } else {
                return `距离被超越还差${topMeCenter.pairInfos[3].value}个`
            }
        }
    },
    data: {
        currStage: 1, // 0 -> before start 1 -> running 2 -> finished
        isModRank: 0, // 0 -> mod 1 -> user
        isLogin: true, // 是否登录

        inLottoryStage: false,
        canDraw: false,
        drawTime: 0,
        drawing: false,

        currRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            type: 'mod',
            inited: false,
            meCenter: null
        },
        topUser: [],
        topMeCenter: null,

        prizePool: [{}, {}, {}, {}, {}, {}],

        svgShow: false,
        ruleState: false,
        purchaseState: false,
        rechargeState: false,
        toastState: false,
        toastMsg: '',

        formBuyNum: 1,
        formBuyPrice: 6666,
        perPrice: 6666
    },
    computed: {
        drawBtnShow () {
            return this.isLogin && this.canDraw
        },
        drawBtnClass () {
            if (!this.drawBtnShow) { // 没有抽奖资格
                return ''
            }

            // 抽奖次数为0 或者 已经过了抽奖阶段
            if (this.drawTime === 0 || !this.inLottoryStage) {
                return 'btn-draw-dis'
            }

            // 正在抽奖
            if (this.drawing) {
                return 'btn-draw-loading'
            }

            return 'btn-draw'
        },
        levelPerfix () {
            return this.isModRank === 0 ? 'm_level_icon_' : 'u_level_icon_'
        }
    },
    mounted () {
        this.initPage()
        this.initScroll()
        this.loadRank()
        this.initToper()
    },
    methods: {
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        /* 点击预览 */
        preview () {
            if (con.svgAniIns) {
                con.svgAniIns.play()
            } else {
                con.svgAniIns = playSvg(con.svgAniPath)

                con.svgAniIns.play()
            }

            con.svgIns = con.svgAniIns

            this.svgShow = true
        },
        stopSvg () {
            this.svgShow = false
            if (con.svgIns) {
                con.svgIns.stop()
                con.svgIns = null
            }
        },
        // toast
        showToast (msg) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toastState = true
            this.toastMsg = msg

            con.toastTimer = setTimeout(() => {
                this.toastState = false
                this.toastMsg = ''
            }, con.toastDuration)
        },
        hideToast () {
            clearTimeout(con.toastTimer)
            this.toastState = false
            this.toastMsg = ''
        },
        captureLayer (evt) {
            if (evt.target.className.indexOf('layer-rules') > -1) {
                this.toggleRule()
            }
        },
        toggleRule () {
            this.ruleState = !this.ruleState

            if (this.ruleState && !this.pcRankRefresh) {
                this.$nextTick(() => {
                    this.$refs['rules-scroller'].$el.scrollTop = 0
                })
            }
        },
        togglePurchase () {
            // 判断登录
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            // 点击购买 -> 判断时间
            if (!this.purchaseState) {
                if (this.currStage === 0) { // 活动未开始
                    this.showToast('3.29 12:00才可购买！')
                    return
                }

                if (this.currStage === 2) { // 活动已结束
                    return
                }
            }

            this.purchaseState = !this.purchaseState

            // 重置购买数据
            if (this.purchaseState) {
                this.formBuyNum = 1
                this.formBuyPrice = 6666
            }
        },
        toggleRecharge () {
            this.rechargeState = !this.rechargeState
        },
        /* input filter 0 - 9999 */
        _inputFilter (value) {
            if (value === '') {
                return 0
            }

            value = +value.replace(/[^0-9]+/g, '')

            if (value > 9999) {
                value = 9999
            }
            if (value <= 0) {
                value = 0
            }

            return value
        },
        // 加减购买数量
        calcBuyNum (num) {
            if (typeof num !== 'number') return

            var output = this.formBuyNum + num

            if (output > 9999) {
                output = 9999
            }

            if (output < 0) {
                output = 0
            }

            this.formBuyNum = output
            this.formBuyPrice = output * this.perPrice
        },
        inputFocus (evt) {
            evt.target.focus()
        },
        /* form input */
        buyInput (evt) {
            var price = this.perPrice
            var value = this._inputFilter(evt.target.value)

            evt.target.value = value
            this.formBuyNum = value
            this.formBuyPrice = value * price
        },
        /* 榜单切换 */
        changeRanks (type) {
            if (type === this.isModRank) return
            this.isModRank = type
            this.refreshRank()
        },
        // 前往购买
        goBuy () {
            // console.log('[buyGifts] : ', [this.formBuyNum, this.formBuyPrice])
            service.buyGifts(this.formBuyNum).then(res => {
                this.togglePurchase()
                if (res.errno === 0) {
                    this.showToast('礼物已放至您的背包，请注意查收！')
                    if (this.refreshBackpack) this.refreshBackpack() // 刷新礼物背包
                } else {
                    if (res.msg === '余额不足，请充值再来！' || res.errno === 111) {
                        this.toggleRecharge()
                    } else {
                        this.showToast(res.msg)
                    }
                }
            })
        },
        // 初始化页面数据
        initPage () {
            service.init().then(res => {
                this.isLogin = res.isLogin
                this.currStage = res.isActivity
                this.inLottoryStage = res.prize
                this.canDraw = res.canLoterry
                this.drawTime = res.lotteryNum

                this.prizePool = res.prizePool
            })
        },
        // 抽奖动画
        runDrawAni (ipos, callback) {
            var si = 0
            var slast = 0
            var slen = 6

            var sj = 0
            var sstep = 6 * 5 + ipos
            var _this = this

            _this.drawing = true

            var calcSpeed = function (s) {
                return Math.pow(s - sstep / 2, 2) * 1 + 100
            }

            var drawAni = function () {
                _this.$refs['lottery-i-' + slast][0].className = 'fl-box lottery-i'
                _this.$refs['lottery-i-' + si][0].className = 'fl-box lottery-i active'

                sj++
                slast = si
                if (si < slen - 1) {
                    si++
                } else {
                    si = 0
                }

                if (sj < sstep) {
                    // console.log('speed -> ', calcSpeed(sj))
                    setTimeout(drawAni, calcSpeed(sj))
                } else {
                    _this.drawing = false
                    callback()
                }
            }

            for (var i = 0; i < 6; i++) {
                this.$refs['lottery-i-' + i][0].className = 'fl-box lottery-i'
            }

            drawAni()
        },
        // 抽奖
        draw () {
            if (this.isLogin && this.inLottoryStage && this.canDraw && this.drawTime > 0 && !this.drawing) {
                service.drawLottery().then(data => {
                    if (data.errno === 0) {
                        var index = 1
                        var prizeName = data.msg.slice(0, -17).slice(5)
                        for (var i = 0, len = this.prizePool.length; i < len; i++) {
                            if (prizeName === this.prizePool[i].name) {
                                index = i + 1
                                break
                            }
                        }
                        this.drawTime = data.data.lotteryNum

                        this.runDrawAni(index, () => {
                            this.showToast(`恭喜您抽中${prizeName}，礼物已放至您的背包，请注意查收！`)
                        })
                    } else {
                        this.showToast(data.msg)
                    }
                })
            }
        },
        // 滚动加载
        initScroll () {
            var scrollBox = function (ele, cb, ctx) {
                var bh = 150
                var _self = ctx
                var scrollEle = ele

                scrollEle.addEventListener('scroll', function () {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH < bh) {
                        cb.call(_self)
                    }
                }, {
                    passive: true,
                    capture: false
                })
            }

            console.log('** init scroller loader **')
            scrollBox(this.$refs['rank-scroller'].$el, () => {
                this.loadRank()
            }, this)
        },
        // 加载榜单
        loadRank () {
            // if (this.currStage <= 0) return Promise.resolve({})

            var source = this.currRank
            if (!source.hasNext) {
                console.log(`[loading]: 没有更多数据...`)
                return Promise.resolve({})
            }
            if (source.loading) {
                console.log(`[load]: loading 正在加载中... 请稍后`)
                return Promise.resolve({})
            }

            source.loading = true

            return service.getRanks(source.type, source.currPage + 1).then(data => {
                var list
                if (source.inited) {
                    list = source.list.concat(data.data)
                } else {
                    list = data.data
                }
                source.hasNext = data.hasNext

                if (list.length > 100) {
                    list = list.slice(0, 100)
                    source.hasNext = false
                }

                source.list = list
                source.currPage += 1
                source.loading = false

                if (!source.inited) {
                    source.inited = true
                    source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
                }
            })
        },
        // 刷洗榜单
        refreshRank () {
            var type = ''
            if (this.isModRank === 0) {
                type = 'mod'
            } else {
                type = 'user'
            }

            this.currRank.hasNext = true
            this.currRank.loading = false
            this.currRank.currPage = 0
            this.currRank.type = type
            this.currRank.inited = false
            this.currRank.meCenter = null

            if (this.pcRankRefresh) {
                this.pcRankRefresh()
            } else {
                this.$refs['rank-scroller'].$el.scrollTop = 0
            }

            this.showLoading()
            this.loadRank().then(() => {
                this.hideLoading()
            })
        },
        // 关注
        payAttention (mod, index) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            service.attend(mod.id || mod.mid).then(data => {
                if (data.errno === 0) {
                    // this.currRank.list[index].isLoved
                    mod.isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            })
        },
        // 初始化整蛊大神数据
        initToper () {
            service.getTopUser().then(data => {
                this.topUser = data.data.slice(0, 3)
                this.topMeCenter = data.myRank && data.myRank.uid && data.myRank.nickName ? data.myRank : null
            })
        }
    }
}

export default commonMixins
