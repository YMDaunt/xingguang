import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import layer from 'layer'
import swiper from '../component/swiper.min.js'
import {scroxt} from '../component/gj.scroxt.js'
import polyfillScroll from '../component/gj.polyfillScroll.js'

require('../../css/component/swiper.min.css')
require('../../css/activity/pkSong.less')

let linkJudge = false
let ruleJudge = true
var eightSwiper = undefined

new Vue({
    el: '#app',
    data: {
        wsUrl: '', // websocketUrl
        videoUrl: '', // 视频Url
        someOneLive: true,
        socket: null,
        urlSid: '',
        urlUid: '',
        roomId: '',
        tabCon: true,
        showRule: false,
        fl: false,
        pcroomId: '',
        pkotherId: '',
        pkotherImg: '',
        midArr: [], // 主播的所有mid列表
        playingMid: '', // 推流的主播id
        playingNum: '', // 推流的主播序号
        playingName: '', // 推流的主播昵称
        playingImg: '', // 推流的主播头像
        pkName: '', // pk方主播昵称
        pkImg: '', // pk方主播头像
        isPk: false, // 主播是否在PK
        scoreArr: [],
        videoArr: [],
        instArr: [],
        pkArr: [],
        giftArr: [], // 礼物进度
        pkResult: [], // PK结果
        timeArr: [],
        nowday: '',
        endDay: '',
        stage1Day: '',
        stage2Day: '',
        stage3Day: '',
        modArr: [],
        userArr: [],
        modPage: 1,
        userPage: 1,
        transformEntity: undefined,
        transformEntity2: undefined,
        transformEntity3: undefined,
        scrollLock1: false,
        scrollLock2: false,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/Solstice/userInfo')
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

        // 初始化信息
        axios.get('/Solstice/initInfo')
            .then(res => {
                let that = this
                let data = res.data
                // this.modArr = data.data.modRankPage1.data;
                // this.userArr = data.data.userRankPage1.data;
                this.timeArr = data.data.timeInfo
                this.playingMid = data.data.timeInfo.selectedMid
                this.isPk = data.data.timeInfo.isPk

                // 推流主播的信息
                this.playingName = this.timeArr.modNickname
                this.playingImg = this.timeArr.modHeadPic

                // webscoket 拼接地址
                this.urlSid = this.timeArr.sid
                this.urlUid = this.timeArr.uid
                this.videoUrl = this.timeArr.mobileVideoUrl
                if (this.videoUrl == '') {
                    this.someOneLive = false
                }
                this.roomId = data.data.timeInfo.selectedRid
                this.pcroomId = data.data.timeInfo.selectedMid
                this.wsUrl = this.timeArr.protocol + this.timeArr.messageIp + '?uid=' + this.urlUid + '&sid=' + this.urlSid + '&rid=' + this.roomId + '&platform=pc&packageId=2&activityId=430'

                // 链接socket
                this.socket = new WebSocket(this.wsUrl)
                this.socket.onopen = function () {
                    that.socket.send(JSON.stringify({'cmd': 'querySolsticeRank', data: {}}))
                    that.socket.send(JSON.stringify({'cmd': 'querySolsticeRank',
                        data: {
                            sortBy: 'isPlaying'
                        }}))

                    setInterval(() => {
                        that.socket.send(JSON.stringify({'cmd': 'ping',
                            data: {}
                        }))
                    }, 120000)
                }

                // 监听
                this.socket.onmessage = function (e) {
                    var response = $.parseJSON(e.data)
                    if (response.cmd == 'onQuerySolsticeRank') {
                        that.videoArr = response.data
                        Vue.nextTick(() => {
                            var fourSwiper = new swiper('.four', {
                                direction: 'horizontal',
                                loop: false,
                                slidesPerView: 4,

                                // 如果需要前进后退按钮
                                navigation: {
                                    nextEl: '.four-button-next',
                                    prevEl: '.four-button-prev'
                                }
                            })

                            eightSwiper = new swiper('.eight', {
                                direction: 'horizontal',
                                loop: false,
                                slidesPerView: 4,

                                // 如果需要前进后退按钮
                                navigation: {
                                    nextEl: '.eight-button-next',
                                    prevEl: '.eight-button-prev'
                                }
                            })

                            // 清除样式
                            $('.topfour').find('.swiper-slide').children('div').find('div').removeClass('seeing')
                            // 清除样式
                            $('.topeight').find('.swiper-slide').children('div').find('div').removeClass('seeing')

                            for (var i = 0; i < that.videoArr.length; i++) {
                                if (that.playingMid == that.videoArr[i].mid) {
                                    that.playingNum = i
                                    if (that.playingNum <= 3) {
                                        $('.topfour').find('.swiper-slide').eq(that.playingNum).children('div').find('div').addClass('seeing')
                                    } else {
                                        $('.topeight').find('.swiper-slide').eq(that.playingNum - 4).children('div').find('div').addClass('seeing')
                                        // 大于8展示处理
                                        if (that.playingNum > 7) {
                                            eightSwiper.slideTo(that.playingNum - 4, 500, false)
                                        }
                                    }
                                }
                            }
                        })
                    } else
                    if (response.cmd == 'onPKStart') {
                        that.pkArr = response.data
                        // pk方主播昵称
                        that.pkName = that.pkArr.otherNickname,
                        // pk方主播头像
                        that.pkImg = that.pkArr.otherPic,
                        // 开启PK模板
                        that.isPk = true
                    } else if (response.cmd == 'onPKEnd') {
                        that.isPk = !that.isPk
                    } else if (response.cmd == 'onQuerySolsticeRankByPlaying') {
                        that.instArr = response.data
                        Vue.nextTick(() => {
                            // 初始化排列
                            var instrSwiper = new swiper('.instr', {
                                direction: 'horizontal',
                                loop: true,
                                slidesPerView: 2,

                                // 如果需要前进后退按钮
                                navigation: {
                                    nextEl: '.instr-button-next',
                                    prevEl: '.instr-button-prev'
                                }
                            })
                        })
                    }

                    // 监听开播
                    else if (response.cmd == 'onSolsticeVideoPublish') {
                        // 如果是当前在看
                        if (that.playingMid == response.data.mid) {
                            that.someOneLive = true
                            for (var i = 0; i < that.videoArr.length; i++) {
                                if (that.playingMid == that.videoArr[i].mid) {
                                    that.playingNum = i
                                    if (that.playingNum <= 3) {
                                        $('.topfour').find('.swiper-slide').eq(that.playingNum).children('div').attr({'class': 'live'})
                                    } else {
                                        $('.topeight').find('.swiper-slide').eq(that.playingNum - 4).children('div').attr({'class': 'live'})
                                    }
                                }
                            }
                        }
                    }
                    // 监听下播
                    else if (response.cmd == 'onSolsticeVideoUnPublish') {
                        if (that.playingMid == response.data.mid) {
                            that.someOneLive = false
                            for (var i = 0; i < that.videoArr.length; i++) {
                                if (that.playingMid == that.videoArr[i].mid) {
                                    that.playingNum = i
                                    if (that.playingNum <= 3) {
                                        $('.topfour').find('.swiper-slide').eq(that.playingNum).children('div').attr({'class': 'unlive'})
                                        console.log(that.playingNum)
                                    } else {
                                        $('.topeight').find('.swiper-slide').eq(that.playingNum - 4).children('div').attr({'class': 'unlive'})
                                    }
                                }
                            }
                        }
                    }
                }

                // 时间判断
                if (that.timeArr.activityStatus == 2) {
                    $('.line').find('span').addClass('line1')
                    $('.stage1').addClass('now')
                    $('.time-doit').addClass('doit1')
                    $('.time-text').find('strong').eq(0).addClass('now')
                    $('.time-text').find('strong').eq(1).addClass('now')
                    $('.time-tips').show()
                    $('.time-tips').text('第一轮守擂赛')
                } else
                if (that.timeArr.activityStatus == 3) {
                    $('.line').find('span').addClass('line2')
                    $('.stage1').addClass('now')
                    $('.stage2').addClass('now')
                    $('.time-doit').addClass('doit2')
                    $('.time-text').find('strong').eq(1).addClass('now')
                    $('.time-text').find('strong').eq(2).addClass('now')
                    $('.time-tips').show()
                    $('.time-tips').text('第二轮守擂赛')
                } else
                if (that.timeArr.activityStatus == 4) {
                    $('.line').find('span').addClass('line3')
                    $('.stage1').addClass('now')
                    $('.stage2').addClass('now')
                    $('.stage3').addClass('now')
                    $('.time-doit').addClass('doit3')
                    $('.time-text').find('strong').eq(2).addClass('now')
                    $('.time-text').find('strong').eq(3).addClass('now')
                    $('.time-tips').show()
                    $('.time-tips').text('终极排位赛')
                } else
                if (that.timeArr.activityStatus == 1) {
                    $('.time-doit').hide()
                } else
                if (that.timeArr.activityStatus == 5) {
                    $('.time-doit').hide()
                    $('.line').find('span').css({
                        'width': '100%'
                    })
                }

                // PK信息拉取
                if (that.isPk) {
                    axios.get('/Solstice/pkInfo?rid=' + that.roomId)
                        .then(res => {
                            let data = res.data
                            that.pkArr = data.data
                            console.log(that.pkArr)
                            // 对战方信息
                            that.pkotherId = that.pkArr.currentScore.otherMid
                            that.pkotherImg = that.pkArr.otherPic
                            console.log(that.pkotherId, that.pkotherImg)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
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
        // 换主播
        change (e, index) {
            let that = this
            linkJudge = false
            var rid = e.target.getAttribute('data-rid')
            var url = e.target.getAttribute('data-url')
            if (url == that.videoUrl) {

            } else {
                if (this.socket) {
                    this.socket.send(JSON.stringify({'cmd': 'disconnectMe', data: {}}))
                    this.socket.onclose = function () {
                        console.log('已关闭上一个webscoket')
                    }
                }
                // 拼接新的WS地址
                that.wsUrl = that.timeArr.protocol + that.timeArr.messageIp + '?uid=' + that.uid + '&sid=' + that.urlSid + '&rid=' + rid + '&platform=pc&packageId=2&activityId=430'
                that.socket = new WebSocket(that.wsUrl)
                that.socket.onopen = function () {
                    that.socket.send(JSON.stringify({'cmd': 'querySolsticeRank', data: {}}))
                    that.socket.send(JSON.stringify({'cmd': 'querySolsticeRank',
                        data: {
                            sortBy: 'isPlaying'
                        }}))

                    setInterval(() => {
                        that.socket.send(JSON.stringify({'cmd': 'ping',
                            data: {}
                        }))
                    }, 120000)
                }

                // 监听
                that.socket.onmessage = function (e) {
                    var response = $.parseJSON(e.data)
                    if (response.cmd == 'onQuerySolsticeRank') {
                        that.videoArr = response.data
                        Vue.nextTick(() => {
                            for (var i = 0; i < that.videoArr.length; i++) {
                                if (rid == that.videoArr[i].rid) {
                                    that.playingNum = i
                                    that.isPk = that.videoArr[i].isPk
                                    that.videoUrl = that.videoArr[i].mobileVideoUrl

                                    that.pcroomId = that.videoArr[i].mid

                                    // 推流主播的信息
                                    that.playingName = that.videoArr[i].nickname
                                    that.playingImg = that.videoArr[i].headPic
                                    // 清除样式
                                    $('.topfour').find('.swiper-slide').children('div').find('div').removeClass('seeing')
                                    $('.topeight').find('.swiper-slide').children('div').find('div').removeClass('seeing')
                                    // 重新渲染样式
                                    if (that.playingNum <= 3) {
                                        $('.topfour').find('.swiper-slide').eq(that.playingNum).children('div').find('div').addClass('seeing')
                                    } else {
                                        $('.topeight').find('.swiper-slide').eq(that.playingNum - 4).children('div').find('div').addClass('seeing')
                                        // 大于8展示处理
                                        if (that.playingNum > 7) {
                                            eightSwiper.slideTo(that.playingNum - 4, 500, false)
                                        }
                                    }

                                    // 判断是否直播
                                    if (that.videoArr[i].isPlaying) {
                                        that.someOneLive = true
                                        // 在直阿播则拉取直播信息
                                        axios.get('/Solstice/pkInfo?rid=' + rid)
                                            .then(res => {
                                                let data = res.data
                                                that.pkArr = data.data
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
                                    } else {
                                        that.someOneLive = false
                                    }
                                }
                            }
                        })
                    } else if (response.cmd == 'onPKStart') {
                        that.pkArr = response.data
                        axios.get('/Solstice/pkInfo?rid=' + rid)
                            .then(res => {
                                let data = res.data
                                that.pkArr = data.data
                                // 对战方信息
                                that.pkotherId = that.pkArr.currentScore.otherMid
                                that.pkotherImg = that.pkArr.otherPic
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        // 开启PK模板
                        that.isPk = true
                    } else if (response.cmd == 'onPKEnd') {
                        that.isPk = !that.isPk
                    } else if (response.cmd == 'onQuerySolsticeRankByPlaying') {
                        that.instArr = response.data
                    }
                    // 监听开播
                    else if (response.cmd == 'onSolsticeVideoPublish') {
                        if (rid == response.data.rid) {
                            that.someOneLive = true
                            for (var i = 0; i < that.videoArr.length; i++) {
                                if (rid == that.videoArr[i].rid) {
                                    that.playingNum = i
                                    if (that.playingNum <= 3) {
                                        $('.topfour').find('.swiper-slide').eq(that.playingNum).children('div').attr({'class': 'live'})
                                    } else {
                                        $('.topeight').find('.swiper-slide').eq(that.playingNum - 4).children('div').attr({'class': 'live'})
                                    }
                                }
                            }
                        }
                    }
                    // 监听下播
                    else if (response.cmd == 'onSolsticeVideoUnPublish') {
                        if (rid == response.data.rid) {
                            that.someOneLive = false
                            for (var i = 0; i < that.videoArr.length; i++) {
                                if (rid == that.videoArr[i].rid) {
                                    that.playingNum = i
                                    if (that.playingNum <= 3) {
                                        $('.topfour').find('.swiper-slide').eq(that.playingNum).children('div').attr({'class': 'unlive'})
                                        console.log(that.playingNum)
                                    } else {
                                        $('.topeight').find('.swiper-slide').eq(that.playingNum - 4).children('div').attr({'class': 'unlive'})
                                    }
                                }
                            }
                        }
                    }
                }
                that.socket.onclose = function () {

                }
            }
        },

        rule () {
            this.showRule = !this.showRule
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rules-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rules-con')
                    that.transformEntity3 = new polyfillScroll({
                        scrollWrap: '.rules-out',
                        scrollContent: '.rules-con',
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '0px',
                            'background': 'rgba(247,127,25,0.6)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
            Vue.nextTick(() => {
                let that = this
                if (!that.transformEntity2) {
                    const sortWrapElement = document.querySelector('.user-other')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.other-user')
                    that.transformEntity2 = new polyfillScroll({
                        scrollWrap: '.user-other',
                        scrollContent: '.other-user',
                        cb: function (distance) {
                            const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                            if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                if (that.scrollLock2) return
                                that.scrollLock2 = true
                                that.userPage++
                                that.initScrollLoadUser(that.userPage)
                            }
                        },
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '10px',
                            'background': 'rgba(247,127,25,0.6)'
                        }
                    })
                }
            })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-id')
            window.open('/' + rid) // 主播用户id
        },

        // 关注
        love (e, index) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/Solstice/Attention', {
                    params: {
                        mid: e.target.getAttribute('data-id')
                    }
                })
                    .then(res => {
                        if (typeof data === 'string') {
                            data = JSON.parse(data)
                        }
                        let _data = res.data
                        console.log(_data)
                        if (_data.errno == 0) {
                            this.modArr[index]['isLoved'] = true
                        } else if (!this.uid) {
                            return common.goLogin()
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 主播榜滚动加载
        initScrollLoadMod () {
            let that = this
            axios.get('/Solstice/SolsticeRank?type=mod&pageSize=15', {
                params: {
                    pageNo: that.modPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addModArr = data.data.data
                    if (addModArr.length > 0) {
                        that.modArr = that.modArr.concat(addModArr)
                        that.scrollLock1 = false
                        if (!that.transformEntity) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.mod-other')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.other-mod')
                                that.transformEntity = new polyfillScroll({
                                    scrollWrap: '.mod-other',
                                    scrollContent: '.other-mod',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                            if (that.scrollLock1) return
                                            that.scrollLock1 = true
                                            that.modPage++
                                            that.initScrollLoadMod(that.modPage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '60px',
                                        right: '10px',
                                        'background': 'rgba(247,127,25,0.6)'
                                    }
                                })
                            })
                        }
                    }
                })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            let that = this
            axios.get('/Solstice/SolsticeRank?type=user&pageSize=15', {
                params: {
                    pageNo: that.userPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addUserArr = data.data.data
                    if (addUserArr.length > 0) {
                        that.userArr = that.userArr.concat(addUserArr)
                        that.scrollLock2 = false
                    }
                })
        }
    }
})
