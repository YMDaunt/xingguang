/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:52:38
 */
/* eslint-disable */
import '../../css/download/iosSign.less'

import Vue from 'vue'
import common from 'common'
import layer from 'layer'

new Vue({
    el: 'article',
    data: {
        v: '4.5.6'
    },
    created: function () {
        this.v = location.search.split('?v=')[1] ? location.search.split('?v=')[1] : this.v
    },
    mounted: function () {

    },
    methods: {
        goDown () {
            if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                layer.open({
                    content: '只支持iOS设备下载',
                    skin: 'msg',
                    time: 3
                })
                return
            }

            location.href = `http://www.tuho.tv/download/ipa?version=${this.v}`
            /* setInterval(function(){
				location.href = 'xingguang://';
			}, 1000) */
        }
    }
})
