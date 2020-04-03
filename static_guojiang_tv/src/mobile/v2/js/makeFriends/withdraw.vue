<template>
  <section class="wflg">

    <div class="wd_input clearfix">
      <label
        for="wdLgNum"
        class="input_desc">提现金额（元）：</label>
      <input
        name="wd_lg_num"
        id="wdLgNum"
        type="number"
        placeholder="请输入提现金额"
        v-model="wdLgNum"
        autocomplete="off"
        v-focus>
      <em
        class="close input_close_icon hide"
        @click="clean('wdLgNum')"/>
    </div>

    <div class="wd_input clearfix">
      <label class="input_desc">支付宝账号：</label>
      <input
        name="wd_lg_alipay"
        id="wdLgAlipay"
        type="text"
        autocomplete="off"
        placeholder="请输入您本人的支付宝账号"
        v-model="alipayNumber"
        v-focus >
      <em
        class="close input_close_icon hide alipay_close_icon"
        @click="clean('alipayNumber')"/>
    </div>

    <div class="wd_input clearfix">
      <label class="input_desc">支付宝实名认证的姓名：</label>
      <input
        name="wd_lg_name"
        id="wdLgName"
        type="text"
        autocomplete="off"
        placeholder="请输入您本人的支付宝实名认证姓名"
        v-model="alipayName"
        v-focus >
      <em
        class="close input_close_icon hide"
        @click="clean('alipayName')"/>
    </div>

    <div class="wd_input clearfix">
      <label class="input_desc">身份证号：</label>
      <input
        name="wd_lg_idnum"
        id="wdLgIDNum"
        type="text"
        autocomplete="off"
        placeholder="请填写支付宝实名对应的身份证号"
        v-model="IDNumber"
        v-focus>
      <em
        class="close input_close_icon hide"
        @click="clean('IDNumber')"/>
    </div>

    <small>请确保填写的支付宝账号准确无误，若因您的填写失误导致的
    金钱损失问题，官方将不承担任何责任！</small>
    <button
      class="wd_submit wd_submit_lg"
      :disabled="!canSubmit"
      @click="submit">提交</button>

    <div class="wd_desc">
      <h2>温馨提醒</h2>
      <p>提交申请后，工作人员会在N+1个工作日内进行审核，如有疑问请联系客服</p>
    </div>
  </section>
</template>

<script>
import layer from 'layer'
import {goWebviewUrl} from 'common'
export default {
    directives: {
        focus: {
            bind (el, binding, vnode) {
                el.onfocus = () => {
                    el.nextElementSibling.className = 'close input_close_icon'
                }
                el.onblur = function () {
                    // 用异步是为了先触发close元素的点击事件
                    setTimeout(() => {
                        el.nextElementSibling.className = 'close input_close_icon hide'
                    }, 0)
                }
            }
        }

    },
    data () {
        return {
            wdLgNum: '', // 提现金额
            alipayNumber: '', // 支付宝账号
            alipayName: '', // 支付宝姓名
            IDNumber: '' // 身份证号
        }
    },
    computed: {
        canSubmit () {
            if (this.wdLgNum !== '' && this.alipayNumber !== '' && this.alipayName !== '' && this.IDNumber !== '') {
                return true
            } else {
                return false
            }
        }
    },
    created () {
        this.axios.get('/income/socialWithdrawFillLg')
            .then(res => {
                let data = res.data
                if (data.errno === 0) {
                    this.incomeRemaining = data.data.incomeRemaining
                    if (data.data.info) {
                        this.alipayNumber = data.data.info.account
                        this.alipayName = data.data.info.name
                        this.IDNumber = data.data.info.idCard
                    }
                } else {
                    layer.open({
                        content: data.msg,
                        time: 3
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    methods: {
        // 清除已填写的内容
        clean (type) {
            switch (type) {
            case 'wdLgNum':
                this.wdLgNum = ''
                break
            case 'alipayNumber':
                this.alipayNumber = ''
                break
            case 'alipayName':
                this.alipayName = ''
                break
            case 'IDNumber':
                this.IDNumber = ''
                break
            }
        },
        // 提交提现
        submit () {
            // 提现次数限制

            // 校验提现金额
            if (!/^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(this.wdLgNum) && this.wdLgNum !== '') {
                layer.open({
                    content: '提现金额应为数字，若有小数不应超过2位',
                    btn: ['确定'],
                    yes: function (e) {
                        layer.close(e)
                    }
                })
                return
            }
            // 校验身份证号
            if (this.IDNumber.length !== 18) {
                layer.open({
                    content: '身份证号码有误，请重新填写',
                    time: 3
                })
                return
            }
            // 可提现金额判断
            if (parseInt(this.wdLgNum) > parseInt(this.incomeRemaining)) {
                layer.open({
                    content: '本次最多可提现' + this.incomeRemaining + '元',
                    time: 3
                })
                return
            }
            this.withdrawTips(this.wdLgNum)
        },
        withdrawTips (wdLgNum) {
            let that = this
            this.axios({
                method: 'post',
                url: '/income/goCheck',
                data: 'money=' + wdLgNum
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        that.withdraw()
                    } else if (data.errno === 1490) {
                        layer.open({
                            content: data.msg,
                            btn: ['继续提现', '取消'],
                            no: function (e) {
                                layer.close(e)
                            },
                            yes: function () {
                                that.withdraw()
                            }
                        })
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        withdraw () {
            let that = this
            layer.open({
                content: '您填写的支付宝账号为：' + this.alipayNumber + ' 我们将把申请款项转账到此支付宝账号，确定要提交吗？',
                btn: ['确定', '取消'],
                no: function (e) {
                    layer.close(e)
                },
                yes: function (e) {
                    that.goWithdraw()
                    layer.close(e)
                }
            })
        },
        goWithdraw () {
            let that = this
            this.axios({
                method: 'post',
                url: '/income/goSocialWithdraw',
                data: 'wdLgNum=' + that.wdLgNum + '&wdLgName=' + that.alipayName + '&wdLgAlipay=' + that.alipayNumber + '&wdLgIDNum=' + that.IDNumber
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        try {
                            goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/withdrawResult?money=` + this.wdLgNum)
                        } catch (e) {
                            alert(e.name + ':' + e.message)
                        }
                    } else {
                        layer.open({
                            content: data.msg,
                            btn: ['确定']
                        })
                    }
                })
        }
    }
}
</script>
