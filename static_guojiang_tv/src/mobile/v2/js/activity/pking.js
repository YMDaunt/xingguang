import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import swiper from '../component/swiper.min.js'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/pking.less')

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

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/pking.html'

new Vue({
    el: '#app',
    data: {
        uid: false,
        tabCon: true,
        tabCh: true,
        chBox: false,
        jfBox: false,
        ruleBox: false,
        scrollLock1: false,
        scrollLock2: false,
        svgPlayer: false,

        modPage: 1,
        userPage: 1,
        todayScore: '',
        showJfArr: [],
        broadArr: [],
        modArr: [],
        userArr: [],
        myModArr: [],
        myUserArr: [],
        myModTitle: [],
        myUserTitle: [],
        richArr: [],
        myRichArr: [],
        jfArr: []
    },
    created: function () {
        // 个人初始化信息
        axios.get('/PKStar/userInfo')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.id
                    if (!this.uid) {
                        return common.goLogin()
                    }
                    this.userMesArr = data.data.userMes
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 广播
        axios.get('/PKStar/Broadcast')
            .then(res => {
                let data = res.data
                this.broadArr = data.data
                // this.broadArr = ['恭喜aa获得xxxxxxx', '恭喜bb获取yyyyyyy', '恭喜bb获取zzzzzzz'];
                Vue.nextTick(() => {
                    var speed = 20
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
                    // scrollOut.onmouseover = function(){
                    //     clearInterval(timer);
                    // };
                    // scrollOut.onmouseout = function(){
                    //     timer = setInterval(Marquee,speed);
                    // }
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })

        // 榜单
        axios.get('/PKStar/PKStarRank?type=mod')
            .then(res => {
                let data = res.data
                this.modArr = data.data.data
                this.myModArr = data.data.myRank
            })
            .catch(err => {
                console.log(err)
            })

        // 榜单
        axios.get('/PKStar/PKStarRank?type=user')
            .then(res => {
                let data = res.data
                this.userArr = data.data.data
                this.myUserArr = data.data.myRank
            })
            .catch(err => {
                console.log(err)
            })

        // 神豪
        axios.get('/PKStar/Tuhaos')
            .then(res => {
                let data = res.data
                this.richArr = data.data.users
                this.myRichArr = data.data.myRank
            })
            .catch(err => {
                console.log(err)
            })
    },

    mounted: function () {
        // 滚动加载
        this.initScrollLoadMod()
        this.initScrollLoadUser()
    },

    methods: {
        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        tabTitle (tabT) {
            if (tabT == 'choose-tit') {
                this.tabCh = true
            } else {
                this.tabCh = false
            }
        },

        // 称号
        ch () {
            if (!this.uid) {
                return common.goLogin()
            } else {
                this.chBox = !this.chBox
                axios.get('/PKStar/MyTitle')
                    .then(res => {
                        let data = res.data
                        this.myModTitle = data.data.mod
                        this.myUserTitle = data.data.user
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
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
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/pking/pk/data.json')
        },
        doLbSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/pking/lb/data.json')
        },

        // 看积分
        showGift (e) {
            if (!this.uid) {
                return common.goLogin()
            } else {
                var mid = e.target.getAttribute('data-mid')
                axios.get('/PKStar/RankDetail?mid=' + mid + '')
                    .then(res => {
                        let data = res.data
                        this.jfArr = data.data
                        this.jfBox = !this.jfBox
                        let len = this.jfArr.length
                        // 时间判断
                        // 都没开始
                        if (this.jfArr[0].timeFlag == 1) {
                            Vue.nextTick(() => {
                                $('.inte-tit').find('div').addClass('inte-cant')
                                this.todayScore = this.jfArr[0].todayScore
                                this.showJfArr = this.jfArr[0].detail
                            })
                        } else
                        // 都过了
                        if (this.jfArr[len - 1].timeFlag == -1) {
                            Vue.nextTick(() => {
                                $('.inte-tit').find('div').eq(len - 1).addClass('inte-choose')
                                this.todayScore = this.jfArr[len - 1].todayScore
                                this.showJfArr = this.jfArr[len - 1].detail
                                $('.inte-code').scrollTop(0)
                            })
                        } else {
                            for (var i in this.jfArr) {
                                if (this.jfArr[i].timeFlag == 0) {
                                    this.todayScore = this.jfArr[i].todayScore
                                    this.showJfArr = this.jfArr[i].detail
                                    Vue.nextTick(() => {
                                        $('.inte-code').scrollTop(0)
                                    })
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 积分切换
        tabJf (e, index) {
            let timeJudge = e.target.getAttribute('data-time')
            let chooseClass = e.target.getAttribute('class')
            if (timeJudge == 1 || chooseClass == 'inte-choose') {
                return false
            } else {
                $('.inte-tit').children('div').eq(index).addClass('inte-choose').siblings('').removeClass('inte-choose')
                this.todayScore = this.jfArr[index].todayScore
                this.showJfArr = this.jfArr[index].detail
                Vue.nextTick(() => {
                    $('.inte-code').scrollTop(0)
                })
            }
        },

        // 关闭积分
        closeJf () {
            this.jfBox = !this.jfBox
            this.jfArr = [] // 重置jfArr
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            common.goRoom(rid) // 主播房间id //主播用户id
        },

        // 关注
        attention (e, index) {
            if (!this.uid) {
                return common.goLogin()
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
                var scrollTop = _ele.scrollTop

                var cliHeight = _ele.clientHeight

                var scrollHeight = _ele.scrollHeight
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
                that.getModRank(that.modPage, that.stageJudge)
            })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.other-user', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.userPage++
                that.getUserRank(that.userPage, that.stageJudge)
            })
        },

        // ajax获取主播列表
        getModRank (modPage, stage) {
            const that = this
            axios.get('/PKStar/PKStarRank?type=mod&stage=' + stage + '', {
                params: {
                    pageNo: modPage
                }
            })
                .then(res => {
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
        getUserRank (userPage, stage) {
            const that = this
            axios.get('/PKStar/PKStarRank?type=user&stage=' + stage + '', {
                params: {
                    pageNo: userPage
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

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
