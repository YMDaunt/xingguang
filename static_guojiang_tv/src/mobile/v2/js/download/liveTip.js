/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-02 18:27:51
 */

import '../../css/download/liveTip.less'
import Vue from 'vue'
import axios from 'axios'
import layer from 'layer'
import {getPlatformType, showLoading, hideLoading} from 'common'
const querystring = require('querystring')

let vm = new Vue({
    el: '#app',
    data: {
        defaultInfo: {
            ios: 'https://itunes.apple.com/cn/app/id1406646762?mt=8',
            android: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tuhao.kuaishou&from=singlemessage'
        },
        info: {
            downloadUrl: '',
            name: '星光直播',
            bannerImg: require('../../img/download/liveTip/0_01.jpg'),
            bgImg: require('../../img/download/liveTip/0_02.jpg'),
            tipImg: require('../../img/download/liveTip/tips.png'),
            textImg: require('../../img/download/liveTip/text.png'),
            logo: require('../../img/download/liveTip/7.png')
        },
        type: '',
        Fun: '开播', // 提示类型
        isHideName: true,
        showPage: false
    },
    created: function () {
        this.type = querystring.parse(location.search.split('?')[1])['type']
        if (this.type === 'moreTip') {
            this.Fun = '更多功能'
            this.info.bannerImg = require('../../img/download/liveTip/002.jpg')
            // this.info.tipImg = require('../../img/download/liveTip/tips.png')
            this.info.textImg = require('../../img/download/liveTip/more_text.png')
        }
        let plat = getPlatformType()
        if (plat !== 'ios_webview') {
            this.getInfo()
        }
        setTimeout(function () {
            document.querySelector('.desc').style.display = 'block'
        }, 600)
    },
    mounted: function () {
        let plat = getPlatformType()
        // 为了兼容ios 不请求后台，全部用默认的资源
        this.info.downloadUrl = plat === 'ios_webview' ? this.defaultInfo.ios : this.defaultInfo.android

        this.isHideName = plat === 'ios_webview'
    },
    methods: {
        getInfo () {
            showLoading()
            axios.get('/pkg/info')
                .then(
                    (res) => {
                        hideLoading()
                        vm.showPage = true

                        let data = res.data
                        if (data.errno === 0) {
                            if (data.data.length !== 0) {
                                let plat = getPlatformType()
                                vm.info.downloadUrl = plat === 'ios_webview' ? vm.defaultInfo.ios : vm.defaultInfo.android

                                vm.info.downloadUrl = data.data.url === '' ? vm.info.downloadUrl : data.data.url
                                vm.info.name = data.data.appName === '' ? vm.info.name : data.data.appName
                                vm.info.bannerImg = data.data.head === '' ? vm.info.bannerImg : data.data.head
                                vm.info.bgImg = data.data.next === '' ? vm.info.bgImg : data.data.next
                                vm.info.textImg = data.data.foot === '' ? vm.info.textImg : data.data.foot
                                vm.info.logo = data.data.app === '' ? vm.info.logo : data.data.app

                                if (data.data.next !== '') {
                                    document.getElementsByTagName('article')[0].style.backgroundImage = `url(${data.data.next})`
                                }
                            }
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
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },

        goDown () {
            let vm = this

            down()
            function down () {
                if (vm.info.downloadUrl === '') {
                    setTimeout(function () {
                        down()
                    }, 200)
                } else {
                    try {
                        setTimeout(function () {
                            console.log('url:', vm.info.downloadUrl)
                            gBridge.openBrowserWithUrl(vm.info.downloadUrl)
                        }, 100)
                    } catch (e) {
                        alert(e.name + ':' + e.message)
                    }
                }
            }
        }

    }
})
