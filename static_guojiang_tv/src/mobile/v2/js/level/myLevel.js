/*
 * @Date: 2019-09-07 10:29:22
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-18 10:42:09
 */
// ios6号包的用户等级
import '../../css/level/myLevel.less'
import Vue from 'vue'
import Axios from 'axios'
import {showLoading, hideLoading} from 'common'
import BgLayout from '../component/BgLayout.vue'
import PageContent from '../component/PageContent.vue'

new Vue({
    el: '#app',
    components: {
        'bg-layout': BgLayout,
        'page-content': PageContent
    },
    data: {
        userInfo: {},
        tipInfo: {},
        isIOSAppInVerify: true
    },
    computed: {
        currentProgress () {
            return (this.userInfo.level_consume_coin / (this.userInfo.level_consume_coin + this.userInfo.next_level_need_more) * 100) + '%'
        }
    },
    created () {
        showLoading()
        this.getInitData()
    },
    methods: {
        getInitData () {
            Axios.get('/myLevel/index', {
                params: {
                    packageId: 6
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.userInfo = data.data.userInfo
                        this.tipInfo = data.data.tipInfo
                        this.isIOSAppInVerify = data.data.isIOSAppInVerify
                    }
                    hideLoading()
                })
        }
    }
})
// 隐藏ios右上角分享按钮
window.onload = function () {
    function hideRightMenuButton () {
        if (typeof gBridge !== 'undefined') {
            gBridge.showMenuButton(false)
            clearTimeout(timer)
        } else {
            timer = setTimeout(hideRightMenuButton, 200)
        }
    }
    var timer = setTimeout(hideRightMenuButton, 200)
}
