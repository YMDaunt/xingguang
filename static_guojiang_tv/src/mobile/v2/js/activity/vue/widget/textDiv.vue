<!--
	文本
 -->
<template>
  <div
    :class="className"
    :style="[styleObject,filterStyle]">
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
                'font-size': '12px',
                'text-align': 'left'
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
