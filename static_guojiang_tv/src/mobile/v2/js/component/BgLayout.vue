<!--
 * @Date: 2019-05-29 10:52:47
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-14 09:01:19
 -->
<template>
  <section class="page-bgs">
    <div
      v-for="(bg, ind) in bgs"
      :key="'_bg_' + ind"
      :class="`page-bg bg${ind + 1}`"/>
  </section>
</template>

<script>
export default {
    name: 'BgLayout',
    props: {
        bgs: { // 背景图的个数
            type: Number,
            required: false,
            default: 1
        }
    }
}
</script>

<style lang="less">
#app {
    position: relative;
}

.page-bgs {
    position: absolute;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 1;
    .page-bg {
        width: 100%;
        background-position: center;
    }
}
</style>
