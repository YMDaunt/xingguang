'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'

import '../../../css/activity/family/top.less'

var toastTimer = null

new Vue({
    el: '#app',
    data: {
        ui: {
            modalShow: false,
            toastShow: false
        },
        rooms: [],
        user: {
            uid: null,
            isAttend: false
        },
        toast: {
            msg: '123'
        }
    },
    computed: {
        // roomsSelekton () {
        //     var skeleton = [1, 2, 3, 4]
        //     if (this.rooms.length === 0) {
        //         return skeleton.slice(0, skeleton.length - this.rooms.length)
        //     } else {
        //         return []
        //     }
        // }
    },
    mounted: function () {
        this.adaptation()
        this.init()
        this.getUser()
    },
    methods: {
        // 适配机型重定向
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
        /* ui 交互 */
        joinActivity () {
            if (!this.user.uid) {
                this.goLogin()
                return
            }
            if (!this.user.isAttend) {
                this.showModal()
            }
        },
        toastMsg (msg) {
            this.ui.toastShow = true
            this.toast.msg = msg
            toastTimer && clearTimeout(toastTimer)
            toastTimer = setTimeout(() => {
                this.ui.toastShow = false
            }, 1500)
        },
        showModal () {
            this.ui.modalShow = true
        },
        closeModal () {
            this.ui.modalShow = false
        },
        cancelModal () {
            this.closeModal()
        },
        confirmModal () {
            // -> 参与活动
            axios.get('/Sao/attend')
                .then(({ data }) => {
                    return data
                })
                .then(data => {
                    console.log(data)
                    this.closeModal()
                    if (data.errno === 0) {
                        this.user.isAttend = true
                        this.toastMsg('可以了，快去直播间跑Sao吧~')
                    } else {
                        this.toastMsg(data.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        goLogin () {
            common.goLogin()
        },
        goToRoom (room) {
            // 点击头像 -> 跳转至直播间
            room.rid && common.goRoom(room.rid)
        },
        checkin (room) { // room id
            // -> 关注主播
            if (!this.user.uid) {
                this.goLogin()
                return
            }
            if (room.followed) {
                return
            }
            axios.get('/Sao/attention?mid=' + room.id)
                .then(({ data }) => {
                    return data
                })
                .then(data => {
                    if (data.errno === 0) {
                        room.followed = true
                    } else {
                        this.toastMsg(data.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        invite () {
            window.location.href = '/dist/activity/family/topShare.html'
        },
        init () {
            axios.get('/Sao/init')
                .then(({ data }) => {
                    if (data.errno !== 0) {
                        console.log(data.msg)
                        return
                    }
                    this.user.isAttend = data.data.isAttend

                    var rooms = []
                    data.data.recs.map((room) => {
                        rooms.push({
                            'avatar': room.headPic,
                            'nickname': room.nickname,
                            'id': room.id,
                            'rid': room.rid,
                            'live': room.isPlaying,
                            'followed': room.isLoved
                        })
                    })
                    this.rooms = rooms
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getUser () {
            var cookies = document.cookie.split(';')
            var cookiesHash = {}

            var temp = ''
            for (var i = 0, len = cookies.length; i < len; i++) {
                temp = cookies[i].trim()
                temp = temp.split('=')
                cookiesHash[temp[0].trim()] = temp[1].trim()
            }

            this.user.uid = cookiesHash['uid'] ? cookiesHash['uid'] : null
        }
    }
})
