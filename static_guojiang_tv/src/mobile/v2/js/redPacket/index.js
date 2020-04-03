import '../../css/redPacket/index.less'

import Vue from 'vue'
import VueRouter from 'vue-router'

import MyRedPacket from './myRedPacket.vue'
import WithdrawFill from './withdrawFill.vue'
import WithdrawResult from './withdrawResult.vue'
import Record from './record.vue'
import 	axios from 'axios'

Vue.use(VueRouter)

let router = new VueRouter({
    routes: [
        {path: '/', component: MyRedPacket
            /* beforeEnter: (to, from, next) => {
				if(from.path != '/'){
					router.go({'path': '/'})
					return
				}

				next()
			} */
        },
        {path: '/withdrawFill', component: WithdrawFill},
        {path: '/withdrawResult', component: WithdrawResult},
        {path: '/record', component: Record}
    ]
})
window.router = router

new Vue({
    el: '#content',
    data: {
        info: {
            avatar: '',
            nickname: '',
            total: '--',
            remainRedPacket: '--',
            wxName: ''
        }
    },
    router
})

// 用于切换不同的页面时，重新调用自定义右上角信息的接口
window.pageOnShow = function () {
    setTimeout(function () {
        let packageId = 0
        axios.get('/redPacket/getAppType')
            .then(
                (res) => {
                    let data = res.data
                    if (typeof data === 'string') data = JSON.parse(data)

                    if (data.errno == 0) {
                        packageId = data.data.packageId

                        let icon_url = packageId == '0' ? '//static.guojiang.tv/src/mobile/v2/img/redPacket/icon_help.png' : '//static.guojiang.tv/src/mobile/v2/img/redPacket/icon_help_tuho.png'
                        try {
                            console.log('gBridge.changeMenuButton is called')
                            gBridge.changeMenuButton(icon_url, '//' + location.host + '/dist/redPacket/rule.html#my')
                        } catch (e) {
                            console.log(e.name + ':' + e.message)
                        }
                    }
                }
            )
    }, 200)
}
