<template>
	<div class="gift-prize sprite">
		<p class="prize-top">第{{filterNum}}名</p>
		<div class="prize-img sprite" :class="'prize-img-'+sortNum"></div>
		<div class="prize-name">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props:["sortNum"],
		data(){
			return {

			}
		},
		methods:{

		},
		computed:{
			filterNum(){
				if(this.sortNum < 4) return this.sortNum;
				else return '4、5';
			}
		}
	}
</script>

<style lang="less" scoped>
	@bf: 1.43px;
	@imgUrl: '../../../../img/activity/ricePudding/';
	.bfill(@url){
	    background-image: url('@{imgUrl}@{url}');
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
	    background-position: center;
	}
	.gift-prize{
		position: relative;
		width: 302/@bf;
		height: 411/@bf;
		padding-top: 1px;
		margin-bottom: 120/@bf;
		font-size: 30/@bf;
		background-position: -638/@bf -24/@bf;
	}
	.prize-top{
		margin-top: 95/@bf;
		height: 75/@bf;
		line-height: 75/@bf;
		text-align: center;
		color: #b98c66;
	}
	.prize-img{
		margin-top: 15/@bf;
		margin-left: auto;
		margin-right: auto;
	}
	.prize-img-1{
		width: 160/@bf;
		height: 212/@bf;
		background-position: -53/@bf -33/@bf;
	}
	.prize-img-2{
		width: 192/@bf;
		height: 119/@bf;
		margin-top: 38/@bf;
		background-position: -360/@bf -70/@bf;
	}
	.prize-img-3{
		width: 245/@bf;
		height: 165/@bf;
		margin-top: 24/@bf;
		background-position: -40/@bf -338/@bf;
	}
	.prize-img-4{
		width: 162/@bf;
		height: 198/@bf;
		background-position: -401/@bf -305/@bf;
	}
	.prize-name{
		position: absolute;
		width: 100%;
		top: 440/@bf;
		color: #74050c;
		text-align: center;
		line-height: 1.2;
		font-size: 30/@bf;
	}
</style>