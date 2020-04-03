/* eslint-disable*/
// 样式的引用
import '../../../css/activity/noviceWelfare/noviceWelfare2.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import report from 'report'

import payLayer from '../../component/gj.payLayer.js'

let vm = new Vue({
    el: '#app',
    data: {
        lastCoin: 0,   // 账户所剩克拉
        timer: null,
        tostBox: false,
        tostText: '',
    },
    created: function () {
        
    },
    mounted: function () {
        this.$nextTick(function () {
            // 判断是否是支付成功后的页面，如果是进行购买操作
            let succ_cookie = document.cookie.split('rechargeSucc=')[1]
            if (succ_cookie) {
                succ_cookie = succ_cookie.split(';')[0]
                if (succ_cookie == '1') {
                    document.cookie = 'rechargeSucc=' + 0 + ';domain=' + location.host.replace(/^m\./, '') + ';path=/'

                    // 支付完继续购买
                    this.buyBdGift()
                }
            }
        })

        window.addEventListener('offline', function () {
            layer.open({
                content: '槽糕，没网啦~',
                skin: 'msg',
                time: 2
            })
        })
    },
    methods: {
        // 购买前判断余额
        getLastCoin() {
            let that = this
            axios.get('/NoviceWelfareActivity/canBuyBiDong')
            .then(res => {
                let data = res.data
                // 未登录
                if (!data.data.coin) {
                    return common.goLogin()
                } else {
                    this.lastCoin = data.data.coin
                    if(data.data.canBuy === 1){
                        layer.open({
                            content: '确定购买1个壁咚主播吗？',
                            btn: ['确定', '取消'],
                            yes: function (e) {
                                that.buyBdGift()
                                layer.close(e)
                            }
                        })
                    } else if (data.data.canBuy === 4){
                        // 余额不足，充值去买
                        this.showPayLayer()
                    } else if (data.data.canBuy === 2){
                        this.disapperTost(2500, '您不具备购买资格！')
                    } else if (data.data.canBuy === 3){
                        this.disapperTost(2500, '您已经购买过了！')
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 调用购买
        buyBdGift() {
            axios.get('/NoviceWelfareActivity/buyBiDong')
            .then(res => {
                let data = res.data
                if (data.errno === -100) {
                    common.goLogin()
                } else if(data.errno === 0){
                    // 购买成功
                    this.lastCoin = data.data.coin
                    this.buySuccess()
                } else if (data.errno === 106){
                    // 余额不足，用1元去买
                    this.showPayLayer()
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        buySuccess() {
            layer.open({
                title: '支付成功',
                content: '1个壁咚主播已放入您的“礼物-背包”中，快去使用吧',
                btn: ['朕知道了'],
                yes: function(e){
                    layer.close(e);
                }
            })
            // 刷新app余额
            common.refreshAppInfo({'coin': this.lastCoin })
            // 刷新app背包
            common.refreshBackpack()
        }, 

        showPayLayer() {
            let that = this
            payLayer.goPay({
                coin: that.lastCoin,
                unitPrice: 1,
                headlineText: '1元特惠',
                eventIds: [],
                customContent: function (num) {
                    let needCoin = 100 - Number(that.lastCoin)  //还需多少
                    return `<div class="pl_custom">
                                        <p>当前余额：${that.lastCoin} 克拉</p>
                                        <p>还差 ${needCoin}克拉 ￥${needCoin / 100} </p>
                                    </div>`
                },
                callback: function (num) {
                    console.log(num)
                }
            })
        },
        reportSucc () {
            let pay_type = window.sessionStorage['noviceWelfarePayType']
            if (pay_type === 'wechat') {
                report.stat('PurchaseByWechatSuccessfulOfSchemeOne')
            } else if (pay_type === 'alipay') {
                report.stat('PurchaseByAlipaySuccessfulOfSchemeOne')
            } else if (pay_type === 'iospay') {
                report.stat('PurchaseByApplepaySuccessfulOfSchemeOne')
            }
        },
        // tost计时器
        disapperTost(time, text) {
            this.tostBox = true;
            this.tostText = text;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(()=> {
                this.tostBox = false;
            }, time)
        }
    }
})
window.vm = vm
