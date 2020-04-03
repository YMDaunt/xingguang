// import common from 'common'
import axios from 'axios'
require('../../css/makeFriends/callLog.less')

import Vue from 'vue'

new Vue({
    el: '#app',
    data: {
        noCode: false,
        codeArr: [],
        page: 0,
        scrollLock: false
    },
    created: function () {
        this.getCode()
    },
    mounted: function () {
        this.initScrollLoad()
    },
    methods: {
        getCode () {
            axios.get('/call/getCallLogs?page=' + this.page)
                .then(res => {
                    let data = res.data
                    if (data.data.length > 0) {
                        var arr = data.data
                        // 时间处理
                        for (let index in arr) {
                            var time = parseInt(arr[index].duration)
                            // 超过60S处理格式
                            if (time >= 60) {
                                var min = Math.floor(time / 60)
                                var sec = time % 60

                                if (min < 10) {
                                    min = '0' + min
                                }
                                if (sec < 10) {
                                    sec = '0' + sec
                                }
                                arr[index].duration = min + ':' + sec
                            } else {
                                if (time < 10) {
                                    arr[index].duration = '00:0' + arr[index].duration
                                } else {
                                    arr[index].duration = '00:' + arr[index].duration
                                }
                            }
                        }
                        this.codeArr = this.codeArr.concat(arr)
                        this.scrollLock = false
                    }
                    if (this.codeArr.length <= 0) {
                        this.noCode = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 滚动加载记录
        initScrollLoad () {
            const that = this
            that.scrollLoad('.code-list', 150, function () {
                if (that.scrollLock) return
                that.scrollLock = true
                that.page++
                that.getCode()
            })
        },

        // 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele)
            var bH = bottomHeight || 100
            _ele.addEventListener('scroll', function () {
                var scrollTop = _ele.scrollTop
                var cliHeight = _ele.clientHeight
                var scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        }
    }
})
