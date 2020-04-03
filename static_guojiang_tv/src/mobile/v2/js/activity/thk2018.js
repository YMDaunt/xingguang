'use strict'

import Vue from 'vue'
import bodymovin from '../component/bodymovin.min.js'
import axios from 'axios'
import { goRoom, goLogin, goRecharge } from 'common'

import '../../css/activity/thk2018.less'

// IE Array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this)

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function')
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1]

            // 5. Let k be 0.
            var k = 0

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k]
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue
                }
                // e. Increase k by 1.
                k++
            }

            // 7. Return undefined.
            return undefined
        }
    })
}

(function adaptation () {
    let href = window.location
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
        if (href.host.indexOf('www') >= 0) {
            window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
        }
    } else {
        if (href.host.indexOf('www') < 0) {
            window.location.href = 'https://www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
        }
    }
}())

// 组件 - 夺宝礼物
var treaItem = {
    name: 'trea-item',
    template: document.getElementById('com-trea-item').innerText,
    props: ['source', 'showTimer', 'astatus'],
    methods: {
        trigger (name, args) {
            this.$parent[name](args)
        },
        timerCounter (time) { // 刷新时间
            this.$refs.timer && (this.$refs.timer.innerText = time)
        }
    }
}

// 组件 - 数据表
var listTable = {
    name: 'list-table',
    template: document.getElementById('com-list-table').innerText,
    props: ['source', 'placeholder']
}

// 组件 - 榜单前三名
var rankTop3 = {
    name: 'rank-top3',
    template: document.getElementById('com-rank-top3').innerText,
    props: ['type', 'source'],
    methods: {
        trigger (name, args) {
            this.$parent[name](args)
        }
    }
}

// 组件 - 榜单表
var rankList = {
    name: 'rank-list',
    template: document.getElementById('com-rank-list').innerText,
    props: ['type', 'source'],
    methods: {
        trigger (name, args) {
            this.$parent[name](args)
        }
    }
}

// 组件 - 榜单个人数据栏
var rankMecenter = {
    name: 'rank-mecenter',
    template: document.getElementById('com-rank-mecenter').innerText,
    props: ['type', 'source'],
    methods: {
        trigger (name, args) {
            this.$parent[name](args)
        }
    }
}

// 组件 - 成就表格
var achieveTable = {
    name: 'achieveTable',
    template: document.getElementById('com-achieve').innerText
}

// 全局变量及函数
var con = {
    thkStartTime: 0,
    thkTimer: null,
    svgAniIns: {},
    currSvgAniIns: null,
    playSvg: function (path) {
        var svgContainer = document.querySelector('.svg-container')
        return bodymovin.loadAnimation({
            wrapper: svgContainer,
            animType: 'html',
            loop: true,
            autoplay: true,
            path: path
        })
    },
    timeCounter: null,
    fiveMins: 5 * 60 * 1000, // 5分钟 刷新
    fiveMinsFreshed: false, // 5分钟 刷新标志
    sevenFMins: 7.5 * 60 * 1000, // 7.5分钟 刷新
    sevenFMinsFreshed: false, // 7.5分钟 刷新标志
    lastStageCounter: null,
    refreshTime: 0
}

// service
var service = {
    apiHandler (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error(res.msg)
            throw new Error(res.msg)
        }
    },
    _defaultFilter (data) {
        if (data.errno !== 0) {
            console.error(data.msg)
            throw new Error(data.msg)
        }

        return data.data
    },
    // 广播消息
    getBroadcast () {
        return axios.get('/ThanksActivity/Broadcast')
            .then(this.apiHandler)
            .then(this._defaultFilter)
    },
    // 初始化
    getInitData () {
        return axios.get('/ThanksActivity/initInfo')
            .then(this.apiHandler)
            .then(this._defaultFilter)
    },
    // 主播用户榜单
    getRanks (type, page) {
        return axios.get('/ThanksActivity/getRanks', {
            params: {
                type: type,
                pageNo: page,
                pageSize: 15
            }
        }).then(this.apiHandler).then(this._defaultFilter)
    },
    // 感恩榜
    getThkRanks () {
        return axios.get('/ThanksActivity/heart')
            .then(this.apiHandler)
            .then(this._defaultFilter)
    },
    // 感恩榜历史top1
    getThkTop1History (day, page) {
        return axios.get('/ThanksActivity/history', {
            params: {
                // day: day,
                pageNo: page,
                pageSize: 15
            }
        }).then(this.apiHandler).then(this._defaultFilter)
    },
    // 我的成就
    getMyTitle () {
        return axios.get('/ThanksActivity/myTitle')
            .then(this.apiHandler)
    },
    // 主播关注
    attention (mid) {
        return axios.get('/ChenChen/attention', {
            params: {
                mid: mid
            }
        }).then(this.apiHandler)
    },
    // 购买
    buyGift (pid, pnum) {
        return axios.get('/ThanksActivity/buy', {
            params: {
                productId: pid,
                num: pnum
            }
        }).then(this.apiHandler)
    },
    // 所有中奖记录
    getRecords (type, page) {
        var URLs = {
            'opened': '/ThanksActivity/AwardList',
            'won': '/ThanksActivity/MyAwardList',
            'takein': '/ThanksActivity/MyPurchaseList'
        }
        return axios.get(URLs[type], {
            params: {
                pageNo: page,
                pageSize: 15
            }
        }).then(this.apiHandler).then(this._defaultFilter)
    }
}

/**
 * @class TickTock
 * @desc js定时器
 * @description 指定开始时间-结束时间 区间内进行倒计时 指定时间点运行,每秒运行,结束运行
 */
class TickTock {
    /**
     * @constructor
     * @param {string} name 定时器标识名称
     * @param {string} type 运行类型: ['timer', 'counter'] timer定时器 counter倒计时器
     */
    constructor (name, type) {
        this._name = name || ''
        this._type = type || 'timer'
        this._timer = null

        this._evts = {
            'tick': [],
            'timer': [],
            'end': []
        }
    }

    /**
     * @public
     * @method start
     * @param {string} sTime 开始时间 _服务器时间
     * @param {string} eTime 结束时间
     * @desc 开始运行定时器
     */
    start (sTime, eTime) {
        if (this._type !== 'timer') {
            console.log('[Your TimeCounter is NOT timer]:', this._type)
            return
        }

        this._sTime = typeof sTime === 'string' ? new Date(sTime.replace(/-/g, '/')).getTime() : sTime
        this._eTime = typeof eTime === 'string' ? new Date(eTime.replace(/-/g, '/')).getTime() : eTime

        this._startTime = Date.now()

        // 清除所有过期的time
        let timers = this._evts['timer']

        let nextTimers = []
        for (let i = 0; i < timers.length; i++) {
            if (timers[i].time > this._sTime) {
                nextTimers.push(timers[i])
            }
        }
        this._evts['timer'] = nextTimers

        console.log('[Debug: StartTimer]:', this._name)
        this._run()
    }

    /**
     * @private
     * @method _run
     * @desc 开始运行 主逻辑
     */
    _run () {
        let now = Date.now()
        let passed = now - this._startTime
        let serverNow = this._sTime + passed // 与指定时间保持同步 (原因:本地时间与服务器时间存在差值)
        let lefted = this._eTime - serverNow

        let data = {
            now: serverNow,
            lefted: lefted
        }

        if (lefted <= 0) {
            // 结束触发
            this._trigger('end', data)
            // 清零
            this.stop()
        } else {
            // 到点触发
            this._checkHandler(data)

            // 每秒触发
            this._trigger('tick', data)

            // 继续倒计时
            this._timer = setTimeout(this._run.bind(this), 1000)
        }
    }

    /**
     * @private
     * @method _checkHandler
     * @param {*} data
     * @desc 到点触发器
     */
    _checkHandler (data) {
        let timers = this._evts['timer']
        if (timers.length === 0) return

        let nextTimers = []
        for (let i = 0; i < timers.length; i++) {
            let currTimer = timers[i]

            if (currTimer.time <= data.now) {
                currTimer.fn.call(currTimer.ctx, data)
            } else {
                nextTimers.push(currTimer)
            }
        }

        this._evts['timer'] = nextTimers
    }

    /**
     * @private
     * @method _trigger
     * @param {string} evtType
     * @param {object} data
     * @desc 触发对应的handler
     */
    _trigger (evtType, data) {
        let handlers = this._evts[evtType]
        if (!handlers && handlers.length === 0) return

        handlers.forEach(h => {
            h.fn.call(h.ctx, data)
        })
    }

    /**
     * @private
     * @method _register
     * @param {string} evtType
     * @param {func} fn
     * @param {ctx} ctx
     * @return {string} handlerId
     */
    _register (evtType, fn, ctx) {
        let handlerId = evtType + '_' + Date.now()
        this._evts[evtType].push({
            name: handlerId,
            fn: fn,
            ctx: ctx
        })
        return handlerId
    }

    /**
     * @public
     * @method stop
     * @desc 停止定时器
     */
    stop () {
        console.log('[Debug: StopTimer]:', this._name)
        this._timer && clearTimeout(this._timer)
        this._timer = null
    }

    /**
     * @public
     * @method stopTick
     * @desc 移除tick监听
     */
    stopTick () {
        if (this._evts['tick'].length > 0) {
            this._evts['tick'] = []
        }
    }

    /**
     * @public
     * @method count
     * @param {number} seconds
     * @desc 运行倒计时
     */
    count (seconds) {
        if (this._type !== 'counter') {
            console.log('[Your TimeCounter is NOT counter]:', this._type)
            return
        }

        let now = Date.now()
        this._sTime = now
        this._eTime = now + (seconds * 1000)

        this._startTime = now

        console.log('[Debug: StartTimer]:', this._name)
        this._run()
    }

    /**
     * @public
     * @method whenTick
     * @param {func} fn
     * @param {obj} ctx
     * @return {string} handlerId
     * @desc 注册tick事件
     */
    whenTick (fn, ctx) {
        return this._register('tick', fn, ctx)
    }

    /**
     * @public
     * @method whenEnd
     * @param {func} fn
     * @param {obj} ctx
     * @desc 注册tick事件
     * @return {string} handlerId
     */
    whenEnd (fn, ctx) {
        return this._register('end', fn, ctx)
    }

    /**
     * @public
     * @method when
     * @param {string} time
     * @param {func} fn
     * @param {obj} ctx
     * @desc 倒计时剩余时间为time时 有且只触发一次 -> 如果7min注册一次, 5min注册一次, 开始倒计时为4min则只会触发5min, 就近原则
     * @return {string} handlerId
     */
    when (time, fn, ctx) {
        let handlerId = 'timer_' + Date.now()
        this._evts['timer'].push({
            time: typeof time === 'string' ? new Date(time.replace(/-/g, '/')).getTime() : time,
            name: handlerId,
            fn: fn,
            ctx: ctx
        })
        return handlerId
    }
}

// 数据逻辑
var logicMixin = {
    data: {
        // 广播消息
        bdMsgs: [],
        // 我的成就
        achieves: [],
        // 普通夺宝礼物
        gifts: [],
        // 限定夺宝礼物
        mgifts: [],
        // 夺宝记录
        records: {
            opened: {
                name: 'opened',
                table: [
                    { name: '昵称', key: 'nickname' },
                    { name: '奖励', key: 'prize_desc' },
                    { name: '期数', key: 'stage' },
                    { name: '中奖号码', key: 'lottery_number' }
                ],
                list: [],
                isInited: false,
                isLoading: false,
                hasNext: true,
                currPage: 0
            },
            won: {
                name: 'won',
                table: [
                    { name: '期数', key: 'stage' },
                    { name: '参与份数', key: 'numbers' },
                    { name: '中奖号码', key: 'lottery_number' },
                    { name: '奖励', key: 'prize_desc' }
                ],
                list: [],
                isInited: false,
                isLoading: false,
                hasNext: true,
                currPage: 0
            },
            takein: {
                name: 'takein',
                table: [
                    { name: '期数', key: 'stage' },
                    { name: '宝贝', key: 'prize_desc' },
                    { name: '参与份数', key: 'numbers' },
                    { name: '幸运号码', key: 'lottery_desc' },
                    { name: '购买时间', key: 'purchase_time' },
                    { name: '是否中奖', key: 'status_desc' }
                ],
                list: [],
                isInited: false,
                isLoading: false,
                hasNext: true,
                currPage: 0
            }
        },
        // 感恩榜
        listThk: {
            isInited: false,
            top1: null,
            top1Score: 0,
            timecount: 0,
            meCenter: null
        },
        // 感恩历史top1
        listTop1list: {
            list: [],
            isInited: false,
            isLoading: false,
            hasNext: true,
            currPage: 0
        },
        // 主播榜
        listMod: {
            type: 'mod',
            list: [],
            isInited: false,
            isLoading: false,
            hasNext: true,
            currPage: 0,
            meCenter: null
        },
        // 用户榜
        listUser: {
            type: 'user',
            list: [],
            isInited: false,
            isLoading: false,
            hasNext: true,
            currPage: 0,
            meCenter: null
        }
    },
    mounted () {
        this.initInfo()
        this.initBroadcast()
        // this.loadMyAchieve()
    },
    methods: {
        // 页面初始化 (包括夺宝礼物的信息)
        initInfo () {
            service.getInitData().then(data => {
                this.page.islogin = data.isLogin
                this.page.activityStatus = data.activityStatus
                this.page.activityDay = data.day
                this.page.date = data.date

                this.gifts = data.normal
                this.mgifts = data.advance
                this.page.currTime = data.now

                this.page.currVol = data.normal[0] && data.normal[0].stage

                this.gifts[0] && (this.gifts[0].badge = 'new')
                this.gifts[1] && (this.gifts[1].badge = 'hot')
                this.gifts[2] && (this.gifts[2].badge = 'hot')

                this._startTic()
            })
        },
        _startTic () { // currTime, nextTime, lastStageNT
            var currTime = this.page.currTime
            var nextTime = this.gifts[0].nextStageTime
            var lastStageNT = this.mgifts[0].nextStageTime

            nextTime = new Date(nextTime.replace(/-/g, '/')).getTime()
            var sTime = new Date(currTime.replace(/-/g, '/'))
            currTime = sTime.getTime()

            con.timeCounter && con.timeCounter.stop()
            this.page.lastStage = false
            con.lastStageCounter && con.lastStageCounter.stop()

            if (this.page.activityStatus === 1 && this.gifts[0]) {
                // 活动在有效期间内
                var timeCounter = new TickTock('counter normal', 'timer')

                timeCounter.whenTick(this.ticktock)
                // 7.5min
                timeCounter.when(nextTime - con.sevenFMins, this.refresh7, this)
                // 5min
                timeCounter.when(nextTime - con.fiveMins, this.refresh5, this)

                timeCounter.whenEnd(this.ticRefreshEnd, this)

                timeCounter.start(currTime, nextTime)
                con.timeCounter = timeCounter

                // 活动处于最后一天 && 最后一个阶段时
                var currDay = this.page.currTime.split(' ')[0]
                var mgiftNSDay = this.mgifts[0] && this.mgifts[0].nextStageTime.split(' ')[0]
                if (currDay === mgiftNSDay && sTime.getHours() >= 20) {
                    this.page.lastStage = true

                    var lTime = new Date(lastStageNT.replace(/-/g, '/')).getTime()

                    con.lastStageCounter = new TickTock('counter advance', 'timer')

                    con.lastStageCounter.whenTick(this.ticktockBig, this)
                    con.lastStageCounter.when(nextTime - con.fiveMins, this.refresh5Big, this)
                    con.lastStageCounter.whenEnd(this.ticRefreshEnd, this)

                    con.lastStageCounter.start(currTime, lTime)
                }

                if (currDay === mgiftNSDay && sTime.getHours() >= 23) {
                    this.page.lastStageForNS = true
                }
            }
        },
        _formatDate (seconds) {
            var s = seconds % 60 // 秒
            var m = (seconds % 3600) / 60 >> 0 // 分钟
            var h = seconds / 3600 >> 0 // 小时
            return [h < 10 ? '0' + h : h, '小时', m < 10 ? '0' + m : m, '分', s < 10 ? '0' + s : s, '秒'].join('')
        },
        ticktock (timeData) { // 每秒刷新数据 直到五分钟的时候 (普通夺宝)
            var formatTime = this._formatDate((timeData.lefted - con.fiveMins) / 1000 >> 0)

            this.$refs.treas && this.$refs.treas.forEach(trea => {
                trea.timerCounter(formatTime)
            })
        },
        refresh7 (timeData) { // 七分半时数据刷新
            if (!con.sevenFMinsFreshed) {
                con.sevenFMinsFreshed = true
                this.refreshAll()
            }
        },
        refresh5 (timeData) { // 五分钟数据刷新
            if (!con.fiveMinsFreshed) {
                con.timeCounter.stopTick() // 移除倒计时效果
                con.fiveMinsFreshed = true

                if (this.page.lastStage) { // 最后一个阶段
                    this.mgifts.forEach(trea => {
                        trea.status = '2' // 已退款
                    })
                    setTimeout(() => {
                        this.refreshAll()
                    }, 30 * 1000) // 延后30s强制刷新 4min30s
                } else { // 普通阶段
                    this.refreshAll()
                }
            }
        },
        ticktockBig (timeData) {
            var formatTime = this._formatDate((timeData.lefted - con.fiveMins) / 1000 >> 0)

            this.$refs.treasM && this.$refs.treasM.forEach(trea => {
                trea.timerCounter(formatTime)
            })
        },
        refresh5Big () { // 由于最有一个阶段的最后几分钟 数据刷新 普通和高级夺宝礼物为同一组数据 不需要重复刷新
            con.lastStageCounter.stopTick()
        },
        ticRefreshEnd () { // 阶段结束时的刷新
            console.log('End of the time')

            con.fiveMinsFreshed = false
            con.sevenFMinsFreshed = false

            setTimeout(() => {
                this.refreshAll()
            }, 1000) // 1s后刷新列表
        },
        refreshAll () { // 阶段结束 到达下一个阶段的开始时间 -> 刷新数据 (init )
            console.log('[fresh all gift data]')

            // 这边添加一个刷新时间 如果刷新的太快则停止
            var now = Date.now()
            if (now - con.refreshTime < 10000) { // 10s
                console.log('[WARN]: CountTimer RreshAll 异常')
                return
            }
            con.refreshTime = now

            // 1. initInfo 重新加载页面夺宝礼物数据
            this.initInfo()
            // 2. 重置纪录榜单数据 并 初始化加载
            this.refreshRecords()
        },
        refreshRecords (type) {
            var typeMap = ['opened', 'won', 'takein']

            var reset = (t) => {
                if (!this.records[t]) return
                this.records[t].isInited = false
                this.records[t].currPage = 0
                this.records[t].hasNext = true
                this.records[t].list = []
            }

            if (!type) {
                typeMap.forEach(value => {
                    reset(value)
                })
            } else {
                reset(type)
            }

            this.checkRecordsList()
        },
        // 加载广播消息
        initBroadcast () {
            service.getBroadcast().then(data => {
                this.bdMsgs = data
                this.runMsg()
            })
        },
        // 我的成就
        loadMyAchieve () {
            // if (this.achievesInited) return
            service.getMyTitle().then(res => {
                if (res.errno !== 0) {
                    this.toast(res.msg)
                    return
                }
                var data = res.data
                var map = {
                    'hjlr': { className: 'hunter', i: 0 },
                    'hjzb': { className: 'king', i: 1 },
                    'hjslz': { className: 'killer', i: 2 },
                    'hjzjz': { className: 'ender', i: 3 },
                    'hjdmg': { className: 'all', i: 4 }
                }

                var target = data.user.map(item => {
                    var value = map[item.name]
                    item.classType = value.className
                    return item
                })
                this.achieves = target

                // this.achievesInited = true
            })
        },
        // 榜单加载器
        _loadRanks (source, serviceName, serviceArgs, callback) {
            if (!source) return

            if (source.isLoading) {
                console.log(`[${serviceName}][args: ${serviceArgs}] isloading...`)
                return
            }

            if (!source.hasNext) {
                console.log(`[${serviceName}][args: ${serviceArgs}] have no more data!`)
                return
            }

            source.isLoading = true
            service[serviceName](serviceArgs, ++source.currPage)
                .then(data => {
                    if (data.result) {
                        data = data.result // 兼容开奖记录列表返回的数据结构
                    }

                    source.list.push(...data.data)
                    source.hasNext = data.hasNext
                    source.isLoading = false
                    source.isInited = true

                    return data
                })
                .then(callback)
        },
        // 主播榜单
        loadModRanks () {
            this._loadRanks(this.listMod, 'getRanks', this.listMod.type, this.listMod.currPage === 0 && ((data) => {
                this.listMod.meCenter = data.myRank
            }))
        },
        // 用户榜单
        loadUserRanks () {
            this._loadRanks(this.listUser, 'getRanks', this.listUser.type, this.listUser.currPage === 0 && ((data) => {
                this.listUser.meCenter = data.myRank
            }))
        },
        // 感恩榜
        loadThkRanks () {
            service.getThkRanks().then(data => {
                this.listThk.timecount = data.time

                // 开始榜单倒计时
                this.thkTimer()

                if (data.data) {
                    this.listThk.top1 = data.data
                    this.listThk.top1Score = data.data.score
                } else {
                    this.listThk.top1 = null
                    this.listThk.top1Score = 0
                }

                this.listThk.meCenter = data.myRank

                this.listThk.isInited = true
            })
        },
        // 感恩榜Top1历史榜单
        loadThkTop1History () {
            this._loadRanks(this.listTop1list, 'getThkTop1History', this.page.activityDay)
        },
        // 置空榜单数据
        resetRanks () {
            if (this.listThk.isInited) {
                this.listThk.isInited = false
                // this.listThk.top1 = null
                // this.listThk.top1Score = 0
                // this.listThk.timeCount = 0
                this.meCenter = null
            }

            [this.listTop1list, this.listMod, this.listUser].forEach(target => {
                if (target.isInited) {
                    target.isInited = false
                    target.list = []
                    target.hasNext = true
                    target.currPage = 0
                }
            })
        },
        // 主播关注
        attention (topMod) {
            if (!this.checkLogin()) return
            topMod && service.attention(topMod.id).then(res => {
                if (res.errno === 0) {
                    topMod.isLoved = true
                } else {
                    console.error(res.msg)
                    throw new Error(res.msg)
                }
            })
        },
        // 感恩榜单刷新
        refreshThk () {
            console.log('[refreshThk]') // DEBUG:
            setTimeout(() => { // 延迟1s后刷新榜单
                this.listThk.isInited = false
                this.listTop1list = {
                    list: [],
                    isInited: false,
                    isLoading: false,
                    hasNext: true,
                    currPage: 0
                }

                this.loadThkRanks()
                this.loadThkTop1History()
            }, 1000)
        },
        // 所有中奖记录
        loadRecordsOpened () {
            this._loadRanks(this.records.opened, 'getRecords', 'opened')
        },
        // 我的中奖记录
        loadRecordsWon () {
            this._loadRanks(this.records.won, 'getRecords', 'won')
        },
        // 我的夺宝记录
        loadRecordsTakein () {
            this._loadRanks(this.records.takein, 'getRecords', 'takein')
        }
    }
}

// mobile mixin
var mobileMixin = {
    methods: {
        goRoom (rid) {
            rid && goRoom(rid)
        },
        gologin () {
            goLogin()
        },
        goCharge () {
            goRecharge()
        }
    }
}

var $v = new Vue({
    el: '#app',
    components: {
        'trea-item': treaItem,
        'list-table': listTable,
        'rank-top3': rankTop3,
        'rank-list': rankList,
        'rank-mecenter': rankMecenter,
        'achieve-table': achieveTable
    },
    mixins: [logicMixin, mobileMixin],
    data: {
        ui: {
            toast: false,
            toastMsg: '',
            toastTimer: null,
            layer: false,
            layerType: 0, // [0, 1, 2, 3, 4] -> ['活动规则', '我的成就', '幸运号码', '参与夺宝 夺宝礼物购买', '余额不足']
            achieveLayer: false, // 成就提示表格
            listLayer: false,
            listTabType: 0, // [0, 1, 2] -> ['感恩榜', '主播榜', '用户榜']
            tabRecords: 0, // 夺宝记录tab
            svgLayer: false
        },
        // 页面信息
        page: {
            currVol: '000',
            islogin: false,
            activityStatus: 0, // 是否在活动期间
            activityDay: 0, // 活动第几天
            lastStage: false,
            date: [],
            lastStageForNS: false // 最后一天的 23点之后->
        },
        // 表单
        form: {
            cgId: '',
            cgPic: '',
            cgCanBuyNum: 0,
            cgInputNum: 0,
            cgCaclPrice: 0,
            singlePrice: 10
        }
    },
    watch: {
        'form.cgInputNum': function (value) {
            this.form.cgCaclPrice = value * this.form.singlePrice
        }
    },
    mounted: function () {
        this.checkRecordsList() // 初始化加载当前记录列表

        this.initScrollBox()
    },
    methods: {
        toast (msg) { // toast
            if (!msg) return
            this.ui.toastTimer && clearTimeout(this.ui.toastTimer)
            this.ui.toast = true
            this.ui.toastMsg = msg
            this.ui.toastTimer = setTimeout(() => {
                this.ui.toast = false
                this.ui.toastTimer = null
            }, 2000)
        },
        // broadcast消息广播滚动条
        runMsg () {
            this.$nextTick(() => {
                var allWidth = this.$refs.msgwrap.scrollWidth
                var cWidth = this.$refs.msgs.clientWidth

                if (allWidth <= cWidth) {
                    return
                }

                var msgWrapper = this.$refs.msgs
                var left = 0
                var step = 0.6

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
        // 切换中奖记录tab
        changeTabRe (type) {
            if (type !== 0 && !this.checkLogin()) {
                return
            }

            this.ui.tabRecords = type

            this.checkRecordsList()
        },
        // 榜单数据切换tab
        changeTabList (type) {
            this.ui.listTabType = type

            this.checkRank()
        },
        // 关闭弹窗
        closeLayer () {
            this.ui.listLayer = false
            this.ui.layer = false

            this.form.luckyNum = ''
        },
        // 关闭活动榜单 弹窗
        closeListLayer () {
            // 1. 清空定时器
            con.thkTimer && clearTimeout(con.thkTimer)
            // 2. 置空数据
            this.resetRanks()

            this.closeLayer()
        },
        // 显示弹窗
        showLayer (layer, type) {
            this.ui[layer] = true
            if (layer === 'layer') {
                this.ui.layerType = type
            }

            if (layer === 'listLayer') {
                this.ui.listTabType = 0
                this.checkRank()
            }
        },
        // 显示弹窗 - 我的成就
        showLayerAche () {
            if (!this.checkLogin()) return

            this.loadMyAchieve()
            this.showLayer('layer', 1)
        },
        // 检查是否登录
        checkLogin () {
            if (this.page.islogin) {
                return true
            } else {
                this.gologin()
            }
            return false
        },
        // 检查活动状态
        checkActStatu () {
            if (this.page.activityStatus === 0) {
                this.toast('活动未开始')
                return false
            }

            if (this.page.activityStatus === 2) {
                this.toast('活动已结束')
                return false
            }

            return true
        },
        showAchieve () {
            this.ui.achieveLayer = true
        },
        hideAchieve () {
            this.ui.achieveLayer = false
        },
        // 预览动画
        preview (productId) {
            this.ui.svgLayer = true
            if (con.svgAniIns[productId]) {
                con.svgAniIns[productId].show()
                con.svgAniIns[productId].play()
            } else {
                var gift = this._findGift(productId)

                var path = gift.pcAnimationJsonUrl.replace(/http(s)?:/g, '') // .replace('static.guojiang.tv', '117.50.1.112') // TODO: DEBUG

                con.svgAniIns[productId] = con.playSvg(path)
            }
            con.currSvgAniIns = con.svgAniIns[productId]
        },
        // 停止动画
        stopSvg () {
            this.ui.svgLayer = false

            if (con.currSvgAniIns) {
                con.currSvgAniIns.stop()
                con.currSvgAniIns.hide()
                con.currSvgAniIns = null
            }
        },
        // 榜单懒加载
        checkRank () {
            var type = this.ui.listTabType
            if (type === 0) {
                !this.listThk.isInited && this.loadThkRanks()
                !this.listTop1list.isInited && this.loadThkTop1History()
                return
            }

            if (type === 1) {
                !this.listMod.isInited && this.loadModRanks()
                return
            }

            if (type === 2) {
                !this.listUser.isInited && this.loadUserRanks()
            }
        },
        // 我的记录榜单懒加载
        checkRecordsList () {
            var type = this.ui.tabRecords
            if (type === 0) {
                !this.records.opened.isInited && this.loadRecordsOpened()
                return
            }

            if (type === 1) {
                !this.records.won.isInited && this.loadRecordsWon()
                return
            }

            if (type === 2) {
                !this.records.takein.isInited && this.loadRecordsTakein()
            }
        },
        // 榜单滚动加载
        initScrollBox () {
            var scrollBox = function (ele, cb, ctx, flag) {
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

            // 榜单懒加载
            scrollBox(this.$refs.top1list, this.loadThkTop1History, this)
            scrollBox(this.$refs.modlist.$refs.list, this.loadModRanks, this, true)
            scrollBox(this.$refs.userlist.$refs.list, this.loadUserRanks, this, true)
            // 夺宝记录懒加载
            scrollBox(this.$refs.recordsOpened.$refs.list, this.loadRecordsOpened, this)
            scrollBox(this.$refs.recordsWon.$refs.list, this.loadRecordsWon, this)
            scrollBox(this.$refs.recordsTakein.$refs.list, this.loadRecordsTakein, this)
        },
        // 感恩榜时段倒计时
        thkTimer () {
            if (this.page.activityStatus !== 1) return // 活动期间才需要倒计时

            con.thkStartTime = Date.now()
            clearTimeout(con.thkTimer)

            var timeNode = [this.$refs.thkMin10, this.$refs.thkMin1, this.$refs.thkSec10, this.$refs.thkSec1]

            var runCount = () => {
                var now = Date.now()
                var walkedTime = (now - con.thkStartTime) / 1000 >> 0 // 从记录器开始起流逝的时间
                var leftedTime = this.listThk.timecount - walkedTime // 剩余时间

                var leftedSec = leftedTime % 60
                var leftedMin = leftedTime / 60 >> 0

                timeNode[0].className = 'txt-sprite t_num_' + (leftedMin / 10 >> 0)
                timeNode[1].className = 'txt-sprite t_num_' + (leftedMin % 10)

                timeNode[2].className = 'txt-sprite t_num_' + (leftedSec / 10 >> 0)
                timeNode[3].className = 'txt-sprite t_num_' + (leftedSec % 10)

                if (leftedTime <= 0) {
                    this.refreshThk()
                } else {
                    con.thkTimer = setTimeout(runCount, 1000)
                }
            }

            runCount()
        },
        // 参与夺宝
        join (gift) {
            if (!this.checkActStatu()) return
            if (!gift || !this.checkLogin()) return

            this.form.cgId = gift['product_id']
            this.form.cgPic = gift['img']
            this.form.cgCanBuyNum = +gift['leftNum']

            this.form.cgInputNum = 1
            this.$refs.buyInput.value = 1

            this.form.cgCaclPrice = 10

            this.showLayer('layer', 3)
        },
        inputFocus (evt) { // fastclick input focus
            evt.target.focus()
        },
        buyInput (evt) { // 购买输入限制
            var value = evt.target.value
            if (value === '') {
                this.form.cgInputNum = ''
                evt.target.value = ''
                return
            }
            var num = value.replace(/[^0-9]+/g, '')
            num = +num
            if (num > this.form.cgCanBuyNum) {
                this.form.cgInputNum = this.form.cgCanBuyNum
                evt.target.value = this.form.cgCanBuyNum
                return
            }
            if (num <= 0) {
                this.form.cgInputNum = 1
                evt.target.value = 1
                return
            }
            this.form.cgInputNum = num
            evt.target.value = num
        },
        // 购买礼物
        buyGift () {
            if (!this.checkActStatu()) return
            if (!this.checkLogin()) return
            if (!this.form.cgId || this.form.cgInputNum < 0 || this.form.cgInputNum > this.form.cgCanBuyNum) return

            var cgId = this.form.cgId
            var cgInputNum = this.form.cgInputNum
            var gift = this._findGift(cgId)

            service.buyGift(cgId, cgInputNum)
                .then(res => {
                    if (res.errno === 0) {
                        this.form.luckyNum = res.data.result
                        this.showLayer('layer', 2)

                        var num = res.data.buyedNum
                        var leftNum = gift.capacity - res.data.buyedNum

                        // 买满的情况
                        if (num == gift.capacity) { // eslint-disable-line
                            var nextPInfo = res.data.nextPInfo

                            gift.status = nextPInfo.status
                            gift.stage = nextPInfo.stage

                            gift.leftNum = nextPInfo.leftNum
                            gift.num = nextPInfo.num

                            this.refreshRecords()
                        } else {
                            // 我的夺宝记录需要刷新
                            gift.leftNum = leftNum
                            gift.num = num

                            this.refreshRecords('takein')
                        }
                    } else if (res.errno === 210) { // 余额不足
                        this.showLayer('layer', 4)
                    } else if (res.errno === 211) {
                        this.toast(res.msg)
                        gift.leftNum = +res.data.leftNum
                        gift.num = gift.capacity - gift.leftNum

                        this.form.cgCanBuyNum = gift.leftNum
                        this.form.cgInputNum = 1
                        this.$refs.buyInput.value = 1
                    } else if (res.errno === 212) {
                        this.toast(res.msg)
                        gift.leftNum = 0
                        gift.num = gift.capacity
                        gift.status = '1'

                        this.closeLayer()
                    } else {
                        this.toast(res.msg)
                    }
                })
        },
        // 取消购买
        cancelBuy () {
            this.form.cgId = ''

            this.closeLayer()
        },
        // 加减inputNum
        stepInputNum (step) {
            var num = (+this.form.cgInputNum) + step

            if (num < 1) {
                num = 1
            }
            if (num > this.form.cgCanBuyNum) {
                num = this.form.cgCanBuyNum
            }

            this.form.cgInputNum = num
            this.$refs.buyInput.value = num
        },
        _findGift (pid) {
            var gift = this.gifts.find((value) => {
                return value['product_id'] === pid
            })

            if (!gift) {
                gift = this.mgifts.find((value) => {
                    return value['product_id'] === pid
                })
            }

            return gift
        },
        cancelCharge () {
            this.closeLayer()
        }
    }
})

window.con = con
window.$v = $v
