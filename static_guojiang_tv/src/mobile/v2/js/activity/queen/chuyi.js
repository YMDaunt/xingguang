// 在loader里面完成less的编译
import '../../../css/activity/queen/chuyi.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'
import 'babel-polyfill'

var vm = new Vue({
    el: '#app',
    data: {
        isPc: false,
        scrollLock: false,
        rankList: [], // 用户送礼排行榜
        activityId: 171, // 活动id
        start: 0, // 获取榜单起始位置
        end: 19, // 获取榜单截止位置
        m_info: {
            // mid : 1389908,    //测试的主播id
	  		// rid : 44445294   //测试的主播房间号
	        mid: 7250640, // 真实的主播id
	        rid: 674395 // 真实的主播房间号
        }
    },
    created: function () {
        // 获取排行榜
        this.getRank()
    },
    mounted: function () {
        // 滚动事件
        this.$nextTick(() => {
            this.scrollFuc('.table_content', 150, this)
        })
    },
    methods: {
        getRank () {
            let that = this
            axios.get('/queenActivity/getRank', {
                params: {
                    start: that.start,
                    end: that.end,
                    activityId: that.activityId
                }
            })
                .then(res => {
		    	let data = res.data

		    	if (data.errno == 0) {
		    		that.rankList = that.rankList.concat(data.data)
		    		that.scrollLock = false
		    	}
		    })
		    .catch(err => {
		    	console.log(err)
		    })
        },
        scrollFuc (ele, mt, that) {
	    	let _ele = document.querySelector(ele)

            let cliHeight = _ele.clientHeight

            $(ele).scroll(function () {
                let scrollTop = _ele.scrollTop

                let scrollHeight = _ele.scrollHeight

                if (that.scrollLock || scrollHeight == cliHeight) { return false }

                if (scrollHeight - cliHeight - scrollTop < mt) {
                    that.scrollLock = true
                    that.start = that.end + 1
                    that.end += 20 // 每次获取20条
                    that.getRank(that.start, that.end, that.activityId)
                }
            })
        },
        goRoom () {
            let platformType = common.getPlatformType()

	        this.isPc = platformType == 'pc'

            if (this.isPc) {
                window.open('//www.kuaishouvideo.com/' + this.m_info.mid) // 主播用户id
            } else {
                common.goRoom(this.m_info.rid, 2) // 房间号
            }
        }

    }

})
