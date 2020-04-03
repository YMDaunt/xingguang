import Vue from 'vue'
import axios from 'axios'
// import common from 'common';
import user from 'user'

// import user from 'user'; // desc:
// import layer from 'layer'; // desc: 弹出层插件

import '../../css/activity/sao.less'

import imgs from './sao/bgBase64'

const bgImg = imgs.invite_bg
const avatarImg = imgs.avatar
const qrcodeImg = imgs.qrcode

const PANEL = {
    bg: null,
    avatar: null,
    qrcode: null
}

// const START_DATE = new Date('2018/7/7 12:00:00');
// const END_DATE = new Date('2018/7/10 12:00:00');

new Vue({
    el: '#app',
    data: {
        ctx: null,
        ui: {
            toast: false,
            layer: false,
            tips: false,
            toastText: ''
        },
        user: {
            isAttend: false
        },
        rooms: []
    },
    mounted: function () {
        // pc / mobile 重定向
        this.adaptation()

        // 加载用户的登录信息
        this.getUser()

        // 画布资源加载
        this.panelInit()

        // 初始化信息
        this.initService()
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
        getUser: function () {
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
        showModal: function (ele) {
            this.ui[ele] = true
            // document.body.style.overflowY = 'hidden'; // 禁止背景滚动
        },
        hideModal: function (ele) {
            this.ui[ele] = false

            if (ele === 'toast') {
                setTimeout(() => {
                    this.ui.tips = false
                }, 400)
            }

            // document.body.style.overflowY = 'auto'; // 开启背景滚动
        },
        showLogin: function () {
            user.showLoginPanel()
        },
        showToast: function () {
            if (!this.user.uid) {
                this.showLogin()
                return
            }

            if (!this.user.isAttend) {
                this.showModal('toast')
            }
        },
        toast: function (msg) {
            this.ui.toastText = msg
            this.ui.tips = true
            this.ui.toast = true
        },
        run: function () {
            // 我要跑Sao
            // 确定 -> 点击 下发 活动礼物 至该用户礼物栏
            //      -> toast 提示 可以了，快去直播间跑Sao吧~
            //      -> 按钮置灰
            //      -> 点击有效期：7月7日 12:00:00-7月10日 12:00:00
            // var now = Date.now();
            // if (now < START_DATE.getTime() || now > END_DATE.getTime()) {
            //     this.toast('活动时间为 7月7日 12:00:00-7月10日 12:00:00');
            //     return;
            // }

            this.runSaoService()
                .then(data => {
                    if (data.errno === 0) {
                        this.user.isAttend = true
                        this.toast('可以了，快去直播间跑Sao吧~')
                    } else {
                        this.toast(data.msg)
                    }
                })
        },
        goToRoom: function (room) {
            // 点击头像 -> 跳转至直播间
            if (room.id) {
                window.open('//www.kuaishouvideo.com/' + room.id, '_blank')
                // window.location = '//www.kuaishouvideo.com/' + room.id
            }
        },
        follow: function (room) {
            // 点击+关注 -> 同时将按键置为已关注
            if (!room.followed) {
                if (!this.user.uid) {
                    this.showLogin()
                    return
                }

                this.followService(room.id).then((data) => {
                    if (data.errno === 0) {
                        room.followed = true
                    } else {
                        this.toast(data.msg)
                    }
                })
            }
        },
        generateEnvelop: function () {
            // 点击生成邀请函 -> 显示layer
            this.showModal('layer')
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

            if (document.createEventObject) {
                var evt = document.createEventObject()
                alink.fireEvent('onclick', evt)
            } else {
                var evt = document.createEvent('MouseEvent')
                evt.initEvent('click', false, false)
                !alink.dispatchEvent(evt)
            }

            this.hideModal('layer')
        },
        /**
         * @desc 加载画板所需要的资源
         */
        panelInit: function () {
            var panel = this.$refs.panel
            panel.width = panel.clientWidth
            panel.height = panel.clientHeight
            var _self = this

            function loaded () {
                if (PANEL.bg.complete && PANEL.avatar.complete && PANEL.qrcode.complete) {
                    _self.renderPanel()
                }
            }

            this.ctx = this.$refs.panel.getContext('2d')
            PANEL.bg = new Image()
            PANEL.bg.onload = loaded
            PANEL.bg.src = bgImg

            PANEL.avatar = new Image()
            PANEL.avatar.onload = loaded
            PANEL.avatar.src = avatarImg

            PANEL.qrcode = new Image()
            PANEL.qrcode.onload = loaded
            PANEL.qrcode.src = qrcodeImg
        },
        /**
         * @desc 渲染邀请函 - canvas - 用于保存图片
         */
        renderPanel: function () {
            var width = this.$refs.panel.width
            var height = this.$refs.panel.height
            var scale = PANEL.bg.width / width

            // 1. 背景图
            this.ctx.drawImage(PANEL.bg, 0, 0, width, height)

            // 2. 头像图
            var avataBilv = 270 / 976
            var borderR = (270 + 12) / 976

            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.fillStyle = '#f4c261'
            this.ctx.arc(width / 2, ((252 / 976) + avataBilv / 2) * width, (width * borderR) / 2, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.closePath()
            this.ctx.restore()

            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.arc(width / 2, ((252 / 976) + avataBilv / 2) * width, (width * avataBilv) / 2, 0, 2 * Math.PI)
            this.ctx.clip()
            this.ctx.drawImage(PANEL.avatar, (width - width * avataBilv) / 2, (252 / 976) * width, width * avataBilv, width * avataBilv)
            this.ctx.restore()

            // 3. 二维码图
            var qrcodeBilv = 204 / 976
            this.ctx.drawImage(PANEL.qrcode, (width - width * qrcodeBilv) / 2, (860 / 976) * width, width * qrcodeBilv, width * qrcodeBilv)

            // 4. 文本
            var fs = 42 / scale
            var textTop = 90
            this.ctx.fillStyle = '#000'
            this.ctx.textAlign = 'center'
            this.ctx.font = fs + 'px -apple-system-font,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\u5FAE\u8F6F\u96C5\u9ED1,sans-serif'
            this.ctx.fillText('2018年7月7日-7月10日', width / 2, ((252 + 270 + textTop) / 976) * width)
            this.ctx.fillText('Sao、家族成立2周年', width / 2, ((252 + 270 + textTop + 60) / 976) * width)
            this.ctx.fillText('邀您共聚星光直播', width / 2, ((252 + 270 + textTop + 120) / 976) * width)

            fs = 44 / scale
            this.ctx.fillStyle = '#f4c261'
            this.ctx.font = fs + 'px -apple-system-font,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\u5FAE\u8F6F\u96C5\u9ED1,sans-serif'
            this.ctx.fillText('识别图中二维码，即可参与活动！', width / 2, ((860 + 204 + 50 + 40) / 976) * width)
        },
        /** ** 以下为数据交互部分 ****/
        /**
         * @desc 跑骚周年庆 - 初始化信息
         */
        initService: function () {
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

                    console.log(this.rooms)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        /**
         * @desc 关注主播
         */
        followService: function (mid) {
            return axios.get('/Sao/attention?mid=' + mid)
                .then(({data}) => {
                    return data
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * @desc 参与跑Sao活动
         */
        runSaoService: function () {
            return axios.get('/Sao/attend')
                .then(({data}) => {
                    return data
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
