<template>
  <div class="history-module">
    <div class="header-block">
      <div
        class="btn btn-back"
        @click="goBack">后退</div>
      <div class="title">title</div>
    </div>
    <div class="list-container">
      <div
        class="tip empty-tip"
        v-if="!historyList.length">还没有相关记录哦~</div>
      <div
        class="list"
        v-else>
        <div class="tip list-tip">仅显示三个月内的最近30条的炼化记录</div>
        <div class="table-con">
          <table>
            <tr>
              <td>炼化时间</td>
              <td>投入材料</td>
              <td>炼化结果</td>
              <td>获得礼物</td>
            </tr>
            <tr
              v-for="(item, index) in historyList"
              :key="index">
              <td>{{ item.time }}</td>
              <td>{{ item.material }}</td>
              <td>{{ item.result }}</td>
              <td>{{ item.gift }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import layer from 'layer'
export default {
    data () {
        return {
            historyList: []
        }
    },
    created () {
        this.getHistoryList()
    },
    methods: {
        getHistoryList () {
            this.axios.get('/giftCombine/history').then(res => {
                if (res.data.errno === 0) {
                    this.historyList = res.data.data
                } else {
                    layer.open({
                        content: res.data.msg,
                        time: 3
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        goBack () {
            this.$router.push({
                name: 'home',
                params: {removeLoading: 1}
            })
        }
    }
}
</script>

<style lang="less">
  @bf: 108rem;
  .history-module {
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
        background: url("../../../img/game/syngift/title-history.png") no-repeat top / 100% 100%;
        font-size: 0;
        margin: 0 auto;
      }
    }
    .list-container {
      // border: 1px solid yellow;
      height: 800/@bf;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .tip {
        color: #ced3e1;
        font-size: 32/@bf;
        text-align: center;
      }
      .empty-tip {
        margin-top: 250/@bf;
      }
      .list {
        .list-tip {
          padding: 0/@bf 0 20/@bf;
        }
        .table-con {
          padding: 0 25/@bf 20/@bf;
          // border: 1px solid yellow;
          table {
            width: 100%;
            border: 1px solid #fcd49a;
            border-collapse: collapse;
            tr {
              height: 80/@bf;
              td {
                color: #fcd49a;
                font-size: 32/@bf;
                border: 1px solid #fcd49a;
                background: rgba(0, 0, 0, 0.3);
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
</style>
