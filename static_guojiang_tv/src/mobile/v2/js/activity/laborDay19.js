'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import '../../css/activity/laborDay19.less'
import CommonMixin from './laborDay19.mixin'

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
        refreshRule () {
            this.$refs['rules-scroller'].$el.scrollTop = 0
        },
        refreshRW () {
            this.$refs['rec-scroller'].$el.scrollTop = 0
            this.$refs['gift-scroller'].$el.scrollTop = 0
        },
        refreshRankScroller () {}
    }
})
