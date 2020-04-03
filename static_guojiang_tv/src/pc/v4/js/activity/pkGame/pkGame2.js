'use strict'

import Vue from 'vue'
// import axios from 'axios'
import { showLoginPanel } from 'user' // eslint-disable-line
// import layer from 'layer'; // desc: 弹出层插件

import '../../../css/activity/pkGame/pkGame2.less'
import CommonMixins from '../../../../../mobile/v2/js/activity/pkGame/pkGame2.mixin'
import PCScroller from '../components/PCScroller.vue'

new Vue({
    el: '#app',
    components: {
        'scroller': PCScroller
    },
    mixins: [ CommonMixins ],
    data: {
        isPC: true
    },
    updated () {
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
        this.$refs['medals-scroller'] && this.$refs['medals-scroller'].refreshDOM()
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
        pcRankRefresh () {
            this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller']._refresh()
        }
    }
})
