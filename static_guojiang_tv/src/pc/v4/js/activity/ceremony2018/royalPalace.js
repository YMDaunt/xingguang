'use strict'

import Vue from 'vue'
import axios from 'axios'
// import user from 'user'
// import layer from 'layer'; // desc: 弹出层插件

import '../../../css/activity/ceremony2018/royalPalace.less'

new Vue({
    el: '#app',
    data: {
        zhubos: [{
            cname: 'ox',
            name: '年度偶像主播',
            list: [{
                name: '猪猪女孩❤️',
                rid: '1049260',
                mid: '18338736'
            }, {
                name: '娃娃鱼💕休息两天',
                rid: '1035744',
                mid: '11525770'
            }, {
                name: 'Happy·仇儿🌸',
                rid: '1065108',
                mid: '19479702'
            }]
        }, {
            cname: 'rq',
            name: '年度人气主播',
            list: [{
                name: '素婉☞唱的稀碎',
                rid: '35953',
                mid: '653409'
            }, {
                name: '小村姑、求年度票',
                rid: '895920',
                mid: '11091162'
            }, {
                name: '小白🔥连麦渡劫',
                rid: '1003374',
                mid: '17378382'
            }]
        }, {
            cname: 'tl',
            name: '年度天籁主播',
            list: [{
                name: '瑾辰辰🌻',
                rid: '783283',
                mid: '3425640'
            }, {
                name: 'Honey ゛青青✨',
                rid: '1111463',
                mid: '21031786'
            }, {
                name: '陈芷欣🌈感恩陪伴',
                rid: '909376',
                mid: '12483157'
            }]
        }, {
            cname: 'yl',
            name: '年度娱乐主播',
            list: [{
                name: '🌸 北北大宝贝吖✨',
                rid: '157186',
                mid: '1368022'
            }, {
                name: '二万✔♡',
                rid: '947489',
                mid: '14457411'
            }, {
                name: '52温柔颖',
                rid: '124987',
                mid: '1376546'
            }]
        }, {
            cname: 'fy',
            name: '年度风云主播',
            list: [{
                name: 'My💫土豆念eed',
                rid: '766280',
                mid: '8654014'
            }, {
                name: 'LinDa💫琳儿吖',
                rid: '1120698',
                mid: '21329020'
            }, {
                name: '主持人丶凯伦（感恩）',
                rid: '847708',
                mid: '10091464'
            }]
        }],
        users: []
    },
    mounted: function () {
        axios.get('/anniversary/topUsers').then(res => {
            if (res.status === 200) {
                return res.data
            } else {
                console.error(res.msg)
                throw new Error(res.msg)
            }
        }).then(data => {
            if (data.errno !== 0) {
                console.error(data.msg)
                throw new Error(data.msg)
            }

            if (data.data.length === 0) {
                // this.showUsers = false
                return
            }

            // this.showUsers = true
            this.users = data.data
        })
    },
    methods: {
        goRoom: function (mid) {
            // mid = '1389319'
            mid && window.open('/' + mid, '_blank')
        }
    }
})
