import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)
Vue.prototype.axios = axios
Vue.use(VueRouter)
import '../../css/makeFriends/income.less'
import income from './income.vue'
import {hideRightTopMenu} from 'common'
const exchange = () => import(/* webpackChunkName: "makeFriends/exchange" */'./exchange.vue')// 特殊的注释语法来提供 chunk name
const historyRecord = () => import(/* webpackChunkName: "makeFriends/historyRecord" */'./historyRecord.vue')
const withdraw = () => import(/* webpackChunkName: "makeFriends/withdraw" */'./withdraw.vue')
const withdrawInfo = () => import(/* webpackChunkName: "makeFriends/withdrawInfo" */'./withdrawInfo.vue')
const withdrawResult = () => import(/* webpackChunkName: "makeFriends/withdrawResult" */'./withdrawResult.vue')
const list = () => import(/* webpackChunkName: "makeFriends/list" */'./list.vue')
const listDetail = () => import(/* webpackChunkName: "makeFriends/listDetail" */'./listDetail.vue')
const withdrawDetail = () => import(/* webpackChunkName: "makeFriends/withdrawDetail" */'./withdrawDetail.vue')

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: income,
            meta: {
                title: '我的收益'
            }
        },
        {
            path: '/income',
            component: income,
            meta: {
                title: '我的收益'
            }
        },
        {
            path: '/historyRecord',
            component: historyRecord,
            meta: {
                title: '历史记录'
            }
        },
        {
            path: '/withdraw',
            component: withdraw,
            meta: {
                title: '提现'
            }
        },
        {
            path: '/withdrawInfo',
            component: withdrawInfo,
            meta: {
                title: '提现说明'
            }
        },
        {
            path: '/withdrawResult',
            component: withdrawResult,
            meta: {
                title: '提现成功'
            }
        },
        {
            path: '/list',
            component: list,
            meta: {
                title: '账单'
            }
        },
        {
            path: '/listDetail/:item',
            component: listDetail,
            props: true,
            meta: {
                title: '账单详情'
            }
        },
        {
            path: '/withdrawDetail/:item',
            component: withdrawDetail,
            props: true,
            meta: {
                title: '提现详情'
            }
        },
        {
            path: '/exchange',
            component: exchange,
            meta: {
                title: '兑换金币'
            }
        }
    ]
})

new Vue({
    el: '#app',
    router,
    mounted () {
        setTimeout(() => {
            hideRightTopMenu()
        }, 500)
    }
})
