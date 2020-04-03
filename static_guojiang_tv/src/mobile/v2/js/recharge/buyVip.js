/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:55:55
 */
/* eslint-disable */

import '../../css/recharge/buyVip.less'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import payType from './payTypeSelect.vue'

let vm = new Vue({
    el: 'article',
    components: {
        payType
    },
    data: {
        title: '',
        items: [
            {
                time: '12',
                average: '0.27',
                price: '98'
            },
            {
                time: '3',
                average: '0.64',
                price: '58'
            },
            {
                time: '1',
                average: '0.93',
                price: '28'
            }
        ],
        activeRechargeIndex: 0,
        showPayType: false,
        buySuccess: false,
        endDate: '--',
        isTimeToShowBlock: false
    },
    created: function () {

    },
    mounted: function () {
        this.getProductList()
    },
    methods: {
        getProductList () {
            common.showLoading()
            console.log('showLoading')
            axios.get('/recharge/getVipConfig')
                .then(
                    (res) => {
                        console.log('hideLoading')
                        common.hideLoading()
                        this.isTimeToShowBlock = true

                        let data = res.data
                        this.buySuccess = !!data.data.isVip
                        this.items = data.data.feeConfig

                        if (data.data.isVip) {
                            this.title = `还剩${data.data.leftDay}天过期`
                            this.endDate = data.data.endDate
                        } else {
                            this.title = '用户等级达到4级/主播等级达到2级/开通会员<br>达以上条件才可收发私信'
                        }
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },

        selectVipType (key) {
            this.activeRechargeIndex = key
        },

        goBuy () {
            let appChannel = common.getChannel()
            let version = common.getVersion()

            let versionNum = parseInt(version.replace(/\./g, ''))
            let money = this.items[this.activeRechargeIndex]['fee']
            // 华为支付
            if (appChannel == 'and-huawei-4' || (appChannel == 'and-huawei-2' && versionNum >= 455)) {
                try {
                    console.log('recharge.hmsVipPay is called: ' + money)
                    recharge.hmsVipPay(money)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                return
            } else if (appChannel === 'and-vivo.lianyun-24') {
                // vivo渠道支付
                try {
                    console.log('gBridge.vivoVipPay is called: ' + money)
                    gBridge.vivoVipPay(money)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                return
            }

            this.showPayType = !this.showPayType
        },

        getEndDate (gapDay) {
            let now_timestamp = +new Date()
            let next_day_stamp = now_timestamp + gapDay * 24 * 3600 * 1000
            let end_date = new Date(next_day_stamp)
            return `${end_date.getFullYear()}年${end_date.getMonth() + 1}月${end_date.getDate()}日`
        },

        back () {
            common.closeWebview()
        }
    }
})

window.vipPayCallback = function (code, msg) {
    if (code) {
        vm.buySuccess = true

        let expire_month = vm.items[vm.activeRechargeIndex]['month']
        let expire_day = expire_month == '12' ? parseInt(expire_month) * 30 + 5 : parseInt(expire_month) * 30

        vm.title = `还剩${expire_day}天过期`
        vm.endDate = vm.getEndDate(expire_day)
        vm.showPayType = false
    } else {
        layer.open({
            content: msg,
            skin: 'msg',
            time: 3
        })
    }
}
