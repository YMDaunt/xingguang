/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import '../../css/user/gameCenter.less'
import {hex_md5} from '../component/md5.js'
new Vue({
    el: '#app',
    data: {
        appid: 1, // 分配的游戏id
        token: '',
        balance: '888', // 第三方余额
        level: '2', // 第三方等级
        roleid: '456', // 第三方平台角色id
        rolename: 'jesse', // 第三方昵称
        coin: '1',
        urlParams: '',
        notifyUrl: 'https://open.guojiang.tv/default/notify',
        orderid: '123',
        timestamp: ('' + new Date().getTime()).slice(0, -3)
    },
    created () {
        this.urlParams = this.getQueryString()
    },
    methods: {
        getQueryString () {
            var URLParams = {}
            var aParams = document.location.search.substr(1).split('&')
            for (var i = 0; i < aParams.length; i++) {
                var aParam = aParams[i].split('=')
                URLParams[aParam[0]] = aParam[1]
            }
            return URLParams
        },
        sortASCII (obj) {
            var arr = []
            var num = 0
            for (var i in obj) {
                arr[num] = i
                num++
            }
            var sortArr = arr.sort()
            var sortObj = {}
            for (var j in sortArr) {
                sortObj[sortArr[j]] = obj[sortArr[j]]
            }
            return sortObj
        },
        getParams (signObj) {
            var _paramsObj = this.sortASCII(signObj)
            // console.log('排序后的参数', JSON.stringify(_paramsObj))
            var paramsStr = ''
            for (var key in _paramsObj) {
                if (_paramsObj.hasOwnProperty(key)) {
                    paramsStr = paramsStr + key + '=' + _paramsObj[key] + '&'
                }
            }
            return paramsStr
        },
        getSign (signObj) {
            // console.log('参与md5计算的参数', this.getParams(signObj) + 'secreat23')
            return hex_md5(this.getParams(signObj) + 'secreat23')
        },
        goLogin () {
            // 登录签名参数
            let loginSignObj = {
                openid: this.urlParams.openid,
                skey: this.urlParams.skey,
                appid: this.appid
            }
            axios({
                method: 'post',
                url: 'https://open.guojiang.tv/user/login',
                data: 'openid=' + this.urlParams.openid + '&skey=' + this.urlParams.skey + '&appid=' + this.appid + '&sign=' + this.getSign(loginSignObj),
                headers: {'Content-type': 'application/x-www-form-urlencoded'}
            }).then(res => {
                if (typeof res === 'string') {
                    res = JSON.parse(res)
                }
                if (res.data.errno === 0) {
                    alert('登录成功')
                    this.token = res.data.data.token
                }
            })
        },
        updateUser () {
            let userSignObj = {
                appid: this.appid,
                balance: this.balance,
                level: this.level,
                openid: this.urlParams.openid,
                roleid: this.roleid,
                rolename: this.rolename,
                token: this.token
            }
            axios({
                method: 'post',
                url: 'https://open.guojiang.tv/user/updateUser',
                data: 'openid=' + this.urlParams.openid + '&roleid=' + this.roleid + '&appid=' + this.appid + '&rolename=' + this.rolename + '&level=' + this.level + '&balance=' + this.balance + '&token=' + this.token + '&sign=' + this.getSign(userSignObj),
                headers: {'Content-type': 'application/x-www-form-urlencoded'}
            }).then(res => {
                if (typeof res === 'string') {
                    res = JSON.parse(res)
                }
                if (res.data.errno === 0) {
                    alert('更新角色信息成功')
                    console.log(res)
                }
            })
        },
        pay () {
            var paySignObj = {
                appid: this.appid,
                coin: this.coin,
                notify_url: this.notifyUrl,
                openid: this.urlParams.openid,
                orderid: this.orderid,
                timestamp: this.timestamp,
                token: this.token
            }
            this.sign = this.getSign(paySignObj)
            // eslint-disable-next-line
            gjGameCenter.pay(this.appid, this.coin, this.notifyUrl, this.orderid, this.urlParams.openid,this.timestamp, this.token, this.sign, this.paySuccessCB, this.payErrorCB)
        },
        paySuccessCB (res) {
            alert('支付成功')
            console.log(res)
        },
        payErrorCB (err) {
            alert('支付失败')
            console.log(err)
        }
    }

})
