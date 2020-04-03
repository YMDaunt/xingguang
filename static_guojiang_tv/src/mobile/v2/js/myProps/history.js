import '../../css/myProps/history.less'
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import $ from 'webpack-zepto'

console.log('guojiang')

var vm = new Vue({
    el: '.wl_content',
    data: {
        list: [],
        page: 0,
        isEnd: false,
        flag: true
    },
    mounted: function () {
        this.$nextTick(function () {
            vm.getList(0)

		    $(window).on('scroll', function () {
		        var scroll_T = $(window).scrollTop()

                var screen_H = $(window).height()

                var doc_H = $(document).height()

                var offset_B = doc_H - scroll_T - screen_H

		        if (offset_B < 100 && vm.flag) {
		        	vm.page++
		        	vm.flag = false
		        	vm.getList(vm.page)
		        }
		    })
        })
    },
    methods: {
        getList: function (page) {
            axios.get('/myProps/GetHistory', {
                params: {
                    page: page
                }
            })
                .then(function (res) {
                    vm.flag = true
                    let data = res.data
                    if (data.errno == -100) {
                        common.goLogin()
                    } else if (data.errno == 0) {
                        vm.list = vm.list.concat(data.data.list)

                        if (data.data.list.length < 10) {
                            vm.isEnd = true
                            vm.flag = false
                        }
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                })
        }
    }
})
