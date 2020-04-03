/*
 * @Date: 2019-06-04 15:21:42
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:48:38
 */
/* eslint-disable */
'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'

import '../../css/download/iosSign2.less'

new Vue({
    el: '#app',
    data: {
        platform: '',
        showDownloadHint: false
    },
    mounted: function () {
        this.platform = common.getPlatformType()
    },
    methods: {
        install () {
            if (this.platform === 'wechat') {
                this.showDownloadHint = true
                return
            }

            location.href = 'https://www.tuho.tv/download/ios?version=5.10'
        },

        trust () {
            if (this.platform === 'wechat') {
                this.showDownloadHint = true
                return
            }

            location.href = 'https://static.guojiang.tv/ios/ipa/edix.mobileprovision'
        }
    }
})
