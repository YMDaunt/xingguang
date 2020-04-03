'use strict'

import Vue from 'vue'

import '../../css/notice/socialInvite.less'

new Vue({
    el: '#app',
    data: {},
    mounted: function () {
        this.$nextTick(function () {
            var clipboard = new Clipboard('.copy_btn')
            clipboard.on('success', function (element) { // 复制成功的回调
                console.info('复制成功，复制内容:', element)
                layer.open({
                    content: '你已成功复制微信号，快去联系官方运营吧！',
                    skin: 'msg',
                    time: 3
                })
            })
            clipboard.on('error', function (element) { // 复制失败的回调
                console.info(element)
                layer.open({
                    content: element,
                    skin: 'msg',
                    time: 3
                })
            })
        })
    },
    methods: {
    }
})
