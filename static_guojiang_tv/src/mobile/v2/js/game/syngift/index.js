/*
 * @Date: 2020-03-02 17:12:41
 * @LastEditors: Jesse
 * @LastEditTime: 2020-03-09 09:59:38
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import '../../../css/game/syngift/index.less'
import syngift from './syngift.vue'
import historyList from './historyList.vue'
import manual from './manual.vue'
import combine from './combine.vue'
Vue.use(VueRouter)
Vue.prototype.axios = axios

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: syngift,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/history',
            component: historyList,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/manual',
            component: manual,
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: '/combine',
            name: 'combine',
            component: combine,
            meta: {
                keepAlive: false
            }
        }
    ]
})

let vm = new Vue({
    el: '#app',
    data: {
        currentIndex: 0, // 当前选择的礼物卡下标
        moveArr: []// 卡片移动距离数组
    },
    router,
    methods: {
        getIndex (index) {
            this.currentIndex = index
        },
        getMoveArr (arr) {
            this.moveArr = arr
        }
    }
})

window.customClose = function () {
    vm.$destroy()
}
