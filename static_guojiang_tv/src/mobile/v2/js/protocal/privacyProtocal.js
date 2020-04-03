/*
 * @Date: 2020-01-08 12:12:13
 * @LastEditors: Jesse
 * @LastEditTime: 2020-01-15 10:02:09
 */
import Vue from 'vue'
import '../../css/protocal/userProtocal.less'
import { getPackageId, getPlatformType } from 'common'
new Vue({
    el: '#app',
    data: {
        platform: getPlatformType(),
        pid: getPackageId()
    },
    computed: {
        name () {
            if (this.platform === 'android_webview') {
                switch (this.pid) {
                case '24':
                    return '陌生'
                case '32':
                    return '闪恋'
                default:
                    return '常伴交友'
                }
            } else {
                return '常伴交友'
            }
        }
    }
})
