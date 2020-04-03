'use strict'

import Vue from 'vue'
import { swiperAnimateCache, swiperAnimate } from '../../component/animate.min.js'
import Swiper from '../../component/swiper.min.js'
import axios from 'axios'
import { getPackageId, getPlatformType, goLogin } from 'common'

import '../../../css/activity/new/withLive.less'
import '../../../css/component/swiper.min.css'
import '../../../css/component/animate.css'

new Vue({
    el: '#app',
    data: {
        isLogin: false,
        who: '星光',
        name: '克拉',
        mySwiper: null,
        timer: null,
        jd: 0,
        isWith: true, // 2019是否参与直播平台
        isMod: false,
        canTab: false,
        musicPlay: true,
        isModWith: true, // 主播身份一整年是否参与
        upBtn: true, // 向上切
        canChoose: false, // 是否有身份可选
        canNext: false, // 可以切换页面
        userImg: '',
        mod: {},
        user: {},
        chooseMod: false,
        chooseUser: false,
        key: 'chpscq', // 关键词缩写
        keyDesc: '', // 关键词描述
        // musicUrl: '',
        preTimer: null
    },
    computed: {
        keyName () {
            switch (this.key) {
            case 'sh':
                return '神豪'
            case 'zq':
                return '专情'
            case 'mnjds':
                return '美女鉴定师'
            case 'ssw':
                return '手速王'
            case 'bdns':
                return '补刀能手'
            case 'hkxr':
                return '好看星人'
            case 'xjw':
                return '吸金王'
            case 'xxn':
                return '小仙女'
            case 'xghs':
                return '性感化身'
            case 'kad':
                return '可爱多'
            case 'alg':
                return '奥利给'
            case 'wwjkp':
                return '万物皆可盘'
            case 'chpscq':
                return '彩虹屁生成器'
            case 'qlg':
                return '潜力股'
            case 'xcz':
                return '小财主'
            case 'dz':
                return '地主'
            case 'dfh':
                return '大富豪'
            }
        }
    },
    created () {
        const platform = getPlatformType()
        const per = getPackageId()
        if (platform === 'ios_webview') {
            if (per === '5') {
                this.name = '克拉'
                this.who = '漂流瓶'
            } else
            if (per === '11') {
                this.name = '花瓣'
                this.who = '风情'
            } else
            if (per === '12') {
                this.name = '甜蜜'
                this.who = '妩媚'
            }
        }

        Vue.nextTick(() => {
            setTimeout(() => {
                this.preTimer = setInterval(() => {
                    this.jd++
                    if (this.jd >= 65) {
                        clearInterval(this.preTimer)
                        this.preTimer = null
                    }
                }, 45)
            }, 800)
        })
    },
    mounted () {
        document.onreadystatechange = this.loadingChange
    },
    methods: {
        loadingChange () {
            let that = this
            if (document.readyState === 'complete') {
                clearInterval(this.preTimer)
                this.preTimer = null
                this.init()
                this.mySwiper = new Swiper('.swiper-container', {
                    direction: 'vertical',
                    loop: false,
                    on: {
                        init: function () {
                            swiperAnimateCache(this) // 隐藏动画元素
                            swiperAnimate(this) // 初始化完成开始动画
                        },
                        slideChange: function () {
                            swiperAnimate(this)
                            if (!that.isMod) {
                                if (this.activeIndex === 7) {
                                    // 最后一页切换按钮
                                    that.upBtn = false
                                    that.canNext = false
                                } else {
                                    that.upBtn = true
                                    that.canNext = true
                                }
                            } else {
                                if (this.activeIndex === 0) {
                                    // 首页不展示按钮
                                    that.canNext = false
                                    that.upBtn = true
                                } else if (this.activeIndex === 7) {
                                    // 最后一页切换按钮
                                    that.upBtn = false
                                    that.canNext = false
                                } else {
                                    that.upBtn = true
                                    that.canNext = true
                                }
                            }
                        }
                    }
                })
                this.timer = setInterval(() => {
                    this.jd++
                    if (this.jd >= 100) {
                        clearInterval(this.timer)
                        this.timer = null

                        // 开启身份选择
                        setTimeout(() => {
                            // 延迟切换至身份选择页面
                            this.canTab = true
                            if (!this.isMod) {
                                this.canNext = true
                            }
                            // 播放音乐
                            this.start()
                            // Vue.nextTick(() => {
                            // })
                        }, 500)
                    }
                }, 35)
            }
        },

        tabNext () {
            this.mySwiper.slideNext()
        },

        tabIndex () {
            this.mySwiper.slideTo(0)
        },

        init () {
            axios.get('/springFestival2020/yearSummaryInitInfo')
                .then((res) => {
                    let data = res.data.data
                    this.isLogin = data.isLogin

                    // this.musicUrl = data.musicUrl
                    // if (!this.musicUrl) {
                    //     this.musicPlay = false
                    // } else {
                    //     setTimeout(()=> {
                    //         document.getElementById('playMusic').play()
                    //         this.musicPlay = true
                    //     }, 1500)
                    // }
                    this.userImg = data.headPic
                    this.isWith = data.hasSummary
                    if (!this.isLogin) {
                        return goLogin()
                    }
                    this.isMod = data.isMod
                    if (!this.isMod) {
                        this.canChoose = false
                        // 只会获取用户身份
                        this.getUser()
                        this.upBtn = true
                        this.canNext = true
                    } else {
                        this.isModWith = data.hasModSummary
                        this.canChoose = true
                        this.canNext = false
                    }
                    // this.canChoose = data.showTwoOptions
                })
                .catch((err) => console.log(err))
        },

        // 暂停
        stop () {
            document.getElementById('playMusic').pause()
            this.musicPlay = false
        },

        // 开始
        start () {
            // if (!this.musicUrl) {
            //     return false
            // } else {
            //     document.getElementById('playMusic').play()
            //     this.musicPlay = true
            // }
            document.getElementById('playMusic').play()
            this.musicPlay = true
        },

        // 换词
        changeKey () {
            let type = 0
            if (this.chooseMod) {
                type = 1
            } else {
                type = 2
            }
            axios.get('/springFestival2020/changeKeyword?type=' + type + '&keyword=' + this.key)
                .then((res) => {
                    let data = res.data.data
                    this.key = data.keyword
                    this.keyDesc = data.keywordText
                })
                .catch((err) => console.log(err))
        },

        getMod () {
            if (!this.isModWith) {
                this.isWith = false
            } else {
                axios.get('/springFestival2020/getYearSummary?type=1')
                    .then((res) => {
                        let data = res.data.data
                        this.mod = data
                        // 针对没直播数据的主播 删除对应的页面
                        if (data.videoPublishTimes === '' || data.accompanyUserNickname === '' || data.accompanyUserHeadPic === '') {
                            this.mySwiper.removeSlide([2])
                        }
                        if (data.fansNum === 0 || data.biggestFanHeadPic === '' || data.biggestFanNickname === '') {
                            this.mySwiper.removeSlide([3])
                        }
                        if (data.mostReceivedGifts.length === 0) {
                            this.mySwiper.removeSlide([3])
                        }
                        this.key = data.keyword
                        this.keyDesc = data.keywordText
                        // 选择身份后开启tab
                        this.canNext = true
                        this.chooseMod = true
                        this.chooseUser = false
                        Vue.nextTick(() => {
                            this.mySwiper.slideNext()
                        })
                    })
                    .catch((err) => console.log(err))
            }
        },
        getUser () {
            this.canNext = true
            this.chooseUser = true
            this.chooseMod = false
            axios.get('/springFestival2020/getYearSummary?type=2')
                .then((res) => {
                    let data = res.data.data
                    this.user = data
                    // 针对没礼物数据的用户 删除对应的页面
                    if (data.accompanyModNickname === '' || data.accompanyModHeadPic === '') {
                        this.mySwiper.removeSlide([2])
                    }
                    if (data.favoriteModNickname === '' || data.costForFavoriteMod === 0) {
                        this.mySwiper.removeSlide([3])
                    }
                    if (data.mostSentGifts.length === 0) {
                        this.mySwiper.removeSlide([3])
                    }
                    this.key = data.keyword
                    this.keyDesc = data.keywordText
                    if (this.isMod) {
                        this.mySwiper.slideNext()
                    }
                })
                .catch((err) => console.log(err))
        }
    }
})
