<template>
  <section class="wflg">

    <div class="wr_logo"/>

    <p class="wr_p1">提现申请已经提交，将在N+1个工作日审核发放</p>
    <p class="wr_p1">（节假日顺延），请到支付宝查收</p>
    <P class="wr_p2">申请提现金额</P>

    <p class="wr_num">￥{{ money }}</span></p>

    <a
      class="wr_submit"
      @click="goRouter">完成</a>

    <p
      class="wr_p3"
      style="padding-top: 8px;">注意：每个自然月最大发放额度为19.6W元人民币，<br>单笔申请不可超过9.8w元人民币</p>
  </section>
</template>

<script>
import {goWebviewUrl} from 'common'
export default {
    data () {
        return {
            money: 0
        }
    },
    created () {
        this.money = this.$route.query.money
    },
    methods: {
        goRouter () {
            try {
                goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/`)
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        }
    }

}
</script>>
