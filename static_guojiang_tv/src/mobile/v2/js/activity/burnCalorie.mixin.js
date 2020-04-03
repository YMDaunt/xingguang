import axios from 'axios'
import Loading from './components/Loading.vue'

var con = {
    toastTimer: null,
    toastDuration: 3000
}

var service = {
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
        return axios.get('/calorie/init').then(this.apiHandler).then(this.dataHandler)
    },
    // 用户榜
    getUserRanks (pageNo) {
        return axios.get('/calorie/ranks', {
            params: {
                type: 'user',
                pageSize: 15,
                pageNo: pageNo
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 主播榜
    getModRanks (stage, pageNo) {
        var aid = ['', 1967, 1966][stage]
        if (!aid) return Promise.resolve(new Error('[getModRanks stage params error]'))
        return axios.get('/calorie/ranks', {
            params: {
                type: 'mod',
                activityId: aid,
                pageSize: 15,
                pageNo: pageNo
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 日榜
    getDayRanks (date, pageNo) {
        return axios.get('/calorie/ranks', {
            params: {
                type: 'daily',
                date,
                pageSize: 15,
                pageNo
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 关注主播
    attend (id) {
        return axios.get('/chenChen/attention', {
            params: {
                mid: id
            }
        }).then(this.apiHandler)
    }
}

const CommonMixin = {
    components: {
        Loading
    },
    data: {
        islogin: false,
        ruleState: false,
        currStage: 0, // 当前活动阶段
        showStage: 0,
        currRankType: 1, // [1, 2, 3, 4] // 1-日榜 2-stage1主播 3-stage2主播 4 用户榜
        amAttended: false,
        amRid: 0,
        amMid: 0,
        toastState: false,
        toastMsg: '',
        showDaylist: false,
        dates: [],
        currDayList: [],
        currDay: 0,
        currDayRank: 0, // [0, 1, 2, 3, 4] // ['2.26, '2.27', '2.28', '3.1', '3.2']
        sepStageIndex: 0, // 阶段日期
        dayRank: { // 分日期
        },
        modRank: { // 分阶段
        },
        userRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            inited: false,
            type: 'user'
        },
        isRankFirstLoading: true
    },
    mounted: function () {
        this.init().then(this.changeRank) // 初始化完成后 加载榜单
        this.initScroll()
    },
    computed: {
        currRank () {
            if (this.currRankType === 1) { // 日榜
                return this.dayRank[this.dates[this.currDayRank]] || { type: 'date_holder', list: [] }
            }

            if (this.currRankType === 2 || this.currRankType === 3) { // 主播榜
                return this.modRank[this.showStage] || { type: 'mod_holder', list: [] }
            }

            if (this.currRankType === 4) { // 用户榜
                return this.userRank
            }
        }
    },
    methods: {
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        // 拦截冒泡上来的点击
        captrueClick () {
            if (this.showDaylist) {
                this.showDaylist = false
            }
        },
        // 日榜日期下拉框
        toggleDaylist (evt) {
            this.showDaylist = !this.showDaylist

            evt.stopPropagation()
            return false
        },
        // 改变日榜日期
        changeDay (type) {
            if (type > this.currDay) return
            this.currDayRank = type
            this.showDaylist = false

            this.changeRank()
        },
        toggleRule () {
            this.ruleState = !this.ruleState
        },
        // 更换tab
        changeTab (type) {
            if (this.currRankType === type) return
            this.currRankType = type

            this.pcRankRefresh && this.pcRankRefresh()

            this.changeRank()
        },
        // 更换stage
        changeStage (stage) {
            if (this.currStage === 0) {
                this.showToast('活动尚未开始')
                return
            }

            if (this.currStage === 1 && stage === 2) {
                this.showToast('3月1日 00:00:00开启。')
                return
            }

            this.showStage = stage

            if (stage === 1 && this.currRankType === 3) {
                this.currRankType = 2
                // 变为瘦身萌新榜
            }

            if (stage === 2 && this.currRankType === 2) {
                this.currRankType = 3
                // 变为瘦身达人榜
            }

            if (this.currRankType === 2 || this.currRankType === 3) {
                this.pcRankRefresh && this.pcRankRefresh()
            }

            this.changeRank()
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
        enterRoom () {
            this.goRoom({
                rid: this.amRid,
                mid: this.amMid
            })
        },
        attend () {
            if (this.amAttended) return

            if (!this.islogin) {
                this.goLogin()
                return
            }

            service.attend(this.amMid).then(data => {
                if (data.errno === 0) {
                    this.amAttended = true
                } else {
                    this.showToast(data.msg)
                }
            })
        },
        // 滚动加载
        initScroll () {
            var scrollBox = function (ele, cb, ctx) {
                var bh = 150
                var _self = ctx
                var scrollEle = ele

                console.log('scroller')
                scrollEle.addEventListener('scroll', function () {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH < bh) {
                        cb.call(_self)
                    }
                }, false)
            }

            // 方法调用映射表
            var fnMap = {
                1: 'loadDayRank',
                2: 'loadModRank',
                3: 'loadModRank',
                4: 'loadUserRank'
            }

            console.log('** init scroller loader **')
            scrollBox(this.$refs['rank-scroller'].$el, () => {
                fnMap[this.currRankType] && this[fnMap[this.currRankType]]()
            }, this)
        },
        /* api data */
        // 初始化页面数据
        init () {
            this.showLoading()
            return service.init().then(data => {
                this.islogin = data.isLogin

                this.currStage = data.stage
                this.showStage = data.stage > 2 ? 2 : data.stage

                this.amAttended = data.attention
                this.amRid = data.rid
                this.amMid = data.mid

                this.setDayByDate(data.stage1_start, data.stage2_end, data.date, data.stage2_start)
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // 格式化日榜日期列表
        setDayByDate (start, end, now, mid) {
            // 开始时间取日期即可，有可能是中午开始
            let s = new Date(start.split(' ')[0].replace(/-/g, '/')).getTime()
            let e = new Date(end.replace(/-/g, '/')).getTime()
            let n = new Date(now.replace(/-/g, '/')).getTime()
            let mt = new Date(mid.replace(/-/g, '/'))

            let days = Math.ceil((e - s) / (3600000 * 24)) // 活动有多少天
            let dates = []
            let datesInZh = []

            let midDate = [mt.getFullYear(), mt.getMonth() + 1, mt.getDate()].join('-')

            for (let i = 0; i < days; i++) {
                let di = s + 3600000 * 24 * i
                di = new Date(di)
                let y = di.getFullYear()
                let m = di.getMonth() + 1
                let d2 = di.getDate()
                dates.push([y, m, d2].join('-'))
                datesInZh.push([m, '月', d2, '日'].join(''))
            }

            this.sepStageIndex = dates.indexOf(midDate)

            let currDay = 0

            if (n < s) { // 活动未开始
                currDay = -1
            } else if (n > e) { // 活动已结束 -> 最后一天
                currDay = days - 1
            } else {
                currDay = Math.ceil((n - s) / (3600000 * 24)) - 1
            }

            this.dates = dates
            this.currDayList = datesInZh
            this.currDay = currDay
            this.currDayRank = currDay
        },
        // 切换榜单时触发的初始化加载
        changeRank () {
            if (this.currRankType === 1) { // 日榜
                !this.dayRank[this.dates[this.currDayRank]] && this.loadDayRank()
                return
            }

            if (this.currRankType === 2 || this.currRankType === 3) { // 主播榜
                !this.modRank[this.showStage] && this.loadModRank()
                return
            }

            if (this.currRankType === 4) { // 用户榜
                !this.userRank.inited && this.loadUserRank()
            }
        },
        loadUserRank () {
            this.loadRank(this.userRank, 'getUserRanks', 'userlist')
        },
        loadModRank () {
            if (this.showStage === 0) return
            var tag = 'mod_' + this.showStage
            if (!this.modRank[this.showStage]) {
                this.$set(this.modRank, this.showStage, {
                    hasNext: true,
                    loading: false,
                    currPage: 0,
                    list: [],
                    type: tag,
                    inited: false
                })
            }
            this.loadRank(this.modRank[this.showStage], 'getModRanks', tag, [this.showStage])
        },
        loadDayRank () {
            var date = this.dates[this.currDayRank]
            if (!this.dayRank[date]) {
                // 初始化
                this.$set(this.dayRank, date, {
                    hasNext: true,
                    loading: false,
                    currPage: 0,
                    list: [],
                    type: date,
                    inited: false
                })
            }
            this.loadRank(this.dayRank[date], 'getDayRanks', 'daylist-' + date, [date])
        },
        // 榜单加载工厂方法
        loadRank (source, serviceName, tag, args) {
            if (!source.hasNext) {
                console.log(`[loading ${tag}]: 没有更多数据...`)
                return
            }
            if (source.loading) {
                console.log(`[load ${tag}]: loading 正在加载中... 请稍后`)
                return
            }

            if (!source.inited) {
                this.isRankFirstLoading = true
                this.showLoading()
            }
            source.loading = true
            var responser = data => {
                var list = source.list.concat(data.data)

                if (list.length > 100) {
                    source.list = list.slice(0, 100)
                    source.hasNext = false
                } else {
                    source.list = list
                    source.hasNext = data.hasNext
                }

                source.currPage += 1
                source.loading = false

                if (!source.inited) {
                    source.inited = true
                    source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null

                    this.hideLoading()
                    this.isRankFirstLoading = false
                }
            }
            if (args) {
                service[serviceName](...args, source.currPage + 1).then(responser)
            } else {
                service[serviceName](source.currPage + 1).then(responser)
            }
        }
    }
}

export default CommonMixin
