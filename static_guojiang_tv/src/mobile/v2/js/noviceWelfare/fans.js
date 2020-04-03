/*
 * @Date: 2018-09-29 09:58:23
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:56:15
 */

'use strict'

import Vue from 'vue'
import axios from 'axios'
import {getUnit, closeWebview, refreshCoin, goWebviewUrl} from 'common'
// eslint-disable-next-line
import payLayer from '../component/gj.payLayer.js'
import report from 'report'
import layer from 'layer'

import qs from 'querystring'

import '../../css/noviceWelfare/fans.less'

let vm = new Vue({
    el: '#app',
    data: {
        showBanner: true,
        unit: getUnit(),
        coin: 0
    },
    methods: {
        async unlock () {
            // 判断是否有网络
            if (!navigator.onLine) {
                layer.open({
                    content: '网络不给力'
                })
                return false
            }

            report.stat('ClickBroadcastRoom_1RMBFansPopup_1RMBButton')

            this.coin = await this.getUserInfo()
            if (this.coin >= 100) {
                // 余额支付，直接购买
                this.goBuy(true)
            } else if (typeof (this.coin) !== 'undefined') {
                // 第三方支付
                this.showBanner = false
                this.showPayLayer()
            }
        },

        getUserInfo () {
            return new Promise((resolve) => {
                axios.get('/user/getBalance')
                    .then(
                        (res) => {
                            let data = res.data
                            if (data.errno === 0) {
                                resolve(data.data.balance)
                            } else {
                                layer.open({
                                    content: data.msg,
                                    skin: 'msg',
                                    time: 3
                                })
                            }
                        }
                    )
                    .catch(e => {
                        let msg = e.stack
                        if (msg && msg.indexOf('Network Error') !== -1) {
                            msg = '网络不给力'
                        }
                        layer.open({
                            content: msg,
                            skin: 'msg',
                            time: 5
                        })
                    })
            })
                .catch(e => {
                    layer.open({
                        content: e.stack,
                        skin: 'msg',
                        time: 5
                    })
                    // catch里需要throw error，以阻止promise之后的程序执行
                    throw (e)
                })
        },

        showPayLayer () {
            let remainCoin = this.coin
            const unit = this.unit
            payLayer.goPay({
                coin: remainCoin,
                unitPrice: 1,
                headlineText: `1元成为真爱粉`,
                eventIds: ['ClickBroadcastRoom_1RMBFansPopup_Wechat', 'ClickBroadcastRoom_1RMBFansPopup_Alipay', 'ClickBroadcastRoom_1RMBFansPopup_ApplePay'],
                customContent: function () {
                    let newGapCoin = 100 - parseInt(remainCoin)

                    return `<div class="pl_custom">
                                <p>当前余额：${remainCoin} ${unit}</p>
                                <p>还差 ${newGapCoin} ${unit} ￥ ${newGapCoin / 100} </p>
                            </div>`
                },
                buyCallback: function () {
                    vm.goBuy()
                },
                layerEndCallback: function () {
                    if (!window.DO_NOT_CLOSE_WEBVIEW) {
                        vm.closeWebview()
                    }
                }
            })
        },

        reportSucc () {
            let payType = window.sessionStorage['noviceWelfarePayType']
            if (payType === 'wechat') {
                report.stat('ClickBroadcastRoom_1RMBFansPopup_WechatSuccessful')
            } else if (payType === 'alipay') {
                report.stat('ClickBroadcastRoom_1RMBFansPopup_AlipaySuccessful')
            } else if (payType === 'iospay') {
                report.stat('ClickBroadcastRoom_1RMBFansPopup_ApplePaySuccessful')
            }
        },

        closeWebview () {
            closeWebview()
            console.log('closewebview1')
        },

        goBuy (isRemainCoin) {
            let params = qs.parse(location.search.split('?')[1])
            axios.get('/recharge/buyFans', {
                params: {
                    mid: params['mid']
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        if (data.errno === 0) {
                            // 刷新客户端余额
                            refreshCoin('100', false)
                            console.log('common.refreshCoin')
                            layer.open({
                                content: '1元购买成功',
                                time: 3,
                                end: function () {
                                    vm.closeWebview()
                                }
                            })
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    }
                )
        },

        goFansRule () {
            goWebviewUrl(`http://${location.host}/dist/fans/rule.html`)
        }
    }
})

window.vm = vm
