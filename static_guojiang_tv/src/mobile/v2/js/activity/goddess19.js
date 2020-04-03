/*
 * @Author: Jesse
 * @Date: 2019-02-26 18:13:16
 */

'use strict'
import '../../css/activity/goddess19.less'

import Vue from 'vue'
import axios from 'axios'
import {goRoom, goLogin} from 'common'
import Rank from './components/Rank.vue'

Vue.prototype.axios = axios

new Vue({
    el: '#app',
    components: {
        Rank
    },
    data: {
        showRules: false // 活动规则
    },
    mounted: function () {
        // 适配机型重定向
        this.adaptation()
    },
    methods: {
        adaptation () {
            let href = window.location
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
                }
            }
        },
        // 点击主播头像，跳转直播间
        inlive (rid) {
            goRoom(rid)
        },
        // 点击关注按钮，关注主播
        attention (mid, index, rank) {
            this.axios.get('/ChenChen/Attention', {
                params: {
                    mid: mid
                }
            })
                .then(res => {
                    let _data = res.data
                    if (typeof _data === 'string') {
                        _data = JSON.parse(_data)
                    }
                    if (_data.errno === 0) {
                        rank[index].isLoved = true
                    } else if (_data.errno === -100) {
                        goLogin()
                    } else {
                        layer.open({
                            content: _data.msg,
                            time: 3,
                            closeBtn: 0
                        })
                    }
                })
                .catch(err => {
                    console.warn(err)
                })
        }
    }
})
