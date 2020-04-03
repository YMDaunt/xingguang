/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:53:25
 */
/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
let common = require('../../../common/common.js')
// data数组
let postData = []

const vm = new Vue({
    el: '#svgContainer',
    data: {
        lotteryMsg: '', // 中奖信息
        clickLock: true, // 点击抽奖锁
        showBox: false, // 弹框显示隐藏
        viewStat: false
    },
    methods: {
        lotteryHandle () {
            if (!this.clickLock) {
                this.clickLock = true
                lottery(postData.pop())
            }
        },
        sureBtn () {
            this.showBox = false
            closeView()
        },
        closeWebView () {
            closeView()
        }
    }
})

// 抽奖xhr
function lottery (data) {
    // cnzz统计
    _czc.push(['_trackEvent', '炸房活动ID' + data['activityId'] + ' app', '参与抽奖的用户'])
    axios({
        method: 'get',
        url: '//m.guojiang.tv/lottery/goLottery',
        params: {
            animate_data: data
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    })
        .then((res) => {
            vm.showBox = true
            let result = res.data
            console.log(result)
            if (result.errno == -100) {
                vm.lotteryMsg = '卧槽，没中'
                return
            }
            if (result.errno == 0) {
            // 判断是否抽取背包物品
                if (result.data.addPackageGift) {
                // 版本号小于 2.8.5 不支持背包
                    var version = common.getVersion()
                    if (parseInt(version.replace(/\./g, '')) < 285) {
                        vm.lotteryMsg = '请移步V2.8.5及以上版本app端<br>查看背包礼物'
                    } else {
                        vm.lotteryMsg = '恭喜你抢到<em>' + result.data.prizeName + '</em>泡泡'
                    }
                    common.refreshBackpack()
                } else if (result.data.addCoin) {
                    var addCoin = result.data.addCoin.toString()
                    // 抽中奖品
                    vm.lotteryMsg = '恭喜你抢到<em>' + result.data.prizeName + '</em>泡泡'
                    common.refreshCoin(addCoin)
                } else if (result.data.prizeId == 0) {
                    vm.lotteryMsg = '卧槽，没中！'
                }
            } else {
                if (result.msg == '101 格子不足') {
                    vm.lotteryMsg = '背包已满，请先腾空后再来领取哦~'
                } else {
                    vm.lotteryMsg = '卧槽，没中！'
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

// 关闭webview
function closeView () {
    clearTimeout(st30)
    vm.viewStat = false
    common.closeWebview()
}

// 炸房通知触发执行
let animItem
let st30
function triggle (data) {
    postData.push(data)
    vm.viewStat = true
    vm.clickLock = true
    // 3s后可以点击抽奖
    setTimeout(function () {
        vm.clickLock = false
    }, 3000)
    // 30s后关闭webview
    st30 = setTimeout(function () {
        closeView()
    }, 30000)

    if (typeof animItem !== 'undefined') {
        animItem.goToAndPlay(0, false)
        return
    }

    animItem = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: '//static.guojiang.tv/src/mobile/v2/js/poplayer/emperor/json/redpack.json'
    })
}

export {
    triggle
}
