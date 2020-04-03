'use strict'

import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import bodymovin from '../../component/bodymovin.min.js'
import '../../component/niceScroll.js'

import '../../../css/activity/new/newYear2020.less'

new Vue({
    el: '#app',
    data: {
        showRule: false,
        showSend: false,
        showChan: false,
        tabCon: true,
        canOpen: true,
        canChange: false,
        openVal: 100,
        tostBox: false,
        svgPlayer: false,
        tostText: '',
        isMod: false,
        modId: '', // 主播id app为rid pc为mid
        activityStatus: 0, // 0：未开始；1：进行中；-1：已结束
        isLogin: false,
        uid: '',
        // videoUrl: '',
        liveTime: 0, // 开播时长
        seeTime: 0, // 观看时长
        cqValue: 0, // 开播财气值
        cardArr: [],
        svgArr: [],
        sendCardName: 'xgf',
        sendCardNum: 0,
        sendId: '',
        cardId: '',
        sendName: '',
        changeType: 1,
        liveArr: [], // 开播榜单
        broadArr: [],
        broadArr2: [],
        myLiveArr: [],
        myModArr: [],
        myUserArr: [],
        modArr: [],
        userArr: [],
        modPage: 0,
        userPage: 0,
        timer: null,
        timer1: null,
        timer2: null,
        scrollLock1: false,
        scrollLock2: false
    },
    created () {
        this.init()
        this.getBroad()
        // this.liveRank()
        this.getModRank(0)
        this.getUserRank(0)
        Vue.nextTick(() => {
            setTimeout(() => {
                this.player()
            }, 1000)
        })
    },
    mounted () {
        // 滚动加载
        this.initScrollLoadMod()
        this.initScrollLoadUser()
    },
    methods: {
        init () {
            axios.get('/springFestival2020/initInfo')
                .then((res) => {
                    let data = res.data.data
                    this.isLogin = data.isLogin
                    this.uid = data.uid
                    // this.videoUrl = data.videoUrl
                    this.activityStatus = data.activityStatus
                    this.isMod = data.isMod
                    this.liveTime = data.liveTime
                    this.cqValue = data.score
                    this.seeTime = data.watchTime
                    this.cardArr = data.cards
                    this.canOpen = !data.hasGetRedPackage
                    if (!this.canOpen) {
                        this.openVal = data.redPackageCoin
                    }
                    // 是否可领取
                    if (this.activityStatus !== 1) {
                        // 不可领取
                        this.canChange = false
                    } else {
                        if (this.cardArr[0].num > 0 && this.cardArr[1].num > 0 && this.cardArr[2].num > 0 &&
                            this.cardArr[3].num > 0 && this.cardArr[4].num > 0) {
                            this.canChange = true
                        }
                    }

                    this.svgArr = data.pcAnimation

                    // 开播榜
                    this.liveArr = data.liveRanks.ranks
                    if (this.liveArr.length < 10) {
                        for (var i = 0; i < 10; i++) {
                            if (!this.liveArr[i]) {
                                this.liveArr.push(null)
                            }
                        }
                    }
                    this.myLiveArr = data.liveRanks.myRank
                })
                .catch((err) => console.log(err))
        },

        // 开播榜
        // liveRank () {
        //     axios.get('/springFestival2020/ranks?type=3&pageRows=10')
        //         .then((res) => {
        //             let data = res.data.data
        //             this.liveArr = data.ranks
        //             if (this.liveArr.length < 10) {
        //                 for (var i = 0; i < 10; i++) {
        //                     if (!this.liveArr[i]) {
        //                         this.liveArr.push(null)
        //                     }
        //                 }
        //             }
        //             this.myLiveArr = data.myRank
        //             console.log(this.myLiveArr)
        //         })
        //         .catch((err) => console.log(err))
        // },

        tab (tabN) {
            if (tabN === 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        // remove svg
        removeSvg () {
            this.svgPlayer = false
            var doc = $('.svg-box').find('div')
            doc.remove()
        },

        doSvg (e) {
            var id = e.target.getAttribute('data-id')
            if (this.svgArr[id]) {
                playSvg(this.svgArr[id])
                this.svgPlayer = true
            } else {
                this.disapperTost(2500, '动效获取失败')
            }
        },

        // 抽福卡
        getCard () {
            if (!this.isLogin) {
                user.showLoginPanel()
            } else
            if (this.activityStatus === 0) {
                this.disapperTost(2500, '活动未开始')
            } else
            if (this.activityStatus === 2) {
                this.disapperTost(2500, '活动已结束')
            } else {
                axios.get('/springFestival2020/goLottery')
                    .then((res) => {
                        let data = res.data
                        if (data.errno === 0) {
                            this.disapperTost(3000, '恭喜您抽中' + data.data.prizeName)
                            this.init()
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch((err) => console.log(err))
            }
        },

        // 兑换
        exchange () {
            // this.changeType = 1
            // this.showChan = true
            if (!this.isLogin) {
                user.showLoginPanel()
            } else
            if (this.activityStatus === 0) {
                this.disapperTost(2500, '活动未开始')
            } else
            if (this.activityStatus === 2) {
                this.disapperTost(2500, '活动已结束')
            } else {
                axios.get('/springFestival2020/exchange')
                    .then((res) => {
                        let data = res.data
                        if (data.errno === 0) {
                        // 1：迎财神；2：迎财神和招财进宝
                            this.changeType = data.data.type
                            this.showChan = true
                            this.init()
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch((err) => console.log(err))
            }
        },

        // 赠送
        sendCard (e) {
            if (!this.isLogin) {
                user.showLoginPanel()
            }
            if (this.activityStatus === -1) {
                this.disapperTost(2500, '活动已结束')
            } else {
                var num = e.target.getAttribute('data-num')
                if (num <= 0) {
                    this.disapperTost(2500, '福卡数量不足')
                } else {
                    this.showSend = true
                    var id = e.target.getAttribute('data-id')
                    this.cardId = id
                    switch (id) {
                    case '1':
                        this.sendCardName = 'xgf'
                        break
                    case '2':
                        this.sendCardName = 'paf'
                        break
                    case '3':
                        this.sendCardName = 'fgf'
                        break
                    case '4':
                        this.sendCardName = 'hyf'
                        break
                    case '5':
                        this.sendCardName = 'jxf'
                        break
                    }
                    this.sendCardNum = num
                }
            }
        },

        searchName () {
            if (this.sendId === '') {
                this.disapperTost(2500, '请先输入ID')
            } else {
                axios.get('/springFestival2020/getNickname?uid=' + this.sendId)
                    .then((res) => {
                        let data = res.data
                        if (data.errno === 0 && data.data.nickname) {
                            this.sendName = data.data.nickname
                        } else {
                            this.disapperTost(2500, '找不到该用户')
                        }
                    })
                    .catch((err) => console.log(err))
            }
        },

        // 清空搜索的结果
        cleanTxt () {
            this.sendName = ''
        },

        // 确认赠送
        sureSend () {
            if (this.sendId === '') {
                this.disapperTost(2500, '请先输入赠送的用户id')
            } else {
                axios.get('/springFestival2020/giveCard?uid=' + this.sendId + '&cardId=' + this.cardId)
                    .then((res) => {
                        let data = res.data
                        if (data.errno === 0) {
                            this.disapperTost(2500, this.sendId + '已收到你的福卡啦！')
                            this.init()
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch((err) => console.log(err))
            }
        },

        // 广播
        getBroad () {
            axios.get('/springFestival2020/getExchangeList')
                .then((res) => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.broadArr = data.data
                        if (this.broadArr.length === 1) {
                            this.broadArr = this.broadArr.concat(this.broadArr)
                            console.log(this.broadArr)
                        }
                    }
                })
                .catch((err) => console.log(err))

            axios.get('/springFestival2020/getRedPackageList')
                .then((res) => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.broadArr2 = data.data
                        if (this.broadArr2.length === 1) {
                            this.broadArr2 = this.broadArr2.concat(this.broadArr2)
                        }
                    }
                })
                .catch((err) => console.log(err))
        },

        openPack () {
            if (!this.isLogin) {
                user.showLoginPanel()
            } else
            if (!this.isMod) {
                this.disapperTost(2500, '您还未成为主播！')
            } else
            if (this.activityStatus === 0) {
                this.disapperTost(2500, '活动未开始')
            } else
            if (this.activityStatus === 2) {
                this.disapperTost(2500, '活动已结束')
            } else {
                axios.get('/springFestival2020/getRedPackage')
                    .then((res) => {
                        let data = res.data
                        if (data.errno === 0) {
                            // this.showChan = true
                            this.openVal = data.data.coin
                            this.disapperTost(2500, '成功领取春节红包' + this.openVal + '克拉' + '，已下发至账户')
                            this.canOpen = false
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch((err) => console.log(err))
            }
        },

        // 关注
        attention (e, index) {
            if (!this.isLogin) {
                user.showLoginPanel()
            } else {
                axios.get('/PKStar/Attention', {
                    params: {
                        mid: e.target.getAttribute('data-id')
                    }
                })
                    .then(res => {
                        let data = res.data
                        if (data.errno === 0) {
                            this.modArr[index]['isLoved'] = true
                        } else {
                            this.disapperTost(2500, data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 去我和星光的2019
        goWithXg () {
            this.disapperTost(2500, '请移步至app端查看！')
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
            that.scrollLoad('.mod-other', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.modPage)
            })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.user-other', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.userPage++
                that.getUserRank(that.userPage)
            })
        },

        // ajax获取主播列表
        getModRank (page) {
            const that = this
            axios.get('/springFestival2020/ranks?type=1&page=' + page)
                .then(res => {
                    let data = res.data.data.ranks

                    if (data.length > 0) {
                        that.modArr = that.modArr.concat(data)
                        that.scrollLock1 = false
                    }
                    if (that.modArr.length >= 100) {
                        that.scrollLock1 = true
                    }

                    this.myModArr = res.data.data.myRank
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取用户列表
        getUserRank (page) {
            const that = this
            axios.get('/springFestival2020/ranks?type=2&page=' + page)
                .then(res => {
                    let data = res.data.data.ranks
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock2 = false
                    }
                    if (that.userArr.length >= 100) {
                        that.scrollLock2 = true
                    }
                    this.myUserArr = res.data.data.myRank
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid)
        },

        showRuleBox () {
            this.showRule = true
            Vue.nextTick(() => {
                $('.rule-con').niceScroll({
                    cursorwidth: 8,
                    cursorcolor: 'rgba(255, 229, 120,0.8)', // 设置滚动条滑块的颜色
                    cursorborder: 'none', // CSS方式定义滚动条边框颜色
                    autohidemode: false,
                    cursorfixedheight: 60,
                    hwacceleration: true,
                    horizrailenabled: false,
                    railpadding: { top: 80, right: 0, left: 0, bottom: 0 }
                })
            })
        },

        // 广播
        player () {
            var speed = 25
            var scrollOut = $('.scroll-con')
            var scrollEle1 = $('#scrollEle')
            var scrollEle2 = $('#scrollEle2')

            var scrollOut2 = $('.scroll-con2')
            var scrollEle3 = $('#scrollEle3')
            var scrollEle4 = $('#scrollEle4')
            function Marquee () {
                if (scrollEle2[0].offsetWidth - scrollOut[0].scrollLeft <= 0) {
                    scrollOut[0].scrollLeft = 0
                } else {
                    scrollOut[0].scrollLeft++
                }
            }
            function Marquee2 () {
                if (scrollEle4[0].offsetWidth - scrollOut2[0].scrollLeft <= 0) {
                    scrollOut2[0].scrollLeft = 0
                } else {
                    scrollOut2[0].scrollLeft++
                }
            }

            if (scrollEle1.find('span').length > 1) {
                scrollEle2.html(scrollEle1.html())
                this.timer1 = setInterval(Marquee, speed)
            }

            if (scrollEle3.find('span').length > 1) {
                scrollEle4.html(scrollEle3.html())
                this.timer2 = setInterval(Marquee2, speed)
            }
        },

        disapperTost (time, text) {
            this.tostBox = true
            this.tostText = text
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.tostBox = false
            }, time)
        }
    }
})

$('.mod-other').niceScroll({
    cursorwidth: 8,
    cursorcolor: 'rgba(255, 229, 120,0.8)', // 设置滚动条滑块的颜色
    cursorborder: 'none', // CSS方式定义滚动条边框颜色
    autohidemode: false,
    cursorfixedheight: 60,
    hwacceleration: true,
    horizrailenabled: false,
    railpadding: { top: 0, right: 20, left: 0, bottom: 0 }
})
$('.user-other').niceScroll({
    cursorwidth: 8,
    cursorcolor: 'rgba(255, 229, 120,0.8)', // 设置滚动条滑块的颜色
    cursorborder: 'none', // CSS方式定义滚动条边框颜色
    autohidemode: false,
    cursorfixedheight: 60,
    hwacceleration: true,
    horizrailenabled: false,
    railpadding: { top: 0, right: 20, left: 0, bottom: 0 }
})
$('.live-out').niceScroll({
    cursorwidth: 8,
    cursorcolor: 'rgba(255, 229, 120,0.8)', // 设置滚动条滑块的颜色
    cursorborder: 'none', // CSS方式定义滚动条边框颜色
    autohidemode: false,
    cursorfixedheight: 60,
    hwacceleration: true,
    horizrailenabled: false,
    railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
})

// svg方法
function playSvg (path) {
    var svgContainer = document.querySelector('.svg-box')
    bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: true,
        autoplay: true,
        path: path
    })
}
