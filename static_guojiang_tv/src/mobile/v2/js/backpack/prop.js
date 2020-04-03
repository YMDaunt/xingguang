import '../../css/backpack/list.less'

import Vue from 'vue'
import Prop from './prop.vue'

new Vue({
    el: '#app',
    components: {
        prop: Prop
    },
    mounted: function () {
        this.$nextTick(function () {
            // 显示右上角背包入口
            window.onload = function () {
                setTimeout(function () {
                    try {
                        gBridge.changeMenuButton('商城', location.protocol + '//' + location.host + '/dist/store/list.html')
                    } catch (e) {
                        console.log(e.name + ':' + e.message)
                    }
                }, 500)
            }
        })
    }
})
