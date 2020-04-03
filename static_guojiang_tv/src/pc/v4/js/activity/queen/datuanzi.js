/**
 * @author  Jesse
 * @date    2017-12-28 18:22:07
 */
require('../../../css/activity/queen/datuanzi.less')

import user from 'user'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'

import slimscroll from '../../component/jquery.slimscroll.js'

new Vue({
    el: '#app',
    data: {
        isFollow: false, // 是否已关注
        list: [], // 用户榜单
        scrollLock: false,
        page: 0,
        showRules: false,
        showMore: false
    },
    computed: {

    },
    created: function () {
        // 获取初始化页面数据
        axios.get('/DatuanziActivity/Init')
            .then(res => {
                let data = res.data
                // console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.uid = data.data.uid
                    this.isFollow = data.data.isFollow
                    this.list = data.data.list
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
        // 适配机型重定向
        this.adaptation()
        // 初始化滚动条
        this.initScrollBar()
        // 绑定滚动加载
        this.initScrollLoad()
    },
    methods: {
        // 适配机型重定向
        adaptation () {
            let href = window.location
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
                }
            }
        },
        // 要求登录执行回调
        login (callback) {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                callback()
            }
        },
        // 点击跳转直播间
        inlive () {
            this.login(function () {
                const mid = 9173285
                window.open(location.origin + '/' + mid)
            })
        },
        // 点击关注按钮，关注主播
        attention () {
            const that = this
            this.login(function () {
                axios.get('/DatuanziActivity/Attention', {
                    params: {
                        mid: 9173285
                    }
                })
                    .then(res => {
                        if (typeof data === 'string') {
                            data = JSON.parse(data)
                        }
                        let _data = res.data
                        if (_data.errno == 0) {
                            that.isFollow = true
                        } else {
                            layer.open({
                                content: _data.msg,
                                time: 3000,
                                closeBtn: 0
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
        },
        // 初始化滚动条
        initScrollBar () {
            $('.last-list').slimScroll({
                width: 'auto', // 可滚动区域宽度
                height: '880px', // 可滚动区域高度
                size: '10px', // 组件宽度
                color: '#a00a38', // 滚动条颜色
                position: 'right', // 组件位置：left/right
                distance: '20px', // 组件与侧边之间的距离
                start: 'top', // 默认滚动位置：top/bottom
                opacity: 1, // 滚动条透明度
                alwaysVisible: true, // 是否 始终显示组件
                disableFadeOut: false, // 是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
                railVisible: false, // 是否 显示轨道
                railColor: '#333', // 轨道颜色
                railOpacity: 0.2, // 轨道透明度
                railDraggable: true, // 是否 滚动条可拖动
                railClass: 'slimScrollRail', // 轨道div类名
                barClass: 'slimScrollBar', // 滚动条div类名
                wrapperClass: 'slimScrollDiv', // 外包div类名
                allowPageScroll: true, // 是否 使用滚轮到达顶端/底端时，滚动窗口
                wheelStep: 10, // 滚轮滚动量
                touchScrollStep: 200, // 滚动量当用户使用手势
                borderRadius: '5px', // 滚动条圆角
                railBorderRadius: '5px' // 轨道圆角
            })
        },
        // 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            let _ele = document.querySelector(ele)
            let bH = bottomHeight || 100
            _ele.addEventListener('scroll', function () {
                let scrollTop = _ele.scrollTop,
                    cliHeight = _ele.clientHeight,
                    scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        },
        // 绑定滚动加载
        initScrollLoad () {
            const that = this
            that.scrollLoad('.last-list', 550, function () {
                if (that.scrollLock) return
                that.scrollLock = true
                that.page++
                that.getUserRank(that.page)
            })
        },
        // ajax获取用户列表
        getUserRank (page) {
            const that = this
            axios.get('/DatuanziActivity/GetRank', {
                params: {
                    page: page
                }
            })
                .then(res => {
                    let data = res.data.data
                    // console.log(data);
                    if (data && data.length > 0) {
                        that.list = that.list.concat(data)
                        that.scrollLock = false
                    } else {
                        that.showMore = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
