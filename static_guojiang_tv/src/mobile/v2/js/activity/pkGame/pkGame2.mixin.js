'use strict'

import axios from 'axios'
import Loading from '../components/Loading.vue'
import bodymovin from '../../component/bodymovin.min.js'

let service = {
    apiHandler (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error('[service.apiHandler]:', res.message)
            throw new Error(res.message)
        }
    },
    dataHandler (data) {
        if (data.errno === 0) {
            return data.data
        } else {
            console.error('[service.dataHandler]:', data.msg)
            throw new Error(data.msg)
        }
    },
    // 初始化
    initPage () {
        return axios.get('/PKStar/InitInfo').then(this.apiHandler).then(this.dataHandler)
    },
    // 广播
    getBdMsgs () {
        return axios.get('/PKStar/broadcast').then(this.apiHandler).then(this.dataHandler)
    },
    // 我的称号
    getTitles (stage) {
        return axios.get('/PKStar/myTitle', {
            params: {
                stage
            }
        }).then(this.apiHandler)
    },
    // 榜单
    getRanks (isMod, stage, modType, pageNo) {
        var params = {
            stage,
            type: ['mod', 'user'][isMod],
            pageNo,
            pageSize: 15
        }

        if (modType !== false) {
            params.level = modType
        }

        return axios.get('/PKStar/PKStarRank', {
            params
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 获取主播所选周的积分明细
    getScore (stage, mid) {
        return axios.get('/PKStar/RankDetail', {
            params: {
                mid, stage
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 获取神豪榜
    getTopUser () {
        return axios.get('/PKStar/Tuhaos').then(this.apiHandler).then(this.dataHandler)
    },
    // 轮询获取热门对战主播
    getHotBattle () {
        return axios.get('/PKStar/top1PK').then(this.apiHandler)
    }
}

let con = {
    toastTimer: null,
    toastDuration: 3000,
    svgIns: null,
    svgAniIns: [],
    svgAniPath: [
        '//static.guojiang.tv/src/pc/img/room/svg/mount/55/data.json',
        '//static.guojiang.tv/src/pc/img/room/svg/mount/56/data.json'
    ],
    tipers: {
        ldzw: 'PK胜利数量累计50场的主播和其中累计贡献最大的用户可同时获得',
        cs: 'PK连胜5场的主播和其中累计贡献最大的用户可同时获得',
        zjz: '终止对手&ge;5连胜的主播和其中贡献最大的用户可同时获得',
        scjq: '当日PK，贡献前三名的用户',
        psw: 'PK中，为30位不同的主播送礼过的用户',
        ssw: '若A主播领先于B主播&ge;5000克拉，B主播获得胜利，则最后一刻帮助B主播赢得胜利的用户可获得此称号',
        sdqc: 'PK中第一个送礼，数量达到30场的用户',
        ymdx: '每天PK胜利的前20位主播，前20位主播若有重复情况，则名额顺延',
        yzyy: 'PK负的场次为30场的主播',
        fdbz: 'PK数量为80场的主播',
        yzdd: 'PK对象为25个不同主播的主播'
    }
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

let commonMixin = {
    components: {
        'my-table': MyTable,
        'scroller': {
            template: `<div><slot/></div>`
        },
        Loading
    },
    data: {
        currRankType: 1,

        isLogin: false,
        isMod: false,
        // 热门对战
        hotBattle: null,
        // 消息广播
        boardcast: [],
        // 我的称号
        currTitleStage: 0, // 当前指定阶段的称号列表
        // 上周PK王
        lastPkKing: null,
        // 当前日期所处的活动阶段
        currStage: 0,
        // 用户选择的阶段
        showStage: 0,
        stagesInfo: [],
        // 用户选择的榜单类型
        isModRank: 0, // -> 主播/用户榜
        showRankType: 0, // -> 当主播榜时，二级选项 [0, 1, 2, 3, 4] // [周榜, 王者, 钻石, 精英, 新星]

        ruleState: false,
        titleState: false,
        scoreState: false,
        toastState: false,
        subdates: false,

        titleTabType: 'mod',
        titleTimeStage: 1, // 用户选择的我的称号时间阶段

        toastMsg: '',

        titles: {},
        scoreList: [],
        chosenDate: null,
        scoreMid: null,

        currRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            type: 'zhubo',
            inited: false,
            meCenter: null
        },
        topUser: [],
        topMeCenter: null,
        svgShow: false,

        toastTipShow: false,
        toastTip: ''
    },
    computed: {
        pkBattleScore () {
            let progress = []
            let total = 0
            let fromS = 0
            let toS = 0
            if (this.hotBattle) {
                fromS = +this.hotBattle.fromScore
                toS = +this.hotBattle.toScore
                total = fromS + toS
            }
            if (total === 0) {
                progress = ['49%', '51%']
            } else {
                let chP = (fromS / total) * 100
                progress = [(chP - 1) + '%', (chP + 1) + '%']
            }

            return {
                background: `linear-gradient(to right, #ff5601, #ffc703 ${progress[0]}, #26d0fe ${progress[1]}, #4f3cf0)`
            }
        },
        scoreDates () {
            return this.scoreList.filter(list => {
                return list.timeFlag <= 0
            }).map(list => {
                return list.date
            })
        },
        currScoreList () {
            let flag = !!this.chosenDate
            let len = this.scoreList.length
            for (let i = 0; i < len; i++) {
                if (flag && (this.chosenDate === this.scoreList[i].date)) {
                    if (this.chosenDate === this.scoreList[i].date) {
                        return this.scoreList[i]
                    }
                } else if (this.scoreList[i].timeFlag === 0) {
                    return this.scoreList[i]
                }
            }

            if (len === 0) {
                return {
                    detail: [],
                    totalScore: 0
                }
            } else { // 都过期了
                return this.scoreList[len - 1]
            }
        }
    },
    mounted: function () {
        this.initScroll()
        this.initHotBattle()

        this.showLoading()
        Promise.all([
            this.initPage(),
            this.initBdMsgs(),
            this.initTopUser()
        ]).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        /* 点击预览 */
        preview (type) {
            if (type !== 0 && type !== 1) return

            if (con.svgAniIns[type]) {
                con.svgAniIns[type].play()
            } else {
                con.svgAniIns[type] = playSvg(con.svgAniPath[type])

                con.svgAniIns[type].play()
            }

            con.svgIns = con.svgAniIns[type]

            this.svgShow = true
        },
        stopSvg () {
            this.svgShow = false
            if (con.svgIns) {
                con.svgIns.stop()
                con.svgIns = null
            }
        },
        runMsg () { // 消息滚动条
            this.$nextTick(() => {
                var allWidth = this.$refs['msg-wrapper'].scrollWidth
                var cWidth = this.$refs['boardcast'].clientWidth

                if (allWidth <= cWidth) {
                    return
                }

                var msgWrapper = this.$refs['msg-wrapper']
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
        showToastTip (type) {
            if (!con.tipers[type]) return
            this.toastTipShow = true
            this.toastTip = con.tipers[type]
        },
        hideToastTip () {
            this.toastTipShow = false
            this.toastTip = ''
        },
        changeTime (stage) {
            if (stage > this.currStage || stage === this.showStage) {
                return
            }
            this.showStage = stage

            this.refreshRank()
        },
        changeMainType (isModRank) { // 0 -> 主播 1 -> 用户
            this.isModRank = isModRank

            this.refreshRank()
        },
        changeModType (type) { // 更改主播 段位榜
            this.showRankType = type

            this.refreshRank()
        },
        toggleRule () {
            this.ruleState = !this.ruleState
        },
        toggleTitle () {
            if (this.titleState) {
                this.titleState = false
                return
            }

            if (this.currStage < 1) {
                this.showToast('活动尚未开始')
                return
            }

            this.showLoading()
            this.loadTitle().then((data) => {
                this.titleState = !!data

                if (this.titles.mod) {
                    this.titleTabType = 'mod'
                } else {
                    this.titleTabType = 'user'
                }

                this.hideLoading()
            })
        },
        hideScore () {
            this.scoreState = false
        },
        showScore (mod) {
            this.scoreState = true

            if (this.scoreMid === (mod.mid || mod.id || mod.uid)) {
                return
            } else {
                this.scoreMid = (mod.mid || mod.id || mod.uid)
                this.chosenDate = null
            }

            this.showLoading()
            this.loadScore().then(() => {
                this.hideLoading()
            }).catch(err => {
                console.log(err)
            })
        },
        changeTitleType (type) {
            this.titleTabType = type
        },
        changeTitleTime (stage) {
            if (stage > this.currStage) {
                return
            }

            if (this.titleTimeStage !== stage) {
                this.titleTimeStage = stage
                this.loadTitle()
            }
        },
        showSubDate () {
            this.subdates = true
        },
        chooseDate (date) {
            this.subdates = false

            this.chosenDate = date
        },
        hideSubDates () {
            this.subdates = false
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
        /* api service */
        initPage () {
            return service.initPage().then(data => {
                this.lastPkKing = data.allTop1

                this.currStage = data.currentStage
                this.showStage = data.currentStage > 3 ? 3 : data.currentStage
                this.titleTimeStage = this.showStage

                this.stagesInfo = data.stagesInfo
            }).then(() => {
                this.refreshRank()
            })
        },
        initBdMsgs () {
            return service.getBdMsgs().then(data => {
                this.boardcast = data
                this.runMsg()
            }).catch(err => {
                console.log(err)
            })
        },
        loadTitle () {
            if (this.titles.mod) {
                this.titles.mod = []
            }
            return service.getTitles(this.titleTimeStage).then(data => {
                if (data.errno === 1) {
                    this.goLogin()
                } else {
                    this.titles = data.data
                    return true
                }
            }).catch(err => {
                console.log(err)
            })
        },
        loadScore () {
            this.scoreList = []

            // 传入当前日期
            return service.getScore(this.showStage, this.scoreMid).then(data => {
                this.scoreList = data.details
            })
        },
        refreshRank () {
            var type = ''
            if (this.isModRank === 0) {
                type = 'zhubo_' + this.showRankType + '_' + this.showStage
            } else {
                type = 'user_' + this.showStage
            }

            this.currRank.hasNext = true
            this.currRank.loading = false
            this.currRank.currPage = 0
            this.currRank.type = type
            this.currRank.inited = false

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
        loadRank () {
            if (this.currStage <= 0) return Promise.resolve({})

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

            return service.getRanks(this.isModRank, this.showStage, this.isModRank === 0 && this.showRankType, source.currPage + 1).then(data => {
                var list
                if (source.inited) {
                    list = source.list.concat(data.data)
                } else {
                    list = data.data
                }

                if (list.length > 100 && this.showRankType <= 1) { // 周榜 和 新星榜显示前一百
                    source.list = list.slice(0, 100)
                    source.hasNext = false
                } else { // 其他的显示全部
                    source.list = list
                    source.hasNext = data.hasNext
                }

                source.currPage += 1
                source.loading = false

                if (!source.inited) {
                    source.inited = true
                    source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
                }
            })
        },
        initTopUser () {
            return service.getTopUser().then(data => {
                this.topUser = data.users
                this.topMeCenter = data.myRank.length === 0 ? null : data.myRank
            }).catch(err => {
                console.log(err)
            })
        },
        // 开启轮询任务
        initHotBattle () {
            console.log('[loadHotBattle] <-- polling -->')
            this.refreshHotBattle().then(() => {
                setTimeout(this.initHotBattle, 5000)
            }).catch(() => {
                setTimeout(this.initHotBattle, 5000)
            })
        },
        // 刷新热门对战
        refreshHotBattle () {
            return service.getHotBattle().then(data => {
                if (data.errno === 0) {
                    this.hotBattle = data.data
                } else {
                    this.hotBattle = null
                }
            }).catch(err => {
                console.log(err)
                this.hotBattle = null
            })
        }
    }
}

module.exports = commonMixin
