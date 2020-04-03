'use strict'

import Vue from 'vue'
import common from 'common'

import '../../css/activity/beibei.less'

const config = {
    mid: '1368022', // 正式环境
    rid: '157186'
    // mid: '1389908',
    // rid: '44445294'
}

new Vue({
    el: '#app',
    data: {},
    mounted: function () {
    },
    methods: {
        goroom () {
            common.goRoom(config.rid)
        }
    }
})
