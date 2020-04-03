<!--
 * @Date: 2019-08-13 15:34:09
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-07 18:09:51
 -->
<template>
  <section class="page-content">
    <slot/>
  </section>
</template>
<style lang="less">
.page-content {
    position: relative;
    overflow: hidden;
    z-index: 2;
    height:100vh;
}
</style>
