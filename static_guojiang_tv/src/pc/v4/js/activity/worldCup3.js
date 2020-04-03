import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import user from 'user'
import layer from 'layer'
import scroll from '../component/niceScroll.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import {scroxt} from '../component/gj.scroxt.js'
import swiper from '../component/swiper.min.js'

require('../../css/component/swiper.min.css')
require('../../css/activity/worldCup3.less')
require('../../css/activity/country.less')

var timer = null
var ruleJudge = true
var instrSwiper

new Vue({
    el: '#app',
    data: {
        uid: false,
        tabCon: true,
        supBox: false, // 支持窗口
        supSure: false, // 支持确认窗口
        canSup: false, // 是否可支持
        giftBox: false, // 礼物弹窗
        ruleBox: false,
        sured: false,
        tostBox: false,
        chooseTeam: false,
        voteJudge: false, // 是否投票过
        stage: 1, // 阶段
        getSatge: 1, // 拉取阶段数据参数
        stageJudge: 1, // 当前数据阶段判断
        scrollLock1: false,
        scrollLock2: false,
        transformEntity1: undefined,
        transformEntity2: undefined,
        transformEntity3: undefined,
        startJudge: false,
        fialText: '',
        dataTime: '计数周期：6月30日12:00:00-7月5日 11:59:59',

        supContury: '', // 想要支持的国家
        supConturyCode: '', // 想要支持的国家代号

        likeTeam: '',
        voteCountry: '',

        supArr: [], // 支持国家队列表
        modArr: [],
        userArr: [],
        myModArr: [],
        myUserArr: [],
        babyArr: [],
        giftTopArr: [],
        giftOtherArr: [],
        modPage: 1,
        userPage: 1
    },
    created: function () {
        // 个人初始化信息
        axios.get('/WorldCup/userInfo')
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

        // 投票初始化信息
        axios.get('/WorldCup/voteDetail')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.voteJudge = true
                    this.voteCountry = data.data.countryName
                } else {
                    this.voteJudge = false
                }
                console.log(this.voteJudge)
            })
            .catch(err => {
                console.log(err)
            })

        // 初始化
        axios.get('/WorldCup/init')
            .then(res => {
                let data = res.data.data
                this.stage = data.stage
                // this.stage = 4;
                this.stageJudge = this.stage
                if (this.stageJudge == 4) {
                    this.stageJudge = 3
                } else
                if (this.stageJudge == 0) {
                    this.stageJudge = 1
                }
                this.supArr = data.teams
                this.canSup = data.isModerator // 判断是不是主播才可以支持

                // 阶段展示设置
                if (this.stage == 0) {
                    $('.step-text').children('span').removeClass('now')
                    $('.time-line').find('p').css({'width': '100%'})
                    // 都没开始
                    $('.tab-h2').children('div').find('b').addClass('fe')
                } else
                if (this.stage == 1) {
                    $('.step-text').children('span').eq(0).addClass('now')
                    $('.time-line').find('p').addClass('p-1')
                    $('.time-line').find('b').addClass('b-1')
                    $('.date-text').children('span').eq(0).addClass('now')
                    $('.tab-h2').children('div').eq(0).find('b').addClass('ing')
                    $('.tab-h2').children('div').eq(1).find('b').addClass('fe')
                    $('.tab-h2').children('div').eq(2).find('b').addClass('fe')
                } else
                if (this.stage == 2) {
                    $('.tab-h2').children('div').eq(1).addClass('step-now').siblings('div').removeClass('step-now')
                    $('.step-text').children('span').eq(1).addClass('now')
                    $('.time-line').find('p').addClass('p-2')
                    $('.time-line').find('b').addClass('b-2')
                    $('.date-text').children('span').eq(1).addClass('now')
                    $('.tab-h2').children('div').eq(0).find('b').addClass('ed')
                    $('.tab-h2').children('div').eq(1).find('b').addClass('ing')
                    $('.tab-h2').children('div').eq(2).find('b').addClass('fe')
                    this.dataTime = '计数周期：7月5日12:00:00-7月10日 11:59:59'
                } else
                if (this.stage == 3) {
                    $('.tab-h2').children('div').eq(2).addClass('step-now').siblings('div').removeClass('step-now')
                    $('.step-text').children('span').eq(2).addClass('now')
                    $('.time-line').find('p').addClass('p-3')
                    $('.time-line').find('b').addClass('b-3')
                    $('.date-text').children('span').eq(2).addClass('now')
                    $('.tab-h2').children('div').eq(0).find('b').addClass('ed')
                    $('.tab-h2').children('div').eq(1).find('b').addClass('ed')
                    $('.tab-h2').children('div').eq(2).find('b').addClass('ing')
                    this.dataTime = '计数周期：7月10日12:00:00-7月15日 23:59:59'
                } else {
                    $('.tab-h2').children('div').eq(2).addClass('step-now').siblings('div').removeClass('step-now')
                    $('.time-line').find('b').css({'right': '0'})
                    $('.tab-h2').children('div').find('b').addClass('ed')
                    this.dataTime = '计数周期：7月10日12:00:00-7月15日 23:59:59'
                }

                // 主播榜单
                this.getSatge = this.stage
                if (this.getSatge == 0) {
                    this.getSatge = 1
                } else
                if (this.getSatge == 4) {
                    this.getSatge = 3
                }
                axios.get('/WorldCup/WorldCupRank?type=mod&stage=' + this.getSatge + '')
                    .then(res => {
                        let data = res.data
                        this.modArr = data.data.data
                        this.myModArr = data.data.myRankInfo
                    })
                    .catch(err => {
                        console.log(err)
                    })

                // 用户榜单
                axios.get('/WorldCup/WorldCupRank?type=user&stage=' + this.getSatge + '')
                    .then(res => {
                        let data = res.data
                        this.userArr = data.data.data
                        this.myUserArr = data.data.myRankInfo
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })

        // 足球宝贝
        axios.get('/WorldCup/Babys')
            .then(res => {
                let data = res.data
                this.babyArr = data.data
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
        // 分阶段拉取
        getData (stage) {
            // 页码重置
            this.modPage = 1
            this.userPage = 1

            axios.get('/WorldCup/WorldCupRank?type=mod&stage=' + stage + '')
                .then(res => {
                    let data = res.data
                    this.modArr = data.data.data
                    this.myModArr = data.data.myRankInfo
                })
                .catch(err => {
                    console.log(err)
                })

            // 用户榜单
            axios.get('/WorldCup/WorldCupRank?type=user&stage=' + stage + '')
                .then(res => {
                    let data = res.data
                    this.userArr = data.data.data
                    this.myUserArr = data.data.myRankInfo
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 阶段切换
        tabDate1 (e) {
            if (this.stageJudge == 1) {
                return false
            } else {
                this.modArr = []
                this.userArr = []
                this.stageJudge = 1
                Vue.nextTick(() => {
                    this.dataTime = '计数周期：6月30日12:00:00-7月5日 11:59:59'
                    this.tabCon = true
                    this.getData(1)
                    this.getSatge = 1
                })
                $('.tab-h2').children('div').eq(0).addClass('step-now').siblings('div').removeClass('step-now')
            }
        },
        tabDate2 (e) {
            if (this.stage < 2) {
                this.tostBox = !this.tostBox
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    this.tostBox = !this.tostBox
                }, 2000)
            } else
            if (this.stageJudge == 2) {
                return false
            } else {
                this.modArr = []
                this.userArr = []
                this.dataTime = '计数周期：7月5日12:00:00-7月10日 11:59:59'
                Vue.nextTick(() => {
                    this.tabCon = true
                    this.getData(2)
                    this.getSatge = 2
                })
                this.stageJudge = 2
                $('.tab-h2').children('div').eq(1).addClass('step-now').siblings('div').removeClass('step-now')
            }
        },
        tabDate3 (e) {
            if (this.stage < 3) {
                this.tostBox = !this.tostBox
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    this.tostBox = !this.tostBox
                }, 1000)
            } else
            if (this.stageJudge == 3) {
                return false
            } else {
                this.modArr = []
                this.userArr = []
                this.dataTime = '计数周期：7月10日12:00:00-7月15日 23:59:59'
                Vue.nextTick(() => {
                    this.tabCon = true
                    this.getData(3)
                    this.getSatge = 3
                })
                this.stageJudge = 3
                $('.tab-h2').children('div').eq(2).addClass('step-now').siblings('div').removeClass('step-now')
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
            axios.get('/WorldCup/WorldCupRank?type=mod&stage=' + stage + '', {
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
            axios.get('/WorldCup/WorldCupRank?type=user&stage=' + stage + '', {
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
        },

        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        ruleShow () {
            this.ruleBox = !this.ruleBox
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-con')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-cov')
                    that.transformEntity1 = new PolyfillScroll({
                        scrollWrap: '.rule-con',
                        scrollContent: '.rule-cov',
                        bar: {
                            width: '8px',
                            height: '60px',
                            right: '0px',
                            'background': 'rgba(255, 198, 34,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // 关注
        attention (e, index) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/WorldCup/Attention', {
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

        // 关注
        attention2 (e, index) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/WorldCup/Attention', {
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
                            this.babyArr[index]['isLoved'] = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        showGift (e) {
            let that = this
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                this.giftBox = !this.giftBox
                var mid = e.target.getAttribute('data-mid')
                var stageNum = e.target.getAttribute('data-stage')
                axios.get('/WorldCup/RankDetail?mid=' + mid + '&stage=' + stageNum + '')
                    .then(res => {
                        let data = res.data
                        this.giftTopArr = data.data.gallery
                        this.giftOtherArr = data.data.ranks

                        // 初始化排列
                        Vue.nextTick(() => {
                            if (instrSwiper) {
                                instrSwiper.update()
                            } else {
                                instrSwiper = new swiper('.swiper-container', {
                                    direction: 'horizontal',
                                    loop: false,
                                    slidesPerView: 3,

                                    // 如果需要前进后退按钮
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev'
                                    }
                                })
                            }

                            if (that.transformEntity2) {
                                $('.gift-cov').siblings('div').remove()
                                that.transformEntity2.refresh()
                            }
                            const sortWrapElement = document.querySelector('.other-gift')
                            const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                            const sortListElement = document.querySelector('.gift-cov')
                            that.transformEntity2 = new PolyfillScroll({
                                scrollWrap: '.other-gift',
                                scrollContent: '.gift-cov',
                                bar: {
                                    width: '8px',
                                    height: '60px',
                                    right: '0px',
                                    'background': 'rgba(255, 198, 34,1)'
                                }
                            })
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 支持
        sup () {
            // 投票初始化信息
            let that = this
            axios.get('/WorldCup/voteDetail')
                .then(res => {
                    let data = res.data
                    if (data.errno == 0) {
                        this.voteJudge = true
                        this.voteCountry = data.data.countryName
                        this.sured = !this.sured
                        this.likeTeam = this.voteCountry
                    } else {
                        this.voteJudge = false
                        this.supBox = !this.supBox
                        Vue.nextTick(() => {
                            $('.sup-out').niceScroll({
                                cursorwidth: 8,
                                cursorcolor: 'rgba(255, 198, 34,1)', // 设置滚动条滑块的颜色
                                cursorborder: 'none', // CSS方式定义滚动条边框颜色
                                autohidemode: false,
                                cursorfixedheight: 60,
                                hwacceleration: true,
                                horizrailenabled: false,
                                railpadding: { top: 0, right: 2, left: 0, bottom: 0 }
                            })
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        choose (e, index) {
            Vue.nextTick(() => {
                $('.sup-select').find('li').eq(index).addClass('thisgj').siblings('li').removeClass('thisgj')
                this.supContury = e.target.getAttribute('data-contury')
                this.supConturyCode = e.target.getAttribute('data-tid')
                this.chooseTeam = true
                console.log(this.supContury, this.supConturyCode)
            })
        },

        see () {
            this.supBox = !this.supBox
            this.supSure = !this.supSure
        },

        supTeam () {
            this.supBox = !this.supBox
            this.supSure = !this.supSure
        },

        sureSup () {
            // 主播榜单
            axios.get('/WorldCup/voteTeam?teamCode=' + this.supConturyCode + '')
                .then(res => {
                    let data = res.data
                    if (data.errno == 0) {
                        this.supSure = !this.supSure
                        this.sured = !this.sured
                        this.likeTeam = this.supContury
                    } else {
                    // 支持不了
                        this.startJudge = !this.startJudge
                        this.fialText = data.msg
                        this.supSure = !this.supSure
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

$(document).ready(function () {
    $('.other-mod').niceScroll({
        cursorwidth: 8,
        cursorcolor: 'rgba(255, 198, 34,1)', // 设置滚动条滑块的颜色
        cursorborder: 'none', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        horizrailenabled: false,
        hwacceleration: true,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })

    $('.other-user').niceScroll({
        cursorwidth: 8,
        cursorcolor: 'rgba(255, 198, 34,1)', // 设置滚动条滑块的颜色
        cursorborder: 'none', // CSS方式定义滚动条边框颜色
        autohidemode: false,
        cursorfixedheight: 60,
        hwacceleration: true,
        horizrailenabled: false,
        railpadding: { top: 0, right: 10, left: 0, bottom: 0 }
    })
})
