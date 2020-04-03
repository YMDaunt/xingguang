/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:57:10
 */

import '../../css/store/list.less'

import Vue from 'vue'
import VueRouter from 'vue-router'
import {getUnit} from 'common'
import Mount from './mount.vue'
import Prop from './prop.vue'

Vue.use(VueRouter)

let unit = getUnit()

let router = new VueRouter({
    routes: [
        {path: '/', redirect: '/mount'},
        {path: '/mount', component: Mount, props: {unit: unit}},
        {path: '/prop', component: Prop, props: {unit: unit}}
    ]
})
window.router = router

new Vue({
    el: '#content',
    data: {
    },
    router
})
