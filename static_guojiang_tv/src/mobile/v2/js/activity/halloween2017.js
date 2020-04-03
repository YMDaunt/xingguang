import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'

require('../../css/activity/halloween2017.less')

// 直播内容不超过20个字
//  $('.live-content').each(function(){
//     var len = this.innerHtml;
//     if(len > 20){
//         len = len.slice(19);
//     }
// });

let modPage = 0
let userPage = 0
let scrollLock1 = false
let scrollLock2 = false

// 滚动加载
function scrollLoad (ele, bottomHeight, callback) {
    var _ele = document.querySelector(ele)
    var cliHeight = _ele.clientHeight
    var bH = bottomHeight || 100
    var scrollTop = _ele.scrollTop
    var scrollHeight = _ele.scrollHeight
    _ele.addEventListener('scroll', function () {
        // if(scrollHeight <= cliHeight){return false};
        cliHeight = _ele.clientHeight
        scrollTop = _ele.scrollTop
        scrollHeight = _ele.scrollHeight
        if (scrollHeight - cliHeight - scrollTop < bH) {
            callback()
        }
    }, false)
}

new Vue({
    el: '#app',
    data: {
        activeTime: '10/26-10/31',
        animItem: '',
        linMid: 7250640,
        linRid: 674395,
        // linRid:44444459,
        // linMid:1387698,
        num: 1,
        price: 0,
        productId: 0,
        purchaseLayer: false,
        listContent: true,
        showLayer: false,
        smash: false,
        svgSrc: '',
        svgContainerBox: false,
        love: '',
        time: '',
        giftData: [],
        modRank: [], // 主播排行榜
        userRank: [], // 用户排行榜
        ghostList: [] // 鬼混列表
    },
    computed: {
        totalMoney: function () {
            return this.num * this.price
        }
    },
    created: function () {
        this.Init()
    },
    mounted: function () {
        // 绑定滚动加载
        this.initScrollLoad()
    },
    methods: {
        Init () {
            axios.get('/Halloween2017Activity2/Init')
                .then(res => {
                    let data = res.data
                    console.log(data)
                    if (data.errno == 0) {
                        this.uid = data.data.uid
                        if (!this.uid) {
                            common.goLogin()
                        }
                        this.time = data.data.time,
                        this.love = data.data.love
                        this.giftData = data.data.giftData
                        this.ghostList = data.data.ghostList
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            this.getModRank()
            this.getUserRank()
        },
        getModRank () {
            const that = this
            axios.get('/Halloween2017Activity2/GetModRank', {
                params: {
                    activityId: 210,
                    page: modPage
                }
            })
                .then(res => {
                    let data = res.data.data
                    console.log(data)
                    if (data.modRank.length > 0) {
                        that.modRank = that.modRank.concat(data.modRank)
                        scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getUserRank () {
            const that = this
            axios.get('/Halloween2017Activity2/GetUserRank', {
                params: {
                    activityId: 210,
                    page: userPage
                }
            })
                .then(res => {
                    let data = res.data.data
                    console.log(data)
                    if (data.userRank.length > 0) {
                        that.userRank = that.userRank.concat(data.userRank)
                        scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        initScrollLoad () {
            const that = this
            scrollLoad('.mod-last-list', 120, function () {
                if (scrollLock1) return
                scrollLock1 = true
                modPage++
                that.getModRank()
            })
            scrollLoad('.user-last-list', 120, function () {
                if (scrollLock2) return
                scrollLock2 = true
                userPage++
                that.getUserRank()
            })
        },
        // 礼物预览
        preview (item) {
            let svgSrc = item.h5AnimationJsonUrl
            this.playSvg(svgSrc)
            this.smash = true
            this.svgContainerBox = true
        },
        // 播放动画
        playSvg (svgData) {
            let svgContainer = document.getElementById('svgContainer')
            svgContainer.innerHTML = ''
            this.animItem = bodymovin.loadAnimation({
                wrapper: svgContainer,
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: svgData
            })
        },
        // 销毁实例
        destory () {
            // this.animItem.destroy();
            this.smash = false
            this.svgContainerBox = false
        },
        // 购买弹窗
        popUp (item) {
            if (this.time < 1509012000) {
                layer.open({
                    content: '活动未开始',
                    time: 3// 默认3秒关闭
                })
            } else if (this.time > 1509465599) {
                layer.open({
                    content: '活动已结束',
                    time: 3// 默认3秒关闭
                })
            } else {
                this.price = item.price
                this.productId = item.id
                this.purchaseLayer = true
            }
        },
        // 关闭弹窗
        close () {
            this.num = 1
            this.purchaseLayer = false
        },
        // 购买
        purchase () {
            axios.get('/Halloween2017Activity2/BuyGifts', {
                params: {
                    productId: this.productId,
                    num: this.num
                }
            })
                .then(res => {
                    let _data = res.data.data
                    console.log(_data)
                    if (_data.result) {
                        layer.open({
                            content: '购买成功，礼物已放入您的背包',
                            time: 3// 默认3秒关闭
                        })
                    } else {
                        layer.open({
                            content: '余额不足，快去充值吧！',
                            time: 3// 默认3秒关闭
                        })
                    }
                    this.close()
                })
                .catch(err => {
                    console.log(err)
                })
        },
        change (arg) {
            if (arg == 'witch') {
                this.listContent = true
            } else if (arg == 'ghost') {
                this.listContent = false
            }
        },
        inlive (mid) {
            if (!mid) {
                common.goRoom(this.linRid)
            } else {
                common.goRoom(mid)
            }
        },
        attention (mid, index, arr) {
            axios.get('/Halloween2017Activity2/Love', {
                params: {
                    mid: mid
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        if (arr === 'love') {
                            this.love = true
                        } else if (arr === 'ghostList') {
                            this.ghostList[index].is_attention = true
                        } else if (arr === 'modRank') {
                            this.modRank[index].is_attention = true
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
