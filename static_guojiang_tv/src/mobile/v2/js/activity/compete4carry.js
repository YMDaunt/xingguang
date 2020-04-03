'use strict'

import Vue from 'vue'
import axios from 'axios'
import { goRoom } from 'common'

import './directive/xgSkeleton'
import '../../css/activity/compete4carry.less'

;(function apadation () {
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
}())

var service = {
    _state: {},
    _apiHandler: function (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error(res.msg)
            throw new Error(res.msg)
        }
    },
    initPage () { // 初始化页面数据
        return axios.get('/centerMatch/initInfo').then(this._apiHandler)
    },
    getPreHoursList () { // 入围赛小时榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: 1,
                pageSize: 20,
                stage: 1,
                type: 'hour'
            }
        }).then(this._apiHandler)
    },
    getPreDaysList (page, size) { // 入围赛日榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: page,
                pageSize: size,
                stage: 1,
                type: 'day'
            }
        }).then(this._apiHandler)
    },
    getPreModList (page, size) { // 入围赛明星榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: page,
                pageSize: size,
                stage: 1,
                type: 'star'
            }
        }).then(this._apiHandler)
    },
    getPromHoursList () { // 晋级赛小时榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                stage: 2,
                type: 'hour'
            }
        }).then(this._apiHandler)
    },
    getPromDaysList (page, size) { // 晋级赛日榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: page,
                pageSize: size,
                stage: 2,
                type: 'day'
            }
        }).then(this._apiHandler)
    },
    getPromModList (page, size) { // 晋级赛明星榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: page,
                pageSize: size,
                stage: 2,
                type: 'star'
            }
        }).then(this._apiHandler)
    },
    getFinalHoursList () { // 决赛小时榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                stage: 3,
                type: 'hour'
            }
        }).then(this._apiHandler)
    },
    getFinalDaysList (page, size) { // 决赛日榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: page,
                pageSize: size,
                stage: 3,
                type: 'day'
            }
        }).then(this._apiHandler)
    },
    getUserList (page, size) { // 粉丝榜
        return axios.get('/centerMatch/getRanks', {
            params: {
                pageNo: page,
                pageSize: size,
                stage: 1,
                type: 'fans'
            }
        }).then(this._apiHandler)
    },
    getAllTeams () { // 获取所有战队信息
        return axios.get('/centerMatch/teams').then(this._apiHandler)
    }
}

var con = { // 不需要使用数据监听的固定值
    second: 1000,
    minute: 60000,
    hours: 3600000,
    days: 24 * 3600000,

    toastDuration: 2000,
    toastTimer: null,
    countTime: 0, // 倒计时
    countTimer: null
}

/* 滚动加载 */
var scrollBox = function (ele, cb, ctx) {
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

/* util */
var assign = function (target, source) {
    if (!target || !source) return

    var keys = Object.keys(target)
    keys.forEach((key) => {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key]
        }
    })
}

var getArr = function (obj) { // 类数组对象转数组
    var result = []
    for (var i = 0; i < 7; i++) {
        if (obj[i]) {
            result.push(obj[i])
        }
    }
    return result
}

var formatDate = function (value, sep, hasHours) {
    var seconds = value % con.minute / con.second >> 0
    var minutes = value % con.hours / con.minute >> 0
    var hours = value % con.days / con.hours >> 0
    var days = value / con.days >> 0

    var result = ''

    if (days !== 0) {
        result += (hours < 10 ? '0' + hours : hours) + (sep || '天')
    }

    if (hours !== 0 || hasHours) {
        result += (hours < 10 ? '0' + hours : hours) + (sep || '时')
    }

    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }

    result += `${minutes}${sep || '分'}${seconds}${sep ? '' : '秒'}`

    return result
}

var getDate = function (value) { // 获取日期
    var d = new Date(value.replace(/-/g, '/'))

    return (d.getMonth() + 1) + '.' + d.getDate()
}

/* mixins */
var preCompetion = { // 入围赛
    data () {
        return {
            preCompetion: { // 入围赛
                hours: { // 小时榜
                    list: [{}],
                    sState: false,
                    isInit: false
                },
                days: { // 日榜
                    list: [{}],
                    sState: false,
                    isInit: false,
                    isLoading: false,
                    hasNext: true,
                    currPage: 0,
                    meCenter: {
                        rank: '',
                        headPic: '',
                        nickName: '',
                        score: 0,
                        rankComment: '',
                        isPlaying: false,
                        id: 0,
                        rid: 0
                    }
                },
                zhubos: { // 明星榜
                    list: [{}],
                    sState: false,
                    isInit: false,
                    isLoading: false,
                    hasNext: true,
                    currPage: 0
                }
            }
        }
    },
    methods: {
        /* 入围赛 小时榜 */
        initPreHoursList () {
            var source = this.preCompetion.hours
            source.sState = true
            service.getPreHoursList().then(data => {
                source.sState = false
                source.isInit = true
                if (data.errno === 0) {
                    data.data.time && this.loadTime(data.data.time)
                    source.list = data.data.data
                } else {
                    console.log(data.msg)
                }
            })
        },
        /* 入围赛 日榜 */
        initPreDaysList () {
            this.initListFactory(this.preCompetion.days, 'listOfPreDays.list', this.loadPreDaysList, true)
        },
        loadPreDaysList (cb) {
            this.loadListFactory(this.preCompetion.days, 'getPreDaysList', '入围赛 日榜', cb)
        },
        /* 入围赛 主播榜 */
        initPreZhubosList () {
            this.initListFactory(this.preCompetion.zhubos, 'listOfPreZhubos.list', this.loadPreZhubosList)
        },
        loadPreZhubosList (cb) {
            this.loadListFactory(this.preCompetion.zhubos, 'getPreModList', '入围赛 主播榜', cb)
        }
    }
}

var promoteCompetion = { // 晋级赛
    data () {
        return {
            promoteCompetion: { // 晋级赛
                hours: {
                    topValue: 0,
                    topZhubo: { // -> 这里需要默认数据
                        headPic: '',
                        nickname: '',
                        isPlaying: false,
                        rid: 0,
                        id: 0
                    },
                    topUser: {
                        headPic: '',
                        nickname: '',
                        id: 0
                    },
                    sState: false,
                    isInit: false,
                    meCenter: { // -> 个人中心
                        headPic: '',
                        nickName: '',
                        rank: '',
                        rankComment: '',
                        isPlaying: false,
                        rid: 0,
                        id: ''
                    },
                    topHistory: [{}]
                },
                days: {
                    list: [{}],
                    sState: false,
                    isInit: false,
                    isLoading: false,
                    hasNext: true,
                    currPage: 0,
                    meCenter: {
                        headPic: '',
                        nickName: '',
                        rank: '',
                        rankComment: '',
                        isPlaying: false,
                        rid: 0,
                        id: '',
                        score: 0
                    }
                },
                zhubos: {
                    list: [{}],
                    sState: false,
                    isInit: false,
                    isLoading: false,
                    hasNext: true,
                    currPage: 0
                }
            }
        }
    },
    methods: {
        /* 晋级赛 小时榜 */
        initPromHoursList () {
            var source = this.promoteCompetion.hours
            source.sState = true

            service.getPromHoursList()
                .then(data => {
                    source.sState = false
                    source.isInit = true
                    if (data.errno === 0) {
                        data.data.time && this.loadTime(data.data.time)

                        var tops = data.data.data[0]
                        if (tops) {
                            source.topValue = tops.score

                            assign(source.topZhubo, {
                                headPic: tops.headPic,
                                id: tops.id,
                                nickname: tops.nickname,
                                rid: tops.rid,
                                isPlaying: tops.isPlaying
                            })

                            assign(source.topUser, {
                                headPic: tops.uHeadPic,
                                nickname: tops.uNickname,
                                id: tops.uid
                            })
                        } else {
                            source.topValue = 0

                            assign(source.topZhubo, {
                                headPic: '',
                                nickname: '',
                                isPlaying: false,
                                rid: 0,
                                id: 0
                            })

                            assign(source.topUser, {
                                headPic: '',
                                nickname: '',
                                id: 0
                            })
                        }

                        if (data.data.myRank === null) {
                            source.meCenter = null
                        } else {
                            assign(source.meCenter, data.data.myRank)
                        }

                        source.topHistory = data.data.top
                    } else {
                        console.error(data.msg)
                    }
                })
        },
        /* 晋级赛 日榜 */
        initPromDaysList () {
            this.initListFactory(this.promoteCompetion.days, 'listOfPromDays.list', this.loadPromDaysList, true)
        },
        loadPromDaysList (cb) {
            this.loadListFactory(this.promoteCompetion.days, 'getPromDaysList', '晋级赛 日榜', cb)
        },
        /* 晋级赛 主播榜 */
        initPromZhubosList () {
            this.initListFactory(this.promoteCompetion.zhubos, 'listOfPromZhubos.list', this.loadPromZhubosList)
        },
        loadPromZhubosList (cb) {
            this.loadListFactory(this.promoteCompetion.zhubos, 'getPromModList', '晋级赛 主播榜', cb)
        }
    }
}

var finalCompetion = { // 决赛
    data () {
        return {
            finalCompetion: { // 决赛
                hours: {
                    meCenter: {
                        headPic: '',
                        nickName: '',
                        score: 0,
                        rankComment: '',
                        isPlaying: false,
                        id: '',
                        rid: 0
                    },
                    // topTeamId: null,
                    topTeam: [],
                    sState: false,
                    isInit: false,
                    topTeamHistory: [{}]
                },
                days: {
                    teams: [{}],
                    sState: false,
                    isInit: false
                },
                teams: [] // 战队信息列表
            }
        }
    },
    computed: {
        /* 获取决赛小时榜 top1 战队 */
        getFinalHoursTop () {
            var source = this.finalCompetion.hours.topTeam

            var totalShineNum = 0
            source.forEach(member => {
                totalShineNum += member.score
            })

            return {
                totalShineNum: totalShineNum,
                hasNothing: source.length === 0,
                members: source.length === 0 ? [{}, {}, {}, {}, {}, {}] : source
            }
        },
        /* 获取决赛top history战队信息 */
        getFinalTopHistory () {
            var source = this.finalCompetion.hours.topTeamHistory
            var teams = this.finalCompetion.teams

            var result = source.map((history) => {
                var mteam = teams.find((team) => {
                    return team.tid === history.tid
                })
                if (mteam) {
                    mteam = JSON.parse(JSON.stringify(mteam))
                    mteam.timeRange = history.time
                }
                return mteam || {
                    members: [{}]
                }
            })

            return result || [{
                members: [{}]
            }]
        },
        /* 获取决赛日榜列表 */
        getFinalList () {
            var source = this.finalCompetion.days.teams
            var teams = this.finalCompetion.teams

            var result = source.map((item) => {
                var mteam = teams.find((team) => {
                    return team.tid === item.tid
                })
                return mteam || {
                    members: [{}]
                }
            })

            return result
        },
        /* 获取我的战队 */
        getMyTeam () {
            var source = this.finalCompetion.hours
            if (!source.meCenter || !source.meCenter.id) return []
            var uid = source.meCenter.id
            return this.finalCompetion.teams.find((team) => {
                var flag = false
                for (var i = 0, len = team.members.length; i < len; i++) {
                    if (team.members[i].id == uid) { // eslint-disable-line
                        flag = true
                        break
                    }
                }
                return flag
            }) || [{
                members: [{}]
            }]
        }
    },
    methods: {
        /* 决赛 基础信息 */
        initFinalStage () {
            service.getAllTeams()
                .then(data => {
                    if (data.errno === 0) {
                        var teamsIds = Object.keys(data.data)
                        var result = []
                        teamsIds.forEach(teamId => {
                            result.push({
                                tid: +teamId,
                                totalShineNum: data.data[teamId].flash,
                                totalScore: data.data[teamId].point,
                                members: getArr(data.data[teamId])
                            })
                        })

                        this.finalCompetion.teams = result
                    } else {
                        console.log(data.msg)
                    }
                })
        },
        /* 决赛 小时榜 */
        initFinalHoursList () {
            var source = this.finalCompetion.hours
            source.sState = true

            service.getFinalHoursList()
                .then(data => {
                    source.sState = false
                    source.isInit = true
                    if (data.errno === 0) {
                        data.data.time && this.loadTime(data.data.time)

                        if (!data.data.meCenter) {
                            source.meCenter = null
                        } else {
                            assign(source.meCenter, data.data.meCenter)
                        }

                        // source.topTeamId = data.data.topTeamId
                        source.topTeam = data.data.data

                        source.topTeamHistory = data.data.topTeamHistory
                    } else {
                        console.error(data.msg)
                    }
                })
        },
        /* 决赛 日榜/主播榜 */
        initFinalDaysList () {
            var source = this.finalCompetion.days
            source.sState = true

            service.getFinalDaysList()
                .then(data => {
                    source.sState = false
                    source.isInit = true

                    if (data.errno === 0) {
                        source.teams = data.data
                    } else {
                        console.error(data.msg)
                    }
                })
        }
    }
}

/* 组件抽离 - 这边只抽离view部分 */
var XgList = {
    props: ['theader', 'tbody', 'needSkr', 'sktState', 'noneTips', 'disableGoRoom'],
    template: document.getElementById('template-table').innerText,
    filters: {
        formatDate (value) {
            return formatDate(value * 1000, ':', true)
        }
    },
    methods: {
        goRoom (rid) {
            rid && goRoom(rid)
        }
    }
}

var XgMeCenter = {
    props: ['isZhubo', 'meCenter', 'type'],
    template: document.getElementById('teamplete-meCenter').innerText,
    methods: {
        goRoom (rid) {
            this.$parent.goRoom(rid)
        },
        showModal (type) {
            this.$parent.showModal(type)
        }
    }
}

new Vue({
    el: '#app',
    filters: {
        formatDate (value) {
            return formatDate(value * 1000, ':', true)
        }
    },
    components: {
        'xglist': XgList,
        'mecenter': XgMeCenter
    },
    mixins: [preCompetion, promoteCompetion, finalCompetion],
    data: {
        currStage: 4, // 标识服务器当前阶段
        nowStage: 4, // [1, 2, 3] 赛制阶段 -> [入围赛，晋级赛，决赛] 4未开始 5已结束
        nowTime: 0, // 服务器时间
        startTime: 0, // Page Init Time
        boardType: 0, // [0, 1, 2, 3] -> [小时榜，日榜，明星榜，粉丝榜]
        rulesTabType: 0, // 活动规则 [0, 1, 2] -> [入围赛，晋级赛，决赛]

        aTime: {
            pre: ['10.16', '10.18'],
            promote: ['10.19', '10.20'],
            final: ['10.21', '10.21']
        },

        userList: { // 粉丝榜: 不区分赛制
            list: [{}],
            sState: false,
            isInit: false,
            isLoading: false,
            hasNext: true,
            currPage: 0,
            meCenter: {
                rank: '',
                headPic: '',
                nickName: '',
                score: 0,
                rankComment: '',
                help: 0
            },
            centerProgress: 100000
        },
        ui: {
            modalState: false,
            modalType: 0 // [0, 1, 2] 活动奖励 活动规则 我的战队
        },
        toast: {
            state: false,
            msg: ''
        },
        todayCarry: {
            nickname: '',
            headPic: '',
            id: 0,
            rid: 0,
            // isPlaying: false,
            // score: 0,
            isDefault: true // 没有数据使用默认值
        },
        user: {
            isLogined: false,
            isZhubo: false
        }
    },
    mounted: function () {
        this.initPage()
            .then(() => {
                this.checkStageList()

                if (this.nowStage === 3) {
                    this.initFinalStage()
                }
            })
    },
    methods: {
        /* 入围赛 晋级赛 决赛切换 */
        changeCompetion (stage) {
            if (this.currStage === 4 || stage > this.currStage) {
                this.showToast('活动尚未开始!')
                return
            }

            if ([1, 2, 3].indexOf(stage) !== -1 && stage <= this.currStage) {
                this.nowStage = stage
                this.tickTock() // 重新计算倒计时规则
                this.checkStageList()
            }
        },
        /* 榜单切换 */
        changeBoard (type) {
            if ([0, 1, 2, 3].indexOf(type) !== -1 && type !== this.boardType) {
                this.boardType = type
                this.checkStageList()
            }
        },
        /* 活动规则tab切换 */
        changeRulesTab (type) {
            if ([0, 1, 2].indexOf(type) !== -1 && type !== this.rulesTabType) {
                this.rulesTabType = type
            }
        },
        /* 显示弹出框 */
        showModal (type) {
            if ([0, 1, 2].indexOf(type) !== -1) {
                this.ui.modalState = true
                this.ui.modalType = type

                if (type === 1) {
                    this.rulesTabType = this.nowStage === 4 ? 0 : this.nowStage - 1
                }
            }
        },
        /* 关闭弹出框 */
        closeModal () {
            this.ui.modalState = false
        },
        /* 下拉框样式 */
        toggleSlide (evt) {
            var tagert = evt.target.parentElement
            var c = tagert.className
            if (c.indexOf('slide-down') !== -1) {
                tagert.className = c.replace('slide-down', 'slide-up')
            } else {
                tagert.className = c.replace('slide-up', 'slide-down')
            }
        },
        /* toast */
        showToast (msg) {
            if (!msg) return

            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toast.state = true
            this.toast.msg = msg

            con.toastTimer = setTimeout(() => {
                this.toast.state = false
                this.toast.msg = ''
            }, con.toastDuration)
        },
        /* 主播房间跳转 */
        goRoom (rid) {
            rid && goRoom(rid)
        },
        /* 倒计时 */
        countTimeByMS () { // 通过timeCount进行倒计时
            var past = Date.now() - this.startTime
            con.countTime = this.nowTime - past

            this.refreshTimeDom()

            if (con.countTime / 1000 <= 1) {
                setTimeout(() => {
                    this.pageReload() // 倒计时结束 进行页面刷新
                }, 1000)
                con.countTimer && clearTimeout(con.countTimer)
                return
            }

            con.countTimer && clearTimeout(con.countTimer)
            con.countTimer = setTimeout(this.countTimeByMS, 1000)
        },
        refreshTimeDom () { // 刷新时间节点 (避开vdom)
            function loadDom (target) {
                var timeStr = formatDate(con.countTime)

                if (con.countTime === 0) {
                    target.style.display = 'none'
                } else {
                    target.innerText = '本时段还剩：' + timeStr
                }
            }

            if (this.nowStage === 1) {
                loadDom(this.$refs.preTimeCount)
            } else if (this.nowStage === 2) {
                loadDom(this.$refs.promTimeCount)
            } else if (this.nowStage === 3) {
                loadDom(this.$refs.finalTimeCount)
            }
        },
        tickTock () { // 计算当前榜单的倒计时
            con.countTimer && clearTimeout(con.countTimer)
            if (this.nowStage !== this.currStage) {
                con.countTime = 0 // 不计时
                this.refreshTimeDom()
            } else {
                // if (this.nowStage === 1) { // 入围赛
                //     this.countTimeByNoon()
                // } else if (this.nowStage === 2 || this.nowStage === 3) { // 晋级赛 决赛
                //     this.countTimeByHours()
                // }
                this.countTimeByMS()
            }
        },
        pageReload () {
            console.log('倒计时结束，进行榜单刷新')
            // location.reload() // 1-> 页面刷新
            // 2. 状态刷新
            // 2.1 重置当前小时榜数据为 isInit = false
            if (this.nowStage === 1) {
                this.preCompetion.hours.isInit = false
            } else if (this.nowStage === 2) {
                this.promoteCompetion.hours.isInit = false
            } else if (this.nowStage === 3) {
                this.finalCompetion.hours.isInit = false
            }
            // 2.2 重新获取 init page 数据 (判断当前状态)
            this.initPage()
                .then(() => {
                    console.log('榜单重新刷新 -> ')

                    this.checkStageList()

                    if (this.nowStage === 3) {
                        this.initFinalStage()
                    }
                })
        },
        /* 初始化页面基础信息 */
        initPage () {
            return service.initPage()
                .then(data => {
                    if (data.errno !== 0) {
                        console.error(data.msg)
                        return
                    }

                    // 1. 加载赛制及倒计时
                    this.loadTime(null, data.data.stage)

                    this.user.isLogined = data.data.isLogin
                    this.user.isZhubo = data.data.isMod

                    var carry = data.data.centerMod[0]
                    if (carry) { // 2. 加载今日C位主播信息 (区分 活动第一日显示虚位以待 决赛无C位主播) 头像跳转
                        assign(this.todayCarry, carry)
                        this.todayCarry.isDefault = false
                    } else {
                        this.todayCarry.isDefault = true
                    }

                    var aTime = data.data.activityTime
                    if (aTime) {
                        this.aTime.pre = [
                            getDate(aTime[1997].start),
                            getDate(aTime[1997].end)
                        ]
                        this.aTime.preTime = aTime[1997].start.slice(5).replace('-', '.') + '-' + aTime[1997].end.slice(5).replace('-', '.')
                        this.aTime.promote = [
                            getDate(aTime[1996].start),
                            getDate(aTime[1996].end)
                        ]
                        this.aTime.promoteTime = aTime[1996].start.slice(5).replace('-', '.') + '-' + aTime[1996].end.slice(5).replace('-', '.')
                        this.aTime.final = [
                            getDate(aTime[1995].start),
                            getDate(aTime[1995].end)
                        ]
                        this.aTime.finalTime = aTime[1995].start.slice(5).replace('-', '.') + '-' + aTime[1995].end.slice(5).replace('-', '.')
                    }
                })
        },
        /* 初始化赛段 时间 倒计时 */
        loadTime (times, stage) {
            if (times) {
                // DEBUG: 用于定位问题
                // times = 10 // 10s
                // this.nowTime = new Date(times * 1000).getTime()
                this.nowTime = times * 1000
                this.startTime = Date.now() // 记录客户端时间 反正客户端时间与服务器端时间存在差值

                this.tickTock() // 开始小时榜倒计时
            } else {
                this.refreshTimeDom() // 重新刷新页面
            }
            if (stage !== undefined) {
                this.currStage = stage
                if (stage === 5) {
                    this.nowStage = 3 // 活动已结束
                } else {
                    this.nowStage = stage
                }
            }
        },
        /* 确认各榜单是否加载过第一屏 */
        checkStageList () {
            var type = this.boardType
            var stage = this.nowStage

            if (stage === 4 || [1, 2, 3].indexOf(stage) === -1 || [0, 1, 2, 3].indexOf(type) === -1) { // 活动未开始 及 非法输入
                return
            }

            if (type === 3) { // 粉丝榜 不区分 赛制
                !this.userList.isInit && this.initUserList()
                return
            }

            var boardMap = {
                '1': { // 入围赛
                    '0': {
                        source: this.preCompetion.hours,
                        fn: this.initPreHoursList
                    },
                    '1': {
                        source: this.preCompetion.days,
                        fn: this.initPreDaysList
                    },
                    '2': {
                        source: this.preCompetion.zhubos,
                        fn: this.initPreZhubosList
                    }
                },
                '2': {
                    '0': {
                        source: this.promoteCompetion.hours,
                        fn: this.initPromHoursList
                    },
                    '1': {
                        source: this.promoteCompetion.days,
                        fn: this.initPromDaysList
                    },
                    '2': {
                        source: this.promoteCompetion.zhubos,
                        fn: this.initPromZhubosList
                    }
                },
                '3': {
                    '0': {
                        source: this.finalCompetion.hours,
                        fn: this.initFinalHoursList
                    },
                    '1': {
                        source: this.finalCompetion.days,
                        fn: this.initFinalDaysList
                    },
                    '2': {
                        source: this.finalCompetion.days,
                        fn: this.initFinalDaysList
                    }
                }
            }

            var target = boardMap[stage][type]
            if (!target.source.isInit) { // 没有初始化过
                console.log('初始化榜单 ->', stage, type)
                target.fn.bind(this)()
            }
        },
        /* 粉丝榜 */
        initUserList () {
            this.initListFactory(this.userList, 'listOfUsers.list', this.loadUserList, true)
        },
        loadUserList (cb) {
            this.loadListFactory(this.userList, 'getUserList', '粉丝榜', cb)
        },
        /* 翻页榜单初始化 工厂 */
        initListFactory (source, refEl, service, withCenter) {
            console.info('榜单初始化: -> ' + refEl)
            source.sState = true

            service.bind(this)((data) => { // 首屏回调
                source.sState = false
                source.isInit = true

                if (withCenter && data.errno === 0) {
                    if (data.data.myRank === null) {
                        source.meCenter = null
                    } else {
                        assign(source.meCenter, data.data.myRank)
                    }
                }
            })

            var refElArr = refEl.split('.')
            var targrtEl = this
            refElArr.forEach(prop => {
                targrtEl = targrtEl.$refs[prop]
            })
            scrollBox(targrtEl, service, this)
        },
        /* 翻页榜单加载 工厂 */
        loadListFactory (source, serviceName, sourceName, cb) {
            if (source.isLoading) {
                console.info(sourceName + '数据 -> 正在加载上一页: 请稍后')
                return
            }
            if (!source.hasNext) {
                console.info(sourceName + '数据 -> 无更多数据')
                return
            }

            source.isLoading = true
            service[serviceName] && service[serviceName](source.currPage + 1, 15).then(data => {
                source.isLoading = false
                if (data.errno === 0) {
                    if (source.currPage === 0) {
                        source.list = data.data.data
                    } else {
                        source.list = source.list.concat(data.data.data)
                    }

                    source.currPage += 1
                    source.hasNext = data.data.hasNext
                } else {
                    console.error(data.msg)
                }

                return data
            }).then(cb)
        }
    }
})
