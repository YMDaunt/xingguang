// 星光年货节 2019/01/22 - 01/26
'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import BgLayout from './components/BgLayout.vue'
import MeCenter from './components/MeCenter.vue'
import '../../css/activity/SFStocking.less'

import commonMixins from './SFStockinMixins'

new Vue({
    el: '#app',
    components: {
        BgLayout, MeCenter
    },
    mixins: [ commonMixins ],
    data: {
    },
    computed: {
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
        showLayer () {
            this.layerStatue = true
        }
    }
})
