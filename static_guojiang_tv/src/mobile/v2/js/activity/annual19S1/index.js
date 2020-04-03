'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'
import router from './router'

import '../../../css/activity/annual19S1/index.less'
import CommonMixin from './index.mixin.js'

Vue.component('scroller', {
    template: `<div><slot/></div>`
})

new Vue({
    router,
    el: '#app',
    components: { },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller',
        pageType: 'mobile'
    },
    mounted: function () {
    },
    methods: {
        goRoom (infos) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        goLogin () {
            goLogin()
        },
        // 活动规则 & 奖励 滚动条置顶
        resetRRS () {
            this.$refs['rules-scroller'].$el.scrollTop = 0
        },
        // 活动规则 滚动条置顶
        resetRRule () {
            this.$refs['r-i-scroller'].$el.scrollTop = 0
        },
        // 大人物榜
        resetURLayer () {
            this.$nextTick(() => {
                this.$refs['urank-scroller'].$el.scrollTop = 0
            })
        }
    }
})
