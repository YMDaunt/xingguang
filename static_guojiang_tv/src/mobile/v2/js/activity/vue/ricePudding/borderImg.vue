<template>
  <div
    :class="className"
    class="sort-wrapper">
    <slot name="head"/>
    <div class="box-head"/>
    <div class="box-body">
      <slot name="body"/>
    </div>
    <div class="box-foot"/>
  </div>
</template>

<script>
export default {
    props: ['className'],
    data () {
        return {

        }
    },
    methods: {

    }
}
</script>
