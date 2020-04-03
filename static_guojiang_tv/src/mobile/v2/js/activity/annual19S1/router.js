import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { // 预选赛
            name: 'qualifier',
            path: '/qualifier',
            component: () => import(/* webpackChunkName: "annual19S1-qualifier" */ './page/Qualifier.vue')
        },
        { // 赛道报名
            name: 'sign',
            path: '/sign',
            component: () => import(/* webpackChunkName: "annual19S1-sign" */ './page/Sign.vue')
        },
        { // 晋级赛
            name: 'levelup',
            path: '/levelup',
            component: () => import(/* webpackChunkName: "annual19S1-sign" */ './page/Levelup.vue')
        },
        { // 复活赛
            name: 'repe',
            path: '/repe',
            component: () => import(/* webpackChunkName: "annual19S1-repe" */ './page/Repe.vue')
        },
        { // 决赛
            name: 'final',
            path: '/final',
            component: () => import(/* webpackChunkName: "annual19S1-final" */ './page/Final.vue')
        },
        { // 非法路径
            name: 'redirect',
            path: '*'
        }]
})

export default router

export const path = [
    {
        name: '预选赛',
        path: '/qualifier',
        startTime: new Date('2019/6/12 12:00')
    },
    {
        name: '赛道报名',
        path: '/sign',
        startTime: new Date('2019/6/15 00:00')
    },
    {
        name: '晋级赛',
        path: '/levelup',
        startTime: new Date('2019/6/16 00:00')
    },
    {
        name: '复活赛',
        path: '/repe',
        startTime: new Date('2019/6/21 00:00')
    },
    {
        name: '决赛',
        path: '/final',
        startTime: new Date('2019/6/24 00:00')
    }
]
