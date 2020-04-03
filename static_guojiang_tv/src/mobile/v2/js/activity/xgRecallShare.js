// 在loader里面完成less的编译
import '../../css/activity/xgRecallShare.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'

let vm = new Vue({
    el: '#app',
    data: {
        code: '',
        nickname: '',
        isPc: false
    },
    created: function () {
        // 获取邀请码
        this.code = this.getQuerystring('code')
        this.shareId = this.getQuerystring('shareId')
        // 获取赠送者昵称
        this.getContributorInfo(this.shareId)
        this.isPc = common.getPlatformType() == 'pc'
    },
    methods: {
    	clickToDown () {
    		if (this.isPc) {
    			layer.open({
    				content: '<img src="//static.guojiang.tv/pc/v3/img/common/xg_download.png?v=7e33cd3b8f" width="167px;">'
    			})
    		} else {
    			window.location.href = '//m.kuaishouvideo.com/download/second'
    		}
    	},
        getQuerystring (name) {
            let _str = window.location.search.substr(1)

            let paraArr = _str.split('&')

            let paramObj = {}
            // 输出的保存对象

            let tmp; let key; let value; let newValue

            for (var i = 0, len = paraArr.length; i < len; i++) {
		        tmp = paraArr[i].split('=')
		        key = tmp[0]
		        value = tmp[1]

		        // 如果key没有出现过(可能是0 或者false)
		        if (typeof paramObj[key] === 'undefined') {
		            paramObj[key] = value
		        } else {
		            newValue.push(value)
		            paramObj[key] = newValue
		        }
    		}
    		return paramObj[name]
        },
        getContributorInfo (shareId) {
            let that = this

    		axios.get('/RecallActivity/ContributorInfo', {
    			params: {
                    shareId: shareId
                }
    		}).then(res => {
			    	let data = res.data

                let errCode = data.errno

			    	if (errCode == 0) {
    					that.nickname = data.data.nickname
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
        }
    }
})
