// 在loader里面完成less的编译
import '../../css/activity/xgRecall.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'

let vm = new Vue({
    el: '#app',
    data: {
	    activityId: '199', // 第二期199
	    uid: '',
        remainChance: 0,
        isActivityStart: false,
        isActivityEnd: false,
        isAward: false,
        isOldUser: false,
        isApp: false,
        beGray: false
    },
    created: function () {
	    // 判断平台
	    this.judgePlatform()
    	// 获取用户状态
        this.getUserInfo()
        // 获取活动信息
        this.getActivityInfo()
    },
    methods: {
    	judgePlatform () {
    		// 判断平台
    		let platformType = common.getPlatformType()
    		if (platformType == 'android_webview' || platformType == 'ios_webview') {
		    	this.isApp = true
		    }
    	},
    	getUserInfo () {
    		let that = this
    		axios.get('/RecallActivity/GetUserInfo')
			    .then(res => {
			    	let data = res.data
			    	if (data.errno == 0) {
				    		that.getUserInfoCallback(data.data)
				    	}
				    })
			    .catch(err => {
			    	console.log(err)
			    })
    	},
    	getUserInfoCallback (data) {
    		let _remainChance = data.remainChance

            let _awardStatus = data.awardStatus

            let _isOldUser = data.isOldUser

            let _uid = data.uid

    			this.remainChance = _remainChance
    			this.isAward = _awardStatus
    			this.isOldUser = _isOldUser
    			this.uid = _uid

            if (_remainChance == 0) {
    				this.beGray = true
    			}
    	},
    	getActivityInfo () {
    		let that = this
    		axios.get('/RecallActivity/GetActivityInfo', {
    			params: {
                    activityId: that.activityId
                }
    		}).then(res => {
			    	let data = res.data
			    	if (data.errno == 0) {
			    		that.getActivityInfoCallback(data.data.activityInfo)
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
    	},
    	getActivityInfoCallback (data) {
    		let startTime = common.exchangeTime(data.startTime)

            let endTime = common.exchangeTime(data.endTime)

            let nowTime = common.exchangeTime(data.nowTime)

    		if (startTime - nowTime > 0) {
    			this.isActivityStart = true
    		}

    		if (endTime - nowTime < 0) {
    			this.isActivityEnd = true
    		}
    	},
    	getMyRecallRecord () {
    		let that = this
    		axios.get('/RecallActivity/GetmyRecallRecord')
			    .then(res => {
			    	let data = res.data
			    	console.log(data)
			    	if (data.errno == 0) {
    					that.renderMyRecallRecord(data.data.myRecallRecord)
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
    	},
    	renderMyRecallRecord (data) {
    		let _html = ''

            let _content

    		for (let i = 0, len = data.length; i < len; i++) {
    			_html += `<li>
			    			<span>${data[i]['receive_uid']}</span>
			    			<span>${data[i]['nickname']}</span>
			    			<span>${data[i]['level']}</span>
			    			<span>${data[i]['award']}</span>
			    		</li>`
    		}

    		_content = `<div class="recall-layer my-record-layer">
					    <p class="title">成功召回记录</p>
					    <i class="close-layer"></i>
					    <div class="outer-box">
					    	<ul class="inner-box">
					    		<li class="title">
					    			<span>ID</span>
					    			<span>昵称</span>
					    			<span>等级</span>
					    			<span>奖励</span>
					    		</li>
					    	    ${_html}
					    	</ul>
					    </div>
					</div>`

            layer.open({
	            shade: 0.6, // 遮罩透明度
	            className: 'modification-style',
	            content: _content,
	            success: function () {
	            	$('.close-layer').on('click', function () {
	            		layer.closeAll()
	            	})
	            }
	        })
    	},
    	getInviteCode () {
    		let that = this

    		if (!that.isApp) {
    			that.tipLayer('请移步手机app参与活动哦！')
    			return false
    		}

    		if (that.isActivityStart) {
    			that.tipLayer('活动未开始')
    			return false
    		}

    		if (that.isActivityEnd) {
    			that.tipLayer('活动已结束')
    			return false
    		}

    		axios.get('/RecallActivity/GetInviteCode')
			    .then(res => {
			    	let data = res.data

                    let errCode = data.errno

			    	if (errCode == 0) {
    					that.sendRecallLayer(data.data.inviteCode, data.data.uid)
			    	} else {
			    		layer.open({
			    			shade: 0.6,
                            content: data.msg
			    		})
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
    	},
    	sendRecallLayer (inviteCode, uid) {
    		let that = this

            let _content = `<div class="recall-layer send-code-layer">
								<p class="title">领取福利</p>
								<i class="close-layer"></i>
								<div class="code-wrap">
									<p> 大家一起玩儿才最热闹，快快把散落在各处的星光小伙伴们都召集回来吧！成功召回，双方即可同时获得丰厚奖励哦！</p>
									<div class="show-code">${inviteCode}</div>
									<div id="sendCode" class="sendOrGet-btn">发出召回令</div>
								</div>
							</div>`

            layer.open({
	            shade: 0.6, // 遮罩透明度
	            className: 'modification-style',
	            content: _content,
	            success: function () {
	            	$('.close-layer').on('click', function () {
	            		layer.closeAll()
	            	})
	            	// 发出召回码
	            	$('#sendCode').on('click', function () {
	            		that.setSharePage(inviteCode, uid)
	            	})
	            }
	        })
    	},
    	setSharePage (inviteCode, uid) {
	        let linkUrl = '//m.kuaishouvideo.com/dist/activity/xgRecallShare.html?code=' + inviteCode + '&shareId=' + uid

	        // 平台客户端内
	        if (this.isApp) {
	            // 点击分享链接
	            let gjShareParam = JSON.stringify({
		            title: '星光召回令！',
		            content: '星光直播邀您回家领取大礼包！',
		            link: linkUrl,
		            imgLink: '//static.guojiang.tv/mobile/v2/img/activity/xgRecall/share.png'
		         })

	            try {
	                gBridge.setShareData(gjShareParam)
	            } catch (e) {
	            	alert(e.name + ':' + e.message)
	            }

	            common.goShare()
	        } else {
	        	window.location.href = linkUrl
	        }
    	},
    	getGiftLayer () {
    		let that = this

    		if (that.isActivityStart) {
    			this.tipLayer('活动未开始')
    			return false
    		}

    		if (that.isActivityEnd) {
    			that.tipLayer('活动已结束')
    			return false
    		}

    		if (that.uid == -100) {
    			common.goLogin()
    			return false
    		}

    		if (!that.isOldUser) {
    			that.tipLayer('您不符合召回条件哦！无法领取礼包')
    			return false
    		}

    		if (that.isAward) {
    			that.tipLayer('您已经领取过了哦！')
    			return false
    		}

    		let _content = `<div class="recall-layer get-gift-layer">
								<p class="title">领取福利</p>
								<i class="close-layer"></i>
								<div class="code-wrap">
									<p>填写召回码，领取回家大礼包~</p>
									<input id="inviteCode" type="text">
									<div id="inputCode" class="sendOrGet-btn">提交召回码</div>
								</div>
							</div>`

            layer.open({
	            shade: 0.6,
	            className: 'modification-style',
	            content: _content,
	            success: function () {
	            	$('.close-layer').on('click', function () {
	            		layer.closeAll()
	            	})
	            	// 提交召回码
	            	$('#inputCode').on('click', function () {
	            		let _inviteCode = $('#inviteCode').val().replace(/(^\s*)|(\s*$)/g, '')
	            		that.inputInviteCode(_inviteCode)
	            	})
	            }
	        })
    	},
    	inputInviteCode (inviteCode) {
    		let that = this
    		axios.get('/RecallActivity/UseInviteCode', {
	    			params: {
                    code: inviteCode
                }
            }).then(res => {
			    	let data = res.data

                let errCode = data.errno

			    	if (errCode == 0) {
    					layer.open({
			    			shade: 0.6,
                        content: '欢迎回家！礼包领取成功，已下发至您的账户'
			    		})
			    	} else if (errCode == 206) {
			    		layer.open({
			    			shade: 0.6,
                        content: '您不符合召回条件哦！无法领取礼包'
			    		})
			    	} else {
			    		layer.open({
			    			shade: 0.6,
                        content: data.msg
			    		})
			    	}
			    })
			    .catch(err => {
			    	console.log(err)
			    })
    	},
    	showAwardLayer () {
    		let _content = `<div class="recall-layer rule-layer">
								<p class="title">召回奖励</p>
								<i class="close-layer"></i>
								<table>
									<tr class="title">
										<td>被邀请用户等级</td>
										<td>被邀请人奖励（克拉）</td>
										<td>邀请人奖励（克拉）</td>
									</tr>
									<tr>
										<td>1级-2级</td>
										<td>共享单车体验卡（7天）</td>
										<td>共享单车体验卡（7天）</td>
									</tr>
									<tr>
										<td>3级-5级</td>
										<td>500</td>
										<td>500</td>
									</tr>
									<tr>
										<td>6级-8级</td>
										<td>1000</td>
										<td>1000</td>
									</tr>
									<tr>
										<td>9级-11级</td>
										<td>5000</td>
										<td>5000</td>
									</tr>
									<tr>
										<td>12级-14级</td>
										<td>10000</td>
										<td>10000</td>
									</tr>
									<tr>
										<td>15级-18级</td>
										<td>30000</td>
										<td>30000</td>
									</tr>
									<tr>
										<td>19级-22级</td>
										<td>50000</td>
										<td>50000</td>
									</tr>
									<tr>
										<td>23级以上</td>
										<td>80000</td>
										<td>80000</td>
									</tr>
								</table>
							</div>`

            this.userDefinedLayer(_content)
    	},
    	userDefinedLayer (content) {
    		layer.open({
	            shade: 0.6, // 遮罩透明度
	            className: 'modification-style',
	            content: content,
	            success: function () {
	            	$('.close-layer').on('click', function () {
	            		layer.closeAll()
	            	})
	            }
	        })
    	},
    	tipLayer (content) {
    		layer.open({
    			content: content
            })
    	}
    }

})
