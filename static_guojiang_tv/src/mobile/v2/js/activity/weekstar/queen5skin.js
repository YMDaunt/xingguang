/* 2018.11.5 周星UI改版 mrzjd */
import '../../../css/activity/weekstar/queen5skin.less'

import Vue from 'vue'
import axios from 'axios'
import common from '../../common/common.js'

// ios中激活active伪类
document.body.addEventListener('touchstart', function () {})

// UA重定向
;(function apadation () {
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
}())

new Vue({
    el: '#app',
    data: {
        // 本周礼物
        gift: [true, false, false],
        giftInfo: [], // 活动专属礼物信息
        giftedInfo: [], // 上周周星榜
        // 本周周星护星切换
        giftItem: [true, false],
        // 当前列表
        currentList: [],
        currentShowList: [],

        // 我的排名
        myList: [],
        currentMyList: [],

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
        msgBoxContent: ''
    },
    created () {
        this.getGiftInfo()
        this.getGiftSort(0)
        this.getGiftedSort()
    },
    methods: {
        // 活动专属礼物信息
        getGiftInfo () {
            axios.get('/NewWeekStar/GiftInfo')
                .then(res => {
                    const _data = res.data.data
                    this.giftInfo = _data.giftInfo
                    this.giftedInfo = _data.giftedInfo
                })
                .catch(err => console.log(err))
        },
        // 本周礼物切换
        giftChange (idx) {
            this.gift = [false, false, false]
            this.gift.splice(idx, 1, true)

            this.giftItem = [false, false]
            this.giftItem.splice(0, 1, true)

            this.getGiftSort(idx)
        },
        giftItemChange (idx) {
            this.giftItem = [false, false]
            this.giftItem.splice(idx, 1, true)

            this.currentShowList = this.currentList[idx]
            this.currentMyList = this.myList[idx]
        },
        // 本周礼物
        getGiftSort (idx) {
            var that = this
            axios.get('/NewWeekStar/GetRank', {
                params: {
                    idx
                }
            }).then(res => {
                var tempArr = []
                tempArr[0] = res.data.data.modRank
                tempArr[1] = res.data.data.userRank
                that.currentList = tempArr
                that.currentShowList = that.currentList[0]

                // 我的
                var myArr = []
                myArr[0] =  res.data.data.myRank.mod
                myArr[1] =  res.data.data.myRank.user
                that.myList = myArr
                that.currentMyList = that.myList[0]

                for (var i = 0; i < 3; i++) {
                    if (!tempArr[0][i]) continue
                    that.attendCurrent[i] = tempArr[0][i].isLoved
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
                    console.log(that.lastWeekStar)
                })
                .catch(err => console.log(err))
        },
        // 上周礼物切换
        giftedChange (idx) {
            this.gifted = [false, false, false]
            this.gifted.splice(idx, 1, true)

            if (this.lastWeekStar[idx][0] != undefined) { // eslint-disable-line
                this.currentLastWeekStar = this.lastWeekStar[idx]
            } else {
                this.currentLastWeekStar = null
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
            }).then(res => {
                let _data = res.data.data
                if (_data.uid == '0000') { // eslint-disable-line
                    return common.goLogin()
                } else
                if (!_data.attResult) {
                    alert(_data.error)
                } else {
                    that.attendCurrent.splice(index, 1, true)
                }
            }).catch(err => console.log(err))
        },
        // 查看更多
        loadMore () {
            this.showMore = !this.showMore
        },
        // 关闭规则
        closeRule () {
            this.ruleStatus = false
            document.getElementsByTagName('html')[0].style.cssText += 'height:auto;overflow-y:auto;'
            document.body.style.cssText = ''
        },
        showRule () {
            this.ruleStatus = true
            document.getElementsByTagName('html')[0].style.cssText += 'height:100%;overflow-y:hidden;'
            document.body.style.cssText = 'height:100%;overflow-y:hidden;'
        },
        // 关闭弹框
        closeMsgBox () {
            this.msgBox = false
        },
        // 进入房间页
        goRoom (rid) {
            // if (this.giftItem[1]) return
            common.goRoom(rid, 2)
        },
        classObject: function (recommend, index) {
            return {
                recommend: recommend,
                ['sort-avator-' + index]: true
            }
        }
    }
});