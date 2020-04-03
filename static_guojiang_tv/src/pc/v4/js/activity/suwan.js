'use strict'

import Vue from 'vue'
import axios from 'axios'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../css/activity/suwan.less'

;(function apadation () {
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
}())

var onlineConfig = {
    rid: 35953,
    mid: 653409
}

// var config = {
//     rid: 44445294,
//     mid: 1389908
// }

new Vue({
    el: '#app',
    data: {
        islogined: false,
        isAttended: false,
        musicPlaying: false
    },
    mounted: function () {
        this.initAttend()
    },
    beforeDestroy: function () {
        this.$refs.audio.pause()
    },
    methods: {
        _apiFilter (res) {
            if (res.status === 200) {
                return res.data
            } else {
                console.log('ajax net error catcher: ', res.msg)
                throw new Error(res.msg)
            }
        },
        initAttend () {
            axios.get('/user/isAttentionMid', {
                params: {
                    mid: onlineConfig.mid
                }
            }).then(this._apiFilter).then(res => {
                if (res.errno === 0) { // 已关注
                    this.islogined = true
                    this.isAttended = true
                } else if (res.errno === 1) { // 未关注
                    this.islogined = true
                    this.isAttended = false
                } else { // 未登录
                    this.islogined = false
                    this.isAttended = false
                }
            })
        },
        goroom () {
            window.open('/' + onlineConfig.mid, '_blank')
        },
        gologin () {
            showLoginPanel()
        },
        attend () {
            if (!this.islogined) {
                this.gologin()
                return
            }
            if (this.isAttended) return

            axios.get('/ChenChen/attention', {
                params: {
                    mid: onlineConfig.mid
                }
            }).then(this._apiFilter).then(res => {
                if (res.errno === 0) {
                    this.isAttended = true
                }
            })
        },
        toggleMusicState () {
            if (this.musicPlaying) {
                // to pause
                this.$refs.audio.pause()
            } else {
                // to play
                this.$refs.audio.play()
            }

            this.musicPlaying = !this.musicPlaying
        }
    }
})
