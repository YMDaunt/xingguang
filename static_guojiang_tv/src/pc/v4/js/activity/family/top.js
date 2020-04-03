'use strict'

import Vue from 'vue'
import axios from 'axios'
import user from 'user'
// import layer from 'layer' // desc: 弹出层插件

import '../../../css/activity/family/top.less'
import imgs from './bgBase64'

var toastTimer = null

const bgImg = imgs.invite_bg
const avatarImg = imgs.avatar
const qrcodeImg = imgs.qrcode

const PANEL = {
    bg: null,
    avatar: null,
    qrcode: null,
    rendered: false
}

new Vue({
    el: '#app',
    data: {
        ui: {
            modalShow: false,
            toastShow: false,
            layer: false
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
    mounted: function () {
        this.adaptation()
        this.init()
        this.getUser()
        this.panelInit()
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
        hideLayer () {
            this.ui.layer = false
        },
        goLogin () {
            user.showLoginPanel()
        },
        goToRoom (room) {
            // 点击头像 -> 跳转至直播间
            room.id && window.open('//www.kuaishouvideo.com/' + room.id, '_blank')
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
            // window.location.href = '/dist/activity/family/topShare.html'
            this.ui.layer = true

            this.$nextTick(() => {
                this.renderPanel()
            })
        },
        savePic: function () {
            // 点击保存图片 -> 保存至本地相册
            // 图片尺寸 -> 640*960
            var panel = this.$refs.panel
            var alink = document.getElementById('download-pic')
            alink.href = panel.toDataURL('image/png').replace('image/png', 'image/octet-stream')

            // if(window.navigator.msSaveBlob){
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                // for ie 10 and later
                var blob = panel.msToBlob()
                window.navigator.msSaveBlob(blob, 'Sao、家族成立2周年_邀您共聚星光直播.png')
                return
            }

            var evt
            if (document.createEventObject) {
                evt = document.createEventObject()
                alink.fireEvent('onclick', evt)
            } else {
                evt = document.createEvent('MouseEvent')
                evt.initEvent('click', false, false)
                !alink.dispatchEvent(evt)
            }

            this.hideLayer()
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
        },
        /**
         * @desc 加载画板所需要的资源
         */
        panelInit: function () {
            var panel = this.$refs.panel
            panel.width = panel.clientWidth
            panel.height = panel.clientHeight

            this.ctx = this.$refs.panel.getContext('2d')
            PANEL.bg = new Image()
            PANEL.bg.onload = null
            PANEL.bg.src = bgImg

            PANEL.avatar = new Image()
            PANEL.avatar.onload = null
            PANEL.avatar.src = avatarImg

            PANEL.qrcode = new Image()
            PANEL.qrcode.onload = null
            PANEL.qrcode.src = qrcodeImg
        },
        /**
         * @desc 渲染邀请函 - canvas - 用于保存图片
         */
        renderPanel: function () {
            if (!(PANEL.bg.complete && PANEL.avatar.complete && PANEL.qrcode.complete)) {
                this.toastMsg('图片正在加载中，请稍后...')
                return
            }
            if (PANEL.rendered) {
                return
            }

            var panel = this.$refs.panel
            panel.width = panel.clientWidth
            panel.height = panel.clientHeight

            var width = this.$refs.panel.width
            var height = this.$refs.panel.height
            var scale = PANEL.bg.width / width
            var picWidth = 877

            // 1. 背景图
            this.ctx.drawImage(PANEL.bg, 0, 0, width, height)

            // 2. 头像图
            var avataBilv = 280 / picWidth
            var borderR = (280 + 4) / picWidth

            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.fillStyle = '#f4c261'
            // this.ctx.arc(width / 2, (((252 + 300) / picWidth) + avataBilv / 2) * width, (width * borderR) / 2, 0, 2 * Math.PI)

            // 绘制圆角矩形
            var ctx = this.ctx
            var borderRadius = 3
            var centerX = width / 2
            var centerY = (((252 + 300) / picWidth) + avataBilv / 2) * width
            var rectX = centerX - (width * borderR) / 2 - borderRadius
            var rectY = centerY - (width * borderR) / 2 - borderRadius
            var rectH = borderR * width
            ctx.moveTo(rectX, rectY + borderRadius)
            ctx.lineTo(rectX, rectY + borderRadius + rectH)
            ctx.arcTo(rectX, rectY + borderRadius * 2 + rectH, rectX + borderRadius, rectY + borderRadius * 2 + rectH, borderRadius)
            ctx.lineTo(rectX + borderRadius + rectH, rectY + borderRadius * 2 + rectH)
            ctx.arcTo(rectX + borderRadius * 2 + rectH, rectY + borderRadius * 2 + rectH, rectX + borderRadius * 2 + rectH, rectY + borderRadius + rectH, borderRadius)
            ctx.lineTo(rectX + borderRadius * 2 + rectH, rectY + borderRadius)
            ctx.arcTo(rectX + borderRadius * 2 + rectH, rectY, rectX + borderRadius + rectH, rectY, borderRadius)
            ctx.lineTo(rectX + borderRadius, rectY)
            ctx.arcTo(rectX, rectY, rectX, rectY + borderRadius, borderRadius)

            this.ctx.fill()
            this.ctx.closePath()
            this.ctx.restore()

            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.rect(rectX + borderRadius, rectY + borderRadius, avataBilv * width, avataBilv * width)
            this.ctx.clip()
            this.ctx.drawImage(PANEL.avatar, (width - width * avataBilv) / 2, ((252 + 300) / picWidth) * width, width * avataBilv, width * avataBilv)
            this.ctx.restore()

            // 3. 二维码图
            var qrcodeBilv = 190 / picWidth
            this.ctx.drawImage(PANEL.qrcode, (width - width * qrcodeBilv) / 2, (940 / picWidth) * width, width * qrcodeBilv, width * qrcodeBilv)

            // 4. 文本
            var fs = 60 / scale
            var textTop = 0
            this.ctx.fillStyle = '#ffdfa2'
            this.ctx.textAlign = 'center'
            this.ctx.font = fs + 'px -apple-system-font,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,宋体,\u5FAE\u8F6F\u96C5\u9ED1,Microsoft YaHei,sans-serif'
            this.ctx.fillText('2018年9月7日-9月10日', width / 2, (textTop + 200 / picWidth) * width)
            this.ctx.fillText('TOP家族成立2周年', width / 2, ((textTop + 300) / picWidth) * width)
            this.ctx.fillText('邀您共聚星光直播', width / 2, ((textTop + 400) / picWidth) * width)

            fs = 42 / scale
            this.ctx.fillStyle = '#fff'
            this.ctx.font = fs + 'px -apple-system-font,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\u5FAE\u8F6F\u96C5\u9ED1,sans-serif'
            this.ctx.fillText('识别图中二维码，即可参与活动！', width / 2, ((920 + 204 + 50 + 40) / picWidth) * width)

            PANEL.rendered = true
        }
    }
})
