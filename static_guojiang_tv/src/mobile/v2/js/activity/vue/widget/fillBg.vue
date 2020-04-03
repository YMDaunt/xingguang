<!--
	背景图100% 100% 填充
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
                width: '100%',
                'background-size': '100% 100%',
                'background-repeat': 'no-repeat',
                'margin': '0 auto'
            }
        }
    },
    computed: {
        filterStyle: function () {
            return filterSty(this.overridingStyles, this.bf)
        }
    },
    methods: {

    }
}
</script>
