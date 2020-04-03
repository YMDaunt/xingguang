<template>
  <section>
    <ul class="nav_li clearfix">
      <li
        :class="[showWithdraw?'active':'']"
        @click="changeTab">提现记录</li>
      <li
        :class="[showWithdraw?'':'active']"
        @click="changeTab">兑换记录</li>
    </ul>
    <div
      class="withdraw-list"
      v-show="showWithdraw">
      <div class="total">
        <p class="wl_title">累计提现（元）</p>
        <p class="wl_num">{{ totalWithdraw }}</p>
      </div>
      <ul class="wl_content history">
        <li
          v-for="(item,index) in withdrawHistoryList"
          :key="index">
          <a
          @click="goRouter(item)">
            <p class="clearfix">
                <span class="fl">单次提现</span>
                <span class="fr">{{ item.money }}</span>
            </p>
            <p class="clearfix">
                <span class="fl">{{ item.add_time }}</span>
                <span class="fr">{{ item.status|statusMsg }}</span>
            </p>
          </a>
        </li>
      </ul>
      <p
        class="click_load_more wdl_more"
        @click="getWithdrawHistory">
        <span>{{ getMoreWithdrawTips }}</span>
      </p>
    </div>
    <div
      class="exchange-list"
      v-show="!showWithdraw">
      <div class="total">
        <p class="wl_title">累计兑换（金币）</p>
        <p class="wl_num">{{ totalExchange }}</p>
      </div>
      <ul class="wl_content history">
        <li
          v-for="(item,index) in exchHistoryList"
          :key="index">
          <p class="clearfix">                                                 <span class="fl">兑换金币</span>                                   <span class="fr">{{ item.coin }}</span>                          </p>
          <p class="clearfix">                                                 <span class="fl">{{ item.addTime }}</span>                        <span class="fr"/>
          </p>
        </li>
      </ul>
      <p
        class="click_load_more wdl_more"
        @click="getExchangeHistory">
        <span>{{ getMoreExchangeTips }}</span>
      </p>
    </div>
  </section>
</template>

<script>
import layer from 'layer'
import {goWebviewUrl,getPlatformType} from 'common'
export default {
    filters:{
        statusMsg:function(value){
            switch (value) {
                case '0':
                    return '处理中'
                case '1':
                    return ''
                case '2':
                    return '申请被驳回'
                case '3':
                    return '失败'
            }
        }
    },
    data () {
        return {
            showWithdraw: true, // true 展示提现记录 false 展示兑换记录
            totalExchange: 0,
            currentExchangePage: 0,
            getMoreWithdrawTips: '点击加载更多',
            requestExchangeLock: false,
            exchHistoryList: [],
            totalWithdraw: 0,
            currentWithdrawPage: 0,
            getMoreExchangeTips: '点击加载更多',
            requestWithdrawLock: false,
            withdrawHistoryList: []
        }
    },
    created () {
        this.getWithdrawHistory()
    },
    methods: {
        changeTab () {
            this.showWithdraw = !this.showWithdraw
            if (!this.showWithdraw) {
                this.getExchangeHistory()
            }
        },
        goRouter (item) {
            if(getPlatformType() === 'ios_webview'){
                location.href=`https://${location.host}/dist/makeFriends/index.html#/withdrawDetail/` + JSON.stringify(item)
                return false
            }
            try {
                goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/withdrawDetail/` + JSON.stringify(item))
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        },
        getExchangeHistory () {
            this.axios.get('/income/getExchangeList', {
                params: {
                    page: this.currentExchangePage,
                    type: 2
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        if (data.data.exchangeTotal) {
                            this.totalExchange = data.data.exchangeTotal
                        }
                        this.exchHistoryList = this.exchHistoryList.concat(data.data.list)
                        this.currentExchangePage++
                    } else if (data.errno === 102) {
                        this.getMoreExchangeTips = '偶是有底线滴~'
                        this.requestExchangeLock = true
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
        getWithdrawHistory () {
            this.axios.get('/income/getMoreWdList', {
                params: {
                    page: this.currentWithdrawPage,
                    type: 2
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        if (data.data.checkoutTotal) {
                            this.totalWithdraw = data.data.checkoutTotal
                        }
                        this.withdrawHistoryList = this.withdrawHistoryList.concat(data.data.wdList)
                        this.currentWithdrawPage++
                    } else if (data.errno === 102) {
                        this.getMoreWithdrawTips = '偶是有底线滴~'
                        this.requestWithdrawLock = true
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
