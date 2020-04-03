import '../../css/joinOrg/index2.less'

import Vue from 'vue'
import VueRouter from 'vue-router'

import GetAuthCode from './getAuthCode2.vue'
import SetProfile from './setProfile2.vue'
import BindResult from './bindResult2.vue'

const querystring = require('querystring')

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {path: '/', redirect: '/getAuthCode'},
        {path: '/getAuthCode',
            component: GetAuthCode,
            beforeEnter: (to, from, next) => {
                if (from.path === '/setProfile') {
                    router.go({'path': '/', params: querystring.parse(location.search)})
                    return
                }
                next()
            }
        },
        {path: '/setProfile',
            component: SetProfile,
            beforeEnter: (to, from, next) => {
                if (from.path === '/bindResult') {
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
