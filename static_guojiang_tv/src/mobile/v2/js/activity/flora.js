'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import '../../css/activity/flora.less'
import CommonMixins from './flora.mixin'

new Vue({
    el: '#app',
    components: {
        'scroller': {
            template: `<div><slot/></div>`
        }
    },
    mixins: [ CommonMixins ],
    data: {
        'scroller': 'scroller',
        isMobile: true
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
