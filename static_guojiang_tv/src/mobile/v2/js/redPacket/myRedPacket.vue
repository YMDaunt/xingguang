<template>
  <article>
    <div class="rp_content">
      <img
        src="../../img/redPacket/icon.png"
        class="rp_icon">
      <p>官方红包</p>
      <P>余额（元）</P>
      <p
        v-cloak
        class="rp_remain">{{ info.total }}</p>

      <button
        class="btn"
        @click="readyGoWithdraw()">微信提现</button>
    </div>

    <router-link
      to="/record"
      class="rp_record">红包记录</router-link>
  </article>
</template>

<script type="text/javascript">
import axios from 'axios'
import common from 'common'
import layer from 'layer'

export default {
    props: ['info'],
    data: function () {
        return {
            auStatus: '',
            isBindWx: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            axios.get('/invite/income')
                .then(
                    (res) => {
                        let data = res.data
                        console.log('data:', data)

                        if (data.errno == 0) {
                            // 初始化数据
                            this.info.remainRedPacket = new Number(parseInt(data.data.redPackage.income) / 100).toFixed(2)
                            this.info.afterRate = new Number(parseInt(data.data.redPackage.afterRate) / 100).toFixed(2)
                            this.info.total = new Number(parseInt(data.data.redPackage.total) / 100).toFixed(2)
                            this.info.avatar = data.data.uInfo.head_pic_1
                            this.info.nickname = data.data.uInfo.nickname
                            this.info.wxName = data.data.wxAccount['nickname']

                            this.auStatus = data.data.auStatus
                            this.isBindWx = data.data.isBindWx
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
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
        })
    },
    methods: {
        readyGoWithdraw () {
            if (this.auStatus == -1) {
                // 未身份认证
            	location.href = '/income/authentication'
            } else if (this.auStatus == 1) {
                // 身份认证通过。检查是否绑定微信
                if (this.isBindWx == 'authed') {
                    if (parseInt(this.info.remainRedPacket) < 50) {
                        layer.open({
                            content: '红包达到50元才可以提现哦',
                            skin: 'msg',
                            time: 3
                        })
                    } else {
                    	router.push('/withdrawFill')
                    }
                } else if (this.isBindWx == 'block') {
                    layer.open({
                        content: '该账号已绑定过公众号',
                        skin: 'msg',
                        time: 3
                    })
                } else {
                    location.href = '/income/bind'
                }
            } else {
	            // 返回身份认证结果：拒绝or待审核
	            location.href = '/income/auResult?status=' + this.auStatus
	        }
        }
    }
}
</script>
