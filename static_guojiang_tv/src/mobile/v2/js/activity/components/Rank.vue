<template>
  <div class="rank">
    <!-- <div class="title"/> -->
    <ul class="tab">
      <li
        v-for="(item,index) in 2"
        :key="index"
        :class="['tab-'+index,{active:selected==index}]"
        @click="exchangeTab(index)"
      >
        <!-- <span/> -->
      </li>
    </ul>
    <ul class="prev-list">
      <li v-for="(item,index) in prevList(rankList)" :class="'no'+(index+1)" :key="index">
        <div :class="{userMarginBottom:!isMod}" class="avatar-wrap">
          <div class="crown"/>
          <div v-if="isMod && item.isPlaying === true" class="live"></div>
          <div class="avatar-box">
            <img v-if="isMod" :src="item.headPic" class="avatar" @click="inlive(item.rid)" onerror="this.src='//static.guojiang.tv/pc/v3/img/common/avatar/head_bg_p7_330.png'">
            <img v-else :src="item.headPic" class="avatar" onerror="this.src='//static.guojiang.tv/pc/v3/img/common/avatar/head_bg_p7_330.png'">
          </div>
          <!-- <div class="index">No.{{ index+1 }}</div> -->
        </div>
        <p class="info">
          <span class="nickname">{{ item.nickname }}</span>
          <span v-if="isMod" :class="'level_icon m_level_icon_'+(item.level)"/>
          <span v-else :class="'level_icon u_level_icon_'+(item.level)"/>
        </p>
        <div v-if="isMod" class="receive">魅力值:{{ item.score }}</div>
        <div v-else :class="{userMarginTop:!isMod}" class="receive">贡献值:{{ item.score }}</div>
        <div v-if="isMod">
          <div v-show="item.isLoved" class="follow-btn following"></div>
          <div v-show="!item.isLoved" class="follow-btn nofollow" @click="attention(item.id,index)"></div>
        </div>
      </li>
    </ul>
    <div class="nothing" v-show="nothing">快去直播间送出活动礼物，支持你的女神吧！</div>
    <div v-if="rankList.length>0 && isMod" class="last-title">
        <span class="title1">排名</span>
        <span class="title2">女神</span>
        <span class="title3">魅力值</span>
    </div>
    <div v-if="rankList.length>0 && !isMod" class="last-title">
        <span class="title1">排名</span>
        <span class="title2">粉丝</span>
        <span class="title3">贡献值</span>
    </div>
    <ul ref="scrollDom" class="last-list" @scroll="scrollLoad()">
      <li v-for="(item,index) in lastList(rankList)" :key="index">
        <div class="index">{{ index+4 }}</div>
        <div class="avatar-box">
          <img v-if="isMod" :src="item.headPic" class="avatar" @click="inlive(item.rid)" onerror="this.src='//static.guojiang.tv/pc/v3/img/common/avatar/head_bg_p7_330.png'">
          <img v-else :src="item.headPic" class="avatar" onerror="this.src='//static.guojiang.tv/pc/v3/img/common/avatar/head_bg_p7_330.png'">
        </div>
        <div v-if="isMod && item.isPlaying == 1" class="live"></div>
        <div class="info">
          <span class="nickname fl">{{ item.nickname }}</span>
          <span v-if="isMod" :class="'level_icon fl m_level_icon_'+(item.level)"/>
          <span v-else :class="'level_icon fl u_level_icon_'+(item.level)"/>
        </div>
        <div v-if="isMod" class="receive">{{ item.score }}</div>
        <div v-else class="receive">{{ item.score }}</div>
      </li>
    </ul>
    <div class="no-more" v-if="isMod">仅展示前100名女神</div>
    <div class="no-more" v-else>仅展示前100名粉丝</div>
    <div class="myRank" v-show="showmMyRanks && isMod">
        <p class="line"></p>
      <div class="avatar-box">
        <div class="avatar-wrap">
          <img :src="mmyRanks.headPic" alt class="avatar" @click="inlive(mmyRanks.rid)" onerror="this.src='//static.guojiang.tv/pc/v3/img/common/avatar/head_bg_p7_330.png'">
        </div>
        <div class="live" v-if="mmyRanks.isPlaying"></div>
        <div class="myinfo">
          <span class="nickname fl">{{mmyRanks.nickName}}</span>
          <span v-if="isMod" :class="'level_icon fl m_level_icon_'+(mmyRanks.level)"/>
          <span v-else :class="'level_icon fl u_level_icon_'+(mmyRanks.level)"/>
        </div>
      </div>
      <div class="info">
        <div class="info1">
          <span class="title">{{mmyRanks.pairInfos[0].name}}</span>
          <br>
          {{mmyRanks.pairInfos[0].value}}
        </div>
        <div class="info2">
          <span class="title">{{mmyRanks.pairInfos[2].name}}</span>
          <br>
          {{mmyRanks.pairInfos[2].value}}
        </div>
        <div class="info3">
          <span class="title">{{mmyRanks.pairInfos[1].name}}</span>
          <br>
          {{mmyRanks.pairInfos[1].value}}
        </div>
        <div class="info4">
          <span class="title">{{mmyRanks.pairInfos[3].name}}</span>
          <br>
          {{mmyRanks.pairInfos[3].value}}
        </div>
      </div>
    </div>
    <div class="myRank" v-show="showuMyRanks && !isMod">
      <p class="line"></p>
      <div class="avatar-box">
        <div class="avatar-wrap">
          <img :src="umyRanks.headPic" alt class="avatar" onerror="this.src='//static.guojiang.tv/pc/v3/img/common/avatar/head_bg_p7_330.png'">
        </div>
        <div class="live" v-if="umyRanks.isPlaying"></div>
        <div class="myinfo">
          <span class="nickname fl">{{umyRanks.nickName}}</span>
          <span :class="'level_icon fl u_level_icon_'+(umyRanks.level)"/>
        </div>
      </div>
      <div class="info">
        <div class="info1">
          <span class="title">{{umyRanks.pairInfos[0].name}}</span>
          <br>
          {{umyRanks.pairInfos[0].value}}
        </div>
        <div class="info2">
          <span class="title">{{umyRanks.pairInfos[2].name}}</span>
          <br>
          {{umyRanks.pairInfos[2].value}}
        </div>
        <div class="info3">
          <span class="title">{{umyRanks.pairInfos[1].name}}</span>
          <br>
          {{umyRanks.pairInfos[1].value}}
        </div>
        <div class="info4">
          <span class="title">{{umyRanks.pairInfos[3].name}}</span>
          <br>
          {{umyRanks.pairInfos[3].value}}
        </div>
      </div>
    </div>
    <div class="border"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: 0, // 当前选中的tab
      isMod: true, // 默认类型是主播
      currentPage: 1, // 当前页数
      rankList: [], // 当前列表数据
      mRanks: [], // 主播排行榜
      uRanks: [], // 用户排行榜
      mmyRanks: {
          pairInfos: [
          { name: "榜单排名", value: 0 },
          { name: "魅力值", value: 0 },
          { name: "距离上一名", value: 0 },
          { name: "领先后一名", value: "-" }
        ],
      },
      umyRanks: {
          pairInfos: [
          { name: "榜单排名", value: 0 },
          { name: "魅力值", value: 0 },
          { name: "距离上一名", value: 0 },
          { name: "领先后一名", value: "-" }
        ],
      },
      showmMyRanks: false,
      showuMyRanks: false,
      scrollLock: false,
      nothing: false
    };
  },

  created: function() {
    this.getRank(1, "mod");
    this.getRank(1, "user");
  },
  methods: {
    // tab切换
    exchangeTab(index) {
      this.selected = index;
      this.currentPage = 1;
      this.$refs.scrollDom.scrollTop = 0;
      this.scrollLock = false;
      if (index == 0) {
        this.isMod = true;
        this.rankList = this.mRanks;
        this.myRanks = this.mmyRanks;
      } else {
        this.isMod = false;
        this.rankList = this.uRanks;
        this.myRanks = this.umyRanks;
      }
    },
    // 获取榜单数据
    getRank(Page, Tag) {
      this.axios
        .get("/goodness2018/ranks", {
          params: {
            pageNo: Page,
            pageSize: 15,
            type: Tag
          }
        })
        .then(res => {
          let data = res.data.data;
          //console.log(data);
          if(data.data.length === 0 && data.pageNo === '1'){
            // 无数据的状态
            this.nothing = true;
          }
          if (data.data.length > 0) {
            this.nothing = false
            if (Tag == "mod") {
              this.mRanks = this.mRanks.concat(data.data);
              if (data.myRank) {
                this.mmyRanks = data.myRank;
                this.showmMyRanks = true;
              }
            } else {
              this.uRanks = this.uRanks.concat(data.data);
              if (data.myRank) {
                this.umyRanks = data.myRank;
                this.showuMyRanks = true;
              }
            }
            this.scrollLock = false;
          }
          
        })
        .then(res => {
          if (this.isMod) {
            this.rankList = this.mRanks;
          } else {
            this.rankList = this.uRanks;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 前三过滤
    prevList() {
      return this.rankList.filter((item, index) => {
        return index < 3;
      });
    },
    // 第三名之后过滤
    lastList() {
      return this.rankList.filter((item, index) => {
        return index >= 3;
      });
    },
    // 点击主播头像，跳转直播间
    inlive(rid) {
      this.$emit("inlive", rid);
    },
    // 滚动加载绑定
    scrollLoad() {
      let scrollHeight = this.$refs.scrollDom.scrollHeight;

      let cliHeight = this.$refs.scrollDom.clientHeight;

      let scrollTop = this.$refs.scrollDom.scrollTop;
      if (scrollHeight - cliHeight - scrollTop < 500) {
        if (this.scrollLock) return;
        this.scrollLock = true;
        this.currentPage++;
        if (this.isMod) {
          this.getRank(this.currentPage, "mod");
        } else {
          this.getRank(this.currentPage, "user");
        }
      }
    },
    // 点击关注按钮，关注主播
    attention(mid, index) {
      this.$emit("attention", mid, index, this.rankList);
    }
  }
};
</script>

<style lang='less' scoped>
.tab {
  li {
    float: left;
    width: 50%;
    display: flex;
    justify-content: center;
    span {
      display: inline-block;
    }
  }
}
</style>

