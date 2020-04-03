/**
 * @author  Jesse
 * @date    2017-12-28 18:22:07
 */
import common from 'common'
import Vue from 'vue'
import axios from 'axios'

require('../../../css/activity/queen/datuanzi.less')

// ios中激活active伪类
document.body.addEventListener('touchstart', function () {})

new Vue({
    el: '#app',
    data: {
        showRules: false,
        isFollow: false, // 是否已关注
        list: [], // 用户榜单
        scrollLock: false,
        page: 0
    },
    computed: {

    },
    created: function () {
        // 获取初始化页面数据
        axios.get('/DatuanziActivity/Init')
            .then(res => {
                let data = res.data
                // console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.uid = data.data.uid
                    if (!this.uid) {
                        common.goLogin()
                    }
                    this.isFollow = data.data.isFollow
                    this.list = data.data.list
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
    	// 适配机型重定向
    	this.adaptation()
        // 绑定滚动加载
        this.initScrollLoad()
    },
    methods: {
    	// 适配机型重定向
    	adaptation () {
    		let href = window.location
    		if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
		        if (href.host.indexOf('www') >= 0) {
    	    	    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
    	    	}
    		} else {
    			if (href.host.indexOf('www') < 0) {
    	            window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
    	        }
    		}
    	},
        // 点击主播头像跳转直播间
        inlive () {
            var rid = 903573
            common.goRoom(rid)
        },
        // 点击关注按钮，关注主播
        attention () {
            axios.get('/DatuanziActivity/Attention', {
                params: {
                    mid: 9173285
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    // console.log(_data);
                    if (_data.errno == 0) {
                        this.isFollow = true
                    } else {
                        layer.open({
                            content: _data.msg,
                            time: 3000,
                            closeBtn: 0
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele)
            var bH = bottomHeight || 100
            _ele.addEventListener('scroll', function () {
                var scrollTop = _ele.scrollTop

                var cliHeight = _ele.clientHeight

                var scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        },
        // 绑定滚动加载
        initScrollLoad () {
            const that = this
            that.scrollLoad('.last', 150, function () {
                if (that.scrollLock) return
                that.scrollLock = true
                that.page++
                that.getUserRank(that.page)
            })
        },
        // ajax获取用户列表
        getUserRank (page) {
            const that = this
            axios.get('/DatuanziActivity/GetRank', {
                params: {
                    page: page
                }
            })
                .then(res => {
                    let data = res.data.data
                    // console.log(data);
                    if (data.length > 0) {
                        that.list = that.list.concat(data)
                        that.scrollLock = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
