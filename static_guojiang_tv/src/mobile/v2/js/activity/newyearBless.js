'use strict'

import Vue from 'vue'

import '../../css/activity/newyearBless.less'

var played = false

new Vue({
    el: '#app',
    data: {},
    mounted: function () {
        this.$refs['video'].addEventListener('play', () => {
            // 播放次数埋点
            if (played) return
            played = true
            _czc && _czc.push(['_trackEvent', 'newyearBless - video', '[video onplay]']) // eslint-disable-line
        })
    },
    methods: {
    }
})
