'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge } from 'common'

import '../../css/activity/annual19S1Charge.less'

import CommonMixin from './annual19S1Charge.mixin.js'

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
        goRecharge
    }
})
