<template>
  <div class="content">

    <div
      v-if="info.isSelf"
      class="sub_nav ">
      <div class="sub_nav_content clearfix">
        <span
          :class="subNavActiveIndex==1?'slide_tab_r':''"
          class="slide_tab"/>
        <a
          :class="subNavActiveIndex==0?'active':''"
          href="javascript:;"
          class="fl"
          @click="switchToNoDue()">未过期({{ getNoDueNum }})</a>
        <a
          :class="subNavActiveIndex==1?'active':''"
          href="javascript:;"
          class="fr"
          @click="switchToDue()">已过期({{ info.overdueNum }})</a>
      </div>
    </div>

    <article class="guard_other">
      <ul>
        <li
          v-for="(val, key) in info.toGInfo"
          v-if="isShowItem(val['isOverdue'])"
          :key="key"
          :class="val['isOverdue']?'overdue':''"
          class="clearfix"
          @click="goDetailPage(val['mid'])">

          <div class="avatar_wrap fl">
            <img
              :src="val['head_pic_1']"
              :class="val['timeType'] == 1?'year_avatar':'month_avatar'">
            <span
              v-if="val['isVip']==1"
              class="icon_v"/>
            <span
              v-if="val['timeType']==1"
              class="icon_year"/>
          </div>

          <div class="info_wrap fl">
            <h3>
              <span class="nickname">{{ val['nickname'] }}</span>
              <span
                :class="val['sex']==1?'gender_icon_m':'gender_icon_w'"
                class="gender_icon"/>
              <span
                :class="'m_level_icon_'+val['level']"
                class="level_icon"/>
            </h3>

            <p class="p_1">{{ val['startTime'] }} 成为ta的{{ constsarr[val['type']] }}守护神</p>
            <p>为ta守护{{ val['guardTotalTime'] }}</p>

            <p v-if="info.isSelf">有效期至：{{ val['endTime'] }}</p>

            <span
              v-if="info.isSelf"
              class="continue_guard continue_btn"
              @click.stop="renew(val)">续期</span>

            <span class="overdue_icon hide"/>
          </div>
        </li>

      </ul>

      <p
        v-cloak
        v-if="info.toGInfo && getNoDueNum == 0 && !showOverDueList"
        class="no_data_hint">{{ info.listKey }}还没有成为别人的守护神哦~</p>
      <p
        v-else-if="info.overdueNum == 0 && showOverDueList"
        class="no_data_hint">{{ info.listKey }}还没有过期的守护哦~</p>
      <p
        v-cloak
        v-else-if="info.toGInfo && info.toGInfo.length == 0"
        class="no_data_hint">{{ info.listKey }}还没有成为别人的守护神哦~~</p>

    </article>
    <payLayer
      v-if="isRenew"
      :m-cost="info.mCost"
      :y-cost="info.yCost"
      :u-info="info.uInfo"
      :m-info="reNewMInfo"
      :is-iosapp-in-verify="info.isIOSAppInVerify"
      @buySuccessCallback="buySuccessCallback"
      @closeAllLayer="closeAllLayer"/>
  </div>
</template>

<script type="text/javascript">
export default {
    components: {
        'payLayer': () => import(/* webpackChunkName: "guard/bayLayer" */ './buyLayer.vue')
    },
    // eslint-disable-next-line vue/require-prop-types
    props: ['info', 'constsarr'],
    data: function () {
        return {
            subNavActiveIndex: 0,
            isRenew: false,
            reNewMInfo: {},
            showOverDueList: false
        }
    },
    computed: {
        getNoDueNum () {
            if (this.info.toGInfo) {
                return parseInt(this.info.toGInfo.length) - parseInt(this.info.overdueNum)
            } else {
                return ''
            }
        }
    },
    methods: {
        isShowItem (isOverdue) {
            if (this.showOverDueList && isOverdue) {
                return true
            } else if (!this.showOverDueList && !isOverdue) {
                return true
            }
        },
        switchToNoDue () {
            this.subNavActiveIndex = 0
            this.showOverDueList = false
        },
        switchToDue () {
            this.subNavActiveIndex = 1
            this.showOverDueList = true
        },
        /**
         * 续费
        */
        renew (mInfo) {
            console.log('minfo:', mInfo)
            this.reNewMInfo = mInfo
            this.isRenew = true
        },
        /**
         * 进个人中心页
        */
        goDetailPage (uid) {
            try {
                console.log('gBridge.userDetail called:' + uid)
                gBridge.userDetail(uid.toString())
            } catch (e) {
                alert(e.name + ': ' + e.message)
            }
        },
        /**
         * 续费成功回调
        */
        buySuccessCallback () {
            console.log('buy success')
            this.isRenew = false
            location.reload()
        },
        closeAllLayer () {
            this.isRenew = false
        }
    }
}
</script>
