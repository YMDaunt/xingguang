'use strict'

import Vue from 'vue'
import router from './router'
// import axios from 'axios'
import { showLoginPanel } from 'user' // eslint-disable-line

import '../../../css/activity/ceremony2018/index.less'

import { getInit, getTicket } from './service/service'
import Timeline from './components/Timeline.vue'
import bus from './bus'
import './loader'

var con = {
    toastTimer: null,
    toastDuration: 2000,
    currSvgAniIns: null
}

// 开放入口
var path = [
    '/preState',
    '/qualifier',
    '/singleSign',
    '/single',
    '/final'
]

// 分享文案 及标题
var gjShare = [{
    title: '2018星光年度盛典强势来袭！',
    content: '积攒一年的能量，就在此刻爆发。'
}, {
    title: '2018星光年度盛典预选赛',
    content: '100强淘汰赛开始了，冲鸭！'
}, {
    title: '2018星光年度盛典单项赛报名',
    content: '积攒一年的能量，就在此刻爆发。'
}, {
    title: '2018星光年度盛典单项赛',
    content: '偶像、人气、天籁、娱乐、风云，五大单项赛！到底谁能卫冕，让我们拭目以待！'
}, {
    title: '2018星光年度盛典超级冠军赛',
    content: '巅峰之战，实力对决！到底谁能卫冕，让我们拭目以待！'
}]

new Vue({
    router,
    el: '#app',
    components: {
        Timeline
    },
    // global store
    data: {
        ui: {
            toast: false,
            toastMsg: '',
            svgLayer: false,
            bgs: [ // 配置每个阶段的背景样式
                ['bg1', 'bg2', 'bg3'],
                ['bg1', 'bg2-rank'],
                ['bg1', 'bg2', 'bg3-sign'],
                ['bg1', 'bg2-single'],
                ['bg1', 'bg2-final']
            ]
        },
        page: {
            originStage: 0, // 当前实际阶段
            stage: 0,
            currStage: -1,
            isLogin: false,
            yxDates: [],
            currDate: '', // 仅用于预选赛
            sTime: '',
            isInited: false,
            ticket: { // 用户榜领取助力票数据
                first: false,
                taked: 0, // 已领取
                total: 0,
                watchTime: 0
            }
        }
    },
    mounted () {
        // 拉去当前状态 -> 显示
        this.init()

        // 赛程切换
        bus.$on('changeNavi', (type) => {
            if (type > this.page.stage) return
            this.page.currStage = type
        })

        // 去房间页
        bus.$on('goRoom', this.goRoom)

        // toast
        bus.$on('toast', this.toast)

        // 领取ticket
        bus.$on('getTicket', this.takeTicket)

        // 登录
        bus.$on('goLogin', this.goLogin)

        // 预览动效
        bus.$on('playSvg', this.playSvg)

        // 背景图样式切换
        bus.$on('changeSingleRankH', this.changeBg)
        bus.$on('changeFRankH', this.changeBg2)
    },
    // global methods
    methods: {
        toast (msg) {
            if (!msg) return

            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.ui.toast = true
            this.ui.toastMsg = msg

            con.toastTimer = setTimeout(() => {
                this.ui.toast = false
                this.ui.toastMsg = ''
            }, con.toastDuration)
        },
        goRoom (mid) {
            mid && window.open('/' + mid, '_blank')
        },
        goLogin () {
            !this.page.isLogin && showLoginPanel()
        },
        playSvg (animationUrl) {
            if (!animationUrl) return
            loader.require('//static.guojiang.tv/pc/v3/js/component/bodymovin.js', () => { // eslint-disable-line
                this.ui.svgLayer = true

                var playSvg = function (path) {
                    var svgContainer = document.querySelector('.svg-container')
                    return bodymovin.loadAnimation({ // eslint-disable-line
                        wrapper: svgContainer,
                        animType: 'html',
                        loop: true,
                        autoplay: true,
                        path: path
                    })
                }

                con.currSvgAniIns = playSvg(animationUrl)
            }, function () {})
        },
        stopSvg () {
            this.ui.svgLayer = false

            if (con.currSvgAniIns) {
                con.currSvgAniIns.stop()
                con.currSvgAniIns.hide()
                con.currSvgAniIns.destroy()
                con.currSvgAniIns = null
            }
        },
        // 改变榜单样式高度
        changeBg ({ stage, cname }) {
            this.$set(this.ui.bgs[stage], 1, 'bg2-single ' + cname)
        },
        changeBg2 ({ stage, cname }) {
            this.$set(this.ui.bgs[stage], 1, 'bg2-final ' + cname)
        },
        takeTicket () {
            if (!this.page.isLogin) {
                showLoginPanel()
                return
            }

            var ticket = this.page.ticket
            if (ticket.first === 1) {
                this.toast('一个设备/IP每日仅限一个ID获得观看福利哦！')
                return
            }

            var canTaked = ticket.watchTime / 5 >> 0
            if (canTaked - ticket.taked < 1) {
                this.toast('在线累计观看直播每满5分钟，才能领取1张助力票哦！')
                return
            }

            getTicket().then(data => {
                if (data.errno === 0) {
                    // ticket.taked += data.data.recNum // 本次领取数量
                    ticket.taked = ticket.total - data.data.canNum

                    // if (ticket.taked === ticket.total) {
                    if (data.data.canNum === 0) {
                        this.toast(`本次领取${data.data.recNum}张助力票，您已领取全部助力票。`)
                    } else {
                        this.toast(`本次领取${data.data.recNum}张助力票，还有${data.data.canNum}张助力票可领取，加油哦！`)
                    }
                } else {
                    console.log(data.msg)
                    this.toast(data.msg)
                }
            })
        },
        init () {
            getInit().then(data => {
                this.page.isLogin = data.isLogin
                this.page.sTime = data.serverTime

                this.page.yxDates = data['yx_dates']
                this.page.currDate = data['current_date']

                this.page.originStage = data.stage

                if (data.stage < 3) { // 预告, 预选赛, 单项赛报名
                    this.page.stage = data.stage
                }

                if (data.stage === 3) { // 报名阶段结束 - 单项赛开始 之间 (显示报名数据)
                    this.page.stage = 2
                }

                if (data.stage === 4) { // 单项赛
                    this.page.stage = 3
                }

                if (data.stage === 5) { // 单项赛结束- 决赛开始 之间 (显示单项赛)
                    this.page.stage = 3
                }

                if (data.stage > 5) { // 决赛及决赛结束之后 (显示决赛)
                    this.page.stage = 4
                }

                var currStage = path.indexOf(location.hash.slice(1))

                if (currStage === -1 || currStage > data.stage) { // 未知路径 -> 设为当前path
                    this.page.currStage = this.page.stage
                } else {
                    this.page.currStage = currStage
                }

                this.$router.replace(path[this.page.currStage])
                this.reactPageTitle(this.page.currStage)

                // -> 助力票状态
                this.page.ticket.first = data.first
                this.page.ticket.taked = data.received
                this.page.ticket.total = data['cumulate_total']
                this.page.ticket.watchTime = data['watch_time']
            }).then(() => {
                // -> 这里要触发 预选赛日榜
                bus.$emit('yxInit')

                this.page.isInited = true

                // router change 路由监听
                this.$router.afterEach(this.routerChange)
            })
        },
        // 路由发生变化之后
        routerChange (to) {
            var i = path.indexOf(to.path)

            if (i === -1 || i > this.page.stage) { // 未开放的route
                this.$router.replace(path[this.page.stage])
                i = this.page.stage
            }

            this.page.currStage = i

            this.reactPageTitle(i)
        },
        reactPageTitle (i) {
            document.title = gjShare[i].title
        }
    }
})
