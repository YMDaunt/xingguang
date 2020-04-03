'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import '../../../css/activity/pkGame/pkGame2.less'
import CommonMixins from './pkGame2.mixin'

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
        isPC: false
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
