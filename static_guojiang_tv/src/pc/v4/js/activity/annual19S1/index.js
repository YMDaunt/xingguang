'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line
import router from '../../../../../mobile/v2/js/activity/annual19S1/router'

import '../../../css/activity/annual19S1/index.less'

import CommonMixin from './../../../../../mobile/v2/js/activity/annual19S1/index.mixin.js'
import PCScroller from '../components/PCScroller.vue'

Vue.component('scroller', PCScroller)

new Vue({
    router,
    el: '#app',
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller',
        pageType: 'pc'
    },
    created () {
        document.querySelector('html').style.fontSize = '70px'
    },
    mounted: function () {
    },
    updated () {
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
        this.$refs['r-i-scroller'] && this.$refs['r-i-scroller'].refreshDOM()
        this.$refs['urank-scroller'] && this.$refs['urank-scroller'].refreshDOM()
    },
    methods: {
        goRoom (infos) {
            if (!infos) return

            let rid = infos.id || infos.mid || infos.uid
            rid && window.open('/' + rid, '_blank')
        },
        goLogin () {
            showLoginPanel()
        },
        // 活动规则 & 奖励 滚动条置顶
        resetRRS () {
            this.$nextTick(() => {
                this.$refs['rules-scroller']._resetBox()
                this.$refs['rules-scroller'].refreshDOM()
            })
        },
        // 活动规则 滚动条置顶
        resetRRule () {
            this.$refs['r-i-scroller']._resetBox()
            this.$refs['r-i-scroller'].refreshDOM()
            this.$nextTick(() => {
                this.$refs['r-i-scroller']._resetBox()
                this.$refs['r-i-scroller'].refreshDOM()
            })
        },
        // 大人物榜
        resetURLayer () {
            this.$nextTick(() => {
                this.$refs['urank-scroller']._resetBox()
                this.$refs['urank-scroller'].refreshDOM()
            })
        }
    }
})
