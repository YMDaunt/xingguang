'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line
import $ from 'jquery'
import '../component/niceScroll.js'

import BgLayout from '../../../../mobile/v2/js/activity/components/BgLayout.vue'
import MeCenter from '../../../../mobile/v2/js/activity/components/MeCenter.vue'
import '../../css/activity/SFStocking.less'

import commonMixins from '../../../../mobile/v2/js/activity/SFStockinMixins'

var con = {}

new Vue({
    el: '#app',
    components: {
        BgLayout, MeCenter
    },
    mixins: [ commonMixins ],
    data: {},
    mounted: function () {
        con.scroller = $(this.$refs.scroller).niceScroll({ // eslint-disable-line
            cursorwidth: 8,
            cursorcolor: 'rgba(254, 236, 154, .9)', // 设置滚动条滑块的颜色
            cursorborder: 'none', // CSS方式定义滚动条边框颜色
            autohidemode: false,
            cursorfixedheight: 40,
            horizrailenabled: false,
            hwacceleration: true,
            railpadding: { top: 0, right: 6, left: 0, bottom: 4 }
        })

        con.layerScroller = $(this.$refs.layerScroller).niceScroll({ // eslint-disable-line
            cursorwidth: 8,
            cursorcolor: 'rgba(254, 236, 154, .9)', // 设置滚动条滑块的颜色
            cursorborder: 'none', // CSS方式定义滚动条边框颜色
            autohidemode: false,
            cursorfixedheight: 40,
            horizrailenabled: false,
            hwacceleration: true,
            railpadding: { top: 4, right: 6, left: 0, bottom: 4 }
        })
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
        showLayer () {
            this.layerStatue = true

            setTimeout(() => {
                con.layerScroller.show().doScrollTo(con.layerScroller.scrollTop() || 1)
            })
        }
    }
})

window.con = con
