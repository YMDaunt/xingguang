<template>
  <section>
    <p class="ic_total">累计总收入（元）<span class="ic_all">{{ incomeTotal }}</span></p>
    <div class="ic_content">
      <p class="ic_title">可提现金额（元）</p>
      <P class="ic_remained">{{ canCashOut }}</P>
      <p class="ic_title">今日可提现金额（元）</p>
      <P class="ic_t_remained">{{ todayCanCashOut }}</P>
      <p
        class="go_exchange_pp"
        @click="goRouter('exchange')">兑换金币</p>
    </div>
    <div class="ic_func">
      <a
        class="ic_withdraw"
        @click="limitTimes">提现</a>
    </div>
    <p class="ic_hint">提交后将在N+1个工作日审核发放，节假日顺延</p>
    <p class="ic_hint">（例，若在周一提交申请，则将在周二审核发放）</p>
    <div class="withdraw_wrap">
      <div
        class="withdraw_s_nav withdraw_list"
        @click="goRouter('historyRecord')">历史记录</div>
      <div
        class="withdraw_s_nav withdraw_detail"
        @click="goRouter('list')">账单</div>
      <div
        class="withdraw_s_nav withdraw_info"
        @click="goRouter('withdrawInfo')">提现说明</div>
    </div>
  </section>
</template>

<script>
import layer from 'layer'
import {goWebviewUrl} from 'common'
export default {
    data () {
        return {
            incomeTotal: 0, // 累计总收益
            canCashOut: 0, // 可提现金额
            todayCanCashOut: 0, // 今日可提现金额
            timesLeft: 0 // 剩余提现次数
        }
    },
    created () {
        this.init()
    },
    methods: {
        goRouter (router) {
            switch (router) {
            case 'historyRecord':
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/historyRecord`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 'list':
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/list`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 'withdrawInfo':
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/withdrawInfo`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 'exchange':
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/exchange`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            }
        },
        init () {
            this.axios.get('/income/getSocialIncome')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.incomeTotal = data.data.moneyTotal
                        this.canCashOut = data.data.money
                        this.todayCanCashOut = data.data.moneyLeft
                        this.timesLeft = data.data.timesLeft
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
        limitTimes () {
            if (this.timesLeft > 0) {
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/withdraw`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
            } else {
                layer.open({
                    content: '提现次数不足，无法提现',
                    time: 3
                })
            }
        }
    }
}
</script>>
