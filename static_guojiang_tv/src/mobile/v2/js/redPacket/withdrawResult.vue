<template>
  <article>
    <img
      src="../../img/redPacket/success.png"
      class="wr_logo" >

    <p class="wr_p1">提现申请已经提交，请到微信查收</p>
    <P class="wr_p2">提现至微信账号：<span>{{ info.wxName }}</span></P>

    <p class="wr_num">￥<span>{{ info.afterRate }}</span></p>

    <a
      class="wr_submit"
      href="javascript:;"
      @click="goHome()">完成</a>

    <p class="wr_p3">预计24小时内到帐</p>
  </article>
</template>

<style lang="less" scoped>
	@bf:108rem;

	.wr_logo{width:210/@bf;height:210/@bf;margin:150/@bf auto 50/@bf;display:block;}
	.wr_p1{font-size:14px;color:#666666;text-align: center;}
	.wr_p2{font-size:14px;color:#b4b4b4;text-align: center;padding:20/@bf 0 40/@bf;
	span{color:#333;}
	}
	.wr_num{font-size:20px;color:#da500e;text-align: center;}
	.wr_submit{font-size:16px;color:#ffffff;width:750/@bf;padding:40/@bf 0;text-align: center;background:#da500e;border-radius:30px;margin:90/@bf auto 25/@bf;display:block;
		&:active{background:#a63d0b;color:#c2c2c2;}
	}
	.wr_p3{font-size:12px;color:#b4b4b4;text-align: center;}
</style>

<script type="text/javascript">
export default {
    props: ['info'],
    methods: {
        goHome () {
            router.push('/')
        }
    }
}
</script>
