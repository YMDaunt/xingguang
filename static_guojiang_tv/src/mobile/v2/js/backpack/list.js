import '../../css/backpack/list.less'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Vehicle from './vehicle.vue'
import gifts from './gifts.vue'
import Prop from './prop.vue'

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {path: '/', redirect: '/vehicle'},
        {path: '/vehicle', component: Vehicle},
        {path: '/gifts', component: gifts},
        {path: '/prop', component: Prop}
    ]
})

new Vue({
    el: 'article',
    router,
    mounted: function () {
        this.$nextTick(function () {
            // 显示右上角背包入口
            window.onload = function () {
                setTimeout(function () {
                    try {
                        gBridge.changeMenuButton('商城', location.protocol + '//' + location.host + '/dist/store/list.html')
                    } catch (e) {
                        console.log(e.name + ':' + e.message)
                    }
                }, 500)
            }
        })
    }
})
