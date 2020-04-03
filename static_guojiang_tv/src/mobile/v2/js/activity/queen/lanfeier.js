// 在loader里面完成less的编译
import '../../../css/activity/queen/lanfeier.less'

// 通用库类的引用
import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'
import TouchTransform from '../../component/gj.touchTransform.js'

const os = (function () {
    var ua = navigator.userAgent

    var isWindowsPhone = /(?:Windows Phone)/.test(ua)

    var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone

    var isAndroid = /(?:Android)/.test(ua)

    var isFireFox = /(?:Firefox)/.test(ua)

    var isChrome = /(?:Chrome|CriOS)/.test(ua)

    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))

    var isPhone = /(?:iPhone)/.test(ua) && !isTablet

    var isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/queen/lanfeier.html'

var vm = new Vue({
    el: '#app',
    data: {
        isPc: false,
        scrollLock: false,
        rankList: [], // 用户送礼排行榜
        activityId: 285, // 活动id
        page: 0, // 获取榜单起始位置
        m_info: {
            // mid : 1389908,    //测试的主播id
	  		// rid : 44445294   //测试的主播房间号
	        mid: 4154188, // 真实的主播id
	        rid: 268688 // 真实的主播房间号
        },
        transformEntity: undefined
    },
    created: function () {
        // 获取排行榜
        this.getRank()
    },
    methods: {
        getRank () {
            let that = this
            axios.get('/queenActivity/GetUserRank', {
                params: {
                    activityId: that.activityId,
                    page: that.page
                }
            })
                .then(res => {
		    	const _data = res.data
		    	const userRank = _data.data.userRank
	    		if (userRank.length > 0) {
	    			that.rankList = that.rankList.concat(userRank)
	    			that.scrollLock = false
	    			if (!that.transformEntity) {
	    				Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.sort-lists-wrap')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.sort-lists')
                                that.transformEntity = new TouchTransform('.sort-lists-wrap', '.sort-lists', function (distance) {
                                    const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                    if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                        if (that.scrollLock) return
                                        that.scrollLock = true
                                        that.page++
                                        that.getRank()
                                    }
	    					})
	    				})
	    			}
	    		}
		    })
		    .catch(err => {
		    	console.log(err)
		    })
        },
        goRoom () {
            common.goRoom(this.m_info.rid, 2) // 房间号
        }

    }

})
