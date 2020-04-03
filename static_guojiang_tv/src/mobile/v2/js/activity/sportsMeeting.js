import Vue from 'vue'
import $ from 'webpack-zepto'
import common from '../common/common.js'
import sorttable from './vue/sportsMeeting/sportsMeetingTable.vue'
import TouchTransform from '../component/gj.touchTransform.js'

require('../../css/activity/sportsMeeting.less')

const vm = new Vue({
    el: '.wrapper',
    components: {
        sorttable
    },
    data: {
        allSortStatus: false, // 总积分显示状态
        allEightSortData: [], // 总榜前八数据
        allSortData: [], // 总榜列表

        itemSortStatus: false, // 运动会榜单显示状态
        itemEightSortData: [], // 分榜前八数据
        itemSortData: [], // 分榜列表

        mapArr: [false, true, false], // 分别对应三种比赛
        scoreStatus: false, // 积分表
        prizeStatus: false, // 奖励列表
        allPage: 1,
        page: 1,
        allSortLock: false,
        sortLock: false,

        common: {},
        sortLoadLock: false,
        sortAllLoadLock: false,
        currentRank: 'boom',
        sortTouchEnity: '',
        sortAllTouchEnity: ''
    },
    created () {
        this.getRankData('all', this.allPage)
        this.getRankData('boom', this.page)
    },
    mounted () {

    },
    methods: {
        allSortToggle () {
            const that = this
            this.allSortStatus = !this.allSortStatus
            Vue.nextTick(function () {
                if (vm.$data.allSortStatus) {
                    var scrollWrap = document.querySelector('.part0 .scroll-wrap')
                    var scrollContent = document.querySelector('.part0 .scroll-content')
                    var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))

                    if (!that.sortAllTouchEnity) {
                        that.sortAllTouchEnity = new TouchTransform('.part0 .scroll-wrap', '.part0 .scroll-content', function (distance) {
                            console.log(distance)
                            var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                            if (contentHeight + distance - scrollWrapHeight < 120) {
                                if (that.sortAllLoadLock) return
                                that.sortAllLoadLock = true
                                that.allPage++
                                that.getRankData('all', that.allPage)
                            }
                        })
                    } else {
                        that.sortAllTouchEnity.refresh()
                    }
                }
            })
        },
        itemSortToggle () {
            const that = this
            this.itemSortStatus = !this.itemSortStatus
            Vue.nextTick(function () {
                if (vm.$data.itemSortStatus) {
                    var scrollWrap = document.querySelector('.part2 .scroll-wrap')
                    var scrollContent = document.querySelector('.part2 .scroll-content')
                    var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))

                    if (!that.sortTouchEnity) {
                        that.sortTouchEnity = new TouchTransform('.part2 .scroll-wrap', '.part2 .scroll-content', function (distance) {
                            console.log(distance)
                            var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                            if (contentHeight + distance - scrollWrapHeight < 120) {
                                if (that.sortLoadLock) return
                                that.sortLoadLock = true
                                that.page++
                                that.getRankData(that.currentRank, that.page)
                            }
                        })
                    } else {
                        that.sortTouchEnity.refresh()
                    }
                }
            })
        },
        // 切换比赛
        mapSelect (event) {
            const id = event.target.getAttribute('data-id')
            const box = ['ten_match', 'boom', 'hide_mission']
            this.currentRank = box[id]
            this.itemSortStatus = false
            this.mapArr = [false, false, false]
            this.mapArr.splice(id, 1, true)
            this.page = 1
            this.getRankData(this.currentRank, this.page)
        },
        // 发送榜单接口
        getRankData (type, page) {
            const that = this
            $.ajax({
                type: 'GET',
                url: '/SportsMeeting/GetRank',
                dataType: 'json',
                data: {
                    type: type,
                    page: page
                },
                success: function (data) {
                    const result = data.data.result.data
                    if (type === 'all') {
                        if (page === 1) {
                            that.allEightSortData = result.slice(0, 8)
                            that.allSortData = result.slice(8)
                        } else {
                            that.allSortData = that.allSortData.concat(result)
                        }
                        if (result.length === 0) return
                        that.sortAllLoadLock = false
                    } else {
                        if (page === 1) {
                            that.itemEightSortData = result.slice(0, 8)
                            that.itemSortData = result.slice(8)
                        } else {
                            that.itemSortData = that.itemSortData.concat(result)
                        }
                        if (result.length === 0) return
                        that.sortLoadLock = false
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    }
})

vm.$data['common'] = common
// initEvent();
// initXHR();
