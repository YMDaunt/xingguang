<!--
	背景图cover覆盖
 -->
<template>
  <div :style="[styleObject,filterStyle]">
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
        }
    },
    data () {
        return {
            styleObject: {
                width: '100%',
                'background-size': 'cover',
                'background-repeat': 'no-repeat'
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
