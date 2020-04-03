import axios from 'axios'
import Loading from './components/Loading.vue'

var con = {
    toastTimer: null,
    toastDuration: 3000,
    pollingTimer: null,
    pkPollingD: 5000
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
    // 初始化
    init: function () {
        return axios.get('/children2019/initInfo').then(this.apiHandler).then(this.dataHandler)
    },
    // 热门pk对战
    getTopPk: function () {
        return axios.get('/children2019/top1PK').then(this.apiHandler).then(this.dataHandler)
    },
    // 福利总积分
    getRWScore: function () {
        return axios.get('/children2019/currentProgress').then(this.apiHandler).then(this.dataHandler)
    },
    // 福利榜
    getRWRank (stage, type) {
        // console.debug('[service][getRWRank] stage', stage, 'type', type) // * debug
        return axios.get('/children2019/ranks', {
            params: {
                stage,
                type: type === 'mod' ? 1 : 2,
                page: 1
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 数据榜
    getDataRank (type, page) {
        // console.debug('[service][getDataRank]', 'type', type, 'page', page) // * debug
        return axios.get('/children2019/ranks', {
            params: {
                stage: 0,
                type: type === 'mod' ? 1 : 2,
                page: page,
                pageRows: 15
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 童心值详情
    getPKDetails (page) {
        return axios.get('/children2019/valueDetail', {
            params: {
                page,
                pageRows: 15
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
    components: { Loading },
    data: {
        isLogin: false,
        isMod: false,
        currStage: 0, // 活动阶段

        lRWShow: false,
        lGDShow: false,
        lRuleShow: false,
        toastState: false,
        toastMsg: '',

        pkToper: null, // 热门pk

        rwScore: 0, // 福利大放送 - 总童心值
        rwStage: 'curr', // curr 表示本轮 prev 表示上一轮
        rwStageInd: 2, // 轮次
        rwTab: 'mod',
        rwRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            meCenter: null
        },
        rwRewards: {
            map: { // 用于查找对应奖励
                0: 0,
                1: 1,
                2: 1,
                3: 2,
                4: 2,
                5: 2,
                6: 3,
                7: 3,
                8: 3,
                9: 3
            },
            mod: [
                ['萌萌喵*1', '开播飘屏*2'],
                ['麦克风*2', '开播飘屏*2'],
                ['麦克风*1', '开播飘屏*1'],
                ['光之翼*1', '开播飘屏*1']
            ],
            user: [
                ['年度助力票*100', '童趣party*2'],
                ['年度助力票*60', '童趣party*2'],
                ['年度助力票*40', '童趣party*1'],
                ['年度助力票*20', '童趣party*1']
            ]
        },

        // 数据榜
        dataRTab: 'mod',
        currRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            meCenter: null
        },

        // pk获得分数详情列表
        pkDetails: {
            awardTotal: 0,
            scoreTotal: 0,
            page: 0,
            hasNext: true,
            loading: false,
            list: []
        }
    },
    computed: {
        calcPkProgress () {
            let p
            if (!this.pkToper) {
                p = '50%'
            } else {
                let fromS = +this.pkToper.fromScore
                let toS = +this.pkToper.toScore
                if (fromS + toS === 0) {
                    p = '50%'
                } else {
                    let pvalue = Math.ceil((fromS / (fromS + toS)) * 100)
                    if (pvalue < 7) {
                        pvalue = 7
                    }
                    if (pvalue > 93) {
                        pvalue = 93
                    }
                    p = pvalue + '%'
                }
            }

            return {
                background: `linear-gradient(to right, #ff5601 0%, #ffc703 ${p}, #2fd2fe ${p}, #4f3cf0 100%)`
            }
        },
        calcRMCenterInfos () {
            if (!this.rwRank.meCenter) return [{}, {}, {}, {}]

            let infos = [
                ...this.rwRank.meCenter.pairInfos
            ]

            let value = '-'
            let num = +infos[0].value // 排名
            if (!(!num || num > 10) && (+this.rwRank.meCenter.pairInfos[1].value) >= 40000) { // 排名前十 并且 分数大于40000
                value = this.rwRewards[this.rwTab][this.rwRewards.map[num - 1]].join('<br/>')
            }

            infos[3] = {
                name: '本轮奖励',
                value
            }
            return infos
        },
        showRWCenter () {
            return ((this.rwTab === 'mod' && this.isMod) || this.rwTab === 'user') && this.rwRank.meCenter
        },
        showDRCenter () {
            return ((this.dataRTab === 'mod' && this.isMod) || this.dataRTab === 'user') && this.currRank.meCenter
        }
    },
    mounted: function () {
        this.initScroll()

        this.showLoading()
        // 1. 初始化页面信息
        this.getInit().then(() => {
            // 2. 活动进行时轮询pk数据
            if (this.currStage === 1) {
                return this.startPolling()
            }

            this.getRWScore()
            return ''
        }).then(() => {
            this.loadRWRank() // 加载福利榜
            this.loadDataRank() // 加载数据榜
        }).then(() => {
            this.hideLoading()
        }).catch(() => {
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
        // 更换tab
        changeTab (type) {
            if (this.currRankType === type) return
            this.currRankType = type

            this.pcRankRefresh && this.pcRankRefresh()

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
        toggleRW () {
            this.lRWShow = !this.lRWShow

            if (this.lRWShow) {
                this.rwSReset()
            }
        },
        toggleGD () {
            this.lGDShow = !this.lGDShow

            // 关闭时 重置数据
            if (!this.lGDShow) {
                this.pkDetails = {
                    awardTotal: 0,
                    scoreTotal: 0,
                    page: 0,
                    hasNext: true,
                    loading: false,
                    list: []
                }
                return
            }

            this.gdSReset()

            this.showLoading()
            this.loadGD().then(() => {
                this.hideLoading()
            })
        },
        toggleRule () {
            this.lRuleShow = !this.lRuleShow

            if (this.lRuleShow) {
                this.ruleSReset()
            }
        },
        changeRWTab (type) {
            if (type === this.rwTab) return

            this.rwTab = type

            this.refreshRWRank()
        },
        rwGo (stage) {
            if (stage === 'prev' && this.rwStageInd === 1) {
                // 并且是第一轮次
                this.showToast('本轮是第一轮哦~')
                return
            }

            if (this.currStage === 2) {
                this.showToast('活动已结束哦~')
                return
            }

            if (stage === this.rwStage) return

            this.rwStage = stage

            this.refreshRWRank()
        },
        changeDTab (type) {
            if (type === this.dataRTab) return

            this.dataRTab = type

            this.rankSReset()
            this.refreshDataRank()
        },
        // 刷新福利榜
        refreshRWRank () {
            // refresh rw rank 1. reset 2. refetch
            console.log('[refreshRWRank]')
            this.rwRank = {
                hasNext: true,
                loading: false,
                currPage: 0,
                list: [],
                meCenter: null
            }

            let $refresh = this.loadRWRank()
            if ($refresh) {
                this.showLoading()
                $refresh.then(() => {
                    this.hideLoading()
                }).catch(err => {
                    console.log(err)
                    this.hideLoading()
                })
            }
        },
        // 加载福利榜单 // 无滚动加载
        loadRWRank () {
            let stage = this.rwStage === 'curr' ? this.rwStageInd : this.rwStageInd - 1
            return this.loadRank(this.rwRank, 'getRWRank', 'rwRank', [stage, this.rwTab])
        },
        // 刷新数据榜
        refreshDataRank () {
            // refresh rw rank 1. reset 2. refetch
            console.log('[refreshDataRank]')
            this.currRank = {
                hasNext: true,
                loading: false,
                currPage: 0,
                list: [],
                meCenter: null
            }

            let $refresh = this.loadDataRank()
            if ($refresh) {
                this.showLoading()
                $refresh.then(() => {
                    this.hideLoading()
                }).catch(err => {
                    console.log(err)
                    this.hideLoading()
                })
            }
        },
        // 加载数据榜 // 有滚动加载
        loadDataRank () {
            return this.loadRank(this.currRank, 'getDataRank', 'dataRank', [this.dataRTab])
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

            console.log('** init scroller loader **')
            scrollBox(this.$refs['rank-scroller'].$el, () => {
                this.loadDataRank()
            }, this)

            scrollBox(this.$refs['gd-scroller'].$el, () => {
                this.loadGD()
            }, this)
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

            source.loading = true
            var responser = data => {
                source.loading = false
                source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null

                if (data.ranks.length === 0) {
                    source.hasNext = false
                    return
                }

                var list = source.list.concat(data.ranks)
                if (list.length > 100) {
                    source.list = list.slice(0, 100)
                    source.hasNext = false
                } else {
                    source.list = list
                }

                source.currPage += 1
            }
            if (args) {
                return service[serviceName](...args, source.currPage + 1).then(responser)
            } else {
                return service[serviceName](source.currPage + 1).then(responser)
            }
        },
        startPolling () {
            if (con.pollingTimer) {
                clearTimeout(con.pollingTimer)
            }

            console.debug('<!-- Polling -->')
            this.getTopPk()
            this.getRWScore()

            // * polling timer
            con.pollingTimer = setTimeout(() => {
                this.startPolling()
            }, con.pkPollingD)
        },
        // 关注主播
        atte (item) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            if (!item || !item.id) {
                return
            }

            service.attend(item.id || item.mid).then(data => {
                if (data.errno === 0) {
                    item.isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // ajax to vm - init
        getInit () {
            return service.init().then(data => {
                this.isLogin = data.isLogin
                this.currStage = data.activityStatus
                this.rwStageInd = data.currentStage
                this.isMod = data.isMod // 是否是主播
            }).catch(err => {
                console.log('[getInit][ERROR]: ', err.message)
            })
        },
        // ajax to vm - 热门PK
        getTopPk () {
            return service.getTopPk().then(data => {
                if (data instanceof Array) {
                    this.pkToper = null
                    return
                }
                this.pkToper = data
            }).catch(err => {
                console.log('[getTopPk][ERROR]: ', err.message)
            })
        },
        // ajax to vm - 总积分
        getRWScore () {
            return service.getRWScore().then(data => {
                // 这里积分小于当前积分表示进入下一轮 刷新榜单~
                if (data.value < this.rwScore) {
                    this.rwStageInd += 1
                    this.refreshRWRank()
                }

                this.rwScore = data.value
            }).catch(err => {
                console.log('[getTopPk][ERROR]: ', err.message)
            })
        },
        // ajax to vm - pk详情列表
        loadGD () {
            if (!this.pkDetails.hasNext) {
                console.log('[loadGD] 没有下一页数据了')
                return
            }
            if (this.pkDetails.loading) {
                console.log('[loadGD] 正在加载 请稍等')
                return
            }

            this.pkDetails.loading = true
            return service.getPKDetails(this.pkDetails.page + 1).then(data => {
                this.pkDetails.loading = false
                this.pkDetails.page += 1
                if (this.pkDetails.page === 1) {
                    this.pkDetails.scoreTotal = data.scoreTotal
                    this.pkDetails.awardTotal = data.awardTotal
                }
                if (!data.record || data.record.length === 0) {
                    this.pkDetails.hasNext = false
                } else {
                    this.pkDetails.list = this.pkDetails.list.concat(data.record)
                }
            }).catch(err => {
                this.showToast(err.message)
            })
        }
    }
}

export default CommonMixin
