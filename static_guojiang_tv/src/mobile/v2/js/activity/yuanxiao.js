import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import bodymovin from '../component/bodymovin.min.js'

require('../../css/activity/yuanxiao.less')

// ios中激活active伪类
document.body.addEventListener('touchstart', function () {})

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
                        common.goLogin()
                    }
                    if (data.data.time > 1519876800 && data.data.time < 1520265599) {
                    // if(data.data.time > 1519401600 && data.data.time < 1520265599){
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
            this.showPurchase = true
            if (item == 751) {
                this.price = 2999
                this.productId = 470
            } else if (item == 752) {
                this.price = 6666
                this.productId = 471
            }
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
                            layer.open({
                                content: '购买成功，礼物已放入您的背包',
                                time: 3
                            })
                        } else if (_data.errno == -1) {
                            layer.open({
                                content: '余额不足，快去充值吧！',
                                time: 3
                            })
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
        inlive (rid) {
            common.goRoom(rid)
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
