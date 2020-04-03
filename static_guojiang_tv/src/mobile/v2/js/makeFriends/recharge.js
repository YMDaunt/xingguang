import '../../css/makeFriends/recharge.less'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import {getVersion} from 'common'
import {showBottomPayLayer} from '../component/gj.payType'

new Vue({
    el: '#app',
    data: {
        balance: 0,
        version: getVersion(),
        rechargeList: []
    },
    computed: {
        newVersion () {
            if (this.version.trim().replace(/\./g, '') >= 565) {
                return true
            } else {
                return false
            }
        }
    },
    created () {
        this.getRechargeList()
    },
    methods: {
        // 获取充值列表和初始余额
        getRechargeList () {
            axios.get('/recharge/getRechargeList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.rechargeList = data.data.rechargeList
                        this.balance = data.data.mfCoins
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        recharge (money) {
            showBottomPayLayer(money)
        }

    }
})
// 支付成功后回调，app调用
window.payResultCallback = function () {
    location.reload()
}
