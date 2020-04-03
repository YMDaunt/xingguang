/*
 * @Date: 2019-09-07 10:29:22
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-11 11:48:51
 */
// ios6号包的主播等级
import '../../css/level/moderator.less'
import Vue from 'vue'
import Axios from 'axios'
import layer from 'layer'
import BgLayout from '../component/BgLayout.vue'
import PageContent from '../component/PageContent.vue'

// import '../../../../../../../mock/level.js'

new Vue({
    el: '#app',
    components: {
        'bg-layout': BgLayout,
        'page-content': PageContent
    },
    data: {
        modInfo: {},
        isModerator: false
    },
    computed: {
        currentProgress () {
            return (this.modInfo.mod_level_coin / (this.modInfo.mod_level_coin + this.modInfo.mod_next_level_need_more) * 100) + '%'
        }
    },
    created () {
        this.getInitData()
    },
    methods: {
        getInitData () {
            Axios.get('/myLevel/moderator', {
                params: {
                    packageId: 6
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.modInfo = data.data.modInfo
                        this.isModerator = data.data.isModerator
                    }
                })
        },
        popup () {
            var html = `<h3>不同等级设置房管对应表</h3>
                    <table>
                        <tr><th>等级名称</th><th>管理员个数</th></tr>
                        <tr><td>新秀1</td><td>2</td></tr>
                        <tr><td>新秀2-4</td><td>5</td></tr>
                        <tr><td>新秀5</td><td>10</td></tr>
                        <tr><td>达人6</td><td>10</td></tr>
                        <tr><td>达人7-10</td><td>20</td></tr>
                        <tr><td>大咖11</td><td>20</td></tr>
                        <tr><td>大咖12</td><td>30</td></tr>
                        <tr><td>大咖13</td><td>35</td></tr>
                        <tr><td>大咖14</td><td>40</td></tr>
                        <tr><td>大咖15</td><td>45</td></tr>
                        <tr><td>大咖16</td><td>50</td></tr>
                        <tr><td>大咖17</td><td>60</td></tr>
                        <tr><td>大咖18-20</td><td>65</td></tr>
                        <tr><td>巨星21</td><td>65</td></tr>
                        <tr><td>巨星22-30</td><td>80</td></tr>
                        <tr><td>传奇31</td><td>80</td></tr>
                        <tr><td>传奇32-41</td><td>100</td></tr>
                    </table>`
            layer.open({
                content: html,
                className: 'admin_layer'
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
