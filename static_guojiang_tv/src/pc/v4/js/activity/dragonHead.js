import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.PolyfillScroll.js'
import user from 'user'

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
        transformEntity: undefined,
        transformEntity2: undefined,
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
            Vue.nextTick(function () {
                if (!that.scrollEnity) {
                    const sortWrapElement = document.querySelector('.rules-txt')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-mes')
                    that.scrollEnity = new PolyfillScroll({
                        scrollWrap: '.rules-txt',
                        scrollContent: '.rule-mes',
                        bar: {
                            width: '10px',
                            height: '100px',
                            right: '2px',
                            'background': 'rgba(0,0,0,0.4)'
                        }
                    })
                }
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
                        user.showLoginPanel()
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
                        user.showLoginPanel()
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
            var pc_id = e.target.getAttribute('data-rid')
            window.open('/' + pc_id) // 主播用户id
        },

        // 仙气榜滚动加载
        initScrollLoadMod () {
            let that = this
            axios.get('/DragonHeadActivity/GetModRank', {
                params: {
                    page: that.modPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addModArr = data.data.ranks
                    if (addModArr.length > 0) {
                        that.modArr = that.modArr.concat(addModArr)
                        that.scrollLock1 = false
                        if (!that.transformEntity) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.mod-other')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.rank-out-mod')
                                that.transformEntity = new PolyfillScroll({
                                    scrollWrap: '.mod-other',
                                    scrollContent: '.rank-out-mod',
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
                                        right: '2px',
                                        'background': 'rgba(200,237,204)'
                                    }
                                })
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 霸气榜
        initScrollLoadUser () {
            let that = this
            axios.get('/DragonHeadActivity/GetUserRank', {
                params: {
                    page: that.userPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addUserArr = data.data.useranks
                    if (addUserArr.length > 0) {
                        that.userArr = that.userArr.concat(addUserArr)
                        that.scrollLock2 = false
                        Vue.nextTick(() => {
                            if (!that.transformEntity2) {
                                const sortWrapElement = document.querySelector('.user-other')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.rank-out-user')
                                that.transformEntity2 = new PolyfillScroll({
                                    scrollWrap: '.user-other',
                                    scrollContent: '.rank-out-user',
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
                                        right: '2px',
                                        'background': 'rgba(200,237,204)'
                                    }
                                })
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
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
        // $('.tab-con').children('div').eq(tabIndex).show().siblings('div').hide();

        $('.tab-con').children('div').eq(tabIndex).find('.three').show().parent().siblings('div').find('.three').hide()

        $('.tab-con').children('div').eq(tabIndex).css({
            'height': 'auto',
            'overflow': 'auto',
            'padding-bottom': '30px'
        }).siblings('div').css({
            'height': '0',
            'overflow': 'hidden',
            'padding-bottom': '0px'
        })
    })
}tab()
