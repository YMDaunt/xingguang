'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/springFestival2018.less'
import { uxMixins, commonMixins } from '../../../../mobile/v2/js/activity/springFestival2018.mixin'
import PCScroller from './ceremony2018/PCScroller'

var scrollers = {}

new Vue({
    el: '#app',
    mixins: [ uxMixins, commonMixins ],
    data: {},
    mounted: function () {
        scrollers.rank = new PCScroller(this.$refs['scroller'])
        scrollers.rule = new PCScroller(this.$refs['rules-scroller'])
        scrollers.members = new PCScroller(this.$refs['list-members'])
        scrollers.leaderMsgs = new PCScroller(this.$refs['mtc-records'])
        scrollers.leaderMbs = new PCScroller(this.$refs['mtc-members'])
    },
    updated () {
        PCScroller._scrollers.forEach(s => {
            s.refreshDOM()
        })
    },
    methods: {
        goRoom (infos) {
            if (!infos) return

            let rid = infos.id || infos.mid || infos.uid
            rid && window.open('/' + rid, '_blank')
        },
        go2MyReport () {
            this.showToast('请移步至app端查看！')
        },
        showPCRule () {
            scrollers.rule.boxSize.top = 0
            scrollers.rule.refreshDOM()
        },
        resetPCRankS () {
            scrollers.rank.boxSize.top = 0
            scrollers.rank.refreshDOM()
        },
        goLogin () {
            showLoginPanel()
        }
    }
})
