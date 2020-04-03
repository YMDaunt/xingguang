/*  ——换周星——
* 换礼物图片，本周礼物图片名字为 gift.png，上周为 gifted.png
* 周星礼物名字：giftName数组
* 周星礼物ID更换：
*    文件地址：videochat\web\protected\modules\mobile\controllers\NewWeekStarController.php
*    更换 $pid 和 $pidPre 数组
*
*
*/
import '../../../css/activity/weekstar/queen3.less'
import Vue from 'vue'
import axios from 'axios'
import common from '../../common/common.js'

document.body.addEventListener('click', function () {})

var vm = new Vue({
    el: '#app',
    data: {
        // 本周礼物
        gift: [true, false, false],
        giftInfo: [],
        giftedInfo: [],
        // 本周周星战士切换
        giftItem: [true, false],
        // 列表当前礼物
        giftCurrent: '',
        // 上周礼物
        gifted: [true, false, false],
        // 上周周周星战士切换
        giftedItem: [true, false],

        // 当前列表
        currentList: [],
        currentShowList: [],
        // 上周周星
        lastWeekStar: [],
        currentLastWeekStar: [['', '', '', '', '', ''], ['', '', '', '', '', '']],
        // 活动规则
        actMsgBox: false,
        // 是否查看更多
        showMore: false,
        // 规则
        ruleStatus: false,
        // 关注
        attendStatus: 0,
        attendCurrent: [false, false, false], // 当前关注状态
        attendAnchor: [false, false, false],
        attendUser: [false, false, false],
        // 收到送出礼物切换
        swapGift: '收到礼物个数',
        // 弹框
        msgBox: false,
        msgBoxContent: ''
    },
    created () {
        this.getGiftInfo()
        this.getGiftSort(0)
        this.getGiftedSort()
    },
    methods: {
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

            this.attendStatus = 0
            // this.attendCurrent = idx ? this.attendUser : this.attendAnchor;

            this.swapGift = '收到礼物个数'

            this.getGiftSort(idx)
        },
        giftItemChange (idx) {
            this.giftItem = [false, false]
            this.giftItem.splice(idx, 1, true)

            this.currentShowList = this.currentList[idx]
            this.showMore = false

            this.swapGift = idx == 0 ? '收到礼物个数' : '送出礼物个数'

            this.attendCurrent = idx == 0 ? this.attendAnchor : this.attendUser
        },
        // 上周礼物切换
        giftedChange (idx) {
            this.gifted = [false, false, false]
            this.gifted.splice(idx, 1, true)
            if (this.lastWeekStar[idx][0]) {
                this.currentLastWeekStar = this.lastWeekStar[idx]
            }
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
                        that.attendAnchor[i] = tempArr[0][i][4]
                    }
                    for (var i = 0; i < 3; i++) {
                        if (!tempArr[1][i]) continue
                        that.attendUser[i] = tempArr[1][i][4]
                    }
                    that.attendCurrent = that.attendAnchor
                })
                .catch(error => console.log(error))
        },
        // 上周榜单
        getGiftedSort (idx) {
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
                        return common.goLogin()
                    }
                    if (!_data.attResult) {
                        that.msgBox = true
                        that.msgBoxContent = _data.error
                        return
                    }
                    if (that.attendStatus == 0) {
                        that.attendAnchor[index] = true
                        that.attendCurrent.splice(index, 1, true)
                    } else {
                        that.attendUser[index] = true
                        that.attendCurrent.splice(index, 1, true)
                    }
                })
                .catch(err => console.log(err))
        },

        // 上周礼物
        // 进入房间页
        goRoom (rid) {
            if (this.giftItem[1]) return
            common.goRoom(rid, 2)
        },
        goLastRoom (rid) {
            if (rid) {
                common.goRoom(rid, 2)
            }
        },
        // 查看更多
        loadMore () {
            this.showMore = true
        },
        // 收起
        loadLess () {
            this.showMore = false
        },
        // 关闭规则
        closeRule () {
            this.ruleStatus = false
        },
        showRule () {
            this.ruleStatus = true
        },
        // 关闭弹框
        closeMsgBox () {
            this.msgBox = false
        },
        boxTarget () {

        }
    }
})
