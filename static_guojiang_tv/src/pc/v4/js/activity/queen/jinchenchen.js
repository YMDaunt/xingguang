import '../../../css/activity/queen/jinchenchen.less'

import Vue from 'vue'
import axios from 'axios'
import bodymovin from '../../component/bodymovin.min.js'
import user from 'user'

new Vue({
    el: '#app',
    data: {
        isLogin: false, // 默认用户未登录
        giftTotal: 0, // 礼物总数
        giftList: [], // 用户送礼排行榜
        isCanBuy: false, // 默认不可购买
        tip: '', // 是否可购买提示消息
        svgContainerWrap: false, // 特效背景遮罩
        animItem: '', // 动效
        mask: false, // 购买弹窗背景遮罩
        purchaseNum: 1, // 当前礼物购买数量
        productId: 0, // 当前礼物id
        price: 0, // 当前礼物单价
        m_info: {
            // mid: 1389908, //测试的主播id
            // rid: 44445294 //测试的主播房间号
            mid: 3425640, // 真实的主播id
            rid: 783283 // 真实的主播房间号
        }
    },
    watch: {
        purchaseNum: function (value) {
            if (value > 9999 || value.length > 4) {
                this.purchaseNum = 9999
            } else {
                this.purchaseNum = ('' + value).replace(/[^\d]/g, '')
            }
        }
    },
    computed: {
        totalPrice: function () {
            let temp = this.price * parseInt(this.purchaseNum)
            return temp || 0
        }
    },
    created: function () {
        this.getGiftTotal()
        this.getList()
        this.getUserInfo()
    },
    mounted: function () {
        this.adaptation()
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
        // 获取当前用户信息
        getUserInfo () {
            axios.get('/ChenChen/userInfo')
                .then(res => {
                    let data = res.data
                    if (data.errno == 0) {
                        this.isLogin = true
                    } else {
                        this.isLogin = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 当前主播获得礼物总数
        getGiftTotal () {
            axios.get('/ChenChen/giftTotal')
                .then(res => {
                    let data = res.data
                    if (data.errno == 0) {
                        this.giftTotal = data.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取礼物列表
        getList () {
            axios.get('/ChenChen/ProductList')
                .then(res => {
                    let data = res.data
                    if (data.errno == 0) {
                        this.giftList = data.data
                        data.data.map((item) => {
                            item.image = item.image.replace(/^http:/i, '')
                            if (item.h5AnimationJsonUrl) {
                                item.h5AnimationJsonUrl = item.h5AnimationJsonUrl.replace(/^http:/i, '')
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 进入直播间
        goRoom () {
            window.open('/' + this.m_info.mid) // 主播用户id
        },
        preview (item) {
            let svgSrc = item.h5AnimationJsonUrl,
                imgSrc = item.image
            if (svgSrc) {
                this.playSvg(svgSrc)
            } else {
                let IMG = document.createElement('img')
                IMG.src = imgSrc
                IMG.className = 'svgPng'
                IMG.onload = function () {
                    document.getElementById('svgContainer').appendChild(IMG)
                }
            }
            this.svgContainerWrap = true
        },
        // 播放动画
        playSvg (svgData) {
            this.animItem = bodymovin.loadAnimation({
                wrapper: document.getElementById('svgContainer'),
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: svgData
            })
        },
        // 销毁实例
        destory () {
            document.getElementById('svgContainer').innerHTML = ''
            this.svgContainerWrap = false
        },
        purchase (item) {
            if (this.isLogin) {
                this.productId = item.id,
                axios.get('/ChenChen/canBuy', {
                    params: {
                        productId: this.productId
                    }
                })
                    .then(res => {
                        let data = res.data
                        this.isCanBuy = data.data.canBuy
                        this.tip = data.data.tip
                    })
                    .then(() => {
                        if (this.isCanBuy) {
                            this.purchaseNum = 1
                            this.price = item.price
                            this.mask = true
                        } else {
                            layer.msg(this.tip)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                user.showLoginPanel()
            }
        },
        submit () {
            axios.get('/ChenChen/BuyProduct', {
                params: {
                    productId: this.productId,
                    num: this.purchaseNum
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno == 0) {
                        layer.msg('礼物已放至您的背包，请注意查收！', () => {
                            this.mask = false
                        })
                    } else {
                        layer.msg(data.msg, () => {
                            this.mask = false
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 减少购买
        subtraction () {
            this.purchaseNum--
            if (this.purchaseNum < 0) {
                this.purchaseNum = 0
            }
        },
        // 增加购买
        addition () {
            this.purchaseNum++
        },
        // 关闭弹窗
        close () {
            this.purchaseNum = 1
            this.mask = false
        }
    }
})
