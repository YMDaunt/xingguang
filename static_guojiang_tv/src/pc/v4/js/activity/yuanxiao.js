// 已经引入的库文件
// import $ from 'jquery';
// import layer from 'layer';

import axios from 'axios'
import Vue from 'vue'
import user from 'user'

import bodymovin from '../component/bodymovin.min.js'
import '../component/jquery.slimscroll.js'
require('../../css/activity/yuanxiao.less')
// import PolyfillScroll from '../component/gj.polyfillScroll.js';

new Vue({
    el: '#app',
    data: {
        showList: true, // 展示榜单
        showPurchase: false, // 展示购买弹窗
        isActivityTime: false, // 是否是活动期间
        uid: 0, // 当前用户id
        // time:0,
        showRecommend: true,
        recommendList: [], // 推荐主播列表
        recommendNum: 0, // 可以推荐的主播总数
        moveLeft: false,
        showNoChange: false, // 置灰换一批
        changeLock: false,
        mRanks: [], // 主播排行榜
        uRanks: [], // 用户排行榜
        showRules: false, // 活动规则
        showRulesBtn: false,
        purchaseNum: 1, // 默认购买数量
        defaultNum: 1, // 默认购买数量
        price: 0, // 礼物价格
        productId: 0, // 购买的商品ID
        mask: false, // 特效背景遮罩
        svgContainerBox: false, // 特效盒子
        purchaseLock: true, // 限制连续点击购买
        mScrollLock: false,
        mPage: 0,
        noMoreM: false, // 是否显示没有更多数据
        uScrollLock: false,
        noMoreU: false, // 是否显示没有更多数据
        uPage: 0
    },
    watch: {
        purchaseNum: function (value) {
            if (value == '') {
                this.purchaseNum = 1
            } else {
                this.purchaseNum = ('' + value).replace(/[^\d]/g, '')
            }
        }
    },
    created: function () {
        // 获取初始化页面数据
        axios.get('/YuanXiaoActivity/Init')
            .then(res => {
                let data = res.data
                // console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.uid = data.data.uid
                    if (!this.uid) {
                        user.showLoginPanel()
                    }
                    if (data.data.time > 1519876800 && data.data.time < 1520265599) {
                    // if (data.data.time > 1519401600 && data.data.time < 1520265599) {
                        this.isActivityTime = true
                    }
                    this.recommendList = data.data.recommend.mods
                    this.recommendNum = data.data.recommend.allCount
                    if (this.recommendNum == 0) {
                        this.showRecommend = false
                    }
                    if (this.recommendNum <= 3) {
                        this.showNoChange = true
                    }
                    this.mRanks = data.data.mRank
                    this.uRanks = data.data.uRank
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
        this.scrollBarInit($('.last-list'), '840px')
        this.scrollBarInit($('.rules-content'), '518px')
        // 绑定滚动加载
        this.scrollLoad('.m-last-list', 500, () => {
            if (this.mScrollLock) return
            this.mScrollLock = true
            this.mPage++
            this.getModRank()
        })
        this.scrollLoad('.u-last-list', 500, () => {
            if (this.uScrollLock) return
            this.uScrollLock = true
            this.uPage++
            this.getUserRank()
        })
        // new PolyfillScroll({
        //    scrollWrap:".basket-prize-wrap",
        //    scrollContent: ".basket-scroll-content",
        //    bar:{
        //        background: "rgba(0,0,0,0.6)",
        //    },
        //    cb(distance){
        //        console.log(distance)
        //    }
        // });
        // 监听滚动出现规则按钮
        window.addEventListener('scroll', () => {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            if (scrollTop >= 500) {
                // console.log(scrollTop);
                this.showRulesBtn = true
            } else if (scrollTop < 500) {
                this.showRulesBtn = false
            }
        })
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
        // 初始化滚动条
        scrollBarInit (ele, height) {
            ele.slimScroll({
                width: 'auto', // 可滚动区域宽度
                height: height, // 可滚动区域高度
                size: '10px', // 组件宽度
                color: '#ffec9a', // 滚动条颜色
                position: 'right', // 组件位置：left/right
                distance: '0px', // 组件与侧边之间的距离
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
        // 礼物预览
        preview (item) {
            let svgSrc = ''
            switch (item) {
            // 许愿天灯
            case 751:
                svgSrc = '//static.guojiang.tv/app/gift/pc_animation/751/751.json'
                break
                // 团团圆圆
            case 752:
                svgSrc = '//static.guojiang.tv/app/gift/pc_animation/752/752.json'
                break
            }
            this.playSvg(svgSrc)
            this.mask = true
            this.svgContainerBox = true
        },
        // 播放动画
        playSvg (svgData) {
            this.animItem = bodymovin.loadAnimation({
                wrapper: svgContainer,
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: svgData
            })
        },
        // 销毁动效
        destory () {
            svgContainer.innerHTML = ''
            this.mask = false
            this.svgContainerBox = false
        },
        // 购买弹窗
        popUp (item) {
            this.login(() => {
                this.showPurchase = true
                if (item == 751) {
                    this.price = 2999
                    this.productId = 470
                } else if (item == 752) {
                    this.price = 6666
                    this.productId = 471
                }
            })
        },
        // 减少购买数量
        subtraction () {
            this.purchaseNum--
            if (this.purchaseNum < 0) {
                this.purchaseNum = 0
            }
        },
        // 增加购买数量
        addition () {
            this.purchaseNum++
        },
        // 关闭弹窗
        close () {
            this.purchaseNum = 1
            this.showPurchase = false
        },
        // 确认购买
        purchase () {
            if (this.purchaseLock) {
                this.purchaseLock = false
                axios.get('/YuanXiaoActivity/GetPurchase', {
                    params: {
                        productId: this.productId,
                        num: this.purchaseNum
                    }
                })
                    .then(res => {
                        let _data = res.data
                        // console.log(_data);
                        this.purchaseLock = true
                        this.close()
                        if (_data.errno == 0) {
                            layer.msg('购买成功！礼物已放入您的背包')
                        } else if (_data.errno == -1) {
                            layer.msg('余额不足，快去充值吧！')
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        // 换一批推荐
        change () {
            if (!this.changeLock) {
                this.changeLock = true
                axios.get('/YuanXiaoActivity/GetRecommend')
                    .then(res => {
                        let _data = res.data
                        // console.log('推荐榜', _data);
                        if (_data.errno == 0) {
                            this.recommendList = this.recommendList.concat(_data.data.mods)
                            this.moveLeft = true
                        }
                        setTimeout(() => {
                            this.recommendList.splice(0, 3)
                            this.moveLeft = false
                            this.changeLock = false
                        }, 1000)
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
        // ajax获取主播列表
        getModRank () {
            axios.get('/YuanXiaoActivity/GetRank', {
                params: {
                    page: this.mPage,
                    limit: 20,
                    tag: 'm'
                }
            })
                .then(res => {
                    let data = res.data.data
                    // console.log(data);
                    if (data.ranks.length > 0) {
                        this.mRanks = this.mRanks.concat(data.ranks)
                        // this.scrollBarInit($('.last-list'), '840px');
                        if (this.mRanks.length == data.sum) {
                            this.noMoreM = true
                        }
                        this.mScrollLock = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // ajax获取用户列表
        getUserRank () {
            axios.get('/YuanXiaoActivity/GetRank', {
                params: {
                    page: this.uPage,
                    limit: 20,
                    tag: 'u'
                }
            })
                .then(res => {
                    let data = res.data.data
                    // console.log(data);
                    if (data.ranks.length > 0) {
                        this.uRanks = this.uRanks.concat(data.ranks)
                        // this.scrollBarInit($('.last-list'), '840px');
                        if (this.uRanks.length == data.sum) {
                            this.noMoreU = true
                        }
                        this.uScrollLock = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 点击主播头像，跳转直播间
        inlive (mid) {
            window.open(location.origin + '/' + mid)
        },
        // 点击关注按钮，关注主播
        attention (mid, index, tag) {
            axios.get('/YuanXiaoActivity/Attention', {
                params: {
                    mid: mid
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    // console.log(_data);
                    if (_data.errno == 0) {
                        if (tag == 'list') {
                            this.mRanks[index].is_attention = true
                        } else {
                            this.recommendList[index].isLoved = true
                        }
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
        }
    }
})
