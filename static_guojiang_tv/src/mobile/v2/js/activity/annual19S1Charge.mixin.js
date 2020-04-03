import axios from 'axios'
import Loading from './components/Loading.vue'

var con = {
    toastTimer: null,
    toastDuration: 3000,
    timer: null
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
    // 抽奖
    goLot () {
        return axios.get('/anniversary2019/goLottery').then(this.apiHandler)
    },
    // 抽奖公告
    getPrizeBoard () {
        return axios.get('/anniversary2019/lotteryList').then(this.apiHandler).then(this.dataHandler)
    }
}

const CommonMixin = {
    components: { Loading },
    data: {
        stage: 1,

        toastState: false,
        toastMsg: '',

        checkedI: -1,

        loting: false,
        lotBox: [
            {
                name: '年度票*66',
                icon: 'g-ndp-x66'
            },
            {
                name: '自定义8位靓号',
                icon: 'g-lh'
            },
            {
                name: '助力票*1',
                icon: 'g-zlp-x1'
            },
            {
                name: '助力票*1000',
                icon: 'g-zlp-x1000'
            },
            {
                name: '盛典火箭*1',
                icon: 'g-rocket'
            },
            {
                name: '年度票*3',
                icon: 'g-ndp-x3'
            },
            {
                name: '助力票*188',
                icon: 'g-zlp-x188'
            },
            {
                name: '助力票*30',
                icon: 'g-zlp-x30'
            },
            {
                name: '年度票*30',
                icon: 'g-ndp-x30'
            },
            {
                name: '年度票*5',
                icon: 'g-ndp-x5'
            }
        ],

        lotList: []
    },
    mounted: function () {
        this.initBoard()
    },
    computed: {
        lotType () {
            if (this.stage === 2) {
                return 'btn-lot-d'
            }
            if (this.loting) {
                return 'btn-loting'
            }
            return 'btn-lot'
        }
    },
    methods: {
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
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
        // 初始化公告列表
        initBoard () {
            service.getPrizeBoard().then(data => {
                this.lotList = data
            }).then(() => {
                this.runBoard()
            })
        },
        // 滚动公告列表
        runBoard () {
            let boardlist = this.$refs['board-list']
            let scrollH = boardlist.clientHeight
            let clientH = this.$refs['board-warp'].clientHeight
            let topY = 0
            let stepY = 0.4

            if (scrollH <= clientH) {
                return
            }

            console.log('[runBoard Ani]')
            // 动画
            function run () {
                topY -= stepY
                boardlist.style.transform = `translate3d(0px, ${topY}px, 0px)`
                boardlist.style.webkitTransform = `translate3d(0px, ${topY}px, 0px)`

                if (Math.abs(topY) > (scrollH / 2)) {
                    topY = 0
                }

                requestAnimationFrame(run)
            }

            requestAnimationFrame(run)
        },
        // 前往抽奖
        goLot () {
            if (this.stage === 0) {
                this.showToast('活动未开始~')
                return
            }
            if (this.loting) {
                console.log('正在抽奖中，请稍等')
                return
            }
            service.goLot().then((data) => {
                if (data.errno === 0) {
                    // 中奖信息
                    this.loting = true
                    this.runAni(data.data.prizeName || '') // 传入中奖的奖品名称
                } else {
                    // 错误信息
                    this.showToast(data.msg)
                }
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // 抽奖动画
        runAni (prizeName) {
            let _this = this
            let pi = this.checkedI === -1 ? 0 : this.checkedI
            let pn = typeof prizeName === 'string' ? (prizeName || '').trim() : ''

            let setMap = [0, 1, 2, 3, 5, 9, 8, 7, 6, 4] // 动画 旋转 位置映射表 value -> refIndex

            for (let i = 0, len = this.lotBox.length; i < len; i++) {
                if (this.lotBox[i].name === pn) {
                    this.checkedI = setMap.indexOf(i) // refIndex -> 停止位置
                    break
                }
            }

            let stepi = pi // 开始位置
            let setMaplen = setMap.length
            let times = setMaplen * 5 + this.checkedI // frames

            function run () {
                let step = 6 // 步长
                if (stepi < (6 + pi)) {
                    step = stepi - pi
                }
                if (times - stepi < 6) {
                    step = times - stepi
                }
                let speed = 400 - 50 * step // 速度
                let nowI = setMap[stepi % setMaplen] // 取 dom index
                let prevI = setMap[(stepi - 1) % setMaplen] // 取 dom index

                _this.$refs['lotI'][nowI].className = 'lot-i g-s fl-box g-checked' // 置为checked
                typeof prevI !== 'undefined' && (_this.$refs['lotI'][prevI].className = 'lot-i g-s fl-box g-common') // 上一个置为common

                stepi += 1

                if (stepi <= times) {
                    con.timeraniTimer = setTimeout(run, speed)
                    return
                }

                if (_this.checkedI === -1) {
                    setTimeout(() => {
                        _this.loting = false
                        _this.$refs['lotI'][4].className = 'lot-i g-s fl-box g-common'
                        _this.showToast('好遗憾，什么也没有！')
                    }, speed)
                    return
                }

                _this.loting = false
                if (pn === '自定义8位靓号') {
                    _this.showToast(`恭喜您抽中自定义8位靓号，运营会在活动结束的3个工作日内和您联系！`)
                } else {
                    _this.showToast(`恭喜您抽中${pn}，礼物已放至背包，请注意查收！`)
                }
            }

            run()
        }
    }
}

export default CommonMixin
