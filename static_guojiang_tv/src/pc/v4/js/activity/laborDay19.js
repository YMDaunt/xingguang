'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line
// import layer from 'layer'; // desc: 弹出层插件

import '../../css/activity/laborDay19.less'
import CommonMixin from '../../../../mobile/v2/js/activity/laborDay19.mixin'
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
        this.$refs['gift-scroller'] && this.$refs['gift-scroller'].refreshDOM()
        this.$refs['rec-scroller'] && this.$refs['rec-scroller'].refreshDOM()
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
        refreshRule () {
            this.$refs['rules-scroller']._resetBox()
            this.$refs['rules-scroller']._refresh()
        },
        refreshRW () {
            this.$refs['rec-scroller']._resetBox()
            this.$refs['rec-scroller']._refresh()

            this.$refs['gift-scroller']._resetBox()
            this.$refs['gift-scroller']._refresh()
        },
        refreshRankScroller () {
            this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller']._refresh()
        }
    }
})
