'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/burnCalorie.less'
import CommonMixin from '../../../../mobile/v2/js/activity/burnCalorie.mixin.js'
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
        pcRankRefresh () {
            this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller']._refresh()
        }
    }
})
