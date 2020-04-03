<template>
  <article class="wf_wrap">
    <div class="avatar_wrap">
      <img :src="info.avatar">
    </div>
    <h4 class="nickname">{{ info.nickname }}</h4>

    <div class="detail">
      <P>提现金额（元）：<span>{{ info.remainRedPacket | numFormat }}</span></P>
      <P>税后可提现金额（元）：<span>{{ info.afterRate }}</span></P>
    </div>
    <small>按照国家税务局规定，本次提现需缴纳20%个人所得税</small>

    <button
      class="btn"
      @click="goWithdraw()">提现</button>

    <div class="hint_wrap">
      <h5>温馨提醒</h5>
      <p>1、工作人员次日审核提现（周末节假日顺延），请耐心等待!</p>
      <p>2、审核后，系统0~24小时给您发送红包。</p>
      <p>3、红包72小时过期，请及时领取哦！</p>
    </div>
  </article>
</template>

<script type="text/javascript">
import axios from 'axios'
import common from 'common'

export default {
    filters: {
        numFormat (val) {
            return new Number(val).toFixed(2)
        }
    },
    props: ['info'],
    methods: {
        goWithdraw () {
            common.showLoading()

            axios.get('/invite/apply')
                .then(
                    (res) => {
                        common.hideLoading()

                        let data = res.data
                        if (data.errno != 0) {
	                    layer.open({
	                        content: data.msg,
	                        skin: 'msg',
	                        time: 3
	                    })
	                } else {
	                    router.push('/withdrawResult')
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
        }
    }
}
</script>
