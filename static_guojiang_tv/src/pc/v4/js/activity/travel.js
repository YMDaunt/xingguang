'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import $ from 'jquery'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import bodymovin from '../component/bodymovin.min.js'

import '../../css/activity/travel.less'

var ruleJudge = true
new Vue({
    el: '#app',
    data: {
        ruleBox: false,
        travelBox: false,
        svgPlayer: false,
        travelArr: [],
        awardArr: [true, false, false, false, false, false],
        rankArr: [],
        myMesArr: []
    },
    created: function () {
        // 景点信息
        axios.get('/travel/init')
            .then(res => {
                let data = res.data
                this.travelArr = data.data
            })
            .catch(err => {
                console.log(err)
            })

        // 获取榜单
        this.getModRank()
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

        // 对应景点
        showTravel (posiNum) {
            this.travelBox = true
            this.awardArr = [false, false, false, false, false, false]
            this.awardArr[posiNum - 1] = true
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播房间id //主播用户id
        },

        // remove svg
        removeSvg () {
            this.svgPlayer = !this.svgPlayer
            var doc = $('.svg-con').find('div')
            doc.remove()
        },

        // svg
        doPlaneSvg () {
            this.svgPlayer = !this.svgPlayer
            playSvg('//static.guojiang.tv/src/pc/svg/activity/travel/data.json')
        },

        // ajax获取主播列表
        getModRank () {
            axios.get('/travel/ranks?pageSize=10')
                .then(res => {
                    let data = res.data
                    this.rankArr = data.data.data
                    this.myMesArr = data.data.myRank
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 规则
        ruleShow () {
            this.ruleBox = !this.ruleBox
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-con')
                    that.transformEntity1 = new PolyfillScroll({
                        scrollWrap: '.rule-out',
                        scrollContent: '.rule-con',
                        bar: {
                            width: '8px',
                            height: '60px',
                            right: '0px',
                            'background': 'rgba(214, 57, 51,0.8)'
                        }
                    })
                    ruleJudge = false
                }
            })
        }
    },
    mounted: function () {
        this.adaptation()
    }
})

// svg方法
function playSvg (path) {
    var svgContainer = document.querySelector('.svg-con')
    var giftSvg = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: true,
        autoplay: true,
        path: path
    })
}
