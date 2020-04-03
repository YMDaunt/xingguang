'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line
// import layer from 'layer'; // desc: 弹出层插件

import '../../../css/activity/qixi/qixi19.less'

import CommonMixin from './../../../../../mobile/v2/js/activity/qixi/qixi19.mixin.js'
import PCScroller from '../components/PCScroller.vue'

new Vue({
    el: '#app',
    components: {
        'scroller': PCScroller
    },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller',
        pageType: 'pc'
    },
    mounted: function () {
    },
    updated () {
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
        goRecharge () {
            window.open('/recharge/center', '_blank')
        },
        resetRule () {
            this.$refs['rules-scroller']._resetBox()
            this.$refs['rules-scroller']._refresh()
        }
    }
})
