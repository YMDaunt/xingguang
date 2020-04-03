'use strict'

/* 年度充值活动 mrzjd 2018.12 */

import Vue from 'vue'

import '../../../css/activity/ceremony2018/charge.less'

new Vue({
    el: '#app',
    data: {},
    mounted: function () {
    },
    methods: {
        gocharge () {
            window.open('/recharge/center', '_blank')
        }
    }
})
