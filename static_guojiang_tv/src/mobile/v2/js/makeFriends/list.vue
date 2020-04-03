<template>
  <section
    class="wl_content"
    v-if="noData">
    <div class="noList">
      <div class="img"/>
      <p>暂无账单记录</p>
    </div>
  </section>
  <section
    class="wl_content"
    v-else>
    <ul v-if="list.length>0">
      <li
        v-for="(item,index) in list"
        :key="index">
        <a
        @click="goRouter(item)">
          <p class="clearfix">
            <span
              class="fl message"
              v-if="item.to_uid">{{ item.action_message.slice(0,4) }}<em>{{ item.nickname }}</em>({{ item.to_uid }}){{ item.action_message.slice(4) }}</span>
            <span
              class="fl message"
              v-else>{{ item.action_message }}</span>
            <span
              class="fr"
              :class="item.action == 'add'?'add':''">{{ item.action == 'add'?'+':'-' }}{{ item.income_coin }}</span>
          </p>

          <p class="clearfix">
            <span class="fl">{{ item.add_time }}</span>
            <span class="fr"/>
          </p>
        </a>
      </li>
      <p
        class="click_load_more wdl_more"
        @click="getList"><span>{{ getMoreTips }}</span></p>
    </ul>
  </section>
</template>

<script>
import layer from 'layer'
import {goWebviewUrl,getPlatformType} from 'common'
export default {
    data () {
        return {
            currentPage: 0,
            getMoreTips: '点击加载更多',
            requestLock: false,
            noData: false,
            list: [] // 账单列表
        }
    },
    created () {
        this.getList()
    },
    methods: {
        goRouter (item) {
           if(getPlatformType() === 'ios_webview'){
                location.href=`https://${location.host}/dist/makeFriends/index.html#/listDetail/` + JSON.stringify(item)
                return false
            }
            try {
                goWebviewUrl(`https://${location.host}/dist/makeFriends/index.html#/listDetail/` + JSON.stringify(item))
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        },
        getList () {
            if (this.requestLock) return
            this.axios.get('/income/getIncomeList', {
                params: {
                    page: this.currentPage
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.list = this.list.concat(data.data.IcdList)
                        this.currentPage++
                    } else if (data.errno === 102) {
                        if (this.currentPage === 0) {
                            this.noData = true
                        } else {
                            this.getMoreTips = '偶是有底线滴~'
                        }
                        this.requestLock = true
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
