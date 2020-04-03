'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge, refreshBackpack } from 'common'

import '../../css/activity/sweetsummer.less'
import CommonMixin from './sweetsummer.mixin.js'

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
        goLogin,
        goRecharge,
        refreshBackpack
    }
})
