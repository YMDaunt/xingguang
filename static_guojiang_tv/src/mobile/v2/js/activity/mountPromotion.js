import '../../css/activity/mountPromotion.less'
import Vue from 'vue'
import axios from 'axios'
import layer from 'layer'
import common from 'common'

const querystring = require('querystring')

let vm = new Vue({
    el: 'article',
    data: {
        myMount: [],
        uInfo: [],
        isShowLayer: false,
        layerMsg: '',
        websiteKeywords: '',
        isInApp: true
    },
    mounted () {
        this.$nextTick(function () {
            this.initMountInfo()

            let packageId = querystring.parse(location.search)['?packageId']
            this.websiteKeywords = packageId == 2 ? '土豪' : '果酱'

            let platform = common.getPlatformType()
            this.isInApp = !!(platform == 'android_webview' || platform == 'ios_webview')
        })
    },
    methods: {
        initMountInfo () {
            axios.get('/MountPromotionActivity/initMyMount')
                .then(
                    (res) => {
                        let data = res.data
                        if (data.errno == -100) {
                            common.goLogin()
                        } else if (data.errno == 0) {
                            this.myMount = data.data.info
                            this.uInfo = data.data.uInfo
                            console.log(this.myMount)
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (e) => {
                        layer.open({
                            content: e.name + ':' + e.message,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },

        getMount () {
            // cnzz统计
            _czc.push(['_trackEvent', '商城促销活动', '立即领取按钮'])

            if (!this.isInApp) {
                layer.open({
                    content: '你还未登录app，无法领取',
                    skin: 'msg',
                    time: 3
                })
                return
            }

            let version = common.getVersion()

            let versionNum = version.replace(/\./g, '')
            console.log('versionNum:', versionNum)
            if (versionNum < 320) {
                this.layer('你的版本过低，无法领取。请升级到V3.2.0以上的版本再来领取哦')
                return
            }

            common.showLoading()
            axios.get('/MountPromotionActivity/getMyMount')
                .then(
                    (res) => {
                        common.hideLoading()
                        let data = res.data
                        if (data.errno == -100) {
                            common.goLogin()
                        } else if (data.errno == 0) {
                            layer.open({
                                title: '恭喜您',
                                content: `成功获得${this.myMount.name}座驾2天体验，您也可以到“我的背包”页面选择使用装备哦`,
                                btn: ['开始装备', '取消'],
                                shadeClose: false,
                                skin: 2,
                                yes: function (e) {
                                    vm.goUse()
                                    layer.close(e)
                                },
                                no: function () {
                                    layer.open({
                                        content: '您可以去“我的-我的背包-座驾”页面使用该座驾哦~',
                                        btn: ['朕知道了'],
                                        shadeClose: false,
                                        skin: 2,
                                        yes: function (e) {
                                            layer.close(e)
                                        }
                                    })
                                }
                            })
                        } else {
                            this.layer(data.msg)
                        }
                    },
                    (e) => {
                        layer.open({
                            content: e.name + ':' + e.message,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },

        previewMount () {
            if (!this.isInApp) {
                layer.open({
                    content: '你还未登录app，无法预览',
                    skin: 'msg',
                    time: 3
                })
                return
            }

            let item = this.myMount
            let data = this.uInfo
            data.mountId = item.id
            data.mountName = item.name
            data.mountAction = item.id == 1 ? '骑着' : '开着'
            data.iosMount = typeof (item.ios_effect) === 'undefined' ? '' : item.ios_effect
            data.androidMount = typeof (item.android_effect) === 'undefined' ? '' : item.android_effect

            try {
                gBridge.mountPreview(JSON.stringify(data))
                console.log('call gBridge.mountPreview successful')
            } catch (e) {
                layer.open({
                    content: e.name + ':' + e.message,
                    skin: 'msg',
                    time: 3
                })
            }

            // cnzz统计
            _czc.push(['_trackEvent', '商城促销活动', '预览按钮'])
        },

        layer (msg = '') {
            this.isShowLayer = true
            this.layerMsg = msg
        },

        closeLayer () {
            this.isShowLayer = false
            this.layerMsg = ''
        },

        goUse () {
            common.showLoading()

            // cnzz统计
            _czc.push(['_trackEvent', '商城促销活动', '装备按钮'])

            let pid = this.myMount.id

            axios.get('/backpack/UseMount', {
                params: {
                    pid
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        common.hideLoading()

                        if (data.errno == 0) {
                            // 刷新app
                            let isLowkeyEnter = pid == 10001
                            common.refreshAppInfo({'lowkeyEnter': isLowkeyEnter})

                            layer.open({
                                title: '装备成功',
                                content: `座驾有效期为：${vm.myMount.days}天，快去直播间看看炫酷的座驾进场特效吧！`,
                                shadeClose: false,
                                btn: ['朕知道了'],
                                skin: 2
                            })
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            skin: 'msg'
                        })
                    }
                )
        }
    }
})
