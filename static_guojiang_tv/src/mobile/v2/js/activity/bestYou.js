// 在loader里面完成less的编译
import '../../css/activity/bestYou.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
// 全局
window.vm = new Vue({
    el: '#app',
    data: {
        isLove1: false,
        isLove2: false,
        isLogin: false,
        // mid1:1388495,//测试
        // mid2:1387882,//测试
        mid1: 1381521,
        mid2: 1381334
    },
    created: function () {
        // 关注状态
        this.isAttention(this.mid1, 1) // 左边按钮
        this.isAttention(this.mid2, 2) // 右边按钮
    },
    methods: {
    	isAttention: function (mid, num) {
    		// 关注状态
    		axios.get('/emotionActivity/initState', {
    			params: {
    				attentionUid: mid
    			}
    		}).then(function (res) {
    			var data = res.data
                var data = data == 'string' ? JSON.parse(data) : data
                console.log(data)
			    if (data.errno == 102) {
                    num == 1 && (this.isLove1 = true)
                    num == 2 && (this.isLove2 = true)
                }
    		}.bind(this))
    	},
    	attention1: function () {
    		this.attention(this.mid1, 1)
    	},
    	attention2: function () {
    		this.attention(this.mid2, 2)
    	},
    	attention: function (mid, num) {
    		axios.get('/emotionActivity/love', {
    			params: {
    				attentionUid: mid
    			}
    		}).then(function (res) {
    			var data = res.data
                var data = data == 'string' ? JSON.parse(data) : data
                console.log(data)
                if (data.errno == 0) {
                    num == 1 && (this.isLove1 = true)
                    num == 2 && (this.isLove2 = true)

                    layer.open({
	                    content: '关注成功，敬请期待！'
	                })
                } else if (data.errno == -100) {
                    common.goLogin()
                } else if (data.errno == 102) {
                    layer.open({
	                    content: '您已关注，敬请期待！'
	                })
                } else {
                    layer.open({
	                    content: data.msg
	                })
                }
    		}.bind(this))
    	}
    }

})
