/**
 * @authors Jesse
 * @date    2017-11-28 14:41:33
 */
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'

require('../../css/activity/weekStarByYear.less')

let page = 1

let starScroll = false

new Vue({
    el: '#app',
    data: {
        showQueen: true, // 显示女王榜
        showWeekStar: false, // 显示周星榜
        showNewStar: false, // 显示新星榜
        showStar: false, // 显示星光榜
        showMyReport: false, // 显示我的成绩单
        showRules: false, // 显示规则
        hideLast: true, // 关闭显示剩余项
        hideFirst: true,
        queenRank: [],
        weekStarRank: [],
        newStarRank: [],
        starRank: [],
        pkList: [],
        weekStarReport: [], // 年度周星成绩单
        weekStarYear: [], // 年度周星榜
        protectStarYear: [], // 年度护星榜
        showWeekStarReport: false, // 显示我的成绩单
        selfHeight: 'auto'
    },
    computed: {},
    created: function () {},
    mounted: function () {
        // 获取初始化页面数据
        axios.get('/WeekStarByYearActivity/Init')
            .then(res => {
                let data = res.data
                // console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.uid = data.data.uid
                    if (!this.uid) {
                        common.goLogin()
                    }
                    this.queenRank = data.data.queen
                    this.weekStarRank = data.data.weekStar
                    this.newStarRank = data.data.newStar
                    this.starRank = data.data.star
                    this.pkList = data.data.pkList
                    this.weekStarReport = data.data.weekStarReport
                    this.weekStarYear = data.data.weekStarYear
                    this.protectStarYear = data.data.protectStarYear
                    // 获取PK榜单初始高度
                    this.$nextTick(function () {
                        var style = window.getComputedStyle(document.querySelector('.result'))
                        this.selfHeight = style.height
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        // 绑定滚动加载
        this.initScrollLoad()
    },
    methods: {
        // 榜单切换
        change (arg) {
            this.showQueen = arg == 0
            this.showWeekStar = arg == 1
            this.showNewStar = arg == 2
            this.showStar = arg == 3
        },
        // 滚动加载
        scrollLoad (ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele)
            var cliHeight = _ele.clientHeight
            var bH = bottomHeight || 100
            var scrollTop = _ele.scrollTop
            var scrollHeight = _ele.scrollHeight
            _ele.addEventListener('scroll', function () {
                cliHeight = _ele.clientHeight
                scrollTop = _ele.scrollTop
                scrollHeight = _ele.scrollHeight
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback()
                }
            }, false)
        },
        // 绑定滚动加载
        initScrollLoad () {
            const that = this
            that.scrollLoad('.star_scroll', 350, function () {
                if (starScroll) return
                starScroll = true
                page++
                that.loadList(page)
            })
        },
        // axios翻页加载内容
        loadList (page) {
            const that = this
            axios.get('/WeekStarByYearActivity/GetStarList', {
                params: {
                    page: page
                }
            })
                .then(res => {
                    let data = res.data.data.data
                    // console.log(data);
                    if (data.length > 0) {
                        that.starRank = that.starRank.concat(data)
                        starScroll = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 点击主播头像，跳转直播间
        inlive (rid) {
            common.goRoom(rid)
        },
        // 点击关注按钮，关注主播
        attention (mid, arr, index) {
            axios.get('/WeekStarByYearActivity/Attention', {
                params: {
                    mid: mid
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    // console.log(arr);
                    // console.log(index);
                    if (_data.errno == 0) {
                        if (arr == 'queenRank') {
                            this.queenRank[index].is_love = true
                        } else if (arr == 'weekStarRank') {
                            this.weekStarRank[index].is_love = true
                        } else if (arr == 'newStarRank') {
                            this.newStarRank[index].is_love = true
                        } else if (arr == 'starRank') {
                            this.starRank[index].is_love = true
                        }
                        // item.is_love = true
                    } else {
                        layer.open({
                            content: _data.msg,
                            time: 3000,
                            closeBtn: 0
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 规则弹窗
        popup (tag) {
            switch (tag) {
            case 'rules':
                this.showRules = true
                break
            case 'weekStarReport':
                this.showWeekStarReport = true
                break
            case 'myReport':
                this.showMyReport = true
                break
            }
        },
        // 关闭弹窗
        close (tag) {
            switch (tag) {
            case 'rules':
                this.showRules = false
                break
            case 'weekStarReport':
                this.showWeekStarReport = false
                break
            case 'myReport':
                this.showMyReport = false
                break
            }
        },
        // 查看主播成绩单
        seeModReport () {
            axios.get('/WeekStarByYearActivity/Share', {
                params: {
                    type: 'moderator',
                    uid: this.uid
                }
            })
                .then(res => {
                    let data = res.data
                    // console.log('share', data);
                    if (data.errno == 0) {
                        window.location.href = '//m.kuaishouvideo.com/dist/activity/weekStarShare.html?type=moderator&uid=' +
							this.uid
                    } else if (data.errno == 103) {
                        layer.open({
                            content: '您不是主播哦，点击“我是用户”即可查看用户数据！',
                            time: 3000,
                            closeBtn: 0
                        })
                    } else if (data.errno == 101) {
                        layer.open({
                            content: '用户不存在！',
                            time: 3000,
                            closeBtn: 0
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 查看用户成绩单
        seeUserReport () {
            window.location.href = '//m.kuaishouvideo.com/dist/activity/weekStarShare.html?type=user&uid=' + this.uid
        },
        // 展开PK榜单
        open () {
            this.hideLast = !this.hideLast
            // result内部渲染的内容展开后一直显示，为了和CSS3动画配合
            this.hideFirst = false
        }
    }
})
