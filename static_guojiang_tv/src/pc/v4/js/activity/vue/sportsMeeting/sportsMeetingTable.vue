<template>
	<div class="sort-table" v-show="toggle">
		<div class="triangle"></div>
		<div class="scroll-wrap">
		    <ul class="scroll-content">
		        <li class="sort-table-item clearfix" v-for="(item,index) in sortdata">
		            <div class="sort-item-index">{{index+9}}</div>
		            <div class="sort-item-avator">
		                <div class="sort-item-live sprite" v-show="item['is_playing'] === '1'"></div>
		                <img :src="item['head_pic_1']" @click="common.goRoom(item['rid'],2)" />
		            </div>
		            <div class="sort-item-nickname">{{item["nickname"]}}</div>
		            <div class="sort-item-score">积分:{{item["num"]}}</div>
		        </li>
		        <li v-show="sortdata.length === 0"><p style="line-height:2;text-align:center;">暂无数据！</p></li>
		    </ul>
		</div>
	</div>
</template>

<script>
	import common from "../../../common/common.js";
	import TouchTransform from "../../../component/gj.touchTransform.js";
	export default {
		props: ['toggle','sortdata'],
		mounted:function(){
			// new TouchTransform(".part2 .scroll-wrap",".part2 .scroll-content",function(distance){
			//     console.log(distance);
			// });
		},
		created(){
			
		},
		data(){
			return {
				common
			}
		},
		methods:{

		}
	}
</script>

<style lang="less" scoped>
	@bf: 108rem;
	.sort-table{
		position: relative;
	    width: 1040/@bf;
	    max-height: 640/@bf;
	    background-color: #4a5356;
	    border-radius: 14/@bf;
	    box-shadow: 0 5/@bf 0 #313739;
	    color: #fff;
	    font-size: 12px;
	    padding-top: 33/@bf;
	    padding-left: 40/@bf;
	    box-sizing: border-box;
	    margin: 0 auto;
	}
	.triangle{
		position: absolute;
		right: 198/@bf;
		top: -22/@bf;
		width: 0;
		height: 0;
		border-left: 22/@bf solid transparent;
		border-right: 22/@bf solid transparent;
		border-bottom: 33/@bf solid #4a5356;
	}
	.scroll-wrap{
		max-height: 580/@bf;
		overflow: hidden;
	}
	.scroll-content{
		padding-bottom: 1px;
	}
	.sort-table-item{
	    margin-bottom: 40/@bf;
	    &>*{
	        float: left;
	        height: 76/@bf;
	        line-height: 76/@bf;
	    }
	}
	.sort-item-index{
	    width: 135/@bf;
	    text-align: center;
	}
	.sort-item-avator{
	    position: relative;
	    width: 76/@bf;
	    height: 76/@bf;
	    border-radius: 50%;
	    border: 1px solid #fff;
	    img{
	    	display: block;
	    	width: 100%;
	    	height: 100%;
	    	border-radius: 50%;
	   		vertical-align: middle;
	    }
	}
	.sort-item-live{
	    position: absolute;
	    top: 0;
	    right: -23/@bf;
	    width: 52/@bf;
	    height: 24/@bf;
	    background-position: -564/@bf -115/@bf;
	}
	.sort-item-nickname{
		width: 400/@bf;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-left: 35/@bf;
	}
	.sort-item-score{
		width: 320/@bf;
		white-space: nowrap;
	}
</style>