import '../../css/makeFriends/matching.less'
import Vue from 'vue'
import axios from 'axios'
import layer from 'layer'
import {getPlatformType, preloadImgs} from 'common'
// import report from 'report'
import bodymovin from '../component/bodymovin.min.js'
const url = require('url')
const querystring = require('querystring')

new Vue({
    el: '#app',
    data: {
        svgContainer: '', // 播放动画盒子
        animItem: '',
        hasChance: false,
        message: '',
        showResult: false, // 展示结果页
        otherList: [], // 没机会时列表
        userInfo: {
            headPic: '',
            nickname: '',
            num: 0, // 剩余次数
            uid: ''
        },
        showBg: true
    },
    computed: {
        showHeader () {
            if (getPlatformType() === 'android_webview') {
                return true
            } else {
                return false
            }
        }
    },
    created () {
        let query = url.parse(location.href).query
        let params = querystring.parse(query)
        if (params.canMatchNum > 0) {
            this.hasChance = true
        } else {
            this.hasChance = false
            axios.get('/mfUser/WantChatList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.otherList = data.data
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    mounted () {
        // 预加载svg图片
        let imgArr = []
        for (let i = 0; i <= 177; i++) {
            imgArr.push('https://static.guojiang.tv/app/gift/h5_animation/liaowo/images/img_' + i + '.png')
        }
        preloadImgs(imgArr)
        this.svgContainer = document.getElementById('svgContainer')
    },
    methods: {
        // 播放动画
        playSvg () {
            this.animItem = bodymovin.loadAnimation({
                wrapper: this.svgContainer,
                animType: 'svg',
                loop: false,
                prerender: true,
                autoplay: true,
                path: 'https://static.guojiang.tv/app/gift/h5_animation/liaowo/data.json'
            })
            // 动画播放完成回调
            this.animItem.addEventListener('complete', () => {
                axios.get('/mfUser/WantChat')
                    .then(res => {
                        let data = res.data
                        if (data.errno === 0) {
                            this.message = data.data.message
                            this.userInfo = data.data.userInfo
                            this.showResult = true
                            this.svgContainer.innerHTML = ''
                        } else {
                            layer.open({
                                content: data.msg,
                                btn: ['确定'],
                                yes: function () {
                                    location.reload()
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
        },
        play () {
            if (!navigator.onLine) {
                layer.open({ time: 3, content: '网络不给力' })
                return false
            }
            this.showBg = false
            this.showResult = false
            this.playSvg()
            // 在线匹配统计
            // report.stat('ClickSocialTab_OnlineMatchingH5')
        },
        // 重新匹配
        reMatching () {
            if (this.userInfo.num === 0) {
                layer.open({
                    content: '今日次数已用完',
                    btn: ['确定'],
                    yes: function (e) {
                        layer.close(e)
                        location.href = '/dist/makeFriends/matching.html?canMatchNum=0'
                    }
                })
                return false
            }
            this.showBg = false
            this.showResult = false
            this.playSvg()
        },
        cancel () {
            this.showBg = true
            this.svgContainer.innerHTML = ''
            this.animItem.stop()
        },
        // 打招呼，我要撩
        greet (uid) {
            try {
                gBridge.greet(uid)
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
            // 我要撩统计
            // report.stat('ClickOnlineMatchingH5_SayHelloButton')
        },
        // 进个人主页
        goPersonalPage (uid) {
            try {
                gBridge.userDetail(uid)
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        }
    }
})
