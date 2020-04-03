'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/childrensDay19.less'

import CommonMixin from './../../../../mobile/v2/js/activity/childrensDay19.mixin.js'
import PCScroller from './components/PCScroller.vue'

new Vue({
    el: '#app',
    components: {
        'scroller': PCScroller
    },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller'
    },
    mounted: function () {
    },
    updated () {
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
        this.$refs['rw-scroller'] && this.$refs['rw-scroller'].refreshDOM()
        this.$refs['gd-scroller'] && this.$refs['gd-scroller'].refreshDOM()
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
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
        // 活动规则滚动条位置 置0
        ruleSReset () {
            this.$nextTick(() => {
                this.$refs['rules-scroller']._resetBox()
                this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
            })
        },
        // 活动奖励弹窗
        rwSReset () {
            this.$nextTick(() => {
                this.$refs['rw-scroller']._resetBox()
                this.$refs['rw-scroller'] && this.$refs['rw-scroller'].refreshDOM()
            })
        },
        // pk积分弹窗
        gdSReset () {
            this.$nextTick(() => {
                this.$refs['gd-scroller']._resetBox()
                this.$refs['gd-scroller'] && this.$refs['gd-scroller'].refreshDOM()
            })
        },
        // 总榜单榜单
        rankSReset () {
            this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller']._refresh()
        }
    }
})
