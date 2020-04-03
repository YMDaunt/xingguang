import '../../css/family/task.less'

import Vue from 'vue'
import VueRouter from 'vue-router'

import SignIn from './task/signIn.vue'
import Task from './task/task.vue'

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {path: '/', redirect: '/signIn'},
        {path: '/signIn', component: SignIn},
        {path: '/task', component: Task}
    ]
})

new Vue({
    el: 'article',
    router
})
