// 在loader里面完成less的编译
import '../../css/activity/rechargeRebate.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
// 全局
window.vm = new Vue({
    el: '#app',
    data: {
        isLove: false,
        isLogin: false,
        mid: 1388877, // 测试mid 1381521
        rid: 587030, // 房间id 587030
        stateName: '预约直播',
        signupUrl: '//www.huodongxing.com/event/5388896261700'
    },
    created: function () {
        // 初始请求，开播状态，关注状态
        this.init()
    },
    methods: {
    	init: function () {
    		// 关注状态
    		axios.get('/emotionActivity/initState', {
    			params: {
    				attentionUid: this.mid
    			}
    		}).then(function (res) {
    			var data = res.data
                var data = data == 'string' ? JSON.parse(data) : data
                console.log(data)
			    if (data.errno == 102) {
                    this.isLove = true
                }
                // 开播状态
	     		axios({
	     			method: 'get',
	     			url: '/emotionActivity/isPlay'
	     		}).then(function (res) {
	    			var data = res.data
					 var data = data == 'string' ? JSON.parse(data) : data
					 if (data.errno == 204) {
					 	this.isLove = false
					 	this.stateName = '正在直播'
					 }
	     		}.bind(this))
    		}.bind(this))
    	},
    	book: function () {
    		axios.get('/emotionActivity/love', {
    			params: {
    				attentionUid: this.mid
    			}
    		}).then(function (res) {
    			var data = res.data
                var data = data == 'string' ? JSON.parse(data) : data
                console.log(data)
                if (data.errno == 0) {
                    this.isLove = true
                    layer.open({
	                    content: '预约成功，敬请期待！'
	                })
                } else if (data.errno == -100) {
                    common.goLogin()
                } else if (data.errno == -102) {
                    this.isLove = true
                } else if (data.errno == 204) {
                    // 正在开播直接跳转直播间
                    common.goRoom(this.rid, 0)
                } else {
                    layer.open({
	                    content: data.msg
	                })
                }
    		}.bind(this))
    	},
    	signup: function () {
    		location.href = this.signupUrl
    	}
    }

})
