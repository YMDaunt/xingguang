/*  ——换周星——
* 换礼物图片，本周礼物图片名字为 gift.png，上周为 gifted.png
* 周星礼物名字：giftName数组
* 周星礼物ID更换：
*    文件地址：videochat\web\protected\modules\mobile\controllers\NewWeekStarController.php
*    更换 $pid 和 $pidPre 数组
*
*
*/
import '../../../css/activity/weekstar/queen.less'
import Vue from 'vue'
import axios from 'axios'
import common from '../../common/common.js'

document.body.addEventListener('click', function () {})

// 本周礼物切换

var vm = new Vue({
    el: '#app',
    data: {
        // 本周礼物
        gift: [true, false, false],
        giftName: ['仙女棒', '晚礼服', '南瓜马车'],
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
        currentLastWeekStar: [],
        // 活动规则
        actMsgBox: false

    },
    computed: {

    },
    created () {
        this.giftCurrent = this.giftName[0]
        this.getRank(0)
        this.getLastWeek()
    },
    methods: {
        // 上一周
        getLastWeek () {
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
                    that.currentLastWeekStar = lastWeekArr[0]
                    that.lastWeekStar = lastWeekArr
                })
                .catch(err => console.log(err))
        },
        // 上一周的主播房间
        goLastWeekRoom (rid) {
            common.goRoom(rid, 2)
        },
        // 本周礼物切换 true为本周，false为上周
        giftchange (idx, bool) {
            const that = this
            if (bool) {
                this.giftCurrent = this.giftName[idx]
                this.gift = this.gift.map((value, index) => {
                    if (index == idx) {
                        that.getRank(idx)
                        return true
                    } else return false
                })
                this.giftItem = [true, false]
            } else {
                this.gifted = this.gifted.map((value, index) => {
                    if (index == idx) {
                        that.currentLastWeekStar = that.lastWeekStar[idx]
                        return true
                    } else return false
                })
            }
        },
        getRank (idx) {
            var that = this
            axios.get('/NewWeekStar/GetRank', {
                params: {
                    idx
                }
            })
                .then(res => {
                    var tempArr = []
                    tempArr[0] = res.data.data.infoLeft.reverse().splice(0, 10)
                    tempArr[1] = res.data.data.infoRight.reverse().splice(0, 10)
                    that.currentList = tempArr
                    that.currentShowList = that.currentList[0]
                })
                .catch(error => console.log(error))
        },
        // 周星战士切换
        giftWeekSoldier (idx) {
            this.currentShowList = this.currentList[idx]
            this.giftItem = this.giftItem.map((value, index) => {
                if (idx == index) return true
                else return false
            })
        },

        // 本周名次
        compSortRank: function (index) {
            return 'sort-rank-' + index
        },
        // 跳转到房间页
        queenGoRoom (rid) {
            if (this.giftItem[0]) {
                common.goRoom(rid, 2)
            }
        },
        // 关注
        attentHandle (id, idx) {
            const that = this
            if (that.currentShowList[idx][4]) return
            axios.get('/NewWeekStar/addLove', {
                params: {
                    id
                }
            })
                .then(res => {
                    if (res.data.data.uid === '0000') return common.goLogin()
                    if (res.data.data.attResult) {
                        if (that.giftItem[0]) {
                            that.currentList[0][idx].splice(4, 1, true)
                        } else {
                            that.currentList[1][idx].splice(4, 1, true)
                        }
                    }
                })
                .catch(error => console.log(error))
        },
        // 活动规则
        setActMsg () {
            this.actMsgBox = true
        },
        closeActMsg () {
            this.actMsgBox = false
        },
        // 获取二维数组的值
        getLastStarValue (i, j) {
            const first = this.currentLastWeekStar[i]
            if (typeof first === 'undefined') return undefined
            return first[j]
        }
    }
})
