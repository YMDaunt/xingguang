import axios from 'axios'
import Loading from '../components/Loading.vue'
import Toast from '../components/Toast.vue'
import BuyModal from '../components/BuyModal.vue'
import ChargeModal from '../components/ChargeModal.vue'
import SvgPlayer from '../components/SvgPlayer.vue'

const svgPath = {
    coupleFly: '//static.guojiang.tv/app/gift/pc_animation/qixi19_bird/data.json',
    romanticDay: '//static.guojiang.tv/app/gift/pc_animation/qixi19_card/data.json'
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
    init: function () {
        return axios.get('/chineseValentine/init').then(this.apiHandler).then(this.dataHandler)
    },
    initCard: function () {
        return axios.get('/chineseValentine/getUserBlocks').then(this.apiHandler).then(this.dataHandler)
    },
    loadRank: function () {
        return axios.get('/chineseValentine/ranks').then(this.apiHandler).then(this.dataHandler)
    },
    getHotRandomRoom: function () {
        return axios.get('/chineseValentine/getTop10Mods').then(this.apiHandler).then(this.dataHandler)
    },
    buyGifts: function (num) {
        return axios.get('/chineseValentine/buyProduct', {
            params: {
                num
            }
        }).then(this.apiHandler)
    }
}

const CommonMixin = {
    components: { Loading, BuyModal, ChargeModal, Toast, SvgPlayer },
    data: {
        isLogin: false,
        stage: 0,
        isMod: false,

        // 用于判断 是否有ip限制 // true => 没有限制
        cardlimit: {
            lang: true,
            man: true,
            qi: true,
            xi: true
        },

        card: {
            lang: 0,
            man: 0,
            qi: 0,
            xi: 0,
            watchTime: 0,
            score: 0,
            allFinished: false
        },

        rank: {
            list: [],
            meCenter: null
        },

        listHolder: {
            isPlaying: false,
            nickname: '虚位以待',
            headPic: '',
            score: '-',
            mostScoreUser: {
                nickname: '虚位以待',
                headPic: ''
            },
            _holder: true
        },

        ruleState: false,
        chargeShow: false,

        checking: false
    },
    mounted: function () {
        this.showLoading()
        Promise.all([
            this.init(),
            this.initCard(),
            this.loadRank()
        ]).then(() => {
            this.hideLoading()
        }).catch(err => {
            this.hideLoading()

            if (err.message === '用户未登录') {
                // this.showToast('请先登录')
                console.log('请先登录')
            } else {
                this.showToast(err.message)
            }
        })
    },
    computed: {
        ranklist () {
            let res = []
            for (let i = 0; i < 10; i++) {
                res.push(this.rank.list[i] || this.listHolder)
            }
            return res
        }
    },
    methods: {
        showLoading () {
            this.$refs.loading.show()
        },
        hideLoading () {
            this.$refs.loading.hide()
        },
        toggleRule () {
            this.ruleState = !this.ruleState
            if (this.ruleState) {
                this.resetRule()
            }
        },
        hideCharge () {
            this.chargeShow = false
        },
        showToast (msg) {
            this.$refs.toast.show(msg)
        },
        preview (type) {
            svgPath[type] && this.$refs.svgPlayer.playSvg(svgPath[type])
        },
        checkStage () {
            if (this.stage === 0) {
                this.showToast('活动未开始！')
                return false
            }
            if (this.stage === 2) {
                this.showToast('活动已结束！')
                return false
            }
            return true
        },
        checkLimit (card) {
            if (this.cardlimit[card] === undefined) {
                return Promise.resolve(false)
            }
            if (!this.cardlimit[card]) {
                this.showToast('一个设备/IP每日仅限一个ID获得字块哦！')
                return Promise.resolve(false)
            }

            if (this.checking) {
                this.showToast('正在加载中，请勿频繁操作。')
                return Promise.resolve(false)
            }

            // 重新检测
            this.checking = true
            this.showLoading()
            return service.init().then(data => {
                this.checking = false
                this.hideLoading()
                this.cardlimit = data.blockLimit
                if (!this.cardlimit[card]) {
                    this.showToast('一个设备/IP每日仅限一个ID获得字块哦！')
                    return false
                } else {
                    return true
                }
            })
        },
        goRandomRoom (card) {
            if (!this.checkStage()) return

            this.checkLimit(card).then(result => {
                if (!result) return

                this.showLoading()
                return service.getHotRandomRoom().then(data => {
                    this.hideLoading()
                    this.goRoom(data)
                }).then(data => {
                    this.hideLoading()
                    this.goRoom(data)
                }).catch(err => {
                    this.hideLoading()
                    this.showToast(err.message)
                })
            })
        },
        goChargeProxy (card) {
            if (!this.checkStage()) return

            this.checkLimit(card).then(result => {
                if (!result) return
                this.goRecharge()
            })
        },
        init () {
            return service.init().then(data => {
                this.isLogin = data.isLogin
                this.stage = data.activityStatus
                this.isMod = data.isMod
                this.cardlimit = data.blockLimit
            })
        },
        initCard () {
            return service.initCard().then(data => {
                this.card = {
                    ...this.card,
                    ...data
                }
            })
        },
        goBuy () {
            if (!this.checkStage()) return

            if (!this.isLogin) {
                this.goLogin()
                return
            }

            this.$refs.buyModal.show()
        },
        purchase (num) {
            if (num <= 0 || num > 9999) {
                this.$refs.toast.show('请输入正确的购买数量')
                return
            }
            this.showLoading()
            service.buyGifts(num).then(res => {
                this.hideLoading()
                this.$refs.buyModal.hide()
                if (res.errno === 0) {
                    this.showToast('礼物已放至您的背包，请注意查收！')
                    if (this.refreshBackpack) this.refreshBackpack() // 刷新礼物背包
                } else {
                    if (res.msg === '余额不足，请充值再来！' || res.errno === 111) {
                        this.chargeShow = true
                    } else {
                        this.showToast(res.msg)
                    }
                }
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        },
        // 榜单加载工厂方法
        loadRank () {
            return service.loadRank().then(data => {
                this.rank.list = data.ranks || []
                this.rank.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
            })
        }
    }
}

export default CommonMixin
