import '../../../css/activity/weekstar/queen4.less'

import Vue from 'vue'
import axios from 'axios'
import PolyfillScroll from '../../component/gj.polyfillScroll.js'

document.body.addEventListener('click', function () {})

new Vue({
    el: '#app',
    data: {
        // 本周礼物
        gift: [true, false, false],
        giftInfo: [],
        giftedInfo: [],
        // 本周周星护星切换
        giftItem: [true, false],
        // 当前列表
        currentList: [],
        currentShowList: [],

        // 上周礼物
        gifted: [true, false, false],
        // 上周周周星战士切换
        giftedItem: [true, false],
        // 上周周星
        currentLastWeekStar: [
            ['', '', '', '', '', ''],
            ['', '', '', '', '', '']
        ],
        lastWeekStar: [],
        // 当前关注状态
        attendCurrent: [false, false, false],
        ruleStatus: false,
        showMore: false,
        swapGift: '收到礼物个数',
        msgBox: false,
        msgBoxContent: '',
        scrollBar: ''
    },
    created () {
        this.adaptation()
        this.getGiftInfo()
        this.getGiftSort(0)
        this.getGiftedSort()
    },
    methods: {
        // 适配机型重定向
        adaptation () {
            let href = window.location
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
                }
            }
        },
        // 礼物信息
        getGiftInfo () {
            const that = this
            axios.get('/NewWeekStar/GiftInfo')
                .then(res => {
                    const _data = res.data.data
                    that.giftInfo = _data.giftInfo
                    that.giftedInfo = _data.giftedInfo
                })
                .catch(err => console.log(err))
        },
        // 本周礼物切换
        giftChange (idx) {
            this.gift = [false, false, false]
            this.gift.splice(idx, 1, true)

            this.giftItem = [false, false]
            this.giftItem.splice(0, 1, true)

            this.swapGift = '收到礼物个数'

            this.getGiftSort(idx)
        },
        giftItemChange (idx) {
            this.giftItem = [false, false]
            this.giftItem.splice(idx, 1, true)

            this.currentShowList = this.currentList[idx]
            this.showMore = false

            this.swapGift = idx == 0 ? '收到礼物个数' : '送出礼物个数'
        },
        // 本周礼物
        getGiftSort (idx) {
            var that = this
            axios.get('/NewWeekStar/GetRank', {
                params: {
                    idx
                }
            })
                .then(res => {
                    var tempArr = []
                    tempArr[0] = res.data.data.infoLeft.reverse()
                    tempArr[1] = res.data.data.infoRight.reverse()
                    that.currentList = tempArr
                    that.currentShowList = that.currentList[0]
                    that.showMore = false

                    for (var i = 0; i < 3; i++) {
                        if (!tempArr[0][i]) continue
                        that.attendCurrent[i] = tempArr[0][i][4]
                    }
                })
        },
        // 上周榜单
        getGiftedSort () {
            const that = this
            axios.get('/NewWeekStar/GetLastRank')
                .then(res => {
                    let lastWeekArr = []
                    let lastData = res.data.data.resultWrap
                    for (let i = 0, len = lastData.length; i < len; i++) {
                        let lastLeft = lastData[i][0].reverse()[0]
                        let lastRight = lastData[i][1].reverse()[0]
                        lastWeekArr.push([lastLeft, lastRight])
                    }
                    if (lastWeekArr[0][0]) {
                        that.currentLastWeekStar = lastWeekArr[0]
                    }
                    that.lastWeekStar = lastWeekArr
                })
                .catch(err => console.log(err))
        },
        // 上周礼物切换
        giftedChange (idx) {
            this.gifted = [false, false, false]
            this.gifted.splice(idx, 1, true)

            if (this.lastWeekStar[idx][0]) {
                this.currentLastWeekStar = this.lastWeekStar[idx]
            }
        },
        // 关注主播
        addAttend (idx, index) {
            const that = this
            if (that.attendCurrent[index]) return
            axios.get('/NewWeekStar/AddLove', {
                params: {
                    id: idx
                }
            })
                .then(res => {
                    let _data = res.data.data
                    if (_data.uid == '0000') {
                        // return common.goLogin();
                    }
                    if (!_data.attResult) {
                        that.msgBox = true
                        that.msgBoxContent = _data.error
                        return
                    }
                    that.attendCurrent.splice(index, 1, true)
                })
                .catch(err => console.log(err))
        },
        // 查看更多
        loadMore () {
            this.showMore = !this.showMore
        },
        // 关闭规则
        closeRule () {
            this.ruleStatus = false
        },
        showRule () {
            this.ruleStatus = true
            if (!this.scrollBar) {
                this.scrollBar = new PolyfillScroll({
                    scrollWrap: '.rules-content',
                    scrollContent: '.scroll-box',
                    bar: {
                        width: '10px',
                        height: '50px',
                        right: '10px',
                        background: '#8e5f51'
                    }
                })
            }
        },
        // 关闭弹框
        closeMsgBox () {
            this.msgBox = false
        },
        // 进入房间页
        goRoom (rid) {
            if (this.giftItem[1]) return
            window.open('/' + rid)
        },
        classObject: function (recommend, index) {
            return {
                recommend: recommend,
                ['sort-avator-' + index]: true
            }
        }
    }
})
