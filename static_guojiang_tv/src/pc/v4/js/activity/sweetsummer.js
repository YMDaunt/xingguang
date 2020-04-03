'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/sweetsummer.less'

import CommonMixin from './../../../../mobile/v2/js/activity/sweetsummer.mixin.js'
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
        // this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
        this.$refs['vs-scroller'] && this.$refs['vs-scroller'].refreshDOM()
        this.$refs['cool-scroller'] && this.$refs['cool-scroller'].refreshDOM()
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
        pcRankRefresh () {
            this.$refs['vs-scroller']._resetBox()
            this.$refs['vs-scroller']._refresh()
        },
        ruleRefresh () {
            console.log('rule')
            this.$refs['rules-scroller']._resetBox()
            this.$refs['rules-scroller']._refresh()
        },
        goRecharge () {
            window.open('/recharge/center', '_blank')
        }
    }
})
