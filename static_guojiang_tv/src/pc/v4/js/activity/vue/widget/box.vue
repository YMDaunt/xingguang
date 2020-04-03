<!-- 
	背景图cover覆盖 
 -->
<template>
	<div :style="[styleObject,filterStyle]" :class="className">
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
			className:String
		},
		data(){
			return {
				styleObject:{
					
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

