import axios from 'axios'
import Loading from './components/Loading.vue'

var con = {
    toastTimer: null,
    toastDuration: 3000,
    tenTimesD: 6,
    tenTimesS: '6s',
    cbs: [] // 动画cb队列
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
        return axios.get('/labour2019/init').then(this.apiHandler).then(this.dataHandler)
    },
    // 榜单
    getRanks (type, pageNo) {
        return axios.get('/labour2019/ranks', {
            params: {
                type,
                pageNo,
                pageSize: 15
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 抽奖
    draw (type, times) {
        return axios('/labour2019/goLottery', {
            params: {
                type,
                num: times
            }
        }).then(this.apiHandler)
    },
    // 中奖记录
    getMyRec (type) {
        return axios.get('/labour2019/awardRecord', {
            params: {
                type
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 关注主播
    attend (id) {
        if (!id) {
            return Promise.reject(new Error('[api attention] params miss'))
        }
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
        toastState: false,
        toastMsg: '',

        ruleState: false,
        modalState: false,

        ruleTab: 'rw', // mod user rw

        lotTabType: 'mod', // 1 -> mod 2 -> user

        currStage: 0, // 服务器阶段
        isLogin: false, // 是否登录
        isMod: false, // 当前用户是否是主播
        progress: 0, // 关卡
        lotTimes: { // 剩余次数
            mod: 0,
            user: 0
        },

        isDrawing: false, // 正在抽奖

        rankTabType: 1, // 1 -> mod 2 -> user
        currRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            inited: false,
            type: 'mod',
            meCenter: null
        },

        drawTimes: 1,
        endAngle: 0,
        turnAni: {
            transform: '',
            transitionProperty: 'transform',
            transitionDuration: '3s',
            transitionTimingFunction: 'ease-in-out'
        },
        // 与转盘12点开始顺时针旋转位置相同
        lotPool: {
            mod: ['萌萌喵*1', '小蜜蜂*1', '丘比特*1', '小蜜蜂*3', '梦里花开*1', '暴鸡*1', '100克拉', '30000克拉'],
            user: ['以爱之名*1', '劳模红包雨', '小蜜蜂*10', '战神座驾*1天', '小蜜蜂*1', '宝箱*1', '广播卡*1', '仙女棒*1', '私人飞机座驾*1天']
        },

        reclist: {
            mod: [],
            user: []
        },

        // 达标列表项
        rwlist: {
            mod: [{
                name: '勤劳小蜜蜂',
                icon: 'bee',
                nameIcon: 'txt-qlxmf',
                desc: '每日累计开播时长180min，可获得1次抽奖机会，每日最多1次',
                progress: [0, 180]
            }, {
                name: '交际小能手',
                icon: 'jjxns',
                nameIcon: 'txt-jjxns',
                desc: '每日作为多人直播间主持人开播累计时长120min，可获得1次抽奖机会，每日最多1次',
                progress: [0, 120]
            }],
            user: [{
                name: '勤劳小蜜蜂',
                icon: 'bee',
                nameIcon: 'txt-qlxmf',
                desc: '用户每日观看直播10min，可获得1次抽奖机会，每日最多1次',
                progress: [0, 10]
            }, {
                name: '劳模助攻者',
                icon: 'lmzgz',
                nameIcon: 'txt-lmzgz',
                desc: '每累计送出510个小蜜蜂，获得一次抽奖机会',
                progress: [0, 510]
            }, {
                name: '幸运锦鲤',
                icon: 'xyjl',
                nameIcon: 'txt-xyjl',
                desc: '用户每日暴鸡中奖20倍5次，可获得1次抽奖机会，每日最多1次',
                progress: [0, 5]
            }, {
                name: '交际小能手',
                icon: 'jjxns',
                nameIcon: 'txt-jjxns',
                desc: '多人直播间上麦成为嘉宾每日累计时长30min，可获得1次抽奖机会，每日最多1次',
                progress: [0, 30]
            }]
        },

        lotResState: false,
        lotResMap: {
            '萌萌喵*1': 'g-mmm', // mod
            '小蜜蜂*1': 'g-bee',
            '丘比特*1': 'g-qbt',
            '小蜜蜂*3': 'g-bee',
            '梦里花开*1': 'gift-mlhk',
            '暴鸡*1': 'gift-bj',
            '100克拉': 'g-kl',
            '30000克拉': 'g-kl',
            'default': 'g-null',
            '以爱之名*1': 'g-yazm', // user
            '劳模红包雨': 'g-rb',
            '小蜜蜂*10': 'g-bee',
            '战神座驾*1': 'g-zszj',
            '战神座驾*1天': 'g-zszj',
            '宝箱*1': 'gift-bx',
            '广播卡*1': 'g-card',
            '仙女棒*1': 'g-xnb',
            '私人飞机座驾*1天': 'g-plane'
        },
        lotRes: []
    },
    mounted: function () {
        this.showLoading()
        this.initScroll() // 初始化滚动事件
        this.init()
            .then(this.loadRank)
            .then(() => {
                this.hideLoading()
            })
            .catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
    },
    computed: {
    },
    methods: {
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        changeLotT (lotTabType) {
            if (this.isDrawing) { // 正在抽奖 无法切换
                return
            }
            if (this.lotResState) { // 如果抽奖十次的结果框存在则消失
                this.lotResState = false
            }
            this.lotTabType = lotTabType
            this.resetPanel(0)
        },
        changeRankT (rankTabType) {
            this.rankTabType = rankTabType
            this.refreshRank()
        },
        changeRuleT (ruleTab) {
            this.ruleTab = ruleTab
            this.refreshRule()
        },
        showMyLotRec () {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            if (this.lotTabType === 'mod' && !this.isMod) { // 不是主播 点击我的中奖记录
                this.showToast('本环节只有主播可以参与哦！')
                return
            }

            this.refreshRW()
            this.loadMyRec()
            this.modalState = true
        },
        hideMyLotRec () {
            this.modalState = false
            this.reclist[this.lotTabType] = []
        },
        showRule () {
            this.ruleState = true
            this.ruleTab = 'mod'

            this.refreshRule()
        },
        hideRule () {
            this.ruleState = false
        },
        closeLotRes () {
            if (this.isDrawing) return // 正在抽奖 不允许关闭

            this.lotResState = false
            this.lotRes = []
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
        showTips (msg) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toastState = true
            this.toastMsg = msg
        },
        capClick (evt) {
            let cname = evt.target.className.split(' ')

            if (cname.indexOf('layer-rules') > -1) {
                this.hideRule()
                return
            }

            if (cname.indexOf('modal-rec') > -1) {
                this.hideMyLotRec()
            }
        },
        draw (times) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            if (this.lotTabType === 'mod' && !this.isMod) { // 用户点击主播奖池抽奖
                this.showToast('本环节只有主播可以参与哦！')
                return
            }

            if (this.isDrawing) return // 正在抽奖中

            let avaTimes = this.lotTimes[this.lotTabType]
            if (times > avaTimes) {
                this.showToast(this.lotTabType === 'mod' ? '小主抽奖次数不足！' : '您的抽奖次数不足！')
                return
            }

            let lotType = this.lotTabType
            let offsetR = (lotType === 'mod' ? (360 / 9 / 2) - 2 : (360 / 10))

            this.drawTimes = times
            this.lotRes = []

            times === 1 && (this.lotResState = false)

            this.showLoading()
            service.draw(lotType, times).then(data => {
                this.hideLoading()
                if (data.errno !== 0) { // 抽奖出错
                    this.showToast(data.msg)
                    return
                }

                // 计算转盘奖品位置下标 以及 toast文案
                let prize = data.data.prize
                let currPool = this.lotPool[lotType]
                let totalN = currPool.length
                let lastI = totalN
                // 计算最后的结果toast
                let giftsName = []
                let mountName = []
                for (let i = 0, len = prize.length; i < len; i++) {
                    let prizeI = currPool.indexOf(prize[i].prizeName)
                    if (prizeI !== -1) {
                        lastI = totalN - prizeI - 1;
                        (prize[i].type === 'mount' ? mountName : giftsName).push(prize[i].prizeName)
                    }
                }

                // 刷新剩余次数
                this.lotTimes.mod = data.data.modLotteryNum
                this.lotTimes.user = data.data.userLotteryNum

                this.isDrawing = true
                if (this.drawTimes === 10) {
                    this.showLotResBox(data.data.prize, data.data.sucess)
                }

                return this.runPanel(lastI, totalN + 1, offsetR).then(() => {
                    // console.log('[drawEnd]:', giftsName, mountName)
                    this.showToast(data.msg)

                    // if (lotType === 'mod') {
                    //     if (giftsName.length === 0) {
                    //         this.showToast('好遗憾~什么也没有，再来一次！')
                    //         return
                    //     }

                    //     this.showToast(`恭喜小主抽中${giftsName.join('、')}，礼物已放至背包，请注意查收！`)
                    //     return
                    // }

                    // if (lotType === 'user') {
                    //     if (giftsName.length === 0 && mountName.length === 0) {
                    //         this.showToast('好遗憾~什么也没有，再来一次！')
                    //         return
                    //     }

                    //     if (giftsName.length !== 0 && mountName.length === 0) {
                    //         console.log(`恭喜您抽中${giftsName.join('、')}，礼物已放至背包，请注意查收！`)
                    //         return
                    //     }

                    //     if (giftsName.length === 0 && mountName.length !== 0) {
                    //         this.showToast(`恭喜您抽中${mountName.join('、')},请至我的座驾手动装备！`)
                    //         return
                    //     }

                    //     this.showToast(`恭喜您抽中${giftsName.join('、')},礼物已放至背包！恭喜您抽中${mountName.join('、')},请至我的座驾手动装备！`)
                    // }
                })
            }).then(() => {
                this.isDrawing = false
            })
        },
        // 抽奖动画
        runPanel (ind, totalN, offsetR) {
            var perA = 360 / (totalN * 2)
            var baseRound = (this.drawTimes === 1 ? 1 : 5) * 3 * 360 // -> 起码转3轮
            var duration = this.drawTimes === 1 ? '3s' : con.tenTimesS

            return new Promise((resolve, reject) => {
                let endA = (ind * 2 + 1) * perA
                let endAngle = baseRound + endA + offsetR

                this.endAngle = endAngle

                this.turnAni.transform = `rotate(${this.endAngle}deg)`
                this.turnAni.transitionProperty = 'transform'
                this.turnAni.transitionDuration = duration

                con.cbs.push(resolve)
            })
        },
        // trigger 动画结束的中间函数 -> 通知其他观察者完成
        panelEnd () {
            this.resetPanel(this.endAngle % 360)
            let callback = con.cbs.shift()
            callback && callback()
        },
        // 再次加载动画时 重置位置
        resetPanel (angle) {
            this.endAngle = angle
            this.turnAni.transitionProperty = 'none'
            this.turnAni.transform = `rotate(${this.endAngle}deg)`
        },
        // 计时显示10次抽奖结果框
        showLotResBox (indArr, totalTimes) {
            this.lotResState = true

            while (indArr.length < totalTimes) {
                let n = Math.floor(Math.random() * (indArr.length - 1))

                indArr.splice(n, 0, null)
            }

            let line = Promise.resolve()
            let fnLine = indArr.map((prize) => () => new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.lotRes.push(prize ? {
                        name: prize.prizeName,
                        icon: this.lotResMap[prize.prizeName]
                    } : null)
                    resolve()
                }, con.tenTimesD * 100 - 50) // ms
            }))

            fnLine.forEach((next) => {
                line = line.then(next)
            })
            return fnLine
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

            console.log('[init scroller loader]')
            scrollBox(this.$refs['rank-scroller'].$el, this.loadRank, this)
        },
        // service api
        atte (item) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            if (item.isLoved) {
                console.log('已关注')
                return
            }

            service.attend(item.id).then(data => {
                if (data.errno === 0) {
                    item.isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            })
        },
        init () {
            return service.init().then(data => {
                this.currStage = data.isActivity
                this.isLogin = !!data.loginStatus
                this.isMod = data.loginStatus === 'mod'
                if (!this.isLogin) return // 未登录

                if (this.isMod) {
                    this.progress = data.stage
                }

                this.lotTimes.mod = data.modLotteryNum
                this.lotTimes.user = data.userLotteryNum
            })
        },
        refreshRank () {
            this.currRank = {
                type: this.rankTabType === 1 ? 'mod' : 'user',
                hasNext: true,
                currPage: 0,
                list: [],
                meCenter: null
            }
            this.refreshRankScroller()
            this.showLoading()
            this.loadRank().then(() => {
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        },
        loadRank () {
            let type = this.currRank.type
            let source = this.currRank
            if (!source.hasNext) {
                console.log(`[loading ${type}]: 没有更多数据...`)
                return Promise.resolve()
            }
            if (source.loading) {
                console.log(`[load ${type}]: loading 正在加载中... 请稍后`)
                return Promise.resolve()
            }

            if (!source.inited) {
                this.showLoading()
            }
            source.loading = true
            return service.getRanks(type, source.currPage + 1).then(data => {
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
                }
            })
        },
        // 加载我的中奖记录
        loadMyRec () {
            this.showLoading()
            let lotType = this.lotTabType
            return service.getMyRec(lotType).then((data) => {
                this.reclist[lotType] = data.record

                if (lotType === 'mod') {
                    this.rwlist.mod[0].progress[0] = data.publish
                    this.rwlist.mod[1].progress[0] = data.social
                } else {
                    this.rwlist.user[0].progress[0] = data.watch
                    this.rwlist.user[1].progress[0] = data.gift
                    this.rwlist.user[2].progress[0] = data.bonus
                    this.rwlist.user[3].progress[0] = data.social
                }
            }).then(() => {
                this.hideLoading()
            }).catch((err) => {
                this.showToast(err.message)
                this.hideLoading()
            })
        }
    }
}

export default CommonMixin
