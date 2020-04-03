import axios from 'axios'
import Loading from '../components/Loading.vue'
import bodymovin from '../../component/bodymovin.min.js'

var con = {
    toastTimer: null,
    toastDuration: 3000,
    svgIns: null,
    svgAniIns: {},
    svgAniPath: {
        '人生如戏': '//static.guojiang.tv/app/gift/pc_animation/tuanzi_life/data.json',
        '花团锦簇': '//static.guojiang.tv/app/gift/pc_animation/tuanzi_flowers/data.json'
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
    init () {
        return axios.get('/tuanZi/Init').then(this.apiHandler).then(this.dataHandler)
    },
    atte (mid) {
        return axios.get('/chenChen/attention', {
            params: {
                mid: mid
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    purchase (pid, pnum) {
        if (!pid || !pnum) return

        return axios.get('/tuanZi/buyProduct', {
            params: {
                pid: pid,
                num: pnum
            }
        }).then(this.apiHandler)
    }
}

const CommonMixin = {
    components: { Loading },
    data: {
        stage: 0,
        isLogin: false,

        toastState: false,
        toastMsg: '',

        picShow: false,
        pwGift: {
            pid: '',
            name: ''
        },

        svgShow: false,
        buyShow: false,
        chargeShow: false,

        forms: {
            buyPid: null,
            buyInput: 1,
            buyPrice: 10,
            perPrice: 10
        },

        amber: {
            rid: 0,
            mid: 0,
            isLoved: false,
            giftNum: 0
        },
        cusGifts: [],
        cusGiftsCMap: {
            '吃货': 'ch',
            '喵团': 'mt',
            '假装忧郁': 'jzyy',
            '糯米团子': 'nmtz',
            '表情控': 'bqk',
            '人生如戏': 'rsrx',
            '嫌弃': 'xq',
            '有文化的大团子': 'ywhdtz',
            '爱你团子': 'antz',
            '花团锦簇': 'htjc',
            '假艺术家1': 'jysj1',
            '假艺术家2': 'jysj2'
        }
    },
    mounted: function () {
        this.init()
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
        showPic (pid, name) {
            this.picShow = true
            this.pwGift.pid = pid
            this.pwGift.name = name
        },
        hidePic () {
            this.picShow = false
        },
        goSvg (animName, animUrl) {
            if (typeof animName === 'undefined') return
            if (con.svgAniIns[animName]) {
                con.svgAniIns[animName].play()
            } else {
                con.svgAniIns[animName] = playSvg(animUrl)

                con.svgAniIns[animName].play()
            }

            con.svgIns = con.svgAniIns[animName]

            this.svgShow = true
        },
        stopSvg () {
            this.svgShow = false
            if (con.svgIns) {
                con.svgIns.stop()
                con.svgIns = null
            }
        },
        hideBuy () {
            this.buyShow = false
        },
        hideCharge () {
            this.chargeShow = false
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
            var price = this.forms.perPrice
            var value = this._inputFilter(evt.target.value)

            evt.target.value = value
            this.forms.buyInput = value
            this.forms.buyPrice = value * price
        },
        purchase () {
            if (!this.forms.buyPid) {
                this.showToast('未选中礼物id')
                return
            }
            if (this.forms.buyInput === 0) {
                this.showToast('购买数量不能为0')
                return
            }

            this.showLoading()
            service.purchase(this.forms.buyPid, this.forms.buyInput).then(res => {
                this.hideLoading()
                this.hideBuy()
                if (res.errno === 0) {
                    this.showToast('礼物已放至您的背包，请注意查收！')
                    this.refreshBackpack && this.refreshBackpack() // 刷新礼物背包
                } else {
                    if (res.msg === '余额不足，请充值再来！' || res.errno === 111) {
                        this.chargeShow = true
                    } else {
                        this.showToast(res.msg)
                    }
                }
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.msg)
            })
        },
        init () {
            this.showLoading()
            return service.init().then(res => {
                this.hideLoading()

                this.stage = res.isActivity
                this.isLogin = res.isLogin
                this.amber.rid = res.rid
                this.amber.mid = res.mid
                this.amber.isLoved = res.isLoved
                this.amber.giftNum = res.giftNum

                this.cusGifts = res.products
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        atteAmber () {
            if (!this.isLogin) return this.goLogin()
            if (this.amber.isLoved) return

            this.showLoading()
            return service.atte(this.amber.mid).then(data => {
                this.hideLoading()
                this.amber.isLoved = true
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        },
        preview (gift) {
            if (con.svgAniPath[gift.name]) {
                this.goSvg(gift.name, con.svgAniPath[gift.name])
            } else {
                this.showPic(gift.pid, gift.name)
            }
        },
        goBuy (gift) {
            if (!this.isLogin) return this.goLogin()

            this.forms.buyPid = gift.pid
            this.forms.buyInput = 1
            this.forms.perPrice = gift.price
            this.forms.buyPrice = gift.price

            this.buyShow = true
        }
    }
}

export default CommonMixin
