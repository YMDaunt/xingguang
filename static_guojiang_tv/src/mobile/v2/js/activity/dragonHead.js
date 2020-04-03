import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'

require('../../css/activity/dragonHead.less')

var addmove = true
new Vue({
    el: '#app',
    data: {
        showRule: false,
        scrollEnity: null,
        showModTop: false,
        showUserTop: false,
        recommendArr: [],
        recommendNum: 0,
        modArr: [],
        userArr: [],
        scrollLock1: false,
        scrollLock2: false,
        modPage: 0,
        userPage: 0,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/DragonHeadActivity/Init')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.uid
                    if (!this.uid) {
                        return common.goLogin()
                    }
                    this.userMesArr = data.data.userMes
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 推荐
        axios.get('/DragonHeadActivity/Recommend')
            .then(res => {
                let data = res.data.data.arrs
                let number = data.allCount
                this.recommendNum = number
                this.recommendArr = data.mods
                if (this.recommendNum <= 0) {
                    $('.list-box').find('p').show().siblings('ul').hide()
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 主播榜单
        axios.get('/DragonHeadActivity/GetModRank')
            .then(res => {
                let data = res.data
                this.modArr = data.data.ranks
                console.log(this.modArr)
            })
            .catch(err => {
                console.log(err)
            })

        // 用户榜单
        axios.get('/DragonHeadActivity/GetUserRank')
            .then(res => {
                let data = res.data
                this.userArr = data.data.useranks
                console.log(this.userArr)
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
        showRules: function () {
            let that = this
            this.showRule = !this.showRule
            // 控制滑动
            $('html').css({
                'height': '100%',
                'overflow-y': 'hidden'
            })
        },

        closeRules: function () {
            let that = this
            this.showRule = !this.showRule

            // 控制滑动
            $('html').css({
                'height': 'auto',
                'overflow-y': 'auto'
            })
        },

        // 关注1
        love (e, index) {
            axios.get('/DragonHeadActivity/Attention', {
                params: {
                    mid: e.target.getAttribute('data-mid')
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        this.recommendArr[index]['isLoved'] = true
                    } else if (!this.uid) {
                        return common.goLogin()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 关注2
        attention (e, index) {
            axios.get('/DragonHeadActivity/Attention', {
                params: {
                    mid: e.target.getAttribute('data-mid')
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        this.modArr[index]['is_attention'] = true
                    } else if (!this.uid) {
                        return common.goLogin()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 换一批
        change: function () {
            // 控制执行满一次动画后才可换一批
            if (addmove) {
                axios.get('/DragonHeadActivity/Recommend')
                    .then(res => {
                        let data = res.data.data.arrs
                        this.recommendArr = data.mods
                        console.log(this.recommendArr)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                addmove = false
            }

            $('.list-box').find('li').css({
                'animation': 'bounceInLeft 1.2s',
                '-webkit-animation': 'bounceInLeft 1.2s'
            })

            $('.change-list').css({
                'animation': 'bounce 0.8s',
                '-webkit-animation': 'bounce 0.8s'
            })

            $('.list-box').find('li')[0].addEventListener('webkitAnimationEnd', function () {
                $('.list-box').find('li').css({
                    'animation': '',
                    '-webkit-animation': ''
                })
                $('.change-list').css({
                    'animation': '',
                    '-webkit-animation': ''
                })
                addmove = true
            })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            common.goRoom(rid) // 主播房间id //主播用户id
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

        // 仙气榜滚动加载
        initScrollLoadMod () {
            const that = this
            that.scrollLoad('.mod-other', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.modPage)
            })
        },

        // 霸气榜滚动加载
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
        getModRank (modPage) {
            const that = this
            axios.get('/DragonHeadActivity/GetModRank', {
                params: {
                    page: modPage
                }
            })
                .then(res => {
                    let data = res.data.data.ranks
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
        getUserRank (userPage) {
            const that = this
            axios.get('/DragonHeadActivity/GetUserRank', {
                params: {
                    page: userPage
                }
            })
                .then(res => {
                    let data = res.data.data.useranks
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

// tab
function tab () {
    $('.tab-tit > div').on('click', function () {
        var tabIndex = $(this).index()
        $(this).addClass('tab-choose').siblings('div').removeClass('tab-choose')
        $('.tab-con').children('div').eq(tabIndex).show().siblings('div').hide()
    })
}tab()

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

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/dragonHead.html'

// 控制规则显示
function controlRule () {
    $(document).scroll(function () {
        var scrollVal = $(document).scrollTop()
        var distance = $('.cloud').offset().top
        if (scrollVal >= distance) {
            $('.rule-btn').hide(0)
        } else {
            $('.rule-btn').show(0)
        }
    })
} controlRule()
