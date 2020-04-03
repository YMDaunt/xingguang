'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../../css/activity/queen/tuanzi19.less'

import CommonMixin from './../../../../../mobile/v2/js/activity/queen/tuanzi19.mixin.js'

new Vue({
    el: '#app',
    components: {
    },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller'
    },
    mounted: function () {
    },
    updated () {
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
        }
    }
})
