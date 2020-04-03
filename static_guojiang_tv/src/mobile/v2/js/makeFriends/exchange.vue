<template>
  <section class="s_1">
    <div class="header">
      <ul class="clearfix">
        <li>
          <p>可兑换余额（金豆）</p>
          <p class="max_exchange_money">{{ maxExchange }}</p>
          <span class="line"/>
        </li>
        <li>
          <p>当前金币</p>
          <p class="my_coin">{{ mfCoin }}</p>
        </li>
      </ul>
    </div>

    <ul class="exchange_ul">
      <li
        v-for="(item,index) in exchangeList"
        :key="index"
        @click="exchange(item.bean,item.coin)">
        <div class="li_wrap">
          <span class="p_icon"/>
          <span class="p_num">{{ item.coin }}金币</span>
          <button class="buy">{{ item.bean }}金豆</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import layer from 'layer'
export default {
    data () {
        return {
            maxExchange: 0, // 可兑换余额
            mfCoin: 0, // 当前金币
            exchangeList: []
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.axios.get('/income/getSocialExchangeList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.maxExchange = data.data.info.mfBean
                        this.mfCoin = data.data.info.mfCoin
                        this.exchangeList = data.data.exchangeList
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
        exchange (bean, coin) {
            let that = this

            if (bean > this.maxExchange) {
                layer.open({
                    content: '金豆不足哦，快去赚取足够的金豆吧',
                    time: 3
                })
                return
            }

            layer.open({
                content: '确定要兑换' + coin + '金币？',
                btn: ['确定', '取消'],
                yes: function (e) {
                    layer.close(e)
                    that.exchangeMoney(bean, coin)
                },
                no: function (e) {
                    layer.close(e)
                }
            })
        },
        exchangeMoney (bean, coin) {
            coin = coin.replace(',', '')
            this.axios.get('/income/goSocialExchange', {
                params: {
                    exchMoney: bean
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        const temp = (this.maxExchange * 100 - bean * 100) / 100 // 消除浮点数运算不准确
                        this.maxExchange = (temp).toFixed(2)
                        this.mfCoin = parseInt(this.mfCoin) + parseInt(coin)
                        layer.open({
                            content: '兑换成功',
                            time: 3
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
        }
    }
}
</script>>
