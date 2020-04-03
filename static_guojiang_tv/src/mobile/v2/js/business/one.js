/*
 * @Date: 2018-09-29 09:58:23
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:48:06
 */
/* eslint-disable */
'use strict'

import Vue from 'vue'
import common from 'common'
import axios from 'axios'
import layer from 'layer'
import Swiper from '../component/swiper.min.js'
import '../../css/component/swiper.min.css'

import '../../css/business/one.less'

const qs = require('querystring')

new Vue({
    el: '#app',
    data: {
        url: ''
    },
    beforeCreate: function () {
    },
    created: function () {
        // this.getUrl()
    },
    mounted: function () {
        this.$nextTick(function () {
            this.initSwiper()
        })
    },
    methods: {
        initSwiper () {
            new Swiper('.swiper-container', {
                loop: true,
                autoplay: true,
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination'
                }
            })
        },

        getUrl () {
            let data = qs.parse(location.href.split('?')[1])
            console.log('data:', data)

            axios.get('/download/getDownloadUrl', {
                params: {
                    code: data.code,
                    channel: data.channel
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        if (data.errno === 0) {
                            this.url = data.data.url
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
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tuhao.laosiji&ckey=CK1414607163774'
            return

            let vm = this
            down()
            function down () {
                if (vm.url === '') {
                    setTimeout(function () {
                        down()
                    }, 200)
                } else {
                    window.location.href = vm.url
                }
            }
        }
    }
})
