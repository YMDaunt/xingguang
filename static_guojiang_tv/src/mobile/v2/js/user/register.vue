<!-- 注册组件 -->
<template>
  <section
    id="registerBox"
    class="minbox">
    <div
      v-show="!canNextStep"
      class="first-step-wrap">
      <div class="fp_input_wrap">
        <label class="label fl">
          <span class="phoneIcon"/>
          <input
            v-model.trim="phoneNum"
            class="phone"
            type="tel"
            placeholder="请输入手机号"
            name="phone"
            @keyup="changeBtnStatus">
        </label>
        <button
          :disabled="isCodeBtnDisabled"
          class="bind_get_auth_code get_auth_code"
          type="button"
          @click="getAuthCode">{{ authCodeHintText }}</button>
      </div>

      <div class="fp_input_wrap">
        <label class="label">
          <span class="vcodeIcon"/>
          <input
            v-model.trim="authCode"
            class="vcode"
            type="text"
            placeholder="请输入验证码"
            name="vcode"
            @keyup="changeBtnStatus">
        </label>
      </div>

      <div class="geeBox">
        <div
          id="geePhoneCaptchaWrap"
          class="hide">
          <div class="gee">
            <span class="wait_gee_captcha">正在获取验证码</span>
            <div id="geePhoneCaptcha"/>
          </div>
        </div>
      </div>

      <button
        :disabled="isSubmitDisabled"
        class="fp_phone_submit"
        @click="registerNextStep">提交</button>
    </div>
    <div
      v-show="canNextStep"
      class="second-step-wrap">
      <div class="input_w">
        <i class="user_icon"/>
        <input
          v-model.trim="nickname"
          type="text"
          placeholder="请输入2-10个字昵称"
          name="nickname"
          @keyup="changeRegisterBtnStatus">
      </div>
      <div class="input_w">
        <i class="password_icon"/>
        <input
          v-model.trim="password"
          type="password"
          placeholder="请输入6-16位密码"
          name="password"
          @keyup="changeRegisterBtnStatus">
      </div>
      <div class="input_w sex_wrap clearfix">
        <div class="sex_label">
          <input
            id="male"
            v-model="sex"
            name="sex"
            type="radio"
            value="1"
            @click="selectGender($event.target.value)"
          >
          <label for="male">男<em :class="{active:sex==1}"/></label>
        </div>
        <div class="sex_label">
          <input
            id="female"
            v-model="sex"
            name="sex"
            type="radio"
            value="2"
            @click="selectGender($event.target.value)"
          >
          <label for="female">女<em :class="{active:sex==2}"/></label>
        </div>
      </div>
      <button
        :disabled="isRegisterDisabled"
        class="fp_phone_submit"
        @click="registerSubmit">立刻认识她</button>
    </div>
  </section>
</template>

<script>
import layer from 'layer'
import common from 'common'
import axios from 'axios'
import Promise from 'promise-polyfill'
import _rsa from 'rsa'
const rsa = new (_rsa.RSA)()

export default {
    props: ['channel'],
    data () {
        return {
            gtFlag: true,
            packageId: 2,
            phoneNum: '',
            authCode: '',
            cding: false, // 是否在倒计时
            timer: null,
            isCodeBtnDisabled: true,
            isSubmitDisabled: true,
            authCodeHintText: '获取验证码',
            canNextStep: false, // 是否可以下一步
            nickname: '',
            password: '',
            sex: undefined,
            isRegistering: false, // 是否正在注册
            registerSucc: 0, // 注册成功为1
            isRegisterDisabled: true // 最后一步按钮
        }
    },
    mounted: function () {
        // this.$emit('register-succ',1);
    },
    methods: {
        async getAuthCode () {
            // 获取验证码
            let mobileNum = this.phoneNum

            if (mobileNum == '') {
                layer.open({
                    content: '请先填写手机号码',
                    skin: 'msg'
                })
                return
            } else {
                try {
                    await this.verifyMobileNum()
                } catch (e) {
                    layer.open({
                        content: e,
                        skin: 'msg',
                        time: 3
                    })
                    return
                }

                // 获取验证码之前要增加极验
                if (this.gtFlag) {
                    this.gtFlag = false
                    // 极验
                    common.gtValidate(this.sendVcode)
                }
            }

            // cnzz统计
            _czc.push(['_trackEvent', `H5注册页${this.channel}`, '获取验证码按钮'])
        },
        sendVcode () {
            let that = this
            that.authCodeHintText = '获取中'
            that.isCodeBtnDisabled = true

            axios.get('/user/getVCode', {
                params: {
                    mobile: that.phoneNum,
                    packageId: that.packageId
                }
            }).then((res) => {
                that.gtFlag = true
                res = typeof (res) === 'string' ? JSON.parse(res) : res
                let data = res.data
                if (data.errno == 0) {
                    // 成功之后就倒计时60s
                    let num = 60
                    let that = this
                    vcode_count_down()

                    function vcode_count_down () {
                        that.cding = true
                        if (num > 0) {
                            that.timer = setTimeout(vcode_count_down, 1000)
                            num--
                            that.authCodeHintText = num + '"'
                        } else {
                            that.authCodeHintText = '获取验证码'
                            that.isCodeBtnDisabled = false
                            that.cding = false
                        }
                    }
                } else {
                    layer.open({
                        content: data.data.errMsg,
                        skin: 'msg',
                        time: 3
                    })
                    that.authCodeHintText = '获取验证码'
                    that.isCodeBtnDisabled = false
                }
            },
            (err) => {
                layer.open({
                    content: err,
                    skin: 'msg',
                    time: 3
                })
            }
            )
        },
        registerNextStep () {
            // 提交验证码 进行下一步
            let that = this
            if (that.phoneNum == '') {
                layer.open({
                    content: '请先填写手机号',
                    time: 2
                })
                return
            }

            if (that.authCode == '') {
                layer.open({
                    content: '请输入验证码',
                    time: 2
                })
                return
            }

            axios.get('/user/CheckVCode', {
                params: {
                    mobile: that.phoneNum,
                    vcode: that.authCode
                }
            }).then((res) => {
                let data = res.data
                if (data.errno == 0) {
                    // 下一步
                    that.canNextStep = true
                } else {
                    layer.open({
                        content: data.data.errMsg,
                        time: 2
                    })
                }
            })

            // cnzz统计
            _czc.push(['_trackEvent', `H5注册页${this.channel}`, '下一步按钮'])
        },
        selectGender (sex) {
            if (sex) {
                this.sex = sex
                this.changeRegisterBtnStatus()
            }

            layer.open({
                content: '性別提交后无法修改',
                time: 2
            })
        },
        registerSubmit () {
            if (this.isRegistering) {
                return
            }

            if (this.nickname == '') {
                layer.open({content: '请输入2-10个字昵称', time: 2})
                return
            }
            if (this.password == '') {
                layer.open({content: '请输入6-16位密码', time: 2})
                return
            }
            if (this.sex == undefined) {
                layer.open({content: '请选择性别', time: 2})
                return
            }
            if (this.nickname.length < 2 || this.nickname.length > 10) {
                layer.open({content: '昵称长度不对', time: 2})
                return
            }
            if (this.password.length < 6 || this.password.length > 16) {
                layer.open({content: '密码长度不对', time: 2})
                return
            }
            var key = '-----BEGIN PUBLIC KEY-----\
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

            // 设置公钥
            rsa.setPublicKey(key)

            let that = this
            that.isRegistering = true
            common.showLoading()

            axios.get('/user/MobileRegisterNew', {
                params: {
                    mobile: that.phoneNum,
                    nickname: that.nickname,
                    password: rsa.encrypt(that.password),
                    sex: that.sex
                }
            }).then(res => {
                common.hideLoading()
                that.isRegistering = false

                let data = res.data
                let errCode = data.errno
                if (errCode == 0) {
                    console.log(data)
                    that.registerSucessCallback()
                } else {
                    layer.open({
                        shade: 0.6,
                        content: data.msg,
                        end: function () {
                            that.changeRegisterCallbackStatus()
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })

            // cnzz统计
            _czc.push(['_trackEvent', `H5注册页${this.channel}`, '完成按钮'])
        },
        registerSucessCallback () {
            let that = this
            clearInterval(that.timer)
            // 向父组件传成功信息
            that.$emit('register-succ', 1)

            layer.open({
                content: '注册成功',
                time: 2,
                end: function () {
                    that.changeRegisterCallbackStatus()
                }
            })
        },
        verifyMobileNum () {
            // 验证手机号
            let that = this
            return new Promise((resolve, reject) => {
                var tureTel = common.regExpTest(that.phoneNum, 'mobile')
                if (!tureTel.errno) {
                    reject('请正确填写手机号码')
                } else {
                    resolve()
                }
            })
        },
        changeRegisterCallbackStatus () {
            // 改变注册成功的状态
            let that = this

            that.canNextStep = false
            that.phoneNum = ''
            that.authCode = ''
            that.cding = false
            that.authCodeHintText = '获取验证码'

            that.nickname = ''
            that.password = ''
            that.sex = undefined

            that.changeBtnStatus()
            that.changeRegisterBtnStatus()
        },

        changeBtnStatus () {
            let phone = this.phoneNum

            let vcode = this.authCode

            if (phone != '' && !this.cding) {
                this.isCodeBtnDisabled = false
            } else {
                this.isCodeBtnDisabled = true
            }
            if (phone != '' && vcode != '') {
                this.isSubmitDisabled = false
            } else {
                this.isSubmitDisabled = true
            }
        },

        changeRegisterBtnStatus () {
            let nickname = this.nickname
            let password = this.password
            let sex = this.sex

            if (nickname != '' && password != '' && sex != undefined) {
                this.isRegisterDisabled = false
            } else {
                this.isRegisterDisabled = true
            }
        }
    }
}
</script>

<style type="text/css" lang="less" scoped>
@bf: 108rem;
.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
/* 清除浮动的方法 */
.clearfix {
    clear: both;
    display: block;
}
button:active{
    opacity:0.6
}
/*处理页面字体（采用rem 基于iPhone6去变换）*/
@leastSize:15px;/*12px*/
@minSize:40/@bf;/*14px*/
@midSize:46/@bf;/*16px*/
@midSize:51/@bf;/*18px*/
/*弹出框设置字体居中*/
.layermmain .layermcont{
    text-align: center;
}
/*gee验证的样式*/
.geeBox{
    width:1080/@bf;
}
#geePhoneCaptchaWrap{
    width:900/@bf;
    margin:auto;
}
.register_bg{
    background: url('../../img/user/register_bg.png') no-repeat 0 0;
    background-size: 188/@bf 133/@bf;
}
.minbox{
    position: relative;
    padding:20/@bf 0;
}
.fp_input_wrap{
    position: relative;
    width: 1008/@bf;
    margin: auto;
    margin-bottom: 42/@bf;
    height:114/@bf;
    .label{
        position: relative;
        height: 100%;
        display: block;
    }
}
.phoneIcon,.vcodeIcon{
    position: absolute;
    left: 38/@bf;
}

.phoneIcon{
    .register_bg;
    background-position:-13/@bf -12/@bf;
    top:36/@bf;
    left: 42/@bf;
    width: 0.3rem;
    height: 42/@bf;
}
.vcodeIcon{
    .register_bg;
    background-position:-67/@bf -16/@bf;
    top:40/@bf;
    width: 44/@bf;
    height: 44/@bf;
}
.fp_input_wrap input{
    height: 100%;
    padding: 0;
    padding-left: 96/@bf;
    //background: rgba(255,255,255,0.2);
    border-radius: 10/@bf;
    font-size:@leastSize;
    color:#959595;
    border:1px solid #e3e3e3;
}
.fp_input_wrap input.phone{
    width: 716/@bf;
}
.get_auth_code{
    border: none;
    float: right;
    width: 270/@bf;
    height: 110/@bf;
    color:#fff;
    font-size:@minSize;
    border-radius: 10/@bf;
    background: #ff0071;
    &[disabled="disabled"]{background: #e3e3e3;color:#959595;}
}
.fp_input_wrap input.vcode{
    width: 1008/@bf;
}

/*提交按钮*/
.fp_phone_submit{
    border: none;
    width: 1008/@bf;
    height: 114/@bf;
    line-height: 114/@bf;
    text-align: center;
    margin: 0 auto;
    display: block;
    border-radius: 10/@bf;
    background: url('../../img/user/bottom_bg.png') no-repeat 0 0;
    background-size: 100% 100%;
    font-size: @midSize;
    color:#fff;
    &[disabled="disabled"]{background: #e3e3e3;color:#959595;}
}

//填写密码
.second-step-wrap{
    width: 1008/@bf;
    margin:0 auto;
    .input_w{
      position: relative;
      width: 100%;
      height:114/@bf;
      margin: auto;
      margin-bottom: 42/@bf;
    }
    .user_icon{
        .register_bg;
        background-position:-5/@bf -83/@bf;
        position: absolute;
        top:0.3rem;
        left: 0.4rem;
        width: 40/@bf;
        height: 40/@bf;
    }
    .password_icon{
        .register_bg;
        background-position:-67/@bf -82/@bf;
        position: absolute;
        top:0.35rem;
        left: 0.4rem;
        width: 36/@bf;
        height: 40/@bf;
    }
    input{
        height: 100%;
        width: 1008/@bf;
        padding: 0;
        padding-left: 96/@bf;
        //background: rgba(255,255,255,0.2);
        border-radius: 10/@bf;
        font-size:@leastSize;
        color:#959595;
        border:1px solid #e3e3e3;
    }

    .sex_wrap{
        margin-bottom: 0;
        .sex_label{
            position:relative;left:260/@bf;float:left;margin-right: 150/@bf;
            input{width:10px;    padding: 0;}
            label{margin-left:30/@bf;top:0px;color:#959595;font-size: 16px;}
            em{
                width:45/@bf;
                height:45/@bf;
                border-radius: 50%;
                background:#fff;
                position:absolute;
                top:3px;
                left:0px;
                border:1px solid #a6a6a6;
            }
            em.active{
                .register_bg;
                background-position:-129/@bf -85/@bf;
                width: 45/@bf;
                height: 45/@bf;
                border: none;
            }
        }
    }
}

</style>
