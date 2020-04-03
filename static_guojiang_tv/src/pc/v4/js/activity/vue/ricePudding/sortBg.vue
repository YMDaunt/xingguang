<template>
	<border-img class-name="sort-lists-wrap">
		<div class="tap-change c_clearfix" slot="head">
			<div class="anchor-change tap-item sprite" :class="{'change-act':!changeAct}" @click="clickTap(0)"></div>
			<div class="user-change tap-item sprite" :class="{'change-act':changeAct}" @click="clickTap(1)"></div>
		</div>

		<div class="top-wrap" slot="body" v-if="lists0">
			<div class="top-avator-0 sprite" @click="goRoom(lists0['id'])">
				<span class="live" v-if="lists0['isPlay'] === '1' && !changeAct"></span>
				<img :src="lists0['head_pic_1']">
				<span class="top-num sprite">No.1</span>
			</div>
			<div class="top-nickname">
				<span class="limit-nickname">{{lists0['nickname']}}</span>
				<em class="level_icon" 
					:class="getLevel(lists0['level'])"></em>
			</div>
			<p class="top-gift-num">{{!changeAct?"收到":"送出"}} {{lists0['num']}}</p>
			<div class="attend-btn sprite" :class="{'attend-btn-had':lists0['is_attention']}" @click="loveHandle(lists0['id'])" v-if="!changeAct">{{lists0['is_attention']?'已关注':'+ 关注'}}</div>
		</div>
		<div class="top-wrap-bottom c_clearfix" :class="{'user-wrap-bottom':changeAct}" slot="body" v-if="lists12[0]">
			<div class="top-wrap-half" v-for="(item,index) in lists12">
				<div class="top-avator sprite" @click="goRoom(item['id'])" :class="'top-avator-'+(index+1)">
					<span class="live" v-if="item['isPlay'] === '1' && !changeAct"></span>
					<img :src="item['head_pic_1']">
					<span class="top-num sprite">No.{{index+2}}</span>
				</div>
				<div class="top-nickname">
					<span class="limit-nickname">{{item['nickname']}}</span>
					<em class="level_icon" :class="getLevel(item['level'])"></em></div>
				<p class="top-gift-num">{{!changeAct?"收到":"送出"}} {{item['num']}}</p>
				<div class="attend-btn sprite" :class="{'attend-btn-had':item['is_attention']}" @click="loveHandle(item['id'])" v-if="!changeAct">{{item['is_attention']?'已关注':'+ 关注'}}</div>
			</div>
		</div>
		<div class="sort-table" slot="body" :class="{'table-noborder':lists.length === 0}">
			<ul>
				<li class="sort-item" :class="{'sort-item-ie c_clearfix':isIE}" v-for="(item,index) in lists" v-if="index > 2">
					<span class="item-num">{{index+1}}</span>
					<div class="item-avator" @click="goRoom(item['id'])">
						<img :src="item['head_pic_1']">
						<span class="live" v-if="item['isPlay'] === '1' && !changeAct"></span>
					</div>
					<span class="item-nickname ellipsis">{{item['nickname']}}<em class="level_icon" :class="getLevel(item['level'])"></em></span>
					<span class="item-gift-num">{{!changeAct?"收到":"送出"}} {{item['num']}}</span>
				</li>
			</ul>
		</div>
	</border-img>
</template>

<script>
	import borderImg from './borderImg.vue';

	var isIE9Bool = false;
	var isIEAttr = window.ActiveXObject || "ActiveXObject" in window
	if(isIEAttr){
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		var userAgent = navigator.userAgent;
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if(fIEVersion == 9){
			isIE9Bool = true;
		}
	}

	export default {
		created(){
			
		},
		mounted(){

		},
		props:["lists"],
		components:{
			borderImg,
		},
		data(){
			return {
				isIE: isIE9Bool,
				changeAct: 0,
			}
		},
		methods:{
			clickTap(idx){
				this.changeAct = idx;
				this.$emit('changetap',idx)
			},
			loveHandle(id){
				this.$emit('addlove',id)
			},
			//goroom
			goRoom(id){
				if(!this.changeAct){
					window.open("/"+id);
				}
			},
			getLevel(level){
				if(!this.changeAct) return 'm_level_icon_'+level;
				else return 'u_level_icon_'+level;
			}
		},
		computed:{
			lists0(){
				return this.lists[0];
			},
			lists12(){
				const temp = [];
				for(var i = 1; i < 3; i++){
					this.lists[i] && temp.push(this.lists[i]);
				}
				return temp;
			}
		}
	}
</script>
