'use strict'

import Vue from 'vue'
import { goRoom, goLogin } from 'common'

import '../../css/activity/springFestival2018.less'
import { uxMixins, commonMixins } from '../../../../mobile/v2/js/activity/springFestival2018.mixin'

new Vue({
    el: '#app',
    mixins: [ uxMixins, commonMixins ],
    data: { },
    mounted: function () { },
    methods: {
        goRoom (infos) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        go2MyReport () {
            window.location.href = './annualReport2018.html' + location.search
        },
        goLogin () {
            goLogin()
        },
        showTips (type) {
            var txtMap = {
                'credit': '2天<主播连续未开播天数≤4天，从连续未开播的第3天开始，每天将连续扣1个学分。学分扣至0分为止。<br/>主播连续未开播天数＞4天，从连续未开播的第5天开始，每天将扣2个学分。学分扣至0分为止。',
                'zhuboRank': '主播收取新年礼物“新年红包”、“过年啦”累计好运值。好运值前十名主播获得克拉奖励。',
                'tbRank': '团拜总值排名前三的团队将能获得克拉奖励。'
            }

            if (!txtMap[type]) return

            this.toastTipShow = true
            this.toastTip = txtMap[type]
        }
    }
})
