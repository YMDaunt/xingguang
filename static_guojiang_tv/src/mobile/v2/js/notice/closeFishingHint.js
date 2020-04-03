'use strict'

import Vue from 'vue'
import {getPlatformType} from 'common'

import '../../css/notice/closeFishingHint.less'

new Vue({
    el: '#app',
    data: {
        showFlag: -1
    },
    mounted: function () {
        this.$nextTick(function () {
            var platform = getPlatformType()
            if (platform === 'android_webview') {
                this.showFlag = 0
            } else if (platform === 'ios_webview') {
                this.showFlag = 1
            }
        })
    },
    methods: {
        close () {
            try {
                console.log('close')
                gBridge.closeWeb()
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        }
    }
})
