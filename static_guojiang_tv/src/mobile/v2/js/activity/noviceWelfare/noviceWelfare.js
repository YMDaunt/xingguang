/* eslint-disable*/
// 样式的引用
import '../../../css/activity/noviceWelfare/noviceWelfare.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import report from 'report'

import payLayer from '../../component/gj.payLayer.js'

// 在loader里面完成less的编译
window.copyright = '星光'

let vm = new Vue({
    el: 'article',
    data: {
        fish: [
            '连送该礼物，会出现酷炫特效<span class="new1"></span>',
            '购买大宝剑，即可获取吊炸天的新手勋章<span class="new2"></span>一枚！让你备受全场瞩目！',
            '只有新用户才买得到的礼物，主播收到该礼物满9999个时触发全站广播，所以送大宝剑更受主播欢迎哦！'
        ],
        info: [
            '1元特惠活动每个设备号仅有1次机会，抢到即是赚到！',
            '9.9元礼包活动为每个用户仅在注册起7天内可以重复购买，手快有手慢无哦。',
            '购买成功后礼物直接到背包使用哦。',
            '新手勋章的有效性为7天。'
        ],
        official: '本活动最终解释权归' + window.copyright + '官方所有',
        unit:common.getUnit(),
        oFlag: true,
        tFlag: true,
        giftPackId: 11,
        giftPackNum: 1,
        platform: '',
        websiteId: 0,
        packageId: common.getPackageId(),
        isTimeShowPage: false
    },
    beforeCreate: function () {
        // common.showLoading();
    },
    created: function () {
        this.getRedirectUrl()
    },
    mounted: function () {
        this.$nextTick(function () {
            // 判断是否是支付成功后的页面，如果是进行购买操作
            let succ_cookie = document.cookie.split('rechargeSucc=')[1]
            if (succ_cookie) {
                succ_cookie = succ_cookie.split(';')[0]
                console.log(succ_cookie)
                if (succ_cookie == '1') {
                    document.cookie = 'rechargeSucc=' + 0 + ';domain=' + location.host.replace(/^m\./, '') + ';path=/'
                    this.giftPackId = sessionStorage.getItem('giftPackId')
                    this.giftPackNum = sessionStorage.getItem('giftPackNum')

                    this.succussBuy()
                }
            }

            this.platform = common.getPlatformType()
            this.websiteId = location.search.split('packageId=')[1] ? location.search.split('&')[0].split('packageId=')[1] : 0

            if (this.platform != 'android_webview' && this.platform != 'ios_webview') {
                this.official = this.websiteId == 0 ? '本活动最终解释权归星光官方所有' : '本活动最终解释权归星光官方所有'
                this.info = [
                    '1元特惠活动每个设备号仅有1次机会，抢到即是赚到！',
                    '9.9元礼包活动为每个用户仅在注册起7天内可以重复购买，手快有手慢无哦。',
                    '购买成功后礼物将放入背包中，下载APP后进入直播间即可使用。',
                    '新手勋章的有效性为7天，目前只支持在APP和电脑上显示哦。'
                ]
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
        getRedirectUrl () {
            axios.get('/NoviceWelfareActivity/GetWelfareUrl')
                .then(
                    (res) => {
                        // common.hideLoading();

                        let data = res.data
                        if (data.errno == 0) {
                            if (data.data.url.indexOf('noviceWelfare.html') == -1) {
                                location.href = data.data.url
                            } else {
                                vm.isTimeShowPage = true
                                // 埋点上报
                                report.stat('OpenSchemeOnePage')
                            }
                        } else {
                            layer.open({
                                content: data.msg,
                                time: 3,
                                skin: 'msg'
                            })
                        }
                    }
                )
        },
        purchase_one: function () {
            if (!vm.oFlag) return
            vm.oFlag = false

            if (!navigator.onLine) {
                layer.open({
                    content: '槽糕，没网啦~',
                    skin: 'msg',
                    time: 2
                })
                return
            }
            axios.get('/noviceWelfareActivity/IsBeginner', {
                params: {
                    giftPackId: 11
                }
            })
                .then((res) => {
                    vm.oFlag = true
                    let data = res.data
                    if (data.data.isBeginner) {
                        // 满足条件时候提供接口
                        vm.giftPackId = 11
                        // App审核中时
                        if (data.data.isIOSAppInVerify) {
                            layer.open({
                                content: '请到“我的个人主页-充值”页面进行充值后再购买哦~',
                                btn: ['确定']
                            })
                            return
                        }

                        if (data.data.coin >= 100) {
                            // 余额充足直接用余额支付
                            layer.open({
                                content: '确定购买20个大宝剑',
                                btn: ['确定', '取消'],
                                yes: function (e) {
                                    vm.succussBuy(true)
                                    layer.close(e)
                                    // 埋点上报
                                    report.stat('ClickOKButtonofSchemeOnePanel')
                                }
                            })
                        } else {
                            // 存储sessionStorage支付成功后调用
                            sessionStorage.setItem('giftPackId', 11)
                            sessionStorage.setItem('giftPackNum', 1)

                            let gapCoin = 100 - parseInt(data.data.coin)
                            let unit = this.unit
                            payLayer.goPay({
                                coin: data.data.coin,
                                unitPrice: 1,
                                headlineText: '1元特惠',
                                eventIds: ['ClickWechatOfSchemeOne', 'ClickAlipayOfSchemeOne', 'ClickApplepayOfSchemeOne'],
                                customContent: function () {
                                    return `<div class="pl_custom">
                                            <p>当前余额：${data.data.coin} ${unit}</p>
                                            <p>还差 ${gapCoin} ${unit} ￥ ${gapCoin / 100} </p>
                                        </div>`
                                }
                            })
                        }
                    } else {
                        console.log('不是新手')
                        // 是否为新手，不是新手的时候，应该提示不具备此资格，仅仅一元的有这样的优惠
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 2
                        })
                    }
                })

            // 埋点上报
            report.stat('Click1RMBPurchaseButtonofSchemeOne')
        },
        purchase_ten: function () {
            if (!vm.tFlag) return
            vm.tFlag = false
            if (!navigator.onLine) {
                // 无网络状态的处理
                layer.open({
                    content: '槽糕，没网啦~',
                    skin: 'msg',
                    time: 2
                })
                return
            }
            axios.get('/noviceWelfareActivity/IsBeginner', {
                params: {
                    giftPackId: 12
                }
            })
                .then((res) => {
                    vm.tFlag = true
                    let data = res.data
                    if (data.data.isBeginner) {
                        vm.giftPackId = 12
                        if (data.data.isIOSAppInVerify) {
                            layer.open({
                                content: `请到“我的个人主页-${this.unit}充值”页面进行充值后再购买哦~`,
                                btn: ['确定']
                            })
                            return
                        }
                        if (data.data.coin >= 990) {
                            // 余额充足直接用余额支付
                            layer.open({
                                content: '确定购买99个大宝剑',
                                btn: ['确定', '取消'],
                                yes: function (e) {
                                    vm.succussBuy(true)
                                    layer.close(e)
                                    // 埋点上报
                                    report.stat('ClickOKButtonofSchemeOnePanel')
                                }
                            })
                        } else {
                            // 存储sessionStorage支付成功后调用
                            sessionStorage.setItem('giftPackId', 12)
                            sessionStorage.setItem('giftPackNum', 1)

                            let gapCoin = 990 - parseInt(data.data.coin)
                            let unit = this.unit
                            payLayer.goPay({
                                coin: data.data.coin,
                                unitPrice: 9.9,
                                hasCounter: true,
                                headlineText: '9.9元礼包',
                                eventIds: ['ClickWechatOfSchemeOne', 'ClickAlipayOfSchemeOne', 'ClickApplepayOfSchemeOne'],
                                customContent: function (num) {
                                    let newGapCoin = gapCoin + 990 * (parseInt(num) - 1)
                                    return `<div class="pl_custom">
                                                        <p>当前余额：${data.data.coin} ${unit}</p>
                                                        <p>还差 ${newGapCoin} ${unit} ￥ ${newGapCoin / 100} </p>
                                                    </div>`
                                },
                                callback: function (num) {
                                    vm.giftPackNum = num
                                }
                            })
                        }
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 2
                        })
                    }
                })

            // 埋点上报
            report.stat('Click9.9RMBPurchaseButtonofSchemeOne')
        },
        succussBuy: function (isUseRemainCoinPay) {
            axios.get('/noviceWelfareActivity/WelfareV2', {
                params: {
                    giftPackId: vm.giftPackId,
                    giftPackNum: vm.giftPackNum
                }
            }).then(function (res) {
                var data = res.data
                if (data.errno == -100) {
                    common.goLogin()
                } else if (data.errno == 0) {
                    var num = parseInt(vm.giftPackNum) * 99
                    var buyVal = vm.giftPackId == 11 ? 20 : num

                    if (vm.platform != 'android_webview' && vm.platform != 'ios_webview') {
                        layer.open({
                            title: '支付成功',
                            content: buyVal + '个大宝剑已经放入您的“礼物-背包”中，快去下载APP使用吧',
                            btn: ['去使用'],
                            yes: function (index) {
                                let url = vm.websiteId == 2 ? '/download/second' : '/download/second'
                                location.href = url
                                layer.close(index)

                                // cnzz统计
                                _czc.push(['_trackEvent', 'H5新手福利', '去使用按钮'])
                            },
                            end: function () {
                                console.log('no')
                            }
                        })
                    } else {
                        // 刷新app余额
                        common.refreshAppInfo({'coin': data.data.coin })
                        // 刷新app背包
                        common.refreshBackpack()

                        layer.open({
                            title: '支付成功',
                            content: buyVal + '个大宝剑已经放入您的“礼物-背包”中，快去使用吧',
                            btn: ['朕知道了']
                        })
                    }
                } else if (data.errno == -106) {
                    layer.open({
                        content: '余额不足，可能是充值未到账，请联系客服',
                        skin: 'msg',
                        time: 2
                    })
                } else {
                    layer.open({
                        content: data.msg,
                        skin: 'msg',
                        time: 2
                    })
                }
            })
        },

        reportSucc () {
            let pay_type = window.sessionStorage['noviceWelfarePayType']
            if (pay_type == 'wechat') {
                report.stat('PurchaseByWechatSuccessfulOfSchemeOne')
            } else if (pay_type == 'alipay') {
                report.stat('PurchaseByAlipaySuccessfulOfSchemeOne')
            } else if (pay_type == 'iospay') {
                report.stat('PurchaseByApplepaySuccessfulOfSchemeOne')
            }
        }
    }
})

window.vm = vm






// /* eslint-disable*/
// // 样式的引用
// import '../../../css/activity/noviceWelfare/noviceWelfare.less'

// // 通用库类的引用
// import common from 'common'
// import layer from 'layer'
// import Vue from 'vue'
// import axios from 'axios'
// import report from 'report'

// import payLayer from '../../component/gj.payLayer.js'

// let vm = new Vue({
//     el: '#app',
//     data: {
//         lastCoin: 0,   // 账户所剩克拉
//         timer: null,
//         tostBox: false,
//         tostText: '',
//     },
//     created: function () {
        
//     },
//     mounted: function () {
//         this.$nextTick(function () {
//             // 判断是否是支付成功后的页面，如果是进行购买操作
//             let succ_cookie = document.cookie.split('rechargeSucc=')[1]
//             if (succ_cookie) {
//                 succ_cookie = succ_cookie.split(';')[0]
//                 if (succ_cookie == '1') {
//                     document.cookie = 'rechargeSucc=' + 0 + ';domain=' + location.host.replace(/^m\./, '') + ';path=/'

//                     // 支付完继续购买
//                     this.buyBdGift()
//                 }
//             }
//         })

//         window.addEventListener('offline', function () {
//             layer.open({
//                 content: '槽糕，没网啦~',
//                 skin: 'msg',
//                 time: 2
//             })
//         })
//     },
//     methods: {
//         // 购买前判断余额
//         getLastCoin() {
//             let that = this
//             axios.get('/NoviceWelfareActivity/canBuyBiDong')
//             .then(res => {
//                 let data = res.data
//                 // 未登录
//                 if (!data.data.coin) {
//                     return common.goLogin()
//                 } else {
//                     this.lastCoin = data.data.coin
//                     if(data.data.canBuy === 1){
//                         layer.open({
//                             content: '确定购买1个壁咚主播吗？',
//                             btn: ['确定', '取消'],
//                             yes: function (e) {
//                                 that.buyBdGift()
//                                 layer.close(e)
//                             }
//                         })
//                     } else if (data.data.canBuy === 4){
//                         // 余额不足，充值去买
//                         this.showPayLayer()
//                     } else if (data.data.canBuy === 2){
//                         this.disapperTost(2500, '您不具备购买资格！')
//                     } else if (data.data.canBuy === 3){
//                         this.disapperTost(2500, '您已经购买过了！')
//                     }
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         },

//         // 调用购买
//         buyBdGift() {
//             axios.get('/NoviceWelfareActivity/buyBiDong')
//             .then(res => {
//                 let data = res.data
//                 if (data.errno === -100) {
//                     common.goLogin()
//                 } else if(data.errno === 0){
//                     // 购买成功
//                     this.lastCoin = data.data.coin
//                     this.buySuccess()
//                 } else if (data.errno === 106){
//                     // 余额不足，用1元去买
//                     this.showPayLayer()
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         },

//         buySuccess() {
//             layer.open({
//                 title: '支付成功',
//                 content: '1个壁咚主播已放入您的“礼物-背包”中，快去使用吧',
//                 btn: ['朕知道了'],
//                 yes: function(e){
//                     layer.close(e);
//                 }
//             })
//             // 刷新app余额
//             common.refreshAppInfo({'coin': this.lastCoin })
//             // 刷新app背包
//             common.refreshBackpack()
//         }, 

//         showPayLayer() {
//             let that = this
//             payLayer.goPay({
//                 coin: that.lastCoin,
//                 unitPrice: 1,
//                 headlineText: '1元特惠',
//                 eventIds: [],
//                 customContent: function (num) {
//                     let needCoin = 100 - Number(that.lastCoin)  //还需多少
//                     return `<div class="pl_custom">
//                                         <p>当前余额：${that.lastCoin} 克拉</p>
//                                         <p>还差 ${needCoin}克拉 ￥${needCoin / 100} </p>
//                                     </div>`
//                 },
//                 callback: function (num) {
//                     console.log(num)
//                 }
//             })
//         },
//         reportSucc () {
//             let pay_type = window.sessionStorage['noviceWelfarePayType']
//             if (pay_type === 'wechat') {
//                 report.stat('PurchaseByWechatSuccessfulOfSchemeOne')
//             } else if (pay_type === 'alipay') {
//                 report.stat('PurchaseByAlipaySuccessfulOfSchemeOne')
//             } else if (pay_type === 'iospay') {
//                 report.stat('PurchaseByApplepaySuccessfulOfSchemeOne')
//             }
//         },
//         // tost计时器
//         disapperTost(time, text) {
//             this.tostBox = true;
//             this.tostText = text;
//             if (this.timer) {
//                 clearTimeout(this.timer);
//             }
//             this.timer = setTimeout(()=> {
//                 this.tostBox = false;
//             }, time)
//         }
//     }
// })
// window.vm = vm
