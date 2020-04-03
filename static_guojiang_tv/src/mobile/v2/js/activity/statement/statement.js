'use strict'

import Vue from 'vue'

import '../../../css/activity/statement/statement.less'

var con = {
    href: '//m.kuaishouvideo.com/notice/xgGreen'
}

new Vue({
    el: '#app',
    data: {},
    mounted: function () {
    },
    methods: {
        goPage () {
            window.location.href = con.href
        }
    }
})
