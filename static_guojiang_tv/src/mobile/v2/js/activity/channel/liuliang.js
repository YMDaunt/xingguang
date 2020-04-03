// 在loader里面完成less的编译
import '../../../css/activity/channel/liuliang.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'
import _rsa from 'rsa'

const rsa = new (_rsa.RSA)()

window.vm = new Vue({
    el: '#app',
    data: {
        packageId: 2,
        channel: '', // 渠道号测试环境developer-default,
        bgColor: '#8b9dd6',
        bannerImgNum: '1',
        bannerImgSrc: '',
        shareImgSrc: '',
        appName: '星光',
        activityTime: '', // 页面活动时间
        tel: '', // 手机号
        authCode: '', // 验证码
        nickname: '', // 昵称
        password: '', // 密码
        sex: '', // 性别
        telErrMsg: '',
        nickNameErrMsg: '',
        passwordErrMsg: '',
        countDownNum: 60,
        getingVcode: false,
        registerFlag: false, // 防止提交注册过快
        geeFlag: true // 防止连续点击生成多个极验验证码
    },
    created: function () {
        // 活动信息
        this.getActivityInfo()
        // 是否显示下载栏
        this.setDownloadBar()
        // 测试
        // this.that.getQuerystring('v');
    },
    methods: {
        getActivityInfo () {
            let that = this
            axios.get('/channel/getActivityInfo', {
                params: {
                    v: that.getQuerystring('v')
                }
            }).then((res) => {
				    let data = res.data

                if (data.errno == 0) {
                    let _data = data.data

                    that.bgColor = _data.bgColor
                    that.appName = _data.appName
                    that.channel = _data.channel

                    // 设置图片路径
                    that.getImgSrc(_data.bannerImgNum)

                    if (_data.activityInfo.length != 0) {
                        let _activityInfo = _data.activityInfo

                        that.endTimeCallback(_activityInfo.nowTime, _activityInfo.endTime)
                        that.activityTime = that.getActivityTime(_activityInfo.startTime, _activityInfo.endTime)
                    }
                }
			    })
        },
        getImgSrc (imgNum) {
            let imgSrc = '//static.guojiang.tv/mobile/v2/img/activity/channel/liuliang/'
            this.bannerImgSrc = imgSrc + imgNum + '.jpg'
            this.shareImgSrc = imgSrc + 'share_' + imgNum + '.jpg'
        },
        getActivityTime (startTime, endTime) {
            let _startTime = startTime.split(' ')[0].replace(/\-/g, '.')
            let _endTime = endTime.split(' ')[0].replace(/\-/g, '.')

		    return _startTime + '~' + _endTime
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
        endTimeCallback (newTime, endTime) {
            let diffTime = common.exchangeTime(newTime) - common.exchangeTime(endTime)
            if (diffTime > 0) {
                layer.open({
                    content: '抱歉，活动已结束。'
                })
            }
        },
        setDownloadBar () {
            // 判断平台,app里不显示下载框
            let platformType = common.getPlatformType()
            if (platformType == 'android_webview' || platformType == 'ios_webview') {
                this.activeDisplay = 'none'
            }
        },
        restrictTel (val) {
            // 超过11位才开始验证
            if (val.length >= 11) {
                this.verifyTel(val)
            }
            this.tel = val.match(/^[1]\d*/g) ? val.match(/^[1]\d*/g)[0] : ''
        },
        restrictAuthCode (val) {
            this.authCode = val.match(/\d+/g) ? val.match(/\d+/g)[0] : ''
        },
        verifyTel (val) {
            let regExp = common.regExpTest(val, 'mobile')

            if (!regExp.errno) {
                this.telErrMsg = regExp.msg
            } else {
                this.telErrMsg = ''
            }
        },
        getAuthCode () {
            if (this.tel == '') {
                layer.open({
                    content: '请先填写手机号',
                    skin: 'msg',
                    time: 3
                })
                $('#tel').focus()
                return false
            }

            // 手机格式错误
            if (this.telErrMsg != '') return false

            // 获取极验验证码
            if (this.geeFlag) {
                this.geeFlag = false
                common.gtValidate(this.sendAuthCode)
            }
        },
        sendAuthCode () {
            let that = this
            common.showLoading()

            axios.get('/user/getVCode', {
                params: {
                    mobile: that.tel,
                    packageId: that.packageId
                }
            }).then((res) => {
                common.hideLoading()
                that.geeFlag = true

                let data = res.data

                if (data.errno == 0) {
                    that.getingVcode = true
                    // 开始倒计时
                    that.startCountDown()
                } else {
                    layer.open({
                        content: data.data.errMsg,
                        skin: 'msg',
                        time: 3
                    })
                }
            },
            (err) => {
                console.log(err)
            }
            )
        },
        startCountDown () {
            let vm = this
            let count_down = setInterval(function () {
                if (vm.countDownNum > 1) {
                    vm.countDownNum--
                } else {
                    clearInterval(count_down)
                    vm.getingVcode = false
                    vm.countDownNum = 60
                }
            }, 1000)
        },
        restrictNickname (val) {
            this.nickNameErrMsg = ''
        },
        verifyNickname (val) {
            let reg = /^.{2,10}$/
            if (!reg.test(val)) {
                this.nickNameErrMsg = '请输入2-10个字昵称'
            } else {
                this.nickNameErrMsg = ''
            }
        },
        restrictPassword (val) {
            this.passwordErrMsg = ''
        },
        verifyPassword (val) {
            let regExp = common.regExpTest(val, 'password')

            if (!regExp.errno) {
                this.passwordErrMsg = regExp.msg
            } else {
                this.passwordErrMsg = ''
            }
        },
        selectGender () {
            layer.open({
	            content: '性別提交后无法修改',
	            time: 2
	        })
        },
        registerSubmit () {
            // 防点击点击过快
            if (this.registerFlag) {
	            return
	        }

	        if (this.tel == '') {
	            layer.open({
	                content: '请先填写手机号',
	                time: 2
	            })
	            return
	        }

	        if (this.telErrMsg.length) {
	        	layer.open({
	                content: '请填写正确手机号',
	                time: 2
	            })
	            return
	        }

	        if (this.authCode == '') {
	            layer.open({
	                content: '请输入验证码',
	                time: 2
	            })
	            return
	        }

	        if (this.nickname == '' || this.nickNameErrMsg.length) {
	        	layer.open({
	                content: '请输入2-10个字昵称',
	                time: 2
	            })
	            return
	        }

	        if (this.password == '' || this.passwordErrMsg.length) {
	        	layer.open({
	                content: '请输入6-22位密码',
	                time: 2
	            })
	            return
	        }

	        if (this.sex == '') {
	        	layer.open({
	                content: '请选择性别',
	                time: 2
	            })
	            return
	        }

	        // 开始注册
	        this.register()
        },
        register () {
            let key = '-----BEGIN PUBLIC KEY-----\
                MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAlEB50IfI83W+jVTTBah1\
                0Fhz8I\/veaX\/HUXr0h9SS5ZcUzFoT8s9LFbE5wkjTgcuXKDiWkvIEXxNP3uuvc\/\/\
                5k4zQiH5eLkxJj5oaWbgIKnb\/DR\/ucHbTijt2ZzGwX0hn5AW7rlWgvK6SbuPtI\/y\
                oXcXnwuB7F77\/KCuF5Sgs2upv9LnAJ9WZGuIglRAKXVVb+gHLF2q\/tSm1dh89TJL\
                KtMaMx\/iNTQH84NbeFNvoLe3tcq94lenBoYpd8TwdMhvLQrUVU3p8GDBcg2FF2ii\
                kotH8fs8dIT+zll8TY9SUhKzyYTdyuctcykC+gVUCyn+IQBygjjL1mqCasZ5Jn+o\
                63CbSVHmwCw5kgfXJvai3zAlqbePLLp+b1MiP7eLZznY\/r8MVesw\/Tz4HyVZ3cHg\
                Ybgw\/KgkyYKbMf5wcabu14XJR+qUQKrH6hI44G1Hc7iEmByY7pG2R9wM0IbFBbrM\
                vXCmHVUfWdnAg\/NIB8jmYpKR\/YolI5rpxY6o\/WO0EffzNspF7nzpr3fLFgOEaqtG\
                aB9Bmqhu5Y8vJBzBH+p1RHa0DixZUVgNBAnsUI1G\/5t2JEwTyc+wCbzBkTS0l3+K\
                l4SzL3hBQNm7uaEsBv4Nu8QOhAyoCJvUVBVZ+Nr0amcc9n3NVY38y1V5meueZgi8\
                kn9fnmuFcZqdmwTlJc\/NQcsCAwEAAQ==\
                -----END PUBLIC KEY-----'

	        rsa.setPublicKey(key)

	        let that = this

	        that.egisterFlag = true

	        common.showLoading()

	        axios.get('/Channel/doMobileRegister', {
                params: {
                    mobile: that.tel,
                    vcode: that.authCode,
                    nickname: that.nickname,
                    password: rsa.encrypt(that.password),
                    sex: that.sex,
                    channel: that.channel
                }
            }).then(res => {
                common.hideLoading()
                that.egisterFlag = false

                let data = res.data

                let errCode = data.errno

			    if (errCode == 0) {
    				that.registerSucessCallback()
		    	} else {
		    		layer.open({
		    			shade: 0.6,
                        content: data.msg
		    		})
		    	}
            }).catch(err => {
			    console.log(err)
            })
        },
        registerSucessCallback () {
            let _content = `<div class="register-success-layer">
						    	<i class="close-layer">X</i>
						    	<p>注册成功！打开APP登录即可在活动结束7天内获得流量奖励！</p>
						    	<span class="confirm-btn" >确定</span>
						    </div>`
            layer.open({
	            shade: 0.6, // 遮罩透明度
	            className: 'modification-style',
	            content: _content,
	            success: function () {
	            	$('.close-layer, .confirm-btn').on('click', function () {
	            		layer.closeAll()
	            	})
	            },
	            end: function () {
	            	window.location.reload()
	            }
	        })
        }
    }
})
