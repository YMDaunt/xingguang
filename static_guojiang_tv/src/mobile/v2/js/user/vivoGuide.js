/*
 * @Date: 2020-01-10 14:12:01
 * @LastEditors  : Jesse
 * @LastEditTime : 2020-01-20 15:18:29
 */
import Vue from 'vue'
import Axios from 'axios'
import layer from 'layer'
import {getPlatformType} from 'common'
import report from 'report'
import Swiper from '../component/swiper.min.js'
import '../../css/component/swiper.min.css'
import '../../css/user/vivoGuide.less'

new Vue({
    el: '#app',
    data: {
        btnBlock: false,
        platform: getPlatformType(),
        isGot: false,
        uid: '',
        giftList: [
            {'name': '比心×42', 'id': 1},
            {'name': '丫鬟×20', 'id': 2}
        ]
    },
    mounted () {
        // 种下cookie用于统计
        this.setCookie('channel', 'and-vivo-h5hd-7')
        this.getUid()
        new Swiper('.swiper-container', {
            loop: true,
            effect: 'coverflow', // 3D翻转特效
            centeredSlides: true, // 活动块居中
            slidesPerView: 2, // 同时显示的slides数量
            initialSlide: 1, // 默认第2个
            coverflowEffect: {
                rotate: 10,
                stretch: 50,
                depth: 200,
                modifier: 1,
                slideShadows: false
            }
        })
    },
    methods: {
        // 立即领取
        getIt () {
            if (!this.btnBlock) {
                // 上报点击立即领取按钮
                report.stat('Click_GetButton_InVivoKaquanPage')
                this.btnBlock = true
                Axios.get('/marktingPopularize/getPrize')
                    .then(res => {
                        this.btnBlock = false
                        const data = res.data
                        if (data.errno === 0) {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                            const cookie = this.getCookie()
                            this.uid = cookie.uid
                            // 将uid存入localStorage
                            localStorage.setItem('uid', this.uid)
                            this.isGot = true
                        } else if (data.errno === 100) {
                            location.href = `https://m.tuho.tv/user/loginVivo?callback=${location.href}`
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 进页面试下默认领取
        tryGetIt () {
            Axios.get('/marktingPopularize/getPrize')
                .then(res => {
                    const data = res.data
                    if (data.errno === 0) {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                        const cookie = this.getCookie()
                        this.uid = cookie.uid
                        // 将uid存入localStorage
                        localStorage.setItem('uid', this.uid)
                        this.isGot = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        download () {
            // 上报点击立即领取按钮
            report.stat('Click_DownloadButton_InVivoKaquanPage')
            if (this.platform === 'ios') {
                location.href = 'https://apps.apple.com/cn/app/星光直播-秀场直播视频交友平台/id1453796942?l=en'
            } else {
                location.href = 'https://h5coml.vivo.com.cn/h5coml/appdetail_h5/browser_v2/index.html?appId=1903508&resource=301&source=7'
            }
        },
        setCookie (name, value) {
            var Days = 7
            var exp = new Date()
            exp.setTime(exp.getTime() + (Days * 24 * 60 * 60 * 1000))

            var domainArr = location.host.split('.')
            var domain = domainArr[1] + '.' + domainArr[2]

            document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/;domain=' + domain
        },
        getCookie () {
            var cookie = {}
            var all = document.cookie
            if (all === '') return cookie
            var list = all.split(';')
            for (var i = 0; i < list.length; i++) {
                var item = list[i].trim()
                var p = item.indexOf('=')
                var name = item.substring(0, p)
                name = decodeURIComponent(name)
                var value = item.substring(p + 1)
                value = decodeURIComponent(value)
                cookie[name] = value
            }
            return cookie
        },
        getUid () {
            // const cookie = this.getCookie()
            // if (cookie.uid) {
            //     // 登录过的用户
            //     if (cookie.uid === localStorage.getItem('uid')) {
            //         // 老用户
            //         this.isGot = true
            //     } else {
            //         // 换QQ号的新用户
            //         this.isGot = false
            //     }
            // } else {
            //      // 未登录过的用户
            //     this.isGot = false
            // }

            // 利用接口判断是否领取过
            // if (this.uid) {
            Axios.get('/marktingPopularize/isReceived')
                .then(res => {
                    const data = res.data
                    if (data.data.isReceived) {
                        this.isGot = true
                    } else {
                        this.isGot = false
                        // 试下自动领取
                        this.tryGetIt()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            // }
        }
    }
})
