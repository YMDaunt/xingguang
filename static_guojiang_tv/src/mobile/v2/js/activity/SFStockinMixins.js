// PC/Mobile 公共逻辑复用部分
import axios from 'axios'

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
    // 初始化加小时榜
    initPage: function () {
        return axios.get('/yearMall/hourRank').then(this.apiHandler).then(this.dataHandler)
    },
    loadZhuboRank: function (page) {
        return axios.get('/yearMall/ranks', {
            params: {
                type: 'mod',
                pageNo: page
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    loadUserRank (page) {
        return axios.get('/yearMall/ranks', {
            params: {
                type: 'user',
                pageNo: page
            }
        }).then(this.apiHandler).then(this.dataHandler)
    }
}

var con = {
    toastTimer: null,
    toastDuration: 2000,
    fromTime: 0 // 开始倒计时的初始值
}

export default {
    data: {
        toast: false,
        toastMsg: '',
        layerStatue: false,
        currTab: 0,
        isLogin: false,
        // aRuning: false, // 活动进行中
        // timeRunning: false,
        stage: 0, // [0, 1, 2, 3] ['未开始', '进行中', '倒计时已结束', '活动已结束']
        countdownTime: 0,
        isModerator: false,
        hoursList: {
            tops: {
                user: {},
                mod: {
                    score: '--'
                }
            },
            topHistory: [],
            meCenter: null
        },
        zhuboList: {
            type: 'zhubo',
            inited: false,
            loading: false,
            hasNext: true,
            currPage: 0,
            list: [],
            meCenter: null
        },
        userList: {
            type: 'user',
            inited: false,
            loading: false,
            hasNext: true,
            currPage: 0,
            list: [],
            meCenter: null
        }
    },
    computed: {
        currRank: function () {
            if (this.currTab === 1) {
                return this.zhuboList
            }
            if (this.currTab === 2) {
                return this.userList
            }
            return { list: [] }
        }
    },
    mounted: function () {
        this.init()

        this.initScroll()
    },
    methods: {
        /* toast */
        showToast (msg) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toast = true
            this.toastMsg = msg

            con.toastTimer = setTimeout(() => {
                this.toast = false
                this.toastMsg = ''
            }, con.toastDuration)
        },
        closeLayer () {
            this.layerStatue = false
        },
        changeTab (tabType) {
            if (tabType === this.currTab) return
            this.currTab = tabType

            if (this.currTab === 1) {
                !this.zhuboList.inited && this.loadZhuboRank()
            }
            if (this.currTab === 2) {
                !this.userList.inited && this.loadUserRank()
            }
        },
        attention (infos, ind) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            if (infos.isLoved) return

            axios.get('/chenChen/attention', {
                params: {
                    mid: infos.id
                }
            }).then(service.apiHandler).then(data => {
                if (data.errno === 0) {
                    this.zhuboList.list[ind].isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            })
        },
        // 初始化页面 倒计时
        init () {
            service.initPage().then(data => {
                // this.aRuning = data.info.aRuning
                // this.timeRunning = data.info.running
                this.stage = data.info.stage
                this.countdownTime = data.info.timeLeft * 1000
                this.isModerator = data.info.isModerator // 是否显示我的小时榜个人中心
                this.isLogin = data.info.isLogin

                if (this.stage > 1) { // 已结束默认显示主播榜
                    this.changeTab(1)
                }

                this.loadHoursRank(data)

                this.startCount()
            })
        },
        // 开始倒计时
        startCount () {
            if (this.stage !== 1) return

            var countdown = () => {
                var walkedTime = Date.now() - con.fromTime
                // var nowServerTime = this.serverTime + walkedTime

                // var toEndTime = 3600000 - nowServerTime % 3600000 // 距离下一个小时剩余的ms数
                var toEndTime = this.countdownTime - walkedTime
                if (toEndTime < 1000) {
                    console.log('[countdown] show update history list')
                    setTimeout(() => {
                        this.$refs.secs && (this.$refs.secs.innerText = '00')
                        this.$refs.mins && (this.$refs.mins.innerText = '00')

                        setTimeout(() => {
                            this.init() // 重新刷新页面
                        }, 1000)
                    }, 1000)
                } else {
                    setTimeout(countdown, 1000)
                }

                toEndTime = Math.round(toEndTime / 1000)// ms -> s

                var secs = toEndTime % 60
                var mins = toEndTime / 60 >> 0

                secs = secs < 10 ? '0' + secs : secs
                mins = mins < 10 ? '0' + mins : mins

                this.$refs.secs.innerText = secs
                this.$refs.mins.innerText = mins
            }

            con.fromTime = Date.now()
            countdown()
        },
        // 加载小时榜
        loadHoursRank (data) {
            this.hoursList.tops.mod = data.top.mod
            this.hoursList.tops.user = data.top.user

            if (this.isModerator) {
                this.hoursList.meCenter = data.myRank
            }

            this.hoursList.topHistory = data.history
        },
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

            var fnMap = {
                'zhubo': 'loadZhuboRank',
                'user': 'loadUserRank'
            }

            scrollBox(this.$refs.scroller, () => {
                console.log('[滚动加载]')

                fnMap[this.currRank.type] && this[fnMap[this.currRank.type]]()
            }, this)
        },
        // 加载主播榜
        loadZhuboRank () {
            this.loadRank(this.zhuboList, 'loadZhuboRank', 'zhuboList')
        },
        loadUserRank () {
            this.loadRank(this.userList, 'loadUserRank', 'userList')
        },
        loadRank (source, serviceName, tag) {
            if (!source.hasNext) {
                console.log(`[loading${tag}]: 没有更多数据...`)
                return
            }
            if (source.loading) {
                console.log(`[load${tag}]: loading 正在加载中... 请稍后`)
                return
            }

            source.loading = true
            service[serviceName](source.currPage + 1).then(data => {
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
                    source.meCenter = data.myRank
                }
            })
        }
    }
}
