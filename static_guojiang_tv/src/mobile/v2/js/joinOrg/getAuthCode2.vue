<template>
  <section class="s_1">
    <div class="upload-info">
      <div class="logo">
        <div class="guojiang" />
        <div
          v-if="uploadInfo.logoUrl"
          :style="{
            backgroundImage: 'url(' + uploadInfo.logoUrl + ')'
          }"
          class="cooperationUnitLogo"
        />
      </div>
      <p
        v-if="uploadInfo.cooperationUnit"
        class="cooperationUnit">
        合作单位：{{ uploadInfo.cooperationUnit }}
      </p>
      <p
        v-if="uploadInfo.companyName"
        class="companyName">
        公司名称：{{ uploadInfo.companyName }}
      </p>
      <div class="contacts">
        <p class="contacts1">
          <span
            v-if="uploadInfo.contactInfo1"
            class="contactInfo"
          >联系方式：{{ uploadInfo.contactInfo1 }}</span
          >
          <span
            v-if="uploadInfo.contacts1"
            class="contact"
          >联系人：{{ uploadInfo.contacts1 }}</span
          >
        </p>
        <p class="contacts2">
          <span
            v-if="uploadInfo.contactInfo2"
            class="contactInfo"
          >联系方式：{{ uploadInfo.contactInfo2 }}</span
          >
          <span
            v-if="uploadInfo.contacts2"
            class="contact"
          >联系人：{{ uploadInfo.contacts2 }}</span
          >
        </p>
      </div>
      <p
        v-if="uploadInfo.address"
        class="address">
        地址：{{ uploadInfo.address }}
      </p>
    </div>
    <div class="input_wrap">
      <label for="tel">+86</label>
      <input
        id="tel"
        v-model.trim="tel"
        type="tel"
        name="tel"
        placeholder="请输入手机号"
        @input="restrictTel($event.target.value)"
        @blur="verifyTel($event.target.value)"
      >
    </div>
    <div class="input_wrap">
      <input
        id="authCode"
        v-model.trim="authCode"
        type="text"
        name="authCode"
        placeholder="请输入短信验证码"
        @input="restrictAuthCode($event.target.value)"
      >
      <label
        v-show="!getingVcode"
        @click="getAuthCode($event)"
      >发送</label
      >
      <label
        v-show="getingVcode"
        class="geting_vcode"
      >重新发送({{ countDownNum }})</label
      >

      <P class="err_hint">{{ errMsg }}</P>

      <div
        id="geePhoneCaptchaWrap"
        class="hide">
        <span class="wait_gee_captcha">正在获取滑动验证码</span>
        <div id="geePhoneCaptcha" />
      </div>
    </div>

    <button
      class="ac_next_btn btn"
      @click="verifyAuthCode">下一步</button>

    <P
      class="deal_hint"
    >注册即表示同意<a href="javascript:;">用户协议</a></P
    >
    <div class="tutorial" />
  </section>
</template>

<script>
import common from 'common'
import $ from 'webpack-zepto'
import axios from 'axios'

export default {
    props: ['info'],
    data: function () {
        return {
            tel: '',
            authCode: '',
            errMsg: '',
            orgId: '',
            orgName: '',
            countDownNum: 60,
            getingVcode: false,
            nextClickFlag: true,
            geeFlag: false, // 防止连续点击生成多个极验验证码
            hasGee: false,
            captchaObj: null, // 极验对象
            uploadInfo: {} // 上传信息
        }
    },
    mounted: function () {
        this.initOrgInfo()
    },
    methods: {
        initOrgInfo () {
            const manager = location.search.split('manager=')[1].split('&')[0]
            const uploadInfo = JSON.parse(
                decodeURI(location.search.split('uploadInfo=')[1].split('&')[0])
            )
            this.uploadInfo = uploadInfo
            axios
                .get('/joinOrg/initOrg', {
                    params: {
                        manager: manager
                    }
                })
                .then(
                    res => {
                        res = res.data
                        if (res.errno === 0) {
                            this.orgId = res.data.orgInfo.id
                            this.orgName = res.data.orgInfo.name
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                tip: 3
                            })
                        }
                    },
                    err => {
                        alert(err)
                    }
                )
        },
        restrictTel (val) {
            this.verifyTel(val)
            this.tel = val.match(/^[1]\d*/g) ? val.match(/^[1]\d*/g)[0] : ''

            this.info.tel = this.tel
        },
        restrictAuthCode (val) {
            this.authCode = val.match(/\d+/g) ? val.match(/\d+/g)[0] : ''
            this.info.authCode = this.authCode
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
            if (this.tel === '') {
                layer.open({
                    content: '请先填写手机号',
                    skin: 'msg',
                    time: 3
                })
                $('#tel').focus()
                return
            }

            // 手机格式错误
            if (this.errMsg !== '') return

            // 拉取极验验证码
            if (!this.hasGee && !this.geeFlag) {
                this.geeFlag = true
                this.initGeeCaptcha()
            } else if (this.hasGee) {
                // 验证是否已拖动滑块到正确位置
                let validate = this.captchaObj.getValidate()
                if (!validate) {
                    layer.open({
                        content: '请先拖动验证码到相应位置',
                        skin: 'msg',
                        time: 3
                    })
                } else {
                    // 发送验证码
                    this.sendAuthCode()
                }
            }
        },
        initGeeCaptcha () {
            let vm = this
            $('#geePhoneCaptcha').html('')

            axios
                .get('/user/StartCaptchaServlet?t=' + new Date().getTime())
                .then(
                    res => {
                        let data = res.data
                        // 使用initGeetest接口
                        // 参数1：配置参数
                        // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                        initGeetest(
                            {
                                gt: data.gt,
                                challenge: data.challenge,
                                product: 'embed', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                                offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                            },
                            function (captchaObj) {
                                vm.handlerEmbed(captchaObj)
                            }
                        )

                        $('#geePhoneCaptchaWrap').show()
                        vm.geeFlag = false
                        vm.hasGee = true
                    },
                    err => {
                        console.log(err)
                        vm.geeFlag = false
                        vm.hasGee = true
                    }
                )
        },
        handlerEmbed (captchaObj) {
            let vm = this

            // 将验证码加到id为captcha的元素里
            captchaObj.appendTo('#geePhoneCaptcha')
            captchaObj.onReady(function () {
                $('.wait_gee_captcha').hide()
            })
            captchaObj.onSuccess(function () {
                $('#geePhoneCaptchaWrap').hide()
                // 发送验证码
                vm.sendAuthCode()
            })

            vm.captchaObj = captchaObj
        },
        getPlatformType () {
            if (/android/i.test(navigator.userAgent)) {
                return 'android'
            } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                return 'ios'
            }
        },
        sendAuthCode () {
            common.showLoading()

            let validate = this.captchaObj.getValidate()
            axios
                .get('/user/getMobileVCode', {
                    params: {
                        mobile: this.tel,
                        isRegister: true,
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode,
                        oid: this.uploadInfo.oid
                    }
                })
                .then(
                    res => {
                        common.hideLoading()

                        res = res.data
                        if (res.errno === 0) {
                            this.getingVcode = true
                            // 开始倒计时
                            this.startCountDown()
                        } else if (res.errno === 1104) {
                            // 已加入工会,直接进入下载页
                            router.push('/bindResult')
                        } else if (res.errno === 1102) {
                            var that = this
                            // 已注册 弹窗提示
                            layer.open({
                                content: '手机号已存在，无法加入',
                                btn: '下载APP',
                                yes: function () {
                                    let type = that.getPlatformType()
                                    if (type === 'ios') {
                                        location.href = 'http://m.tuho.tv/dist/download/iosSign.html?v=5.2.0'
                                    } else if (type === 'android') {
                                        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tuhao.kuaishou'
                                    }
                                }
                            })
                        } else if (res.errno === 1105) {
                            // 验证失败重新初始化验证码
                            this.hasGee = false
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    err => {
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

            if (!this.tel || this.tel === '') {
                layer.open({
                    content: '请先正确填写手机号',
                    skin: 'msg',
                    time: 3
                })
                return
            }
            if (!this.authCode || this.authCode === '') {
                layer.open({
                    content: '请先获取验证码',
                    skin: 'msg',
                    time: 3
                })
                return
            }
            this.nextClickFlag = false

            common.showLoading()

            axios
                .get('/user/isVcodeCurrect', {
                    params: {
                        mobile: this.tel,
                        vcode: this.authCode
                    }
                })
                .then(
                    res => {
                        this.nextClickFlag = true
                        common.hideLoading()
                        res = res.data

                        if (res.errno === 0) {
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
                    err => {
                        this.nextClickFlag = true
                        console.log(err)
                    }
                )
        },
        nextStep () {
            router.push('/setProfile')
        }
    }
}
</script>
