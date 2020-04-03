import '../../css/redPacket/invite.less'

import Vue from 'vue'
import common from 'common'
import layer from 'layer'
import axios from 'axios'

var vm = new Vue({
    el: '#app',
    data: {
        info: {
            code: '', // 邀请码
            obtain: 0, // 已获得的金额
            rest: 0 // 还可以获得的金额
        },
        claimCode: '', // 填写的验证码
        lock: false // 提交锁

    },
    created: function () {
        // 初始化邀请信息
        this.getTnviteInfo()
    },
    methods: {
        getTnviteInfo () {
            let that = this
            axios.get('/invite/info')
			    .then(res => {
			    	let data = res.data

			    	if (data.msg == '请先登录') {
			    		common.goLogin()
			    	}

			    	if (data.errno == 0) {
			    		that.info.code = data.data.code
			    		that.info.obtain = data.data.obtain / 100
			    		that.info.rest = data.data.rest / 100
			    	}
			    })
			    .catch((err) => {
			    	console.log(err)
			    })
        },
        clickToShare () {
            // cnzz统计
            _czc.push(['_trackEvent', 'H5邀请朋友页面', '点击邀请按钮'])

            // 先判断平台，微信直接跳转到分享页面，带上是否立即分享的页面
	        let platform = common.getPlatformType()
	        if (platform == 'wechat') {
	            window.location.href = '/inviteShare.html?code=' + this.info.code
	        } else {
	            // 点击分享链接
	            let gjShareParam = JSON.stringify({
		            title: '快来和我一起领现金红包',
		            content: '这个直播APP真奇葩，边看还能边领钱。没见过吧，快来玩玩看~',
		            link: '//m.guojiang.tv/dist/redPacket/inviteShare.html?code=' + this.info.code,
		            imgLink: '//static.guojiang.tv/mobile/v2/img/redPacket/share.jpg'
	            })
	            try {
	                gBridge.setShareData(gjShareParam)
	            } catch (e) {}
	            common.goShare()
	        }
        },
        writeCode () { // 填写邀请码
            let that = this

            if (that.claimCode == '') {
                layer.open({
                    content: '请填写邀请码'
                })
                return
            }

            if (that.lock) return

            that.lock = true
            axios.get('/invite/claim', {
                params: {
                    code: that.claimCode
                }
            }).then(res => {
                that.lock = false
                let data = res.data

                if (data.errno == 0) {
                    that.callbackLayer(0)
                } else if (data.errno == 110) {
                    that.callbackLayer(110)
                } else {
                    layer.open({
                        content: data.msg
                    })
                }
            }).catch((err) => {
			    	console.log(err)
			    })
        },
        callbackLayer (statusCode) {
            let _title, _content

            switch (statusCode) {
            case 0 :
                _title = '恭喜你'
                _content = '成功领取1元现金红包，可以去“我的红包”查收。邀请好友下载app或者去直播间也可获得更多现金红包哦'
				    break
            case 110 :
				    _title = '很遗憾'
                _content = '你来晚了，邀请码已过期。邀请好友下载app或者去直播间也可获得更多现金红包哦'
				    break
            }

            layer.open({
                title: _title,
                content: _content,
                btn: ['朕知道了'],
                shadeClose: false,
                skin: 2
            })
        }
    }
})
