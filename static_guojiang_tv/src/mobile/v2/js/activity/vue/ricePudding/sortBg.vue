<template>
  <border-img class-name="sort-lists-wrap">
    <div
      slot="head"
      class="tap-change c_clearfix">
      <div
        :class="{'change-act':!changeAct}"
        class="anchor-change tap-item sprite"
        @click="clickTap(0)"/>
      <div
        :class="{'change-act':changeAct}"
        class="user-change tap-item sprite"
        @click="clickTap(1)"/>
    </div>

    <div
      v-if="lists0"
      slot="body"
      class="top-wrap">
      <div
        class="top-avator-0 sprite"
        @click="goRoom(lists0['rid'])">
        <span
          v-if="lists0['isPlay'] === '1' && !changeAct"
          class="live"/>
        <img :src="lists0['head_pic_1']">
        <span class="top-num sprite">No.1</span>
      </div>
      <div class="top-nickname">{{ lists0['nickname'] }} <em
        :class="getLevel(lists0['level'])"
        class="level_icon"/></div>
      <p class="top-gift-num">{{ !changeAct?"收到":"送出" }} {{ lists0['num'] }}</p>
      <div
        v-if="!changeAct"
        :class="{'attend-btn-had':lists0['is_attention']}"
        class="attend-btn sprite"
        @click="loveHandle(lists0['id'])">{{ lists0['is_attention']?'已关注':'+ 关注' }}</div>
    </div>
    <div
      v-if="lists12[0]"
      slot="body"
      class="top-wrap-bottom c_clearfix">
      <div
        v-for="(item,index) in lists12"
        class="top-wrap-half">
        <div
          :class="'top-avator-'+(index+1)"
          class="top-avator sprite"
          @click="goRoom(item['rid'])">
          <span
            v-if="item['isPlay'] === '1' && !changeAct"
            class="live"/>
          <img :src="item['head_pic_1']">
          <span class="top-num sprite">No.{{ index+2 }}</span>
        </div>
        <div class="top-nickname">
          <span class="top-nickname-wrap">{{ item['nickname'] }}</span> <em
            :class="getLevel(item['level'])"
            class="level_icon"/>
        </div>
        <p class="top-gift-num">{{ !changeAct?"收到":"送出" }} {{ item['num'] }}</p>
        <div
          v-if="!changeAct"
          :class="{'attend-btn-had':item['is_attention']}"
          class="attend-btn sprite"
          @click="loveHandle(item['id'])">{{ item['is_attention']?'已关注':'+ 关注' }}</div>
      </div>
    </div>
    <div
      slot="body"
      class="sort-table">
      <ul>
        <li
          v-for="(item,index) in lists"
          v-if="index > 2"
          class="sort-item">
          <span class="item-num">{{ index+1 }}</span>
          <div
            class="item-avator"
            @click="goRoom(item['rid'])">
            <img :src="item['head_pic_1']">
            <span
              v-if="item['isPlay'] === '1' && !changeAct"
              class="live"/>
          </div>
          <span class="item-nickname">
            <span class="item-nickname-name ellipsis">{{ item['nickname'] }}</span>
            <em
              :class="getLevel(item['level'])"
              class="level_icon"/>
          </span>
          <span class="item-gift-num">{{ !changeAct?"收到":"送出" }} {{ item['num'] }}</span>
        </li>
      </ul>
    </div>
  </border-img>
</template>

<script>
import borderImg from './borderImg.vue'
import common from 'common'
export default {
    components: {
        borderImg
    },
    props: ['lists'],
    data () {
        return {
            changeAct: 0
        }
    },
    computed: {
        lists0 () {
            return this.lists[0]
        },
        lists12 () {
            const temp = []
            for (var i = 1; i < 3; i++) {
                this.lists[i] && temp.push(this.lists[i])
            }
            return temp
        }
    },
    created () {

    },
    mounted () {

    },
    methods: {
        clickTap (idx) {
            this.changeAct = idx
            this.$emit('changetap', idx)
        },
        loveHandle (id) {
            this.$emit('addlove', id)
        },
        // goroom
        goRoom (id) {
            if (!this.changeAct) {
                common.goRoom(id, 2)
            }
        },
        getLevel (level) {
            if (!this.changeAct) return 'm_level_icon_' + level
            else return 'u_level_icon_' + level
        }
    }
}
</script>
