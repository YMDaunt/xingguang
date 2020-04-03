/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:52:10
 */
/* eslint-disable */
import '../../css/recharge/first.less'

import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import report from 'report'

import {closeBottomPayLayer, goBottomLayerPay} from '../component/gj.payType.js'

let vm = new Vue({
    el: 'article',
    data: {
        oFlag: true,
        platform: '',
        unit:common.getUnit(),
        vehicleText: ''
    },
    created: function () {
        let version = common.getVersion()
        let versionNum = parseInt(version.replace(/\./g, ''))

        this.vehicleText = versionNum >= 500 ? '我的座驾' : '背包'
    },
    mounted: function () {
        this.$nextTick(function () {
            this.platform = common.getPlatformType()

            // 判断是否是h5支付成功后的页面，如果是进行统计操作
            let succCookie = document.cookie.split('rechargeSucc=')[1]
            if (succCookie) {
                succCookie = succCookie.split(';')[0]
                if (succCookie == '1') {
                    document.cookie = 'rechargeSucc=' + 0 + ';domain=' + location.host.replace(/^m\./, '') + ';path=/'
                    // 埋点上报
                    report.stat('PurchaseByWechatSuccessfulOfFirstChargePage')
                }
            }
        })
    },
    methods: {
        goBuy () {
            if (!vm.oFlag) return
            vm.oFlag = false

            // common.showLoading();
            axios.get('/Recharge/isUserMatchRule')
                .then(function (res) {
                    // common.hideLoading();
                    vm.oFlag = true
                    let data = res.data

                    if (data.errno == 0) {
                        // 调起支付类型弹框
                        goBottomLayerPay(1, ['ClikWechatOfFirstChargePage', 'ClickAlipayOfFirstChargePage', 'ClickApplepayOfFirstChargePage'])
                    } else if (data.errno == 102) {
                        common.goLogin()
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                })

            // 埋点上报
            report.stat('ClickBuyitNowButtonofFirstChargePage')
        },
        // 充值成功后，后台自动购买成功，弹框提示
        successBuy () {
            layer.open({
                content: '1元首充礼包购买成功',
                time: 3
            })
        },

        reportSucc () {
            let payType = window.sessionStorage['noviceWelfarePayType']
            if (payType === 'wechat') {
                report.stat('PurchaseByWechatSuccessfulOfFirstChargePage')
            } else if (payType === 'alipay') {
                report.stat('PurchaseByAlipaySuccessfulOfFirstChargePage')
            } else if (payType === 'iospay') {
                report.stat('PurchaseByApplepaySuccessfulOfFirstChargePage')
            }
        },

        closePaytypeLayer () {
            closeBottomPayLayer()
        }
    }
})

window.vm = vm
