<template>
  <div class="wl_content">
    <ul v-if="!items == ''">

      <li
        v-for="item in items"
        :class="item.type | getClass(item.status)">
        <div class="li_inner_wrap">
          <P class="clearfix">
            <span class="fl">{{ item.type | typeFormat }}</span>
            <span class="fr">
              {{ item.money | moneyFormat(item.type) }}
            </span>
          </P>

          <p class="clearfix">
            <span class="fl">{{ item.create_time | timeFormat }}</span>
            <span
              v-if="item.status == 1"
              class="fr">已过期</span>
          </p>
        </div>
      </li>

    </ul>

    <p
      v-if="isLoading"
      class="click_load_more wdl_more"><i/><span>正在加载...</span></p>

    <p
      v-if="isEnd"
      class="click_load_more wdl_more"><span>没有更多了哦 ㄒoㄒ~~</span></p>

    <p
      v-if="isEmpty"
      class="no_record_hint">还没有红包记录哦</p>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import layer from 'layer'
import common from 'common'

let vmData = {
    items: [],
    page: 1,
    isEmpty: false,
    isEnd: false,
    scrollFlag: true,
    isLoading: true
}

export default {

    filters: {
        getClass (type, status) {
            return type == 4 ? 'minusRp' : (status == 0 ? 'addRp' : '')
        },

        typeFormat (type) {
            if (type == 1) {
                return '直播间领取'
            } else if (type == 2) {
                return '邀请注册'
            } else if (type == 3) {
                return '受邀请分成'
            } else if (type == 4) {
                return '提现'
            }
        },

        moneyFormat (money, type) {
            let symbol = type == 4 ? '' : '+'
            return symbol + new Number(parseInt(money) / 100).toFixed(2) + '元'
        },

        timeFormat (time) {
            return common.formatDate(time)
        }
    },
    data: function () {
        return vmData
    },
    mounted () {
        this.$nextTick(() => {
            // 切换tap时会重新挂载，先把列表置为空
            this.items = []
            this.getItems()

            let win_H = window.screen.height

            let vm = this

            window.onscroll = function () {
                let scroll_T = document.documentElement.scrollTop || document.body.scrollTop

                let doc_H = document.documentElement.scrollHeight || document.body.scrollHeight

                let offset_B = doc_H - scroll_T - win_H

                if (offset_B < 30 && vmData.scrollFlag) {
                    vmData.page++
                    vmData.scrollFlag = false
                    vmData.isLoading = true

                    vm.getItems()
                }
            }
        })
    },

    methods: {
        getItems () {
            axios.get('/invite/record', {
                params: {
                    page: this.page,
                    size: 10
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        this.scrollFlag = true
                        this.isLoading = false

                        if (data.errno == 0) {
                            this.items = this.items.concat(data.data.list)
                            this.isEmpty = this.items.length == 0 && this.page == 1

                            if (data.data.list.length < 10 && data.data.list.length != 0) {
                                this.isEnd = true
                                this.scrollFlag = false
                            }
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
        }
    }
}
</script>

<style lang="less">
@bf:108rem;
body{background:#f6f1ea;}
.wl_content{
    ul{
    	background: #fff;
        li{padding-left:40/@bf;background: #fff;
           	.li_inner_wrap{display:block;border-bottom: 1px solid #e6e6e6;padding:40/@bf 35/@bf 35/@bf 0;}
        	&:nth-last-child(1) a{border-bottom: none;}
            p:nth-child(1){color:#333;font-size:13px;padding-bottom: 20/@bf;
            	span:nth-child(2){font-size: 16px;color:#da500e;}
            }
            p:nth-child(2){color:#999999;font-size:10px;
                span:nth-child(2){font-size: 10px;color:#958d8d;}
			}
            span.add{color:#da500e;}

            &.addRp{
            	p:nth-child(1) span:nth-child(2){position: relative;top:20/@bf;}
            }
            &.minusRp{
            	p:nth-child(1) span:nth-child(2){position: relative;top:20/@bf;color:#333333;}
            }
        }
    }
}
.no_record_hint{text-align: center;font-size:14px;color:#333;padding-top:150px;}
</style>
