/*
 * @Date: 2020-01-10 14:12:01
 * @LastEditors  : Jesse
 * @LastEditTime : 2020-02-19 10:38:29
 */
import Vue from 'vue'
import Axios from 'axios'
import layer from 'layer'
import {getPlatformType} from 'common'
import report from 'report'
import Swiper from '../component/swiper.min.js'
import '../../css/component/swiper.min.css'
import '../../css/user/qqGuide.less'

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
    created () {
        this.tryGetIt()
    },
    mounted () {
        // 种下cookie用于统计
        this.setCookie('channel', 'h5-QQkaquan-7')
        this.getUid()
        new Swiper('.swiper-container', {
            loop: true,
            effect: 'slide',
            slidesPerView: 'auto',
            centeredSlides: false,
            spaceBetween: 15
        })
    },
    methods: {
        // 立即领取
        getIt () {
            if (!this.btnBlock) {
                // 上报点击立即领取按钮
                report.stat('Click_GetButton_InQQKaquanPage')
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
                            this.isGot = true
                        } else if (data.errno === 100) {
                            location.href = `https://m.tuho.tv/user/qqLogin?callback=${location.href}`
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

        download () {
            // 上报点击立即领取按钮
            report.stat('Click_DownloadButton_InQQKaquanPage')
            if (this.platform === 'qq') {
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    location.href = 'https://apps.apple.com/cn/app/%E6%98%9F%E5%85%89%E7%9B%B4%E6%92%AD-%E7%A7%80%E5%9C%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E4%BA%A4%E5%8F%8B%E5%B9%B3%E5%8F%B0/id1453796942?l=en'
                } else {
                    location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tuhao.kuaishou&ckey=CK1453306318062'
                }
            } else if (this.platform === 'ios') {
                location.href = 'https://apps.apple.com/cn/app/%E6%98%9F%E5%85%89%E7%9B%B4%E6%92%AD-%E7%A7%80%E5%9C%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E4%BA%A4%E5%8F%8B%E5%B9%B3%E5%8F%B0/id1453796942?l=en'
            } else {
                location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tuhao.kuaishou&ckey=CK1453306318062'
            }
        },
        getUid () {
            Axios.get('/marktingPopularize/isReceived')
                .then(res => {
                    const data = res.data
                    if (data.data.isReceived) {
                        this.isGot = true
                    } else {
                        this.isGot = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
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
                        this.isGot = true
                    } else
                    if (data.errno === 5003) {
                        this.isGot = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        setCookie (name, value) {
            var Days = 7
            var exp = new Date()
            exp.setTime(exp.getTime() + (Days * 24 * 60 * 60 * 1000))

            var domainArr = location.host.split('.')
            var domain = domainArr[1] + '.' + domainArr[2]

            document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/;domain=' + domain
        }
    }
})
