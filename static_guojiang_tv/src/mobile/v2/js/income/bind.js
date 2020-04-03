/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:54:06
 */
/* eslint-disable */
import '../../css/income/bind.less'

import Vue from 'vue'
import common from 'common'
import axios from 'axios'
import layer from 'layer'

const querystring = require('querystring')

let vm = new Vue({
    el: 'article',
    data: {
        isCodeBind: false,
        code: ''
    },
    methods: {
        switchAutoBind () {
            location.href = '/user/wxAuth'
        },
        switchCodeBind () {
            this.isCodeBind = true
        },
        goBind () {
            common.showLoading()
            let urlparams = querystring.parse(location.href)

            axios.get('/income/codeBind', {
                params: {
                    token: vm.code,
                    code: urlparams.code,
                    state: urlparams.state
                }
            })
                .then(function (res) {
                    common.hideLoading()
                    let data = res.data
                    if (data.errno == -100) {
                        common.goLogin()
                    } else if (data.errno == 0) {
                        location.href = '/income/bindHint/status/1'
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
        }
    }
})
