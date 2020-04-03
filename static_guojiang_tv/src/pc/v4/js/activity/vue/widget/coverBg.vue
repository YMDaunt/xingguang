<!-- 
	背景图cover覆盖 
 -->
<template>
	<div :style="[styleObject,filterStyle]">
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
			}
		},
		data(){
			return {
				styleObject:{
					width:"100%",
					"background-size":"cover",
					"background-repeat":"no-repeat",
					"background-position":"center",
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

