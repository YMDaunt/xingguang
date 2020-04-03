'use strict'

import Vue from 'vue'
import axios from 'axios'
import { getPlatformType } from 'common'
import Loading from '../activity/components/Loading.vue'
import Toast from '../activity/components/Toast.vue'

import '../../css/download/iosGuide.less'

new Vue({
    el: '#app',
    components: { Toast, Loading },
    data: {
        platform: '',
        showTips: false,
        showOp: false,

        packageA: null,
        packageB: null
    },
    mounted: function () {
        this.platform = getPlatformType()

        this.$refs.loading.show()
        this.init().then(() => {
            this.$refs.loading.hide()
        }).catch(err => {
            this.$refs.loading.hide()
            this.$refs.toast.show(err.message)
        })
    },
    methods: {
        closeOp () {
            this.showOp = false
        },
        getMoreInfo () {
            this.showOp = true
        },
        init () {
            return axios.get('/download/iosInstallInfo').then(res => {
                if (res.status !== 200) {
                    throw new Error('网络异常:', res.statusText)
                }
                let data = res.data
                if (data.errno !== 0) {
                    throw new Error('异常:', data.msg)
                }

                data.data.forEach(pkg => {
                    if (pkg.qrcode_location === '1') {
                        this.packageA = pkg
                    }
                    if (pkg.qrcode_location === '2') {
                        this.packageB = pkg
                    }
                })
            })
        },
        goInstall (type) {
            if (this.platform === 'wechat' || this.platform === 'QQ' || this.platform === 'android_webview' || this.platform === 'ios_webview') {
                this.showTips = true
                return
            }
            if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                this.$refs.toast.show('只支持iOS设备下载')
                return
            }

            let target
            if (type === 1) {
                target = this.packageA
            }
            if (type === 2) {
                target = this.packageB
            }
            if (!target || !target.link) {
                this.$refs.toast.show('下载链接无效')
                return
            }
            location.href = target.link.replace(/&amp;/g, '&')
        },
        goCert () {
            if (this.platform === 'wechat') {
                this.showTips = true
                return
            }
            if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                this.$refs.toast.show('只支持iOS设备下载')
                return
            }

            location.href = 'https://static.guojiang.tv/ios/ipa/edix.mobileprovision'
        },
        hideLayer () {
            this.showTips = false
        }
    }
})
