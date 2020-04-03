<template>
  <div class="rank">
    <div class="title"/>
    <ul class="tab">
      <li
        v-for="(item,index) in tab"
        :class="{active:selected==index}"
        @click="exchangeTab(index)">{{ item }}</li>
    </ul>
    <div class="tab-content box-corner">
      <div class="corner bottom"/>
      <div class="corner left"/>
      <div class="content">
        <ul class="tab-content-title">
          <li
            v-if="selected<2"
            class="title-1">名次</li>
          <li
            v-else
            class="title-1">&nbsp;&nbsp;</li>
          <li class="title-2">昵称</li>
          <li
            class="title-3"
            style="position: relative;left:8px;">{{ playNum }}</li>
          <li class="title-4">{{ blood }}</li>
        </ul>
        <ul
          ref="scrollDom"
          class="rank-list"
          @scroll="scrollLoad()">
          <li v-for="(item,index) in rankList">
            <div
              v-if="selected<2"
              :class="['index-'+index]"
              class="index">{{ index+1 }}</div>
            <div
              v-else
              class="index"/>
            <div class="avatar-wrap">
              <div
                v-if="selected == 1 && item.is_playing == 1"
                class="live">LIVE</div>
              <div class="avatar-box">
                <img
                  v-if="selected == 1"
                  :src="item.head_pic_1"
                  class="avatar"
                  @click="inlive(item.rid)">
                <img
                  v-else
                  :src="item.head_pic_1"
                  class="avatar">
              </div>
            </div>
            <div class="nickname">{{ item.nickname }}</div>
            <div
              v-if="selected == 2"
              class="play-times">{{ item.beastName }}</div>
            <div
              v-else
              class="play-times">{{ item.attendNum }}</div>
            <div
              v-if="selected == 2"
              class="blood">{{ item.lastAttackBlood }}</div>
            <div
              v-else
              class="blood">{{ item.num }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import common from 'common'
export default {
    data () {
        return {
            selected: 0, // 当前选中的tab
            tab: ['击打榜', '主播榜', '最后一击榜'],
            currentPage: 1, // 当前页数
            playNum: '总参与场次',
            blood: '总击杀血量',
            rankList: [], // 当前列表数据
            hRanks: [], // 击打排行榜
            mRanks: [], // 主播排行榜
            uRanks: [], // 用户排行榜
            scrollLock: false
        }
    },

    created: function () {
        this.getRank(1, 'user')
        this.getRank(1, 'mod')
        this.getRank(1, 'hit')
    },
    mounted: function () {
        this.whichRank(this.selected)
    },
    methods: {
        // tab切换
        exchangeTab (index) {
            this.selected = index
            this.currentPage = 1
            this.$refs.scrollDom.scrollTop = 0
            this.scrollLock = false
            this.whichRank(index)
        },
        // 给相应的榜单填充数据
        whichRank (index) {
            switch (index) {
            case 0:
                this.playNum = '总参与场次'
                this.blood = '总击杀血量'
                this.rankList = this.uRanks
                break
            case 1:
                this.playNum = '场次'
                this.blood = '获得击杀奖励'
                this.rankList = this.mRanks
                break
            case 2:
                this.playNum = '场次'
                this.blood = '最后一击血量'
                this.rankList = this.hRanks
                break
            }
        },
        // 获取榜单数据
        getRank (Page, Type) {
            this.axios.get('/boss/getBossRank', {
                params: {
                    page: Page, // 当前第几页 1开头
                    pageSize: 20, // 每页多少条记录
                    type: Type // mod主播 user用户 hit击打榜
                }
            })
                .then(res => {
                    let data = res.data.data
                    if (data.data.length > 0) {
                        switch (Type) {
                        case 'user':
                            // console.log('击打榜',data.data);
                            this.uRanks = this.uRanks.concat(data.data)
                            break
                        case 'mod':
                            // console.log('主播榜',data.data);
                            this.mRanks = this.mRanks.concat(data.data)
                            break
                        case 'hit':
                            // console.log('用户榜',data.data);
                            this.hRanks = this.hRanks.concat(data.data)
                            break
                        }
                        this.scrollLock = false
                    }
                })
                .then(res => {
                    this.whichRank(this.selected)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 点击主播头像，跳转直播间
        inlive (rid) {
            common.goRoom(rid)
        },
        // 滚动加载绑定
        scrollLoad () {
            let scrollHeight = this.$refs.scrollDom.scrollHeight

            let cliHeight = this.$refs.scrollDom.clientHeight

            let scrollTop = this.$refs.scrollDom.scrollTop
            if (scrollHeight - cliHeight - scrollTop < 98) {
                if (this.scrollLock) return
                this.currentPage++
                this.scrollLock = true
                if (this.selected === 0) {
                    this.getRank(this.currentPage, 'user')
                } else if (this.selected == 1) {
                    this.getRank(this.currentPage, 'mod')
                } else if (this.selected == 2) {
                    this.getRank(this.currentPage, 'hit')
                }
            }
        }
    }
}
</script>
