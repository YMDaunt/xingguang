/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:52:30
 */
/* eslint-disable */
import '../../css/noviceWelfare/1.less'

import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import report from 'report'

import payLayer from '../component/gj.payLayer.js'

let vm = new Vue({
    el: 'article',
    data: {
        product: [],
        oFlag: true,
        tFlag: true,
        giftPackId: 1,
        giftPackNum: 1,
        buyIndex: 0, // 购买产品product的索引值
        platform: ''
    },
    created: function () {
        this.getProduct()
        // 埋点上报
        report.stat('OpenSchemeFourPage')
    },
    mounted: function () {
        this.$nextTick(function () {
            this.platform = common.getPlatformType()
        })
    },
    methods: {
        getProduct () {
            // common.showLoading();

            axios.get('/NoviceWelfareActivity/WelfarePackageInfo')
                .then(
                    (res) => {
                        // common.hideLoading();

                        let data = res.data
                        if (data.errno == 0) {
                            vm.product = data.data.info
                        } else {
                            layer.open({
                                content: data.msg,
                                time: 3,
                                skin: 'msg'
                            })
                        }
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            time: 3,
                            skin: 'msg'
                        })
                    }
                )
        },

        goBuy (index) {
            if (!vm.oFlag) return
            vm.oFlag = false

            this.giftPackId = this.product[index].packId
            this.giftPackNum = 1
            this.buyIndex = index

            // common.showLoading();
            axios.get('/noviceWelfareActivity/IsBeginner', {
                params: {
                    giftPackId: this.giftPackId
                }
            })
                .then(function (res) {
                    // common.hideLoading();

                    vm.oFlag = true
                    let data = res.data

                    if (data.errno == 0) {
                        // App审核中时
                        if (data.data.isIOSAppInVerify) {
                            layer.open({
                                content: '请到“我的个人主页-充值”页面进行充值后再购买哦~',
                                btn: ['确定']
                            })
                            return
                        }

                        let priceCoin = parseInt(vm.product[index].price)
                        let price = priceCoin / 100

                        // 计算能购买的最大数量
                        let maxCounter = parseInt((100 - parseFloat(vm.product[vm.buyIndex].buyedPrice)) / price)

                        payLayer.goPay({
                            coin: data.data.coin,
                            unitPrice: price,
                            hasCounter: true,
                            headlineText: `${price}元礼包`,
                            maxCounter: maxCounter,
                            maxCounterCb: function () {
                                layer.open({
                                    content: '购买金额已达上限',
                                    time: 3,
                                    skin: 'msg'
                                })
                            },
                            eventIds: [ 'ClickWechatOfSchemeFour', 'ClickAlipayOfSchemeFour', 'ClickApplepayOfSchemeFour'],
                            customContent: function (num) {
                                let newGapCoin = priceCoin * parseInt(num) - parseInt(data.data.coin)
                                newGapCoin = newGapCoin < 0 ? 0 : newGapCoin

                                let gap_html = newGapCoin == 0 ? '' : `<p>还差 ${newGapCoin} 克拉 ￥ ${newGapCoin / 100} </p>`

                                return `<div class="pl_custom">
											<small>本设备已购买${vm.product[index].buyedPrice}元</small>
											<p>当前余额：${data.data.coin} 克拉</p>
											${gap_html}
										</div>`
                            },
                            callback: function (num) {
                                vm.giftPackNum = num
                            },
                            buyCallback: function () {
                                vm.succussBuy(true)
                            }
                        })
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                })

            // 埋点上报
            if (index == 0) {
                report.stat('Click1RMBPurchaseButtonofSchemeFour')
            } else {
                report.stat('Click10RMBPurchaseButtonofSchemeFour')
            }
        },
        succussBuy: function (isUseRemainCoinPay) {
            // common.showLoading();

            axios.get('/noviceWelfareActivity/WelfareV2', {
                params: {
                    giftPackId: vm.giftPackId,
                    giftPackNum: vm.giftPackNum
                }
            }).then(function (res) {
                // common.hideLoading();

                var data = res.data
                if (data.errno == -100) {
                    common.goLogin()
                } else if (data.errno == 0) {
                    var num = parseInt(vm.giftPackNum) * parseInt(vm.product[vm.buyIndex].gifts[0].number)

                    // 刷新app余额
                    common.refreshAppInfo({'coin': data.data.coin })

                    layer.open({
                        title: '支付成功',
                        content: num + `个${vm.product[vm.buyIndex].gifts[0].name}已经放入您的“礼物-背包”中，快去使用吧`,
                        btn: ['朕知道了']
                    })

                    if (vm.platform == 'ios_webview' || isUseRemainCoinPay) {
                        common.refreshBackpack()
                    }

                    // 更新已购买的金额
                    let newBuyedPrice = parseFloat(vm.product[vm.buyIndex].buyedPrice) + parseInt(vm.giftPackNum) * parseFloat(vm.product[vm.buyIndex].price) / 100
                    vm.product.forEach(function (val) {
                        val.buyedPrice = newBuyedPrice
                    })
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

            // 埋点上报
            if (vm.buyIndex == 0) {
                report.stat('Click1RMBPurchaseButtonofSchemeFourPanel')
            } else {
                report.stat('Click10RMBPurchaseButtonofSchemeFourPanel')
            }
        },

        reportSucc () {
            let pay_type = window.sessionStorage['noviceWelfarePayType']
            if (pay_type == 'wechat') {
                report.stat('PurchaseByWechatSuccessfulOfSchemeFour')
            } else if (pay_type == 'alipay') {
                report.stat('PurchaseByAlipaySuccessfulOfSchemeFour')
            } else if (pay_type == 'iospay') {
                report.stat('PurchaseByApplepaySuccessfulOfSchemeFour')
            }
        }
    }
})

window.vm = vm
