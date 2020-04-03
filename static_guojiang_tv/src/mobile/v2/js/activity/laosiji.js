import Vue from 'vue'
import layer from 'layer'
import axios from 'axios'
import {
    refreshBackpack,
    refreshCoin,
    closeWebview,
    getPlatformType
} from 'common'
import payLayer from '../component/gj.payLayer.js'
import report from 'report'

import '../../css/activity/laosiji.less'

// ios中激活active伪类
document.body.addEventListener('touchstart', function () {})

let vm = new Vue({
    el: '#app',
    data: {
        showBuyTicket: true,
        showRules: false,
        showResult: false, // 是否显示中奖结果
        firstDriver: false, // 是否是首位发车者
        halfPriceTimes: 0, // 新手半票剩余次数
        ticketId: 0, // 车票id
        coin: 0, /// /用户余额
        ticketLast: 0, // 余票数量
        unitPrice: 0, // 车票单价
        ticketNum: 0, // 已经购买车票数量
        countDownTime: 0, // 距开奖倒计时
        timer: 0, // 倒计时计数器
        buyTicketLock: false, // 买票锁
        noTicket: false, // 没买票
        luckyStatus: 0, // 是否中奖
        tab: 1, // 显示tab栏中哪个项目
        luckyListArr: [], // 中奖名单
        showNoLucky: false,
        payPopupLock: false// 上车按钮锁
    },
    created: function () {
        this.init()
        this.result()
        this.platform = getPlatformType()
    },
    methods: {
        init () {
            axios
                .get('/CoActivity/ticketInitInfo')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.firstDriver = data.data.first
                        this.halfPriceTimes = data.data.halfPriceTimes
                        this.coin = data.data.coin
                        this.ticketId = data.data.ticketId
                        this.unitPrice = data.data.unitPrice
                        this.ticketLast = data.data.leftTimes
                    } else {
                        console.log(data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 查询是否中奖
        result (ticketid) {
            let ticketId = parseInt(ticketid) || location.search.slice(10)
            // 如果中奖车次存在则查询中奖信息
            if (ticketId) {
                axios
                    .get('/CoActivity/queryTicketResult', {
                        params: {
                            ticketId: ticketId
                        }
                    })
                    .then(res => {
                        // 显示购买车票页面
                        this.tab = 1
                        // 通知客户端中奖车次查询成功
                        if (this.platform === 'android_webview') {
                            try {
                                recharge.qTicketStatusSuccess()
                            } catch (e) {
                                alert(e.name + ':' + e.message)
                            }
                        }
                        let data = res.data
                        // 刷新当前车次
                        this.ticketId = data.data.ticketId
                        switch (data.data.status) {
                        case 0:
                            // 未中奖半额退款
                            this.showResult = true
                            this.showRules = false
                            this.showBuyTicket = true
                            this.luckyStatus = 0
                            break
                        case 1:
                            // 中奖啦
                            this.showResult = true
                            this.showRules = false
                            this.showBuyTicket = true
                            this.luckyStatus = 1
                            if (this.platform === 'android_webview') {
                                try {
                                    refreshBackpack()
                                } catch (e) {
                                    alert(e.name + ':' + e.message)
                                }
                            }
                            break
                        case 2:
                            // 还在进行中
                            this.showResult = false
                            break
                        case 4:
                            // 您的免费车票未中奖
                            this.showResult = true
                            this.showRules = false
                            this.showBuyTicket = true
                            this.luckyStatus = 4
                        }
                        // 更新剩余可购买数量
                        this.init()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        close () {
            closeWebview()
        },
        // 关闭中奖查询弹窗
        closeResult () {
            this.showResult = false
        },
        // tab切换
        changeTab (i) {
            switch (i) {
            case 1:
                // 显示购买车票
                this.tab = 1
                break
            case 2:
                // 显示我的车票
                if (!this.offline()) {
                    return false
                }
                this.tab = 2
                this.getMyTicketInfo()
                break
            case 3:
                // 显示中奖名单
                if (!this.offline()) {
                    return false
                }
                this.tab = 3
                this.getLuckyList()
                break
            }
        },
        // 显示规则页面
        showRulesFun (bool) {
            if (bool) {
                this.showRules = true
                this.showBuyTicket = false
            } else {
                this.showRules = false
                this.showBuyTicket = true
            }
        },
        // 查询我的车票
        getMyTicketInfo () {
            axios
                .get('/CoActivity/ticketProfile', {
                    params: {
                        ticketId: this.ticketId
                    }
                })
                .then(res => {
                    let data = res.data
                    this.showMyTicket = true
                    if (data.errno === 0) {
                        if (data.data.ticketNum === 0) {
                            this.noTicket = true
                        } else {
                            this.noTicket = false
                            this.ticketNum = data.data.ticketNum
                            this.countDown(data.data.timeLeft)
                        }
                    } else {
                        console.log(data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取中奖名单
        getLuckyList () {
            axios
                .get('/CoActivity/awardList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        if (data.data.lists) {
                            this.luckyListArr = data.data.lists
                        } else {
                            this.showNoLucky = true
                        }
                    } else {
                        console.log(data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 倒计时
        countDown (intDiff) {
            if (this.timer) {
                clearInterval(this.timer)
            }
            let that = this
            function auto () {
                let minute = 0
                let second = 0
                if (intDiff > 0) {
                    minute = Math.floor((intDiff / 60) % 60)
                    second = Math.floor(intDiff % 60)
                } else {
                    minute = second = 0
                }
                minute = minute < 10 ? '0' + minute : minute
                second = second < 10 ? '0' + second : second
                that.countDownTime = minute + ':' + second
                intDiff--
                if (intDiff < 0) {
                    clearInterval(that.timer)
                    window.location.reload()
                }
            }
            auto()
            this.timer = setInterval(auto, 1000)
        },
        // 买票
        payPopup () {
            if (!this.offline()) {
                return false
            }

            // 走首发买票流程
            if (this.firstDriver) {
                this.firstDriverFun()
                return false
            }
            // 防止点击两次出现两个弹窗
            if (this.payPopupLock) {
                return false
            }
            this.payPopupLock = true

            // 统计购买车票按钮
            report.stat('ClickBroadcastRoom_DriverPopup_BuyTicketButton')
            var ticketNum = this.ticketLast >= 1 ? 1 : 0 // 默认购买一张票
            // 存储sessionStorage支付成功后调用
            sessionStorage.setItem('ticketId', this.ticketId)
            sessionStorage.setItem('ticketNum', ticketNum)
            var halfPriceTimes = parseInt(this.halfPriceTimes)
            var unitPrice = (() => {
                if (halfPriceTimes > 0) {
                    return parseInt(this.unitPrice) / 200
                } else {
                    return parseInt(this.unitPrice) / 100
                }
            })()
            payLayer.goPay({
                unitPrice: unitPrice,
                useOrderPrice: true,
                coin: +this.coin,
                headlineText: '老司机带我飞',
                hasCounter: true,
                maxCounter: this.ticketLast,
                eventIds: [
                    'ClickBroadcastRoom_1RMBFansPopup_Wechat',
                    'ClickBroadcastRoom_1RMBFansPopup_Alipay',
                    'ClickBroadcastRoom_1RMBFansPopup_ApplePay'
                ],
                getOrderPrice: (num = ticketNum) => {
                    if (halfPriceTimes > 0) {
                        if (halfPriceTimes >= num) {
                            return unitPrice * num
                        } else {
                            return (
                                unitPrice * halfPriceTimes +
                                unitPrice *
                                    2 *
                                    (num - halfPriceTimes)
                            )
                        }
                    } else {
                        return unitPrice * num
                    }
                },
                customContent: num => {
                    let gapCoin
                    if (halfPriceTimes > 0) {
                        if (halfPriceTimes >= num) {
                            gapCoin =
                                this.coin - unitPrice * 100 * num
                        } else {
                            gapCoin =
                                this.coin -
                                unitPrice * 100 * halfPriceTimes -
                                unitPrice *
                                    200 *
                                    (num - halfPriceTimes)
                        }
                    } else {
                        gapCoin = this.coin - unitPrice * 100 * num
                    }
                    if (gapCoin < 0) {
                        // 余额不足
                        return `<div class="pl_custom">
                                <p>每名用户和每台设备最多可购买30张</p>
                                <p>当前余额：${this.coin} 克拉</p>
                                <p>还差 ${-gapCoin} 克拉 ￥ ${-gapCoin /
                            100} </p>
                            </div>`
                    } else {
                        return `<div class="pl_custom">
                                <p>每名用户和每台设备最多可购买30张</p>
                            </div>`
                    }
                },
                callback: num => {
                    ticketNum = num
                    // 存储sessionStorage支付成功后调用
                    sessionStorage.setItem('ticketNum', num)
                    if (num > this.ticketLast) {
                        layer.open({
                            time: 3,
                            content: '您已超过剩余可购买上限'
                        })
                    }
                },
                buyCallback: () => {
                    this.buyTicket(this.ticketId, ticketNum)
                    this.payPopupLock = false
                },
                layerEndCallback: () => {
                    this.payPopupLock = false
                }
            })
        },
        // 购买车票
        buyTicket (ticketId, ticketNum) {
            axios
                .get('/CoActivity/buyTicket', {
                    params: {
                        ticketId: ticketId,
                        num: ticketNum,
                        first: 0
                    }
                })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        layer.open({
                            time: 3,
                            content: '车票购买成功'
                        })
                        // 替换最新的车次
                        this.ticketId = data.data.ticketId
                        // 刷新余额
                        if (this.halfPriceTimes > 0) {
                            if (parseInt(ticketNum) > this.halfPriceTimes) {
                                refreshCoin(100 * this.halfPriceTimes, false)
                                refreshCoin(
                                    200 *
                                        (parseInt(ticketNum) -
                                            this.halfPriceTimes),
                                    false
                                )
                            } else {
                                refreshCoin(100 * parseInt(ticketNum), false)
                            }
                        } else {
                            refreshCoin(200 * parseInt(ticketNum), false)
                        }

                        // 刷新可半价购买次数
                        this.halfPriceTimes = data.data.halfPriceTimes
                    } else if (data.errno === 108 || data.errno === 105) {
                        layer.open({
                            time: 3,
                            content: data.msg
                        })
                    } else {
                        console.log(data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 首发买票
        firstDriverFun () {
            if (!this.offline()) {
                return false
            }
            if (!this.firstDriver) {
                return false
            } else {
                // 统计首发免费上车按钮
                report.stat('ClickBroadcastRoom_DriverPopup_FirstBuyButton')
                axios
                    .get('/CoActivity/buyTicket', {
                        params: {
                            ticketId: this.ticketId,
                            num: 1,
                            first: 1
                        }
                    })
                    .then(res => {
                        let data = res.data
                        if (data.errno === 0) {
                            // 抢首位成功
                            layer.open({
                                time: 3,
                                content: '首发成功，免费获得一张车票'
                            })
                            this.firstDriver = false
                        } else if (data.errno === 111) {
                            // 抢首位失败
                            layer.open({
                                time: 3,
                                content: '抢首位失败'
                            })
                            this.firstDriver = false
                            this.payPopup()
                        } else if (data.errno === 105) {
                            layer.open({
                                time: 3,
                                content: data.msg
                            })
                        } else {
                            console.log(data)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        offline () {
            if (!navigator.onLine) {
                layer.open({ time: 3, content: '网络不给力' })
                return false
            }
            return true
        }
    }
})

window.onRefreshTicket = function (ticketId) {
    // 客户端通知H5开奖
    vm.result(ticketId)
}
// 充值成功后提供给webview执行的回调函数
window.payResultCallback = function (bool, errMsg) {
    if (bool) {
        vm.init()
        let payType = window.sessionStorage['noviceWelfarePayType']
        let ticketId = window.sessionStorage['ticketId']
        let ticketNum = window.sessionStorage['ticketNum']
        if (payType === 'wechat') {
            report.stat('ClickBroadcastRoom_1RMBFansPopup_WechatSuccessful')
        } else if (payType === 'alipay') {
            report.stat('ClickBroadcastRoom_1RMBFansPopup_AlipaySuccessful')
        } else if (payType === 'iospay') {
            report.stat('ClickBroadcastRoom_1RMBFansPopup_ApplePaySuccessful')
        }
        layer.closeAll()
        vm.buyTicket(ticketId, ticketNum)
    } else {
        alert(errMsg)
    }
}
