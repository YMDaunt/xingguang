'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/foolsDay19.less'
import CommonMixin from '../../../../mobile/v2/js/activity/foolsDay19.mixin'
import PCScroller from './components/PCScroller.vue'

new Vue({
    el: '#app',
    components: {
        'scroller': PCScroller
    },
    mixins: [ CommonMixin ],
    data: {},
    watch: {
        ruleState (newVal, oldVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs['rules-scroller']._resetBox()
                    this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
                })
            }
        }
    },
    updated () {
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
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
        goRecharge () {
            window.open('/recharge/center', '_blank')
        },
        pcRankRefresh () {
            this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller']._refresh()
        }
    }
})
