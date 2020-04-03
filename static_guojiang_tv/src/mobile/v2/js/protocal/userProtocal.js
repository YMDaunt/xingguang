/*
 * @Date: 2019-12-25 16:54:41
 * @LastEditors  : Jesse
 * @LastEditTime : 2020-01-15 10:00:23
 */
import Vue from 'vue'
import '../../css/protocal/userProtocal.less'
import { getPlatformType, getPackageId } from '../common/common.js'
new Vue({
    el: '#app',
    data: {
        platform: getPlatformType(),
        pid: getPackageId()
    },
    computed: {
        company () {
            if (this.platform === 'ios_webview') {
                return '深圳市鹏城映像科技有限公司'
            } else {
                return '深圳市声远文化传媒有限公司'
            }
        },
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
