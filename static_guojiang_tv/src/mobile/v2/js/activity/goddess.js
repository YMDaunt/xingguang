// 在loader里面完成less的编译
import '../../css/activity/goddess.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'
import 'babel-polyfill'

var vm = new Vue({
    el: '#app',
    filters: {
        formatDay (index) {
            return parseInt(index) < 10 ? '0' + index : index
        }
    },
    data: {
        days: [7, 14, 21, 28],
        tipData: [
    		['祝福', '女神卡', 5, '顶'],
    		['招福', '女神卡', 10, '共享单车1-7日体验卡（随机）'],
    		['纳福', '女神卡', 15, '宝马1-7日体验卡（随机）'],
    		['女神', '女神卡', 20, '筋斗云1-7日体验卡（随机）']
    	],
    	test: {'rid': 22222},
    	ajaxLock: false,
    	mountList: [], // 中奖列表
    	goddessList: [], // 女神列表
    	giftBoxStatus: [], // 盒子的状态
    	useSignedArr: [], // 签到情况,日期布尔表
    	signGifts: [], // 签到礼物
    	totalSignedDay: 0,
    	serverTime: '',
    	userTodayStatus: false, // 今日签到状态,false没签到
    	signStatusText: '我要签到'
    },
    created: function () {
        // 获取获奖名单
        this.getMountList()
        // 获取排名
        this.getGoddessList()
        // 获取历史签到信息
        this.getUserSignedHistory()
        // 模拟数据
	    // var data={
	    //     giftCode:28,
	    //     giftMessage:['女神卡X20', '女神卡X2', '筋斗云3日体验卡']
	    // }
	    // var data={
	    //     giftCode:0,
	    //     giftMessage:['女神卡X2']
	    // }
	    // var data={
	    //     giftCode:0,
	    //     giftMessage:['共享单车1日体验卡']
	    // }
	    // var data={
	    //     giftCode:0,
	    //     giftMessage:['共享单车1日体验卡']
	    // }
	    // this.succeedSign(data);
    },
    methods: {
        sliderFunc ($outerBox, $innerBox, gap, time) {
            var outBox = $outerBox

            var innerBox = $innerBox

            var outerBoxWidth = outBox.width()

            var liList = $('.ul li')

            var liListWidth = 0

            var timer = null

            // li的总宽度
            for (var i = 0, len = liList.length; i < len; i++) {
                liListWidth += liList.eq(i).width() + gap
            }

            liListWidth = liListWidth + outerBoxWidth

            innerBox.append(innerBox.html())

            innerBox.css('width', liListWidth * 2 + 'px')
            $('.ul').css('width', liListWidth + 'px')

            // 复制一份ul加入innerBox

            var left = outerBoxWidth

            var innerBoxWidth = innerBox.width()

            timer = setInterval(function () {
                if ((outerBoxWidth - left) == innerBoxWidth / 2) {
                    left = outerBoxWidth
                    innerBox.append($('.ul').eq(1).remove())
                }
                left -= 1
                innerBox.css('left', left + 'px')
            }, time)
        },
        clickToMark (index) {
            let offsetIndex = index + 9
    		$('.calendar li').eq(offsetIndex).find('b').addClass('active')
        },
        clickToShowTip (index) {
            let p_3

	        	if (index == 0) {
	        		p_3 = '<p class="p-4"><b></b><span>X<i>5</i></span></p>'
	        	} else {
	        		p_3 = `<p class="p-3">${this.tipData[index][3]}</p>`
	        	}

	        let tips_content = `<div class="tip-gift">
								        <div class="gi_wrap clearfix">
								             <p class="p-1">${this.tipData[index][0]}礼包</p>
								             <p class="p-2">${this.tipData[index][1]}<span>X<i>${this.tipData[index][2]}</i></span></p>
								             ${p_3}
								             <span  class="tip-arrow-bottom"></span>
								        </div>
								    </div>`
            layer.open({
			    content: tips_content
            })
        },
        getGoddessList () {
            let that = this
            axios.get('/GoddessActivity/getGoddessList')
			    .then(res => {
			    	let data = res.data
			    	// console.log(data);
			    	if (data.errno == 0) {
			    		that.goddessList = data.data.goddessList
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
        },
        getMountList () {
            let that = this
            axios.get('/GoddessActivity/getMountList')
			    .then(res => {
			    	let data = res.data
			    	console.log(data)
			    	if (data.errno == 0) {
			    		that.mountList = data.data.mountList
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
        },
        getUserSignedHistory () {
            let that = this
            axios.get('/GoddessActivity/getUserSignedHistory')
			    .then(res => {
			    	let data = res.data

			    	if (data.errno == 0) {
			    		let outputData = data.data.outputArr
			    		// 回调初始换状态
			    		that.initStatus(outputData)

			    		// 滚动列表
			    		that.$nextTick(() => {
                            that.sliderFunc($('.outerBox'), $('.innerBox'), 15, 30)
                        })
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
        },
        initStatus (data) {
            // 初始换全部状态

            this.useSignedArr = data[0]
    		this.totalSignedDay = data[1]
    		this.serverTime = data[2]
    		this.userTodayStatus = data[3]
    	    this.signGifts = data[4]
    		if (data[3]) {
    			this.signStatusText = '今日已签到'
    		}
            this.getGiftBoxStatus(data[1])
        },
        sign () {
            // 如果已签到
            if (this.userTodayStatus) return

            if (this.ajaxLock) return

            this.ajaxLock = true

            let that = this
            axios.get('/GoddessActivity/sign')
			    .then(res => {
			    	let data = res.data

			    	console.log(data)
			    	if (data.errno == -100) {
			    		common.goLogin()
			    		return
			    	}

			    	if (data.errno == 0) {
			    		that.ajaxLock = false

			    		that.useSignedInfo = data.data.outputArr
			    		let _data = data.data.result

			    		// 签到成功
                    	that.succeedSign(_data)

			    		// 刷新签到状态
			    		that.refreshStatus(that.serverTime)
			    	} else {
			    		layer.open({
			    			content: `<div class="errLayer">${data.data.errMsg}</div>`
			    		})
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
        },
        refreshStatus (serverTime) {
            let today = +serverTime.slice(-2)

			    // 标记签到的日期
			    this.useSignedArr[today] = true
		    	// 按钮不能不点击
		    	this.userTodayStatus = true
		    	// 今日已签到
		    	this.signStatusText = '今日已签到'
		    	// 签到总天数
		    	this.totalSignedDay += 1
		    	// 刷新盒子状态
		    	this.getGiftBoxStatus(this.totalSignedDay)
        },
        getGiftBoxStatus (totalDay) {
            // 四个礼物盒子的状态
            if (totalDay < 7) {

	    	} else if (totalDay >= 7 && totalDay < 14) {
	    		this.giftBoxStatus[0] = 1
	    	} else if (totalDay >= 14 && totalDay < 21) {
	    		this.giftBoxStatus[0] = 1
	    		this.giftBoxStatus[1] = 1
	    	} else if (totalDay >= 21 && totalDay < 28) {
	    		this.giftBoxStatus[0] = 1
	    		this.giftBoxStatus[1] = 1
	    		this.giftBoxStatus[2] = 1
	    	} else {
	    		this.giftBoxStatus[0] = 1
	    		this.giftBoxStatus[1] = 1
	    		this.giftBoxStatus[2] = 1
	    		this.giftBoxStatus[3] = 1
	    	}
        },
        succeedSign (data) {
	        let giftCode = data.giftCode

            let giftMessage = data['giftMessage'][0]

            let title = ''

            let text = '查收'

            let isOpenGiftBox = false

	        // 如果是开宝箱
	        if (giftCode == 14 || giftCode == 21 || giftCode == 28) {
	           isOpenGiftBox = true
	           giftMessage = data['giftMessage'][1]
	        }

	        // 配合服务器修改
	        if (giftCode == 7) {
	           isOpenGiftBox = true
	           giftMessage = data['giftMessage'][2]
	        }

	        if (giftMessage.indexOf('共享单车') != -1) {
	            text = '装备'
	        }

	        layer.open({
	            shade: 0.6, // 遮罩透明度
	            time: 2,
	            content: '<div class="sign-layer">\
	                        <p class="success">签到成功</p>\
	                        <p>恭喜您获得<span>' + giftMessage + '</span></p>\
	                        <p>快去背包' + text + '吧！</p>\
	                    </div>',
	            end: function () {
	                if (isOpenGiftBox) {
	                    // 开启宝箱回调
	                    vm.layerCallBack(data)
	                } else {

	                }
	            }
	        })
	    },
	    layerCallBack (data) {
	        let giftCode = data.giftCode

            let giftMessage_1 = data['giftMessage'][0]

            let giftMessage_2 = '<p><span>' + data['giftMessage'][2] + '</span></p>'

            let text = '装备'

	        if (giftCode == 7) {
	            text = '查收'
	            giftMessage_2 = '<p><span>' + data['giftMessage'][1] + '</span></p>'
	        }

	        layer.open({
	            shade: 0.6, // 遮罩透明度
	            content: '<div class="sign-layer">\
	            			<p class="success">恭喜您获得</p>\
	                        <p><span>' + giftMessage_1 + '</span></p>\
	                        ' + giftMessage_2 + '\
	                        <p>快去背包' + text + '吧！</p>\
	                    </div>'
	        })
	    },
        goRoom (mid) {
            common.goRoom(mid, 2)
        }
    }

})
