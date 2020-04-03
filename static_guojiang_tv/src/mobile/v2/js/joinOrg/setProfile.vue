<template>
  <section class="s_2">
    <div class="input_wrap">
      <label for="nickname"><i class="nickname_icon"/></label>
      <input
        id="nickname"
        v-model.trim="nickname"
        type="text"
        name="nickname"
        placeholder="请输入2-10个字昵称">
    </div>
    <div class="input_wrap">
      <label for="password"><i class="password_icon"/></label>
      <input
        id="password"
        v-model.trim="password"
        type="password"
        name="password"
        placeholder="请输入6-16位密码">
    </div>
    <div class="input_wrap">
      <label for="sex"><i class="sex_icon"/></label>
      <input
        type="radio"
        class="sex"
        name="sex"
        value="1"
        @click="showSexHint">男
      <input
        type="radio"
        class="sex"
        name="sex"
        value="2"
        @click="showSexHint">女
      <P class="err_hint"/>
    </div>

    <button
      class="sp_next_btn btn"
      @click="verifyInfo()">
      完成
    </button>
  </section>
</template>

<script type="text/javascript">
import $ from 'webpack-zepto'
import common from 'common'
import axios from 'axios'

import rsaObj from 'rsa'
let rsa = new (rsaObj.RSA)()

let data = {
    nickname: '',
    password: '',
    oid: 0,
    sex: 0,
    flag: true
}
export default {
    props: ['info'],
    data: function () {
        return data
    },
    created () {
        this.oid = this.$route.query.id
    },
    methods: {
        showSexHint () {
            layer.open({
                content: '性别提交后无法再次修改',
                btn: ['确定'],
                skin: 'sex_hint'
            })
        },
        verifyInfo () {
            // 防止连续多次点击
            if (!this.flag) return

            let verifyResult = this.verifySubmitInfo()
            if (!verifyResult) return

            this.flag = false

            common.showLoading()
            // 加密密码
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
        	rsa.setPublicKey(key)
            let encryptPassword = rsa.encrypt(this.password)

            axios.get('/user/mobileRegister', {
                params: {
                    vcode: this.info.authCode,
                    nickname: this.nickname,
                    sex: this.sex,
                    password: encryptPassword,
                    oid: this.oid
                }
            })
                .then(
                    (res) => {
                        this.flag = true
                        common.hideLoading()
                        res = res.data

                        if (res.errno == 0) {
                            this.showResult()
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 2
                            })
                        }
                    }
                )
        },
        verifySubmitInfo () {
            this.nickname = $('#nickname').val()
            this.password = $('#password').val()
            this.sex = $('input[name="sex"]:checked').val()

            if (!this.nickname || this.nickname == '') {
                layer.open({
                    content: '请设置昵称',
                    skin: 'msg',
                    time: 3
                })
                $('#nickname').focus()
                return false
            }

            if (!this.password || this.password == '') {
                layer.open({
                    content: '请设置密码',
                    skin: 'msg',
                    time: 3
                })
                $('#password').focus()
                return false
            }

            if (!this.sex || this.sex == '') {
                layer.open({
                    content: '请设置性别',
                    skin: 'msg',
                    time: 3
                })
                return false
            }

            if (this.nickname.length < 2 || this.nickname.length > 10) {
	            layer.open({
                    content: '请输入2-10个字昵称',
                    skin: 'msg',
                    time: 3
                })
                $('#nickname').focus()
                return false
	        }
	        if (this.password.length < 6 || this.password.length > 16) {
	            layer.open({
                    content: '请输入6-16位密码',
                    skin: 'msg',
                    time: 3
                })
                $('#password').focus()
                return false
	        }

	        return true
        },
        showResult () {
            router.push('/bindResult')
        }
    }
}
</script>
