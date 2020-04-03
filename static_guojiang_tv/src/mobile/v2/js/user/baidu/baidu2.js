/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:49:13
 */
/* eslint-disable */
require('../../../css/user/baidu/baidu2.less')
import axios from 'axios'

let count = 1
window.onload = function () {
    const pointNum = document.querySelector('.slide-point em')
    var mySwiper = new Swiper('.swiper-container', {
	  direction: 'horizontal',
	  loop: true,
	  on: {
	  	slideChangeTransitionEnd: function () {
	  		const actEle = document.querySelector('.swiper-slide-active')
	  		if (actEle) {
	  			count = +actEle.getAttribute('data-swiper-slide-index') + 1
	  	        pointNum.innerHTML = count
	  	        changeTxt()
	  		}
  	    }
	  }
    })

    // 播放视频
    const video = document.querySelector('.video-mp4')
    const videoBlock = document.querySelector('.video-block')
    document.querySelector('.play-icon').addEventListener('click', function () {
        video.src = '//static.guojiang.tv/mobile/v2/img/user/baidu/video/' + count + '.mp4'
        videoBlock.style.display = 'block'
        video.play()
    })
    videoBlock.addEventListener('touchstart', function (e) {
        e.stopPropagation()
        e.preventDefault()
        videoBlock.style.display = 'none'
        video.pause()
    }, false)
    video.addEventListener('ended', function () {
        videoBlock.style.display = 'none'
        video.pause()
    })
}

function changeTxt () {
    const job = ['热门手游', '肚皮舞', '钢管舞', '唱歌', '优声', '画画', '二次元', '热门网游', '撒娇卖萌', '讲故事']
    const age = ['16', '19', '17', '21', '20', '18', '16', '19', '16', '22']
    const server = ['陪打王者荣耀和吃鸡', '清晨叫醒服务', '陪酒陪饭当女友', '可线下约见', '哄睡服务', '可画人体素描', '晚上哄睡服务', '陪吃鸡陪网游', '1对1视频', '晚上讲故事给你听']
    const otherjob = ['学生', '护士', '酒吧服务员', '驻唱歌手', '按摩师', '学生', '学生', '幼儿园老师', '化妆师', '电台DJ']
    // const food = ['星光骨灰级玩家','白羊座守护','兰瓜马车团','周星第一人','哭完继续撸','广西一枝花','不要让我看到你哭','永远爱你','香蕉还没熟','大卫哥哥','伟爷','叫我老公','Daven','Tommiy'];
    const metting = ['星巴克', '快捷酒店', '酒吧', '咖啡店', '看情况', '先加微信', '听你的', '咖啡店', '酒店', '奶茶店']

    function g (arg) {
        return document.querySelector(arg)
    }

    g('.job').innerHTML = job[count - 1]
    g('.age').innerHTML = age[count - 1]
    g('.server').innerHTML = server[count - 1]
    g('.otherjob').innerHTML = otherjob[count - 1]
    g('.metting').innerHTML = metting[count - 1]
}

(function () {
    const lotteryName = ['阿彬', '极速飞行', 'Dady', '兔阿哥', '白白白', '一张白纸', '日月', 'SD', '东方', '公会', '干活吧', '好怀念']
    const resultValue = ['充值了10000星光', '充值了100星光', '见面成功', '送了一个见面大礼', '充值了200星光']
    let lotteryStr = ''
    let mouth = (new Date()).getMonth() + 1
    mouth = mouth < 10 ? '0' + mouth : mouth
    let today = (new Date()).getDate()
    if (today !== 1) today -= 1
    today = today < 10 ? '0' + today : today
    for (var i = 1; i <= 10; i++) {
        let hour = ~~(Math.random() * 24)
        hour = hour < 10 ? '0' + hour : hour

        lotteryStr += `
			<p class="scroll-item c_clearfix">
			    <span class="scroll-left">
			        -<em class="scroll-name">${lotteryName.splice(~~(Math.random() * lotteryName.length), 1)}：</em><em class="scroll-value">${resultValue[~~(Math.random() * resultValue.length)]}</em>
			    </span>
			    <span class="scroll-right">
			        ${mouth}-${today} ${hour}:${~~(Math.random() * 50) + 10}:${~~(Math.random() * 50) + 10}
			    </span>
			</p>
		`
    }
    document.querySelector('.scroll-wrap').innerHTML = lotteryStr
})()

const scrollWrap = document.querySelector('.scroll-wrap')
let scrollHeight = 42
let scrollCount = 1
function scrollST () {
    if (scrollCount === 5) {
        scrollCount = 1
        // scrollWrap.style = `transition: none;transform:translateY(0px);-webkit-transform:translateY(0px);`;
        scrollWrap.style.transition = 'none'
        scrollWrap.style.transform = 'translateY(0px)'
        scrollWrap.style.webkitTransform = 'translateY(0px)'
    } else {
        scrollWrap.style.transition = 'all 0.5s'
        scrollWrap.style.transform = `translateY(-${scrollHeight * scrollCount}px)`
        scrollWrap.style.webkitTransform = `translateY(-${scrollHeight * scrollCount}px)`
        scrollCount++
    }
}
setInterval(function () {
    scrollST()
}, 3000)

/*
在之前代码中添加vue实例，为了引用注册组件
 */
import Vue from 'vue'
import register from '../register.vue'

new Vue({
    el: '#app',
    data: {
        appInVerifyStatus: 0, // 1：是app在审核； 0:不是审核状态
        jumpLink: '',
        registerSucc: 0, // 1：注册成功
        channel: '' // 渠道
    },
    mounted: function () {
        // 获取app审核状态
        this.getAppInVerifyStatus()
        // 获取随机跳转链接
        this.getCallbackUrl()
        // 获取链接渠道
        this.channel = this.getQueryString('channel')
    },
    methods: {
        getAppInVerifyStatus () {
            let that = this
            axios.get('//m.tuho.tv/user/AppInVerifyStatus'
            ).then(res => {
                that.appInVerifyStatus = res.data.data.isAppInVerify
            })
        },
        getQueryString (name) {
    		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
		    var r = window.location.search.substr(1).match(reg)
		    if (r != null) return unescape(r[2]); return null
        },
        getCallbackUrl () {
            let that = this
            axios.get('//m.tuho.tv/user/GetCallback', {
                params: {
                    channel: that.getQueryString('channel')
                }
            })
                .then(res => {
                    that.jumpLink = res.data.data.callback
                })
        },
        fromChild (registerSucc) {
            // 获取子组件传值 不是审核状态（状态为0）下跳转直播间
            if (registerSucc && this.appInVerifyStatus == 0 && /android/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    window.location.href = this.jumpLink
                }, 2000)
            }
        }
    },
    components: {
        'register': register
    }
})
