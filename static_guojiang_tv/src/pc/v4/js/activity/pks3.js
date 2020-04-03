require('../../css/activity/pks3.less')

import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import scroll from '../component/niceScroll.js'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import bodymovin from '../component/bodymovin.min.js'

const os = (function () {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

if (os.isPhone) location.href = 'https://m.kuaishouvideo.com/dist/activity/pks3.html'

var ruleJudge = true
new Vue({
    el: '#app',
    data: {
        uid: false,
        tabCon: true,
        tabCh: true,
        chBox: false,
        xqBox: false,
        xqName: '',
        xqCode: '',
        xqText: '',
        jfBox: false,
        ruleBox: false,
        scrollLock1: false,
        scrollLock2: false,
        scrollLock3: false,
        svgPlayer: false,
        secTab: [true, false, false, false, false],
        firstTab: [false, false, false, false],
        tostBox: false,
        timer: null,
        tostText: '',
        level: 0, // 0全部 1星星  2精英 3钻石 4王者
        modPage: 1,
        userPage: 1,
        jfPage: 1,
        hotPkArr: [],
        showJfArr: [],
        broadArr: [],
        modArr: [],
        userArr: [],
        myModArr: [],
        myUserArr: [],
        myModTitle: [],
        myUserTitle: [],
        jfArr: [],
        time: null,
        transformEntity1: undefined,
        transformEntity2: undefined
    },
    created: function () {
        // 个人初始化信息
        axios.get('/PKStar/userInfo')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.id
                    if (!this.uid) {
                        user.showLoginPanel()
                    }
                    this.userMesArr = data.data.userMes
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 对战进度
        axios.get('/PKStar/top1PK')
            .then(res => {
                let data = res.data
                this.hotPkArr = data.data
            })
            .catch(err => {
                console.log(err)
            })

        axios.get('/PKStar/top1PK')
            .then(res => {
                let data = res.data
                this.hotPkArr = data.data
            })
            .catch(err => {
                console.log(err)
            })

        // 广播
        axios.get('/PKStar/Broadcast')
            .then(res => {
                let data = res.data
                this.broadArr = data.data
                Vue.nextTick(() => {
                    var speed = 25
                    var scrollOut = $('.scroll-con')
                    var scrollEle1 = $('#scrollEle')
                    var scrollEle2 = $('#scrollEle2')
                    if (scrollEle1.find('span').length > 1) {
                        scrollEle2.html(scrollEle1.html())
                        function Marquee () {
                            if (scrollEle2[0].offsetWidth - scrollOut[0].scrollLeft <= 0) {
                                scrollOut[0].scrollLeft = 0
                            } else {
                                scrollOut[0].scrollLeft++
                            }
                        }
                        var timer = setInterval(Marquee, speed)
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })

        // 主播榜
        this.getModRank(this.modPage, this.level)

        // 用户榜
        this.getUserRank(this.UserPage, this.level)
    },

    mounted: function () {
        // 滚动加载
        this.initScrollLoadMod()
        this.initScrollLoadUser()
        this.initScrollLoadJf()
        this.hotPk()
    },

    methods: {
        // 热门对战
        hotPk () {
            this.time = setInterval(() => {
                axios.get('/PKStar/top1PK')
                    .then(res => {
                        let data = res.data
                        this.hotPkArr = data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }, 5000)
        },

        // 主播用户选择
        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        // 级别选择
        secTabShow (e) {
            var index = e.target.getAttribute('data-index')
            if (!this.secTab[index]) {
                this.secTab = [false, false, false, false, false]
                this.secTab[index] = true
                switch (index) {
                case '0':
                    this.level = 0
                    break
                case '1':
                    this.level = 4
                    break
                case '2':
                    this.level = 3
                    break
                case '3':
                    this.level = 2
                    break
                case '4':
                    this.level = 1
                    break
                }
                this.modPage = 1
                this.modArr = []
                this.getModRank(this.modPage, this.level)
            }
        },

        tabTitle (tabT) {
            if (tabT == 'choose-tit') {
                this.tabCh = true
            } else {
                this.tabCh = false
            }
        },

        ruleShow () {
            this.ruleBox = true
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-out > ul')
                    that.transformEntity1 = new PolyfillScroll({
                        scrollWrap: '.rule-out',
                        scrollContent: '.rule-out > ul',
                        bar: {
                            width: '8px',
                            height: '60px',
                            right: '6px',
                            'background': 'rgba(255, 248, 145,0.8)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        // 称号
        ch () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                this.chBox = true
                axios.get('/PKStar/MyTitle')
                    .then(res => {
                        let data = res.data
                        this.myModTitle = data.data.mod
                        if (!this.myModTitle) {
                            this.tabCh = false
                        }
                        this.myUserTitle = data.data.user
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 查看称号详情
        showChDetail (e, index, type) {
            this.xqName = e.target.getAttribute('data-name')
            if (type == 'mod') {
                this.xqCode = this.myModTitle[index].remark
                this.xqText = this.myModTitle[index].desc
            } else {
                this.xqCode = this.myUserTitle[index].remark
                this.xqText = this.myUserTitle[index].desc
            }
            this.xqBox = true
        },

        // remove svg
        removeSvg () {
            this.svgPlayer = !this.svgPlayer
            var doc = $('.svg-con').find('div')
            doc.remove()
        },

        // svg
        doPkSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/pks3/pk/data.json')
        },
        doLbSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/pks3/lb/data.json')
        },

        // 看积分
        showGift (e) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                this.jfMid = e.target.getAttribute('data-mid')
                this.getjfArr(this.jfMid)
                this.jfBox = true
            }
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid)
        },

        // 关注
        attention (e, index) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/PKStar/Attention', {
                    params: {
                        mid: e.target.getAttribute('data-id')
                    }
                })
                    .then(res => {
                        if (typeof data === 'string') {
                            data = JSON.parse(data)
                        }
                        let _data = res.data
                        if (_data.errno == 0) {
                            this.modArr[index]['isLoved'] = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele)
            var bH = bottomHeight || 100
            _ele.addEventListener('scroll', function () {
                var scrollTop = _ele.scrollTop,
                    cliHeight = _ele.clientHeight,
                    scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        },

        // 主播榜滚动加载
        initScrollLoadMod () {
            const that = this
            that.scrollLoad('.other-mod', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.modPage, that.level)
            })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.other-user', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.userPage++
                that.getUserRank(that.userPage, that.level)
            })
        },

        // 积分滚动加载
        initScrollLoadJf () {
            const that = this
            that.scrollLoad('.inte-con', 150, function () {
                if (that.scrollLock3) return
                that.scrollLock3 = true
                that.jfPage++
                that.getjfArr(that.jfMid)
            })
        },

        // ajax获取主播列表
        getModRank (modPage, level) {
            const that = this
            axios.get('/PKStar/PKStarRank?type=mod&level=' + level + '', {
                params: {
                    pageNo: modPage
                }
            })
                .then(res => {
                    this.myModArr = res.data.data.myRank
                    let data = res.data.data.data
                    if (data.length > 0) {
                        that.modArr = that.modArr.concat(data)
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取用户列表
        getUserRank (userPage, level) {
            const that = this
            axios.get('/PKStar/PKStarRank?type=user&level=' + level + '', {
                params: {
                    pageNo: userPage
                }
            })
                .then(res => {
                    this.myUserArr = res.data.data.myRank
                    let data = res.data.data.data
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取积分列表
        getjfArr (mid) {
            const that = this
            axios.get('/PKStar/RankDetail?mid=' + mid, {
                params: {
                    pageNo: this.jfPage
                }
            })
                .then(res => {
                    let data = res.data.data
                    if (data.length > 0) {
                        that.jfArr = that.jfArr.concat(data)
                        that.scrollLock3 = false
                        if (that.jfArr.length >= 2) {
                            if (!that.transformEntity1) {
                                Vue.nextTick(() => {
                                    const sortWrapElement = document.querySelector('.inte-con')
                                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                    const sortListElement = document.querySelector('.inte-con > ul')
                                    that.transformEntity1 = new PolyfillScroll({
                                        scrollWrap: '.inte-con',
                                        scrollContent: '.inte-con > ul',
                                        bar: {
                                            width: '8px',
                                            height: '60px',
                                            right: '6px',
                                            'background': 'rgba(255, 248, 145,0.8)'
                                        }
                                    })
                                })
                            } else {
                                that.transformEntity1.refresh()
                                $('.inte-con').scrollTop(0)
                                if (that.jfArr.length >= 3) {
                                    $('.inte-con > div').children('div').css({'opacity': '1'})
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        closeJfArr () {
            this.jfPage = 1
            this.jfBox = false
            this.jfArr = []
        },

        // tost计时器
        disapperTost (time) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.tostBox = !this.tostBox
            }, time)
        }
    }
})

$('.other-mod').niceScroll({
    cursorwidth: 8,
    cursorcolor: 'rgba(255, 248, 145,0.8)', // 设置滚动条滑块的颜色
    cursorborder: 'none', // CSS方式定义滚动条边框颜色
    autohidemode: false,
    cursorfixedheight: 60,
    hwacceleration: true,
    horizrailenabled: false,
    railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
})
$('.other-user').niceScroll({
    cursorwidth: 8,
    cursorcolor: 'rgba(255, 248, 145,0.8)', // 设置滚动条滑块的颜色
    cursorborder: 'none', // CSS方式定义滚动条边框颜色
    autohidemode: false,
    cursorfixedheight: 60,
    hwacceleration: true,
    horizrailenabled: false,
    railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
})

// 展开收起
function slide () {
    var conHeight = $('.ch-list').find('.ch-con').height()
    $('.xl-btn').on('click', function () {
        if ($(this).children('span').hasClass('tran')) {
            $('.ch-list').find('.ch-con').css({'height': conHeight})
            $(this).children('span').removeClass('tran')
        } else {
            $('.ch-list').find('.ch-con').css({'height': 'auto'})
            $(this).children('span').addClass('tran')
        }
    })
}slide()

function playSvg (path) {
    var svgContainer = document.querySelector('.svg-con')
    var giftSvg = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: true,
        autoplay: true,
        path: path
    })
}
