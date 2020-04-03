<template>
  <div class="manual-module">
    <div class="header-block">
      <div
        class="btn btn-back"
        @click="goBack">后退</div>
      <div class="title">title</div>
    </div>
    <div class="introduce-container">
      <div class="item">1，本玩法可合成各种限定礼物，您可根据自己的需要选择炼化的礼物。</div>
      <div class="pic">说明图片</div>
      <div class="item">2，根据选定的礼物不同，所需要的炼金材料不同；礼物炼化存在机率，炼金材料的投入数量将影响合成的成功率，投入材料越多成功机率越高，当成功率为100%时，合成将必定成功。</div>
      <div class="item">3，每次合成成功后，将消耗掉投入的炼金材料及礼物；如合成失败，仅消耗投入的炼金材料，投入的各项礼物将返还。</div>
      <div class="item">4，其中的炼金材料，将通过在直播间内送出指定礼物随机爆出，或通过活动等途径产出。该道具不可赠送，仅为本玩法专属使用。</div>
      <div class="item">5，每次合成成功后，用户将获得合成后的礼物。</div>
      <div class="item">6，在线有奖的倒计时和领取次数将会于每日0时起重新计算。</div>
    </div>
  </div>
</template>
<script>
export default {
    methods: {
        goBack () {
            this.$router.push({
                name: 'home',
                params: {removeLoading: 1}
            })
        }
    }
}
</script>>
<style lang="less">
  @bf: 108rem;
  .manual-module {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header-block {
      height: 100/@bf;
      position: relative;
      .btn-back {
        width: 57/@bf;
        height: 54/@bf;
        background: url("../../../img/game/syngift/back.png") no-repeat center / 100%;
        font-size: 0;
        position: absolute;
        left: 20/@bf;
        top: 15/@bf;
      }
      .title {
        width: 513/@bf;
        height: 77/@bf;
        background: url("../../../img/game/syngift/title-manual.png") no-repeat top / 100% 100%;
        font-size: 0;
        margin: 0 auto;
      }
    }
    .introduce-container {
      height: 800/@bf;
      padding: 0 25/@bf 25/@bf;
      overflow-y: auto;
      .item {
        color: #fcd49a;
        font-size: 32/@bf;
        line-height: 54/@bf;
      }
      .pic {
        width: 802/@bf;
        height: 529/@bf;
        background: url("../../../img/game/syngift/manual-pic.png") no-repeat top / 100%;
        font-size: 0;
        margin: 20/@bf auto;
      }
    }
  }
</style>
