/* eslint-disable*/
import '../../css/activity/giftPackage.less'
import Vue from 'vue'
import layer from 'layer'
import axios from 'axios'
import {refreshBackpack, refreshCoin, closeWebview, getUnit} from 'common'
import payLayer from '../component/gj.payLayer.js'
import report from 'report'

let vm = new Vue({
    el: '#app',
    data: {
        showRules: false,
        showResult: false,
        lock: false,
        gifts: [
            // { name: '转盘抽奖券(必中奖)', price: '200', num: 1 },
            { name: '皇后礼物', price: '999', num: 1 },
            { name: '随机礼包', price: '1000', num: 0 },
            { name: '丫鬟礼物', price: '29', num: 6 }
        ],
        unit: getUnit(),
        openMsg: {
            uid: 0,
            coin: 50,
            resultPlan: 0,
            num: 0
        }
    },
    methods: {
        closeDoc () {
            closeWebview()
        },
        open () {
            // 判断是否有网络
            if (!navigator.onLine) {
                layer.open({
                    content: '网络不给力'
                })
                return false
            }

            if (!this.lock) {
                // 防止双击再发请求
                this.lock = true
                // 统计开启按钮点击数
                report.stat('ClickBroadcastRoom_LuckyTreasureBox_OpenButton')
                axios
                    .get('/NoviceWelfareActivity/WelfareBox')
                    .then(res => {
                        this.lock = false
                        let data = res.data
                        this.openMsg = data.data
                        if (data.errno === 0) {
                            this.showResult = true
                            // 刷新背包
                            refreshBackpack()
                            // 刷新余额
                            refreshCoin(100, false)
                            refreshCoin(this.openMsg.num, true)
                        } else if (data.errno === 1) {
                            layer.open({
                                content: data.msg
                            })
                        } else if (data.errno === 106) {
                            const currentCoin = this.openMsg.coin
                            let gapCoin = 100 - parseInt(currentCoin)
                            const unit = this.unit
                            payLayer.goPay({
                                coin: currentCoin,
                                unitPrice: 1,
                                eventIds: [
                                    'ClickBroadcastRoom_LuckyTreasureBox_Wechat',
                                    'ClickBroadcastRoom_LuckyTreasureBox_Alipay',
                                    'ClickBroadcastRoom_LuckyTreasureBox_ApplePay'
                                ],
                                customContent: function () {
                                    return `<div class="pl_custom">
                                            <p>当前余额：${currentCoin} ${unit}</p>
                                            <p>还差 ${gapCoin} ${unit} ￥ ${gapCoin /
                                        100} </p>
                                        </div>`
                                }
                            })
                        } else {
                            console.log(data)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }
})
// 充值成功后提供给webview执行的回调函数
window.payResultCallback = function (bool, errMsg) {
    if (bool) {
        let payType = window.sessionStorage['noviceWelfarePayType']
        if (payType === 'wechat') {
            report.stat('ClickBroadcastRoom_LuckyTreasureBox_WechatSuccessful')
        } else if (payType === 'alipay') {
            report.stat('ClickBroadcastRoom_LuckyTreasureBox_AlipaySuccessful')
        } else if (payType === 'iospay') {
            report.stat('ClickBroadcastRoom_LuckyTreasureBox_ApplePaySuccessful')
        }
        layer.closeAll()
        vm.open()
    } else {
        alert(errMsg)
    }
}
