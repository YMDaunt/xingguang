/*
 * @Date: 2019-06-25 14:37:48
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:48:30
 */
/* eslint-disable */
'use strict'

import Vue from 'vue'
import axios from 'axios'
import '../../css/user/liveProtocal.less'

new Vue({
    el: '#app',
    methods: {
        agree: function () {
            try {
                gBridge.onAgree()
            } catch (e) {}
            axios.get('/liveProtocol/signAgree')
                .then(res => {
                    var data = eval('(' + data + ')')
                    if (data.errno == 0) {
                        common.closeWebview()
                    } else {
                        alert(data.msg)
                    }
                })
        }
    }
})
