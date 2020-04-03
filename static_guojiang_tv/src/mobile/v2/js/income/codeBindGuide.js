/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:54:13
 */
/* eslint-disable */
import '../../css/income/codeBindGuide.less'
import Vue from 'vue'
import common from 'common'
import axios from 'axios'
import layer from 'layer'

let vm = new Vue({
    el: 'section',
    data: {
        code: '',
        expireTime: ''
    },
    mounted: function () {
        this.$nextTick(function () {
            vm.getData()
        })
    },
    methods: {
        getData: function () {
            common.showLoading()

            axios.get('/income/GetBindCode')
                .then(function (res) {
                    common.hideLoading()
                    let data = res.data
                    if (data.errno == -100) {
                        common.goLogin()
                    } else if (data.errno == 0) {
                        vm.code = data.data.result.token
                        vm.expireTime = data.data.result.expire
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 2
                        })
                    }
                }, function (err) {
                    console.log(err)
                })
        },
        goBind: function () {
            let platformType = common.getPlatformType()

            if (platformType == 'ios_webview') {
                try {
                    gBridge.openwx()
                } catch (e) {
                    console.log(e.name + ':' + e.message)
                }

                try {
                    gBridge.openWechat()
                } catch (e) {
                    console.log(e.name + ':' + e.message)
                }
            } else if (platformType == 'android_webview') {
                try {
                    recharge.toWeiXinBindPublic()
                } catch (e) {
                    console.log(e.name + ':' + e.message)
                }
            } else {
                layer.open({
                    content: '请到APP-我的收益 进行绑定',
                    btn: ['确定']
                })
            }
        }
    }
})
