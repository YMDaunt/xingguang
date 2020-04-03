
<template>
  <article class="guard_self">
    <ul>
      <li
        v-for="(val, key) in info.gInfo"
        :key="key"
        class="clearfix"
        @click="goDetailPage(val['uid'])">

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
              :class="'u_level_icon_'+val['level']"
              class="level_icon"/>
          </h3>

          <p class="p_1">{{ val['startTime'] }} 成为{{ info.listKey }}的{{ constsarr[val['type']] }}守护神</p>
          <p>为{{ info.listKey }}守护{{ val['guardTotalTime'] }}</p>

        </div>
      </li>

    </ul>

    <p
      v-if="info.gInfo && info.gInfo.length == 0"
      class="no_data_hint">呜呜~还没有人守护{{ info.listKey }}呢~~</p>

  </article>
</template>

<script type="text/javascript">
export default {
    // eslint-disable-next-line vue/require-prop-types
    props: ['info', 'constsarr'],
    data: function () {
        return {
        }
    },
    methods: {

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
        }

    }
}
</script>
