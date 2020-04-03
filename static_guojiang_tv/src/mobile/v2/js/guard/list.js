/*
 * @Date: 2019-04-29 11:41:55
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:56:04
 */
/* eslint-disable */

'use strict'
import '../../css/guard/list.less'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import VueRouter from 'vue-router'

import Guard from './guard.vue'

const qs = require('querystring')

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {path: '/', component: Guard},
        {path: '/beGuard',
            component: function () {
                return import(
                    /* webpackChunkName: "guard/beGuard" */
                    './beGuard.vue')
            }}
    ]
})

new Vue({
    el: '#app',
    data: {
        info: {},
        constsArr: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
    },
    router,
    created: function () {
        let urlData = qs.parse(location.search.split('?')[1])
        this.getGuardInfo(urlData['uid'])
    },
    mounted: function () {
        if (common.getPackageId() === '4') {
            this.$nextTick(function () {
                // 隐藏右上角背包入口
                window.onload = function () {
                    setTimeout(function () {
                        try {
                            gBridge.showMenuButton(false)
                        } catch (e) {
                            console.log(e.name + ':' + e.message)
                        }
                    }, 500)
                }
            })
        }
    },
    methods: {
        getGuardInfo (uid = 3) {
            let _this = this
            axios.get('/guard/getGuardInfo', {
                params: {
                    uid
                }
            })
                .then(
                    (res) => {
                        let data = res.data.data.info
                        console.log('data:', data)
                        _this.info = data
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        }
    }
})
