import '../../css/makeFriends/download.less'
import Vue from 'vue'
import layer from 'layer'
import {getPlatformType} from 'common'
require('../../js/common/wxShare')

new Vue({
    el: '#app',
    data: {
        // invitedCode: 123,
        downloadUrl: 'https://static.guojiang.tv/android/apk/social/5.6.5_18.apk',
        platform: getPlatformType()

    },
    computed: {
        showGuide () {
            if (this.platform === 'wechat') {
                return true
            } else {
                return false
            }
        }
    },
    created () {

    },
    methods: {
        download () {
            if (this.platform === 'ios') {
                layer.open({
                    content: 'App Store暂未上架，敬请期待',
                    skin: 'msg',
                    time: 3
                })
            } else if (this.platform === 'qq') {
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    layer.open({
                        content: 'App Store暂未上架，敬请期待',
                        skin: 'msg',
                        time: 3
                    })
                } else {
                    location.href = this.downloadUrl
                }
            } else {
                location.href = this.downloadUrl
            }
        }
    }
})
