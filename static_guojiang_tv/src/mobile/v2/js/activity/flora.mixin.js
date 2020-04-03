import axios from 'axios'
import Loading from './components/Loading.vue'
import bodymovin from '../component/bodymovin.min.js'

const con = {
    toastTimer: null,
    toastDuration: 3000,
    svgAniIns: {}
}

const playSvg = function (path, type) {
    var svgContainer = document.querySelector('.svg-container')
    return bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: type || 'html',
        loop: true,
        autoplay: false,
        path: path
    })
}

const service = {
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
    // 初始化数据
    init () {
        return axios.get('/Flora2019/Init').then(this.apiHandler).then(this.dataHandler)
    },
    // 榜单数据
    getRank (params, pageNo) {
        params.pageNo = pageNo
        params.pageSize = 15
        return axios.get('/Flora2019/Ranks', {
            params: params
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 获取我的碎片详情
    getMyPieces (type) {
        return axios.get('/Flora2019/GetExchangeInfo', {
            params: {
                type
            }
        }).then(this.apiHandler)
    },
    // 获取可兑换礼物碎片列表
    getGiftPieces () {
        return axios.get('/Flora2019/GetPieceGifts').then(this.apiHandler)
    },
    // 碎片兑换
    piecesExchange (gInfo) {
        return axios.get('/Flora2019/Exchange', {
            params: {
                type: gInfo.type,
                giftId: gInfo.gid
            }
        }).then(this.apiHandler)
    }
}

const CommonMixins = {
    components: {
        Loading
    },
    data: {
        isMod: false,
        svgShow: false,

        toastState: false,
        toastMsg: '',

        tTState: false,

        ruleState: false,
        segLayerState: false,
        segModalState: false,
        confirmMState: false,

        segDrawInfo: {
            type: 'mod',
            val: 0,
            gid: null,
            name: ''
        },

        showStage: 0, // 0 - [4.16, 4.17] 1 - [4.18, 4.20]
        rankTab: 'day', // ['day', 'mod', 'user']
        timeTab: 0, // 时间切换
        routeTab: 1, // 赛道切换

        rwTimeTable: ['20190416', '20190417'],

        ruleTab: 0, // 活动规则 layer - tab
        segTab: 'mod', // 碎片兑换layer - tab
        segDeTab: 'mod', // 我的碎片modal -tab

        stage: 0, // 阶段 0 -> 未开始 1 -> 4.16 2 -> 4.17 3 -> 4.18 4 -> 4.19 5 -> 4.20 6 -> 已结束
        isLogin: false, // 是否登陆
        stars: null, // 花神殿
        starsInd: [ // 花神殿样式表
            {
                t: 'txt-f-taohua',
                c: 'flora-th',
                name: '桃花花神'
            }, {
                t: 'txt-f-mudan',
                c: 'flora-md',
                name: '牡丹花神'
            }, {
                t: 'txt-f-lianhua',
                c: 'flora-lh',
                name: '莲花花神'
            }, {
                t: 'txt-f-meihua',
                c: 'flora-mh',
                name: '梅花花神'
            }, {
                t: 'txt-f-lihua',
                c: 'flora-lihua',
                name: '梨花花神'
            }
        ],

        currRank: {
            type: 'day', // day 日榜 rw 入围榜(一阶段主播榜) user 守护榜 // hs (花神榜-阶段-赛道) (hs-1-1)
            hasNext: true,
            currPage: 0,
            list: [],
            meCenter: null
        },

        exGifts: {
            mod: [],
            user: []
        },

        exGiftsMap: {
            mod: {
                '热门推荐10min': {
                    icon: 'gift-i-hotr',
                    hasCor: true
                },
                '5min1.2倍花神值buff卡': {
                    icon: 'gift-i-buff',
                    qs: '主播兑换成功buff卡，直播间即时5分钟内开启花神值加成：用户送出10克拉活动礼物，用户活动榜单记录10守护值，主播活动榜单记录12花神值。',
                    needDis: true
                },
                '开播飘屏': {
                    icon: 'gift-i-b'
                },
                '梦里花开': {
                    icon: 'gift-mlhk'
                },
                'app端广告位*12h': {
                    icon: 'gift-i-bn'
                }
            },
            user: {
                '护花使者*66': {
                    icon: 'gift-hhsz'
                },
                '护花使者*120': {
                    icon: 'gift-hhsz'
                },
                '玫瑰花雨': {
                    icon: 'gift-mghy',
                    animationUrl: '//static.guojiang.tv/app/gift/pc_animation/4945/data.json',
                    needDis: true
                },
                '梦里花开': {
                    icon: 'gift-mlhk'
                },
                '10W用户等级经验值': {
                    icon: 'gift-i-exp'
                },
                '8位靓号': {
                    icon: 'gift-i-num'
                }
            }
        },

        myPiecesLists: {
            mod: [],
            user: []
        },
        myPiecesInfo: {
            mod: {
                total: 0,
                left: 0,
                val: 0
            },
            user: {
                total: 0,
                left: 0,
                val: 0
            }
        },
        piecesLeft: {
            mod: 0,
            left: 0
        },

        pageInited: false
    },
    mounted () {
        this.showLoading()
        this.initScroll()
        this.initPage().then(() => {
            this.pageInited = true
            this.currRank.type = this.currRankType
            return this.loadRankProxy()
        }).then(() => {
            this.hideLoading()
        }).catch(err => {
            console.log(err.message)
            // this.showToast(err.message)
            this.hideLoading()
        })
    },
    watch: {
        'showStage': function () {
            this.refreshRank()
        },
        'rankTab': function () {
            this.refreshRank()
        },
        'timeTab': function () {
            this.refreshRank()
        },
        'routeTab': function () {
            this.refreshRank()
        }
    },
    computed: {
        // 榜单类型
        currRankType: function () {
            // type:
            // user - 用户榜
            // rank_0_day_1 -> 日榜4.16
            // rank_0_day_2 -> 日榜4.17
            // rank_0_mod -> 入围榜
            // rank_1_mod_3 -> 花神榜1
            // rank_1_mod_4 -> 花神榜2
            // rank_1_mod_5 -> 花神榜3
            let type
            if (this.rankTab === 'user') {
                type = 'user'
            } else {
                type = `rank_${this.showStage}_${this.rankTab}`
                if ((this.showStage === 0 && this.rankTab === 'day') || (this.showStage === 1 && this.rankTab === 'mod')) {
                    type = `${type}_${this.timeTab}`
                }
            }
            return type
        },
        // flatArray
        currRankList: function () {
            function flatN (n) {
                let temp = []
                for (let i = 0; i < n; i++) {
                    temp.push(null)
                }
                return temp
            }

            if (this.showStage === 0 || this.rankTab === 'user') { // 用户榜 及 第一阶段日榜 主播榜 显示一百位
                if (this.currRank.hasNext) {
                    return this.currRank.list
                } else {
                    return this.currRank.list.concat(flatN(100 - this.currRank.list.length))
                }
            }

            if (this.timeTab === 3) { // 12 -> 7
                return this.currRank.list.concat(flatN(12 - this.currRank.list.length))
            }

            if (this.timeTab === 4) { // 7 -> 3
                return this.currRank.list.concat(flatN(7 - this.currRank.list.length))
            }

            if (this.timeTab === 5) { // 3 -> 1
                return this.currRank.list.concat(flatN(3 - this.currRank.list.length))
            }

            return this.currRank.list
        },
        // 花神 or 守护
        txtOfSeg: function () {
            if (this.segDeTab === 'mod') {
                return '花神'
            }

            return '守护'
        },
        // 当前兑换榜
        currMySegList: function () {
            return this.myPiecesLists[this.segDeTab]
        },
        // 当前兑换榜我的信息
        currMySegInfo: function () {
            let info = this.myPiecesInfo[this.segDeTab]
            return info || {
                total: 0,
                left: 0,
                val: 0
            }
        }
    },
    methods: {
        /* logic */
        // 初始化
        initPage () {
            return service.init().then(data => {
                this.stage = data.stage // 当前阶段
                this.isLogin = data.isLogin
                this.stars = data.floraMods
                this.isMod = data.isModerator
                this.rwTimeTable = data.stage1DateArray // 入围日榜时间表

                if (this.stage === 0) {
                    this.showStage = 0
                    this.timeTab = 1
                    return
                }

                if (this.stage < 3) {
                    this.showStage = 0
                    this.timeTab = data.stage
                    return
                }

                if (this.stage < 6) {
                    this.showStage = 1
                    this.rankTab = 'mod'
                    this.timeTab = data.stage
                    return
                }

                this.showStage = 1
                this.rankTab = 'mod'
                this.timeTab = 5
            })
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
                }, false)
            }

            console.log('[scroller] init scroller loader')
            scrollBox(this.$refs['rank-scroller'].$el, () => {
                this.loadRankProxy().catch(err => {
                    console.log(err.message)
                })
            }, this)
        },
        refreshRank () {
            if (!this.pageInited) {
                return
            }

            if (this.pcRankRefresh) {
                this.pcRankRefresh()
            } else {
                this.$refs['rank-scroller'].$el.scrollTop = 0
            }

            this.currRank = {
                type: this.currRankType, // date 日榜 rw 入围榜(一阶段主播榜) user 守护榜 // hs (花神榜-阶段-赛道) (hs-1-1)
                hasNext: true,
                currPage: 0,
                list: [],
                meCenter: null
            }

            this.showLoading()
            this.loadRankProxy().then(() => {
                this.hideLoading()
            }).catch(err => {
                console.log(err.message)
                this.hideLoading()
            })
        },
        // 计算rank参数
        getRankParams () {
            if (this.rankTab === 'user') {
                return {
                    activityId: 1957,
                    type: 'user'
                }
            }

            if (this.showStage === 0) {
                if (this.rankTab === 'day') {
                    return {
                        activityId: 1956,
                        type: 'date',
                        extra: this.rwTimeTable[this.timeTab - 1] || ''
                    }
                }

                return {
                    activityId: 1956,
                    type: 'mod'
                }
            }

            if (this.showStage === 1 && this.rankTab === 'mod') {
                return {
                    activityId: [1954, 1953, 1952][this.timeTab - 3] || '',
                    type: 'mod',
                    extra: this.routeTab
                }
            }

            return null
        },
        // 请求数据榜单代理方法
        loadRankProxy () {
            let params = this.getRankParams()

            if (!params) {
                let error = new Error('[getRankParams void]')
                return Promise.reject(error)
            }

            return this.loadRank(params)
        },
        // 榜单加载工厂方法
        loadRank (params) {
            let currRank = this.currRank
            let tag = currRank.type
            if (!currRank.hasNext) {
                return Promise.reject(new Error(`[loading ${tag}]: 没有更多数据...`))
            }
            if (currRank.loading) {
                return Promise.reject(new Error(`[load ${tag}]: loading 正在加载中... 请稍后`))
            }

            currRank.loading = true
            var responser = data => {
                var list = currRank.list.concat(data.data)

                if (list.length > 100) {
                    currRank.list = list.slice(0, 100)
                    currRank.hasNext = false
                } else {
                    currRank.list = list
                    currRank.hasNext = data.hasNext
                }

                currRank.currPage += 1
                currRank.loading = false

                if (!currRank.inited) {
                    currRank.inited = true
                    currRank.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
                }
            }
            return service.getRank(params, currRank.currPage + 1).then(responser).catch((err) => {
                console.log('[getRank]: ', err)
                currRank.hasNext = false
            })
        },
        // 加载碎片兑换礼物列表
        loadGiftsPieces () {
            this.showLoading()
            return service.getGiftPieces().then(res => {
                this.hideLoading()
                if (res.errno === 0) {
                    let data = res.data
                    this.exGifts.mod = data['gift_list'].mod
                    this.exGifts.user = data['gift_list'].user

                    this.mergeGifts(this.exGiftsMap.mod, this.exGifts.mod)
                    this.mergeGifts(this.exGiftsMap.user, this.exGifts.user)

                    this.piecesLeft = data['pieces_left']
                } else {
                    console.log('[礼物碎片兑换列表 Error]: ', res.msg)
                    this.showToast(res.msg)
                }
            })
        },
        // 合并样式配置到后台返回数据中 (规则 name)
        mergeGifts (source, to) {
            to.forEach(gift => {
                if (!source[gift.name]) return
                Object.keys(source[gift.name]).forEach((key) => {
                    if (gift[key]) return

                    gift[key] = source[gift.name][key]
                })
            })
        },
        // 加载具体兑换信息列表
        loadMyPieces (type) {
            this.showLoading()
            return service.getMyPieces(type).then(res => {
                this.hideLoading()
                if (res.errno === 0) {
                    this.myPiecesLists[type] = res.data.list
                    this.myPiecesInfo[type] = {
                        total: res.data.total,
                        left: res.data.left,
                        val: res.data.score || 0
                    }

                    this.piecesLeft[type] = res.data.left
                } else {
                    console.log('[我的兑换信息 Error]: ', res.msg)
                    this.showToast(res.msg)
                }
            })
        },
        // 兑换碎片
        toExchange () {
            this.showLoading()
            service.piecesExchange(this.segDrawInfo).then(res => {
                this.hideLoading()
                this.showToast(res.msg)

                // 兑换成功
                if (res.errno === 0) {
                    let findG = this.exGifts[this.segTab].find((gifts) => {
                        return gifts.gid === this.segDrawInfo.gid
                    })
                    if (findG && findG.nums) { // 可兑换数量减少
                        findG.nums[1] = Math.max(findG.nums[1] - 1, 0)
                    }
                    this.piecesLeft[this.segTab] -= findG.val // 减少碎片数量
                }

                this.toggleCM()
            })
        },
        /* ui ux */
        toggleSeg () {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            this.segLayerState = !this.segLayerState

            if (this.segLayerState) {
                if (this.isMod) { // 区分user mod
                    this.segTab = 'mod'
                } else {
                    this.segTab = 'user'
                }

                this.loadGiftsPieces().then(() => {
                    this.resetSegDrawScroller()
                })
            }
        },
        toggleRule () {
            this.ruleState = !this.ruleState

            if (this.ruleState) {
                // 重置滚动条 及 ruleTab
                this.ruleTab = 0
                this.resetRuleScroller()
            }
        },
        toggleSegInfo () {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            this.segModalState = !this.segModalState

            if (this.segModalState) {
                if (this.isMod) { // 区分user mod
                    this.changeSegDeTab('mod')
                } else {
                    this.changeSegDeTab('user')
                }
            }
        },
        toggleCM () {
            this.confirmMState = !this.confirmMState

            if (!this.confirmMState) { // 关闭时置空数据
                this.segDrawInfo = {
                    type: 'mod',
                    val: 0,
                    gid: null,
                    name: ''
                }
            }
        },
        // 更改显示阶段
        changeStage (stage) {
            if (stage === this.showStage) return
            if (stage === 1 && this.stage < 3) {
                this.showToast('花神之争开始时间为 4月18日 00:00')
                return
            }

            this.showStage = stage
            if (this.showStage === 0) {
                this.rankTab = this.stage < 3 ? 'day' : 'mod' // 第一阶段默认显示日榜
                this.timeTab = this.stage < 3 ? this.stage : 1 // 第二阶段会看数据默认显示 16日
                return
            }

            if (this.showStage === 1) {
                this.rankTab = 'mod' // 第二阶段默认显示主播榜
                this.timeTab = this.stage
            }
        },
        // 更改当前阶段一级tab
        changeTab (rankTab) {
            this.rankTab = rankTab
        },
        changeTime (timeTab) {
            if (timeTab > this.stage) return
            this.timeTab = timeTab
        },
        changeRoute (route) {
            this.routeTab = route
        },
        changeRuleTab (ruleTab) {
            this.ruleTab = ruleTab
            this.resetRuleScroller()
        },
        changeSegTab (segTab) {
            this.segTab = segTab
            this.resetSegDrawScroller()
        },
        changeSegDeTab (segDeTab) {
            this.segDeTab = segDeTab

            this.loadMyPieces(this.segDeTab).then(() => {
                this.resetSegDeScroller()
            })
        },
        exchange (gift) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            if (!gift || !gift.gid) return

            if (gift.val > this.piecesLeft[this.segTab]) {
                this.showToast('呜呜呜，碎片不足！')
                return
            }

            this.segDrawInfo.type = this.segTab
            this.segDrawInfo.val = gift.val
            this.segDrawInfo.gid = gift.gid
            this.segDrawInfo.name = gift.name

            this.toggleCM()
        },
        resetRuleScroller () {
            if (this.isMobile) {
                this.$refs['rules-scroller'].$el.scrollTop = 0
            } else {
                this.$refs['rules-scroller']._resetBox()
                this.$refs['rules-scroller']._refresh()
                this.$nextTick(() => {
                    this.$refs['rules-scroller']._resetBox()
                    this.$refs['rules-scroller']._refresh()
                })
            }
        },
        resetSegDrawScroller () {
            if (this.isMobile) {
                this.$refs['segs-scroller'].$el.scrollTop = 0
            } else {
                this.$refs['segs-scroller']._resetBox()
                this.$refs['segs-scroller']._refresh()
                this.$nextTick(() => {
                    this.$refs['segs-scroller']._resetBox()
                    this.$refs['segs-scroller']._refresh()
                })
            }
        },
        resetSegDeScroller () {
            this.$nextTick(() => {
                if (this.isMobile) {
                    this.$refs['rw-scroller'].$el.scrollTop = 0
                } else {
                    this.$refs['rw-scroller']._resetBox()
                    this.$refs['rw-scroller']._refresh()
                }
            })
        },
        // layer
        capClick (evt) {
            let cname = evt.target.className.split(' ')

            if (cname.indexOf('modal-confirm') > -1) {
                this.confirmMState && this.toggleCM()
                return
            }

            if (cname.indexOf('modal-segs') > -1) {
                this.segModalState && this.toggleSegInfo()
                return
            }

            if (cname.indexOf('layer-segs') > -1) {
                this.segLayerState && this.toggleSeg()
                return
            }

            if (cname.indexOf('layer-rules') > -1) {
                this.ruleState && this.toggleRule()
            }
        },
        // loading
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        // toast
        // noTimer true -> 不需要定时消失
        showToast (msg, noTimer) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toastState = true
            this.toastMsg = msg

            if (!noTimer) {
                con.toastTimer = setTimeout(() => {
                    this.toastState = false
                    this.toastMsg = ''
                }, con.toastDuration)
            }
        },
        hideToast () {
            clearTimeout(con.toastTimer)
            this.toastState = false
            this.toastMsg = ''
        },
        showTToast () {
            this.tTState = true
        },
        hideTToast () {
            this.tTState = false
        },
        /* 点击预览 */
        preview (path) {
            if (con.svgAniIns[path]) {
                con.svgAniIns[path].play()
            } else {
                con.svgAniIns[path] = playSvg(path)

                con.svgAniIns[path].play()
            }

            con.svgIns = con.svgAniIns[path]

            this.svgShow = true
        },
        stopSvg () {
            this.svgShow = false
            if (con.svgIns) {
                con.svgIns.stop()
                con.svgIns = null
            }
        }
    }
}

export default CommonMixins
