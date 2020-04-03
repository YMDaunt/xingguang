import axios from 'axios'
import Loading from './components/Loading.vue'
import bodymovin from '../component/bodymovin.min.js'

var con = {
    toastTimer: null,
    toastDuration: 3000,
    svgIns: null,
    svgAniIns: [null, null],
    svgAniPath: [
        '//static.guojiang.tv/app/gift/pc_animation/summer_watergun/data.json',
        '//static.guojiang.tv/app/gift/pc_animation/summer_cool/data.json'
    ]
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
    // 关注
    atte: function (mid) {
        return axios.get('/chenChen/attention', {
            params: {
                mid: mid
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // init
    initInfo: function () {
        return axios.get('/sweetHeart/Init').then(this.apiHandler).then(this.dataHandler)
    },
    // purchase
    purchase: function (num) {
        if (num === 0) return
        return axios.get('/sweetHeart/buyProduct', {
            params: {
                pid: 607,
                num
            }
        }).then(this.apiHandler)
    },
    // loadRank
    loadRank: function (type, pageNo) {
        return axios.get('/sweetHeart/ranks', {
            params: {
                pageNo,
                pageSize: 15,
                type
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    vsStatus: function () {
        return axios.get('/sweetHeart/teamInfo').then(this.apiHandler).then(this.dataHandler)
    }
}

const CommonMixin = {
    components: { Loading },
    data: {
        ruleState: false,
        toastState: false,
        toastMsg: '',
        modalState: false,
        modalType: '',
        svgShow: false,

        forms: {
            buyInput: 1,
            buyPrice: 9999
        },
        perPrice: 9999,

        atte: {
            mid: null, // TODO 测试 瑾辰辰 mid
            rid: null
        },
        // atte: { // online
        //     mid: ,
        //     rid:
        // },
        isAtte: false,
        islogin: false,

        stage: 0, // 0 未开始 1 进行中 2 已结束
        pkScore: {
            red: 0,
            blue: 0,
            winner: false
        },

        rankType: 'red',
        vsRank: {
            list: [],
            meCenter: null,
            hasNext: true,
            loading: false,
            currPage: 0
        },
        coolRank: {
            list: [],
            meCenter: null,
            inited: false,
            hasNext: true,
            loading: false,
            currPage: 0
        }
    },
    computed: {
        pkStatusClass () {
            if (this.stage === 0) return 'res-default'
            if (this.stage === 1) return ''
            if (this.pkScore.winner === 1) return 'res-red-win'
            if (this.pkScore.winner === 2) return 'res-blue-win'
            return ''
        },
        pkStatusStyle () {
            let red = this.pkScore.red
            let blue = this.pkScore.blue
            let total = red + blue
            let percent

            if (total === 0) {
                percent = 0.5
            } else {
                percent = red / total
            }

            percent = Math.ceil(percent * 100)

            percent = percent < 20 ? 20 : percent
            percent = percent > 90 ? 90 : percent

            return {
                background: `linear-gradient(to right, #e83233 0%, #bc5b6b ${percent - 10}%, #788aaf ${percent + 10}%, #34afe8 100%)`
            }
        },
        vsRanklist () {
            if (this.stage === 0) return []

            return this.vsRank.list
        },
        coolRanklist () {
            if (this.stage === 0) return []

            return this.coolRank.list
        }
    },
    mounted () {
        this.initInfo().then(() => {
            this.pollingVS()
        })
        this.initScroll()
        this.loadVSRank()
        this.loadCoolRank()
    },
    methods: {
        // init
        initInfo () {
            this.showLoading()
            return service.initInfo().then(data => {
                this.hideLoading()
                this.islogin = data.isLogin
                this.isAtte = data.isLoved
                this.atte.mid = data.mid
                this.atte.rid = data.rid
                this.stage = data.isActivity
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        },
        pollingVS () {
            if (this.stage === 0) return

            console.log('-> polling')
            return service.vsStatus().then(data => {
                this.pkScore.red = data.red
                this.pkScore.blue = data.blue
                this.pkScore.winner = data.winner

                this.stage === 1 && setTimeout(() => {
                    this.pollingVS()
                }, 5000)
            }).catch(err => {
                console.log(err)
            })
        },
        // 关注活动大使
        atteAM () {
            if (!this.islogin) return this.goLogin()
            if (this.isAtte) return

            return service.atte(this.atte.mid).then(data => {
                this.isAtte = true
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // 通用关注
        payAtte (info) {
            if (info.isLoved) return

            return service.atte(this.atte.mid || this.atte.id).then(data => {
                info.isLoved = true
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // common
        showLoading () {
            this.$refs.loading.show()
        },
        hideLoading () {
            this.$refs.loading.hide()
        },
        toggleRule () {
            this.ruleState = !this.ruleState

            if (this.ruleState) {
                this.ruleRefresh && this.ruleRefresh()
            }
        },
        toggleModal () {
            this.modalState = !this.toggleModal
        },
        goAMRoom () {
            this.goRoom(this.atte)
        },
        /* 点击预览 */
        preview (type) { // type = 0 / 1 [0 - 夏日水枪 1 - 清凉一夏]
            if (typeof type === 'undefined') return
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
        // 前往购买
        showBuy () {
            if (!this.islogin) return this.goLogin()
            if (this.stage === 0) return this.showToast('7.9 12:00才可购买！')
            if (this.stage === 2) return this.showToast('活动已结束！')

            this.modalState = true
            this.modalType = 'buy'
        },
        /* form input */
        _inputFilter (value) {
            if (value === '') {
                return 0
            }

            value = +value.replace(/[^0-9]+/g, '')

            if (value > 9999) {
                value = 9999
            }
            if (value <= 0) {
                value = 0
            }

            return value
        },
        inputFocus (evt) {
            evt.target.focus()
        },
        buyInput (evt) {
            var price = this.perPrice
            var value = this._inputFilter(evt.target.value)

            evt.target.value = value
            this.forms.buyInput = value
            this.forms.buyPrice = value * price
        },
        purchase () {
            if (this.forms.buyInput === 0) {
                this.showToast('购买数量不能为0')
                return
            }

            service.purchase(this.forms.buyInput).then(res => {
                this.modalState = false
                this.modalType = ''
                if (res.errno === 0) {
                    this.showToast('礼物已放至您的背包，请注意查收！')
                    this.refreshBackpack && this.refreshBackpack() // 刷新礼物背包
                } else {
                    if (res.msg === '余额不足，请充值再来！' || res.errno === 111) {
                        this.modalState = true
                        this.modalType = 'charge'
                    } else {
                        this.showToast(res.msg)
                    }
                }
            })
        },
        chargeCancel () {
            this.modalState = false
            this.modalType = ''
        },
        chargeOK () {
            this.goRecharge()
        },
        // 更换tab
        changeTab (type) {
            if (this.rankType === type) return
            this.rankType = type

            this.pcRankRefresh && this.pcRankRefresh()

            this.refreshVSRank()
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
            scrollBox(this.$refs['vs-scroller'].$el, () => {
                this.loadVSRank()
            }, this)
            scrollBox(this.$refs['cool-scroller'].$el, () => {
                this.loadCoolRank()
            }, this)
        },
        refreshVSRank () {
            this.vsRank = {
                list: [],
                meCenter: null,
                hasNext: true,
                loading: false,
                currPage: 0
            }

            this.showLoading()
            this.loadVSRank().then(() => {
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
            })
        },
        loadVSRank () {
            return this.loadRank(this.vsRank, 'loadRank', this.rankType, 50, [this.rankType])
        },
        loadCoolRank () {
            return this.loadRank(this.coolRank, 'loadRank', 'coolRank', 100, ['user'])
        },
        // 榜单加载工厂方法
        loadRank (source, serviceName, tag, maxNum, args) {
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
                var list = source.list.concat(data.data)

                if (list.length > maxNum) {
                    source.list = list.slice(0, maxNum)
                    source.hasNext = false
                } else {
                    source.list = list
                    // source.hasNext = data.hasNext
                }

                source.currPage += 1
                source.loading = false

                if (!source.inited) {
                    source.inited = true
                    source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
                }
            }
            if (args) {
                return service[serviceName](...args, source.currPage + 1).then(responser)
            } else {
                return service[serviceName](source.currPage + 1).then(responser)
            }
        }
    }
}

export default CommonMixin
