'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import '../../css/activity/burnCalorie.less'
import CommonMixin from './burnCalorie.mixin.js'

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
        }
    }
})
