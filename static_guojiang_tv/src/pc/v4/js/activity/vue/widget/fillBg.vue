<!-- 
	背景图100% 100% 填充 
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
			className: String
		},
		data(){
			return {
				styleObject:{
					width:"100%",
					"background-size":"100% 100%",
					"background-repeat":"no-repeat",
					"margin": "0 auto",
				}
			}
		},
		methods:{

		},
		computed:{
			filterStyle: function(){
				return filterSty(this.overridingStyles,this.bf)
			}
		}
	}
</script>

