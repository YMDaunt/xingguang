// 在loader里面完成less的编译
import '../../../css/activity/channel/12.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'

window.vm = new Vue({
    el: '#app',
    data: {
        activityTime: '活动时间:5月25日-6月7日',
        channelV: '',
        flag: true,
        channelName: '',
        activeDisplay: '',
        downUrl: ''
    },
    created: function () {
    	// URL参数
        var channel_v = location.search.substring(1).split('=')[1]
        channel_v = channel_v || ''

        var down_url = channel_v == 1 ? '//a.app.qq.com/o/simple.jsp?pkgname=com.guojiang.meitu.boys' : '//openbox.mobilem.360.cn/qcms/view/t/detail?sid=3082541'

        var channel_name = channel_v == 1 ? '应用宝' : '360手机助手'

        // 判断平台,app里不显示下载框
        var platformType = common.getPlatformType()
        if (platformType == 'android_webview' || platformType == 'ios_webview') {
            var active_display = 'none'
        }

        this.channelName = channel_name
        this.channelV = channel_v
        this.activeDisplay = active_display
        this.downUrl = down_url
    },
    methods: {
    	getFlow: function () {
    		if (!this.flag) return
            this.flag = false
    		axios.get('/channel/TwelveGetLottery', {
                params: {
                    v: this.channelV
                }
            }).then(function (res) {
                this.flag = true
                var data = res.data

                var data = data == 'string' ? JSON.parse(data) : data

                if (data.errno == 0) {
                    var prize_id = data.data.result.prizeId

                    var prize_name = data.data.result.prizeName

                    var text = '成功领取' + prize_name + '，等待短信发送'
                    layer.open({
                        content: text,
                        time: 4
                    })
                } else if (data.errno == -100) {
             		common.goLogin()
                } else {
              		layer.open({
	                    content: data.msg
	                })
                }
            }.bind(this))
    	}
    }

})
