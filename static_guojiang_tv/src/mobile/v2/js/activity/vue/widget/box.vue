<!--
	背景图cover覆盖
 -->
<template>
  <div
    :style="[styleObject,filterStyle]"
    :class="className">
    <slot/>
  </div>
</template>

<script>
import filterSty from './tools/filterStyle.js'
export default {
    props: {
        bf: {
            type: Number,
            default: 108
        },
        overridingStyles: {
            type: Object,
            required: true
        },
        className: String
    },
    data () {
        return {
            styleObject: {

            }
        }
    },
    computed: {
        filterStyle: function () {
            return filterSty(this.overridingStyles, this.bf)
        }
    }
}
</script>
