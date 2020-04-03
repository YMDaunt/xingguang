'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import '../../css/activity/childrensDay19.less'

import CommonMixin from './childrensDay19.mixin.js'

new Vue({
    el: '#app',
    components: {
        'scroller': {
            template: `<div><slot/></div>`
        }
    },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller'
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
        // 活动规则滚动条位置 置0
        ruleSReset () {
            this.$nextTick(() => {
                this.$refs['rules-scroller'].$el.scrollTop = 0
            })
        },
        // 活动奖励弹窗
        rwSReset () {
            this.$nextTick(() => {
                this.$refs['rw-scroller'].$el.scrollTop = 0
            })
        },
        // pk积分弹窗
        gdSReset () {
            this.$nextTick(() => {
                this.$refs['gd-scroller'].$el.scrollTop = 0
            })
        },
        // 总榜单榜单
        rankSReset () {}
    }
})
