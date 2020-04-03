/**
 * @authors Jesse
 * @date    2017-11-28 14:41:33
 */
import common from 'common'
import Vue from 'vue'
import axios from 'axios'

require('../../css/activity/weekStarShare.less')

new Vue({
    el: '#app',
    data: {
        type: '',
        uid: 0,
        userInfo: [],
        startLiveTime: '',
        registerTime: '',
        bigFans: [],
        godness: [],
        banner: []
    },
    computed: {
        showWitch () {
            return this.type == 'moderator'
        }
    },
    created: function () {
        function parseQueryString (param) {
            var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) return unescape(r[2])
            return null
        }
        // console.log('type', parseQueryString('type'));
        // console.log('uid', parseQueryString('uid'));
        this.type = parseQueryString('type')
        this.uid = parseQueryString('uid')
        // 获取初始化页面数据
        axios.get('/WeekStarByYearActivity/Share', {
            params: {
                type: this.type,
                uid: this.uid
            }
        })
            .then(res => {
                let data = res.data
                // console.log('share页面数据', data);
                if (data.errno == 0) {
                    this.userInfo = data.data.userInfo
                    this.banner = data.data.banner
                    if (this.userInfo.registerTime) {
                        this.registerTime = this.timeChange(this.userInfo.registerTime)
                        this.godness = this.userInfo.godness
                        if (this.godness.mid == '') {
                            this.godness = ['']
                        }
                    }
                    if (this.userInfo.startLiveTime) {
                        this.startLiveTime = this.timeChange(this.userInfo.startLiveTime)
                        this.bigFans = this.userInfo.bigFans
                        this.bigFans.length = 3
                    }
                    // banner数据返回后在渲染swiper
                    Vue.nextTick(function () {
                        var swiper2 = new Swiper('.swiper-container2', {
                            autoplay: {
                                delay: 2500,
                                disableOnInteraction: false
                            },
                            pagination: {
                                el: '.swiper-pagination2'
                            }
                        })
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
        this.$nextTick(function () {
            var swiper1 = new Swiper('.swiper-container', {
                direction: 'vertical',
                pagination: {
                    el: '.swiper-pagination'
                }
            })
        })
    },
    methods: {
        // 日期转换为年月日
        timeChange (time) {
            var year = 0

            var month = 0

            var day = 0
            year = time.slice(0, 4)
            month = time.slice(5, 7)
            if (month.slice(0, 1) == 0) {
                month = month.slice(1)
            }
            day = time.slice(8, 10)
            if (day.slice(0, 1) == 0) {
                day = day.slice(1)
            }
            return year + '年' + month + '月' + day + '日'
        },
        // 分享
        share () {
            common.goShare()
        }
    }
})
