/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:47:53
 */
/* eslint-disable */
import '../../css/fans/list.less'

import Vue from 'vue'
import axios from 'axios'

const querystring = require('querystring')

let vm = new Vue({
    el: 'article',

    filters: {
        formatHeadpic (url) {
            return '//static.guojiang.tv/pc/medals/' + url
        }
    },
    data: {
        items: [],
        page: 0,
        isEmpty: false,
        isEnd: false,
        scrollFlag: true,
        isLoading: true,
        mid: '',
        hasMedal: false,
        fansCount: 0,
        medalPic: '',
        hasFans: true,
        showLock: false
    },
    created: function () {
        this.mid = querystring.parse(location.search.split('?')[1])['mid']
        this.getItems()
    },
    mounted () {
        this.$nextTick(() => {
            let win_H = window.screen.height

            window.onscroll = function () {
                let scroll_T = document.documentElement.scrollTop || document.body.scrollTop

                let doc_H = document.documentElement.scrollHeight || document.body.scrollHeight

                let offset_B = doc_H - scroll_T - win_H

                if (offset_B < 30 && vm.scrollFlag) {
                    vm.page++
                    vm.scrollFlag = false
                    vm.isLoading = true

                    vm.getItems()
                }
            }
        })
    },
    methods: {
        getItems () {
            axios.get('/fans/GetFansList', {
                params: {
                    page: this.page,
                    mid: this.mid
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        this.scrollFlag = true
                        this.isLoading = false

                        if (data.errno == 0) {
                            let itemList = data.data.fansInfo.list
                            if (itemList.length < 10 && this.items.length != 0) {
                                this.isEnd = true
                                this.scrollFlag = false
                            }

                            this.items = this.items.concat(itemList)
                            this.isEmpty = this.items.length == 0 && this.page == 0
                            this.hasMedal = data.data.fansInfo.hasMedal
                            this.fansCount = data.data.fansInfo.fansCount
                            this.medalPic = data.data.fansInfo.medalPic
                            this.hasFans = this.fansCount != 0
                            this.showLock = true
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        }

    }

})
