'use strict'

import Vue from 'vue'
// import axios from 'axios'
import { goRoom, goLogin, goRecharge, refreshBackpack } from 'common'
import CommonMixins from './foolsDay19.mixin'

import '../../css/activity/foolsDay19.less'

new Vue({
    el: '#app',
    mixins: [ CommonMixins ],
    data: {},
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
