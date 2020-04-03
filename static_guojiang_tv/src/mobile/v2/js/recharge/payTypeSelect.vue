<template>
  <div class="pay_bottom_layer">
    <span
      class="mask"
      @click="closePayType()"/>
    <div class="pb_content">
      <h3>请选择充值方式<span @click="closePayType()"><i/></span></h3>
      <ul>
        <li
          class="clearfix"
          data-type="alipay"
          @click="aliPay()">
          <span class="alipay_icon fl"/>
          <span class="arrow fr"/>
        </li>
        <li
          class="clearfix"
          data-type="wechat"
          @click="wxPay()">
          <span class="wechat_icon fl"/>
          <span class="arrow fr"/>
        </li>
        <!-- <li class="clearfix" data-type="un">
                    <span class="un_icon fl"></span>
                    <span class="arrow fr"></span>
                </li>
                <li class="clearfix" data-type="tmail">
                    <span class="tmail_icon fl"></span>
                    <span class="arrow fr"></span>
                </li> -->
      </ul>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
    props: ['money'],
    data: function () {
        return {

        }
    },
    methods: {
        closePayType () {
            this.$emit('closelayer')
        },

        wxPay () {
            try {
                console.log('order money is:', this.money)
                gBridge.wUGF5WithPrivateMsg(this.money)
            } catch (e) {
                alert(e.name + ': ' + e.message)
            }
        },

        aliPay () {
            try {
                console.log('order:', this.money)
                gBridge.aUGF5WithPrivateMsg(this.money)
            } catch (e) {
                alert(e.name + ': ' + e.message)
            }
        }
    }
}
</script>

<style type="text/css" lang="less" scoped>
@bf: 108rem;
.bg{background: url(../../img/recharge/pay_type_all.png) no-repeat;background-size: 583/@bf 220/@bf;}
.pay_bottom_layer{
    position: fixed;top:0;bottom: 0;left:0;right: 0;
    .mask{background: rgba(0,0,0,0.6);width: 100%;height: 100%;position: absolute;top:0;left:0;}
    h3{font-size: 14px;color:#666666;height: 140/@bf;line-height: 140/@bf;background: #f2f2f2;position: relative;padding-left: 60/@bf;
        span{
            width: 140/@bf;height: 140/@bf;position: absolute;top:0;right:0;
            &:active{background:rgba(218, 218, 218, 0.59);}
        }
        i{.bg;background-position:  -43/@bf 0;width: 44/@bf;height: 44/@bf;display: inline-block;position: absolute;top:47/@bf;right:47/@bf;
        }
    }
    .pb_content{position: absolute;bottom: 0;left:0;       width: 100%; }
    ul{
        li{
            height: 160/@bf;line-height: 160/@bf;padding: 0 60/@bf;background: #ffffff;border-bottom: 1px solid #e6e6e6;
            &:nth-last-child(1){border-bottom: none;}
            &:active{background: #ebebeb;}
            span{display: inline-block;    top: 31%;position: relative;}
            .alipay_icon{.bg;background-position:-1/@bf -63/@bf;width: 247/@bf;height: 69/@bf;}
            .wechat_icon{.bg;background-position:  -289/@bf -63/@bf;width: 293/@bf;height: 68/@bf;}
            .un_icon{.bg;background-position:-243/@bf 0;width: 339/@bf;height: 47/@bf}
            .tmail_icon{.bg;background-position: -288/@bf -151/@bf;width: 294/@bf;height: 69/@bf;}
            .qq_icon{.bg;background-position:0 -152/@bf;width: 268/@bf;height: 68/@bf;}
            .arrow{.bg;background-position:-1/@bf 0;width: 24/@bf;height: 47/@bf;top:36%}
            .recommend{font-size: 11px;color:#fff;background: #e80000;border-radius: 10/@bf;padding:7/@bf 12/@bf;font-style: normal;    line-height: 1;top: 38%;position: relative;left: 24/@bf;}
        }
    }
}

</style>
