'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge, refreshBackpack } from 'common'

import '../../../css/activity/qixi/qixi19.less'

import CommonMixin from './qixi19.mixin.js'

new Vue({
    el: '#app',
    components: {
        'scroller': {
            template: `<div><slot/></div>`
        }
    },
    mixins: [ CommonMixin ],
    data: {
        'scroller': 'scroller',
        pageType: 'mobile'
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
        goRecharge () {
            goRecharge()
        },
        resetRule () {

        },
        refreshBackpack
    }
})
