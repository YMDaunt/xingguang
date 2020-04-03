// 在loader里面完成less的编译
import '../../../css/activity/channel/13.less'

// 通用库类的引用
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'

window.vm = new Vue({
    el: '#app',
    data: {
        channelV: '',
        flag: true,
        channelName: '',
        activeDisplay: '',
        downUrl: '',
        tel: '',
        authCode: '',
        errMsg: '',
        orgId: '',
        orgName: '',
        countDownNum: 60,
        getingVcode: false,
        nextClickFlag: true,
        geeFlag: true, // 防止连续点击生成多个极验验证码
        captchaObj: null // 极验对象
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
    mounted: function () {
    	this.$nextTick(function () {
            this.initGeeCaptcha()
    	})
    },
    methods: {
        restrictTel (val) {
            this.verifyTel(val)
            this.tel = val.match(/^[1]\d*/g) ? val.match(/^[1]\d*/g)[0] : ''
        },
        restrictAuthCode (val) {
            this.authCode = val.match(/\d+/g) ? val.match(/\d+/g)[0] : ''
        },
        verifyTel (val) {
            let regExp = common.regExpTest(val, 'mobile')

            if (!regExp.errno) {
                this.errMsg = regExp.msg
            } else {
                this.errMsg = ''
            }
        },
        getAuthCode (obj) {
            if (this.tel == '') {
                layer.open({
                    content: '请先填写手机号',
                    skin: 'msg',
                    time: 3
                })
                $('#tel').focus()
                return
            }

            // 手机格式错误
            if (this.errMsg != '') return

            // 拉取极验验证码
            if (this.geeFlag) {
	    		this.captchaObj.verify()
                this.geeFlag = false
            }
        },
        initGeeCaptcha () {
            let vm = this

	        axios.get('/user/StartCaptchaServlet?t=' + (new Date()).getTime())
	        	.then(
	        		(res) => {
	        			let data = res.data
	        			// 使用initGeetest接口
		                // 参数1：配置参数
		                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
		                initGeetest({
		                    gt: data.gt,
		                    challenge: data.challenge,
		                    offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
		                    new_captcha: data.new_captcha,
		                    product: 'bind' // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
		                }, function (captchaObj) {
		                	vm.handlerEmbed(captchaObj)
		                })
	        		},
	        		(err) => {
	        			console.log(err)
	        			vm.geeFlag = true
	        		}
	        	)
	    },
	    handlerEmbed (captchaObj) {
	    	let vm = this

	    	// 将验证码加到id为captcha的元素里
	        // captchaObj.appendTo("#geePhoneCaptcha");
	        captchaObj.onReady(function () {
		        vm.geeFlag = true
	        })

	        captchaObj.onClose(function () {
	        	vm.geeFlag = true
	        })

	        captchaObj.onSuccess(function () {
	            // 发送验证码
                vm.sendAuthCode()
	        })

	    	vm.captchaObj = captchaObj
	    },
        sendAuthCode () {
            common.showLoading()

            let validate = this.captchaObj.getValidate()
            axios.get('/user/getMobileVCode', {
                params: {
                    mobile: this.tel,
                    geetest_challenge: validate.geetest_challenge,
                    geetest_validate: validate.geetest_validate,
                    geetest_seccode: validate.geetest_seccode
                }
            })
                .then(
                    (res) => {
                        common.hideLoading()

                        res = res.data
                        if (res.errno == 0) {
                            this.getingVcode = true
                            // 开始倒计时
                            this.startCountDown()
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 3
                            })

							 // 验证失败重新初始化验证码
                            if (res.errno == 1105) {
                                this.captchaObj.reset()
                            }
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
        verifyAuthCode () {
            if (!this.nextClickFlag) return

            if (!this.tel || this.tel == '') {
                layer.open({
                    content: '请先正确填写手机号',
                    skin: 'msg',
                    time: 3
                })
                return
            }
            if (!this.authCode || this.authCode == '') {
                layer.open({
                    content: '请先获取验证码',
                    skin: 'msg',
                    time: 3
                })
                return
            }
            this.nextClickFlag = false

            common.showLoading()

            axios.get('/user/isVcodeCurrect', {
                params: {
                    mobile: this.tel,
                    vcode: this.authCode
                }
            })
                .then(
                    (res) => {
                        this.nextClickFlag = true
                        common.hideLoading()
                        res = res.data

                        if (res.errno == 0) {
                            // step to next page
                            this.nextStep()
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 3
                            })
                            // 验证失败重新初始化验证码
                            this.hasGee = false
                        }
                    },
                    (err) => {
                        this.nextClickFlag = true
                        console.log(err)
                    }
                )
        },
        nextStep () {
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
