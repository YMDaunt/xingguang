'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/MCBattle.less'
import CommonMixin from '../../../../mobile/v2/js/activity/MCBattle.mixin'
import PCScroller from './components/PCScroller.vue'

new Vue({
    el: '#app',
    components: {
        'scroller': PCScroller
    },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller',
        isPC: true
    },
    updated: function () {
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
        this.$refs['score-scroller'] && this.$refs['score-scroller'].refreshDOM()
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
        }
    }
})
