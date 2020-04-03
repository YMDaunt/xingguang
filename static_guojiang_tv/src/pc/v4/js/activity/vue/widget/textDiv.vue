<!-- 
	文本
 -->
<template>
	<div :class="className" :style="[styleObject,filterStyle]">
		<slot></slot>
	</div>
</template>

<script>
	import filterSty from './tools/filterStyle.js';
	export default {
		props:{
			bf:{
				type:String,
				default: "10*7"
			},
			overridingStyles:{
				type: Object,
				required: true
			},
			className:String,
		},
		data(){
			return {
				styleObject:{
					"font-size": "12px",
					"text-align": "left",
				}
			}
		},
		computed:{
			filterStyle: function(){
				return filterSty(this.overridingStyles,this.bf)
			}
		}
	}
</script>

