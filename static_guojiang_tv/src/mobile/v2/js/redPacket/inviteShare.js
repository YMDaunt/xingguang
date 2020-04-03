import '../../css/redPacket/invite.less'

import Vue from 'vue'

var vm = new Vue({
    el: '#app',
    data: {
        code: '',
        downUrl: '//a.app.qq.com/o/simple.jsp?pkgname=com.guojiang.meitu.boys'
    },
    computed: {
        codeValue: function () {
            return this.code
        }
    },
    created: function () {
        // 获取邀请码
        this.getVcode()
    },
    methods: {
        getVcode () {
            this.code = this.getQuerystring('code')
        },
        getQuerystring (name) {
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
     		let arg = window.location.search.substr(1).match(reg)
     		if (arg != null) {
     			return unescape(arg[2])
     		} else {
     			return null
     		}
        },
        setCnzzOfDownLoad () {
            // cnzz统计
            _czc.push(['_trackEvent', 'H5邀请码页面', '点击下载app按钮'])
        },
        setCnzzOfCopyCode () {
            // cnzz统计
            _czc.push(['_trackEvent', 'H5邀请码页面', '点击复制邀请码按钮'])
        }
    }
})
