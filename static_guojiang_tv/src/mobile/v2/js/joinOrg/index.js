/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:56:39
 */
/* eslint-disable */

import '../../css/joinOrg/index.less'

import Vue from 'vue'
import VueRouter from 'vue-router'

import GetAuthCode from './getAuthCode.vue'
import SetProfile from './setProfile.vue'
import BindResult from './bindResult.vue'

const querystring = require('querystring')

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {path: '/', redirect: '/getAuthCode'},
        {path: '/getAuthCode',
            component: GetAuthCode,
            beforeEnter: (to, from, next) => {
                if (from.path == '/setProfile') {
                    router.go({'path': '/', params: querystring.parse(location.search)})
                    return
                }
                next()
            }
        },
        {path: '/setProfile',
            component: SetProfile,
            beforeEnter: (to, from, next) => {
                if (from.path == '/bindResult') {
                    router.go({'path': '/', params: querystring.parse(location.search)})
                    return
                }
                next()
            }
        },
        {
            path: '/bindResult',
            component: BindResult
        }
    ]
})
window.router = router

new Vue({
    el: '#content',
    data: {
        info: {
            tel: '',
            authCode: ''
        }
    },
    router
})
// console.log(router)
// router.push('/getAuthCode')
