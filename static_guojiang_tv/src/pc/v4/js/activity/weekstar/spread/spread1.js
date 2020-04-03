import '../../../../css/activity/weekstar/spread/spread1.less'

import Vue from 'vue'
import axios from 'axios'
import user from 'user'
import layer from 'layer'
import $ from 'jquery'
import common from '../../../common/common.js'
import scroll from '../../../component/niceScroll.js'

// 获取URL的参数
var urlId = GetQueryString('stage')
function GetQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}

new Vue({
    el: '#app',
    data: {
        banner: '',
        contentText: '',
        modArr: []
    },
    created () {
        // 主播
        axios.get('/anchorLiveModule/getMsg?id=' + urlId + '')
            .then(res => {
                let data = res.data
                this.banner = data.data.activeMsg.banner
                this.contentText = data.data.activeMsg.text.replace(/<p>&nbsp;<\/p>/g, '')
                this.modArr = data.data.userMsg
                Vue.nextTick(() => {
                    $('.mes-area').niceScroll({
                        cursorwidth: 8,
                        cursorcolor: 'rgba(42, 199, 228,1)', // 设置滚动条滑块的颜色
                        cursorborder: 'none', // CSS方式定义滚动条边框颜色
                        autohidemode: false,
                        cursorfixedheight: 60,
                        hwacceleration: true,
                        horizrailenabled: false,
                        railpadding: { top: 0, right: -8, left: 0, bottom: 0 }
                    })
                })
            })
            .catch(err => {
                console.log(err)
            })
    },
    methods: {
        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // 关注
        attention (e, index) {
            axios.get('/anchorLiveModule/loveAttention', {
                params: {
                    id: e.target.getAttribute('data-id')
                }
            })
                .then(res => {
                    var data = res.data.data
                    console.log(data.uid)
                    if (!data.uid) {
                        user.showLoginPanel()
                    }
                    if (data.addAtt) {
                        this.modArr[index]['isAttention'] = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
