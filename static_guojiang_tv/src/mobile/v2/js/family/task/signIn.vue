<template>
	<section class="signin">
		<div class="top_wrap">
			<img src="../../../img/family/logo.png" class="sign_logo">

			<h2>你已经连续签到了<span v-cloak>{{continueSigninDays}}天</span></h2>
			<p>已有<span>{{signinNums}}</span>人签到了</p>
		</div>

		<button class="btn" v-show="!isSignin" @click="goSignIn"><span>签到</span></button>
		<button class="btn" disabled="disabled" v-show="isSignin"><span>今日已签</span></button>

		<p class="desc" v-if="isSignin">今日已获得{{todayCredits}}积分</p>
		<p class="desc" v-else>签到即可获得积分哦</p>

		<a href="javascript:;" class="rule" @click="showRule">查看签到规则</a>
	</section>
</template>

<script type="text/javascript">
import axios from 'axios'

let dataArr = {
	continueSigninDays: 0,
	signinNums: 0,
	todayCredits: 0,
	isSignin: true,
	signFlag: true
}
export default {
	data: function(){
		return dataArr
	},
	mounted: function(){
		this.$nextTick(function(){
			this.getSigninInfo()
		})
	},
	methods: {
		getSigninInfo () {
			axios.get('/family/usercheckstatus')
			.then(
				(res) => {
					res = res.data
					if(res.errno == 0){
						this.continueSigninDays = res.data.days_checked
						this.signinNums = res.data.family_checked
						this.todayCredits = res.data.bonus_point
						this.isSignin = res.data.checked
					}else{
						layer.open({
							content: res.msg,
							skin: 'msg',
							time: 3
						})
					}
				},
				(err) => {
					alert(err)
				}
			)
		},
		goSignIn () {
			if(!this.signFlag) return
			this.signFlag = false

			//cnzz统计
            _czc.push(["_trackEvent","h5家族","点击签到按钮"])

			let vm = this
			axios.get('/family/usercheckin')
			.then(
				(res) => {
					res = res.data
					if(res.errno == 0){
						this.isSignin = true
						this.continueSigninDays++
						this.signinNums++

						//家族活跃积分
						let familyLiveCredits = 0
						switch(true){
							case this.signinNums <= 3:
								familyLiveCredits = 100
								break
							case this.signinNums <= 10:
								familyLiveCredits = 110
								break
							case this.signinNums <= 30:
								familyLiveCredits = 120
								break
							case this.signinNums <= 40:
								familyLiveCredits = 130
								break
							case this.signinNums <= 50:
								familyLiveCredits = 140
								break
							case this.signinNums <= 60:
								familyLiveCredits = 150
								break
						}

						//个人积分
						let personalCredits = 0
						switch(true){
							case this.continueSigninDays == 1:
								personalCredits = 100
								break
							case this.continueSigninDays == 2:
								personalCredits = 100
								break
							case this.continueSigninDays == 3:
								personalCredits = 200
								break
							case this.continueSigninDays == 4:
								personalCredits = 200
								break
							case this.continueSigninDays == 5:
								personalCredits = 200
								break
							case this.continueSigninDays == 6:
								personalCredits = 300
								break
							case this.continueSigninDays >= 7:
								personalCredits = 400
								break
						}

						vm.todayCredits = personalCredits

						let _html = `<h3>签到成功</h3><p>个人积分 +${personalCredits}</p><p>家族活跃 +${familyLiveCredits}</p>`
						layer.open({
							content: _html,
							btn: ['确定'],
							shadeClose: false,
							yes: function(){
								vm.signFlag = true
								layer.closeAll()
							}
						})
					}else{
						layer.open({
							content: res.msg,
							skin: 'msg',
							time: 3
						})
					}
				},
				(err) => {
					alert(err)
				}
			)
		},
		showRule () {
			let _html = `
				<h2>签到规则</h2>
				<h3>1）签到可以获得个人积分</h3>
				<p>签到1天，可获得100积分；</p>
				<p>连续签到2天，可获得100积分；</p>
				<p>连续签到3天，可获得200积分；</p>
				<p>连续签到4天，可获得200积分；</p>
				<p>连续签到5天，可获得200积分；</p>
				<p>连续签到6天，可获得300积分；</p>
				<p>连续签到7天，可获得400积分。</p>
				<h3>2）签到可以给家族增加活跃</h3>
				<p>有1-3人签到时，每人可为家族增加100活跃；</p>
				<p>有4-10人签到时，每人可为家族增加110活跃；</p>
				<p>有11-30人签到时，每人可为家族增加120活跃；</p>
				<p>有31-40人签到时，每人可为家族增加130活跃；</p>
				<p>有41-50人签到时，每人可为家族增加140活跃；</p>
				<p>有51-60人签到时，每人可为家族增加150活跃。</p>
			`
			layer.open({
				content: _html,
				className: 'rule'
			})
		}
	}
}
</script>