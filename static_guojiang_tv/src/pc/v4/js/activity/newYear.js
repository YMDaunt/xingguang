import axios from 'axios'
import vue from 'vue'
import PolyfillScroll from '../component/gj.polyfillScroll.js'

require('../../css/activity/newYear.less')

document.body.addEventListener('touchstart', function () {})

const os = (function () {
    var ua = navigator.userAgent

    var isWindowsPhone = /(?:Windows Phone)/.test(ua)

    var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone

    var isAndroid = /(?:Android)/.test(ua)

    var isFireFox = /(?:Firefox)/.test(ua)

    var isChrome = /(?:Chrome|CriOS)/.test(ua)

    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))

    var isPhone = /(?:iPhone)/.test(ua) && !isTablet

    var isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

window.onscroll = function () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    vm.$data.signBtn = !(scrollTop > 470)
    vm.$data.fixedBtn = scrollTop > 920
}

const vm = new vue({
    el: '#app',
    data: {
        signBtn: true,
        fixedBtn: false,

        signPage: false,
        rulePage: false,
        prizePage: false,
        inputPage: false,
        tips: false,
        tipsMsg: '',
        giftBuyStatus: false,

        profile: {
            isUserSignToday: false,
            signedTimes: 0,
            showAwardForm: false
        },
        signedTime: 0,
        currentItem: 'toucai',
        modUserList: {
            modPage: 0,
            userPage: 0
        },
        currentType: 'mod', // mod主播榜 user用户榜
        modLists: [], // 主播榜列表
        userLists: [], // 用户榜列表
        currentLists: [],
        moreStopStatus: false, // 查看更多，收起
        actDuratime: '2.14 23:59:59',
        currentTime: 0,
        boomNum: 0,

        getPrizeMethod: 0,
        userMsg: {
            place: '',
            name: '',
            phone: ''
        },
        prizeModel: 0,
        rankScrollEnity: null,
        scrollLock: false,
        showSvgStatus: false,
        showGifStatus: false,
        isLogin: false,
        actPartDeclar: '计数周期：2.9 12:00:00——2.14 23:59:59期间。头彩榜数据与财神榜无关。'
    },
    created () {
        this.Profile()
        this.getRank('mod')
        this.getRank('user')
    },
    mounted () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.signBtn = !(scrollTop > 470)
        this.fixedBtn = scrollTop > 920

        const entity = new PolyfillScroll({
		   scrollWrap: '.basket-prize-wrap',
		   scrollContent: '.basket-scroll-content',
		   bar: {
		       background: 'rgba(0,0,0,0.6)'
		   },
		   cb (distance) {
		       console.log(distance)
		   }
        })
    },
    methods: {
        signBtnHanle () {
            this.signPage = !this.signPage
        },
        ruleBtnHanle () {
            this.rulePage = !this.rulePage
        },
        prizeBtnHanle () {
            this.prizePage = !this.prizePage
        },
        inputBtnHanle () {
            this.Profile()
            this.inputPage = !this.inputPage
        },
        closeCover () {
            this.signPage = false
            this.rulePage = false
            this.prizePage = false
            this.inputPage = false
            this.giftBuyStatus = false
        },

        // 提示信息
        setTipsMsg (data) {
            this.tips = true
            this.tipsMsg = data
            setTimeout(function () {
                this.tips = false
            }.bind(this), 1500)
        },
        getRank (part) {
            let page = 0
            if (part === 'mod') {
                page = ++this.modUserList.modPage
            } else {
                page = ++this.modUserList.userPage
            }
            axios.get('/NewYear18/GetRank', {
                params: {
                    cate: this.currentItem,
                    type: part,
                    page: page
                }
            })
                .then(res => res.data.data)
                .then(data => {
                    if (!data.result.data.length) return
                    this.scrollLock = false
                    if (part === 'mod') {
                        this.modLists = [].concat(this.modLists, data.result.data)
                    } else {
                        this.userLists = [].concat(this.userLists, data.result.data)
                    }
                    if (this.currentType === 'mod') {
                        this.currentLists = this.modLists
                    } else {
                        this.currentLists = this.userLists
                    }
                })
                .catch(err => console.log(err))
        },
        Profile () {
            axios.get('/NewYear18/Profile')
                .then((res) => {
                    if (res.data.data.uid === '0000') {
                        document.querySelector('.login').click()
                    } else {
                        this.isLogin = true
                        return res.data.data
                    }
                })
                .then(data => {
                    this.profile = data.result
                    this.boomNum = this.profile['leftFireworkNum']
                    this.signedTime = this.profile['signedTimes'] < 10 ? '0' + this.profile['signedTimes'] : this.profile['signedTimes']
                    this.userMsg.place = data.userMsg['address']
                    this.userMsg.name = data.userMsg['name']
                    this.currentTime = data.time * 1000
                    this.userMsg.phone = data.userMsg['phone']
                    if (data.userMsg['type'] == 1) {
                        this.getPrizeMethod = 0
                    } else {
                        this.getPrizeMethod = 1
                    }
                })
                .catch(err => console.log(err))
        },
        // 签到
        signToday () {
            if (os.isPc) {
                return this.setTipsMsg('请移步APP参与')
            }
            if (this.profile['isUserSignToday']) return
            this.profile['isUserSignToday'] = true
            axios.get('/NewYear18/Sign')
                .then(res => res.data.data
                )
                .then(data => {
                    if (!data.result) {
                        this.profile['isUserSignToday'] = false
                        this.setTipsMsg(data.errMsg)
                    } else {
                        this.profile['signedTimes']++
                        this.setTipsMsg('签到成功！')
                    }
                })
                .catch(err => console.log(err))
        },
        // 查看更多
        lookMore () {
            const that = this
            this.moreStopStatus = !this.moreStopStatus
            this.rankScrollEnity && this.rankScrollEnity.refresh()
            let scrollWrap = document.querySelector('.sort-body-block')
            let scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('max-height'))
            let scrollContent = document.querySelector('.sort-body-block ul')
            if (this.moreStopStatus) {
                vue.nextTick(() => {
                    const cH = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                    if (document.querySelector('.sort-body-block').lastChild.nodeName === 'DIV' && cH > scrollWrapHeight) {
                        document.querySelector('.sort-body-block').lastChild.style.opacity = 1
                    }
                })
            } else {
                if (document.querySelector('.sort-body-block').lastChild.nodeName === 'DIV') {
                    document.querySelector('.sort-body-block').lastChild.style.opacity = 0
                }
            }

            if (this.moreStopStatus && !this.rankScrollEnity) {
                vue.nextTick(() => {
                    this.rankScrollEnity = new PolyfillScroll({
					    scrollWrap: '.sort-body-block',
					    scrollContent: '.sort-body-block ul',
					    bar: {
					    	background: 'rgba(0,0,0,0.6)'
					    },
					    cb (distance) {
					        console.log(distance)
					        if (!distance) return
					        const contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
					        if (contentHeight - distance - scrollWrapHeight < 300) {
					            if (that.scrollLock) return
					            that.scrollLock = true
					            if (that.currentType === 'mod') {
					                that.getRank('mod')
					            } else {
					                that.getRank('user')
					            }
					        }
					    }
                    })
                })
            }
        },
        // 主播和用户切换
        changeMan (id) {
            this.moreStopStatus = false
            this.scrollLock = false
            if (id === 0) {
                this.currentType = 'mod'
                this.currentLists = this.modLists
            } else {
                this.currentType = 'user'
                this.currentLists = this.userLists
            }
            this.rankScrollEnity && this.rankScrollEnity.refresh()
            if (document.querySelector('.sort-body-block').lastChild.nodeName === 'DIV') {
                document.querySelector('.sort-body-block').lastChild.style.opacity = 0
            }
        },
        // 头彩榜 财神榜切换
        changeActi (idx) {
            this.currentType = 'mod'
            this.modUserList = {
                modPage: 0,
                userPage: 0
            }
            this.moreStopStatus = false
            this.currentLists = []
            this.modLists = []
            this.userLists = []
            this.scrollLock = false
            if (idx === 0) {
                this.actPartDeclar = '计数周期：2.9 12:00:00——2.14 23:59:59期间。头彩榜数据与财神榜无关。'
                this.currentItem = 'toucai'
                this.actDuratime = '2.14 23:59:59'
            } else {
                this.actPartDeclar = '计数周期：2.15 0:00:00——2.20 23:59:59期间。财神榜数据与头彩榜无关。'
                this.currentItem = 'caishen'
                this.actDuratime = '2.20 23:59:59'
            }
            this.rankScrollEnity && this.rankScrollEnity.refresh()
            if (document.querySelector('.sort-body-block').lastChild.nodeName === 'DIV') {
                document.querySelector('.sort-body-block').lastChild.style.opacity = 0
            }
            this.getRank('mod')
            this.getRank('user')
        },
        // 领取奖励
        setUserMsg (idx) {
            if (idx === 0) {
                this.getPrizeMethod = 0
            } else {
                this.getPrizeMethod = 1
            }
        },
        // 提交用户信息
        submitUserMsg () {
            let msgObj = {
                type: 2
            }
            if (!this.getPrizeMethod) {
                if (!this.userMsg.place) {
                    return this.setTipsMsg('请填写收货地址')
                }
                if (!this.userMsg.name) {
                    return this.setTipsMsg('请填写收货人姓名')
                }
                if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.userMsg.phone)) {
                    return this.setTipsMsg('请填写正确手机号码！')
                }
                msgObj = {
                    type: 1,
                    address: this.userMsg.place,
                    name: this.userMsg.name,
                    phone: this.userMsg.phone
                }
            }
            axios.get('/NewYear18/SaveMsg', {
                params: msgObj
            })
                .then(res => res.data.data)
                .then(data => {
                    if (data.uid === '0000') return document.querySelector('.login').click()
                    if (!data.result) {
                        this.setTipsMsg(data.errMsg)
                    } else {
                        this.inputPage = false
                        this.setTipsMsg('保存成功')
                    }
                })
                .catch(err => console.log(err))
        },
        // 弹框礼物切换
        changePrizeModel (idx) {
            if (!idx) this.prizeModel = 0
            else this.prizeModel = 1
        },
        // 去总结
        goSummary () {
            if (!this.isLogin) return document.querySelector('.login').click()
            if (os.isPc) {
                return this.setTipsMsg('请移步APP参与')
            }
            location.href = '//m.kuaishouvideo.com/dist/activity/summary.html'
        },
        // 购买礼物
        giftBuyShow () {
            if (!this.isLogin) return document.querySelector('.login').click()
            this.giftBuyStatus = true
        },
        // 购买数量
        submitNum () {
            this.giftBuyStatus = false
            axios.get('/NewYear18/Buy', {
                params: {
                    num: 7
                }
            })
                .then(res => res.data.data)
                .then(data => {
                    if (!data.result) {
                        this.setTipsMsg(data.error)
                    } else {
                        this.setTipsMsg('购买成功')
                    }
                })
                .catch(err => console.log(err))
        },
        closeShowSvg (idx) {
            this.showSvgStatus = !this.showSvgStatus
            if (idx === 1) {
                this.svgAni('//static.guojiang.tv/src/pc/img/room/svg/mount/25/data.json')
            } else if (idx === 2) {
                this.svgAni('//static.guojiang.tv/app/gift/pc_animation/firework/firework_all.json')
            }
        },
        closeShowGif () {
            this.showGifStatus = !this.showGifStatus
        },
        svgAni (path) {
		    // 生成svg动画
            var svgWrap = document.querySelector('.show-svg')
            svgWrap.innerHTML = ''
            bodymovin.loadAnimation({
                wrapper: svgWrap,
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: path
            })
        },
        addLove (id, index) {
            if (!this.isLogin) return document.querySelector('.login').click()
            axios.get('/NewYear18/AddLove', {
                params: {
                    id
                }
            })
                .then(res => res.data.data)
                .then(data => {
                    if (!data.attResult) {
                        return this.setTipsMsg(data.error)
                    }
                    this.currentLists[index].isLoved = true
                })
                .catch(err => console.log(err))
        }
    }
})
