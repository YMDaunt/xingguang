import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'

require('../../css/activity/childay.less')

const os = (function () {
    var ua = navigator.userAgent

    var isWindowsPhone = /(?:Windows Phone)/.test(ua)

    var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone

    var isAndroid = /(?:Android)/.test(ua)

    var isFireFox = /(?:Firefox)/.test(ua)

    var isChrome = /(?:Chrome|CriOS)/.test(ua)

    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))

    var isPhone = /(?:iPhone)/.test(ua) && !isTablet

    var isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

var drewJudge = true

if (os.isPc) location.href = '//www.kuaishouvideo.com/activity/childay.html'

new Vue({
    el: '#app',
    data: {
        modArr: [],
        userArr: [],
        mesArr: [],
        drewArr: [],
        myLuckArr: [],
        myModArr: [],
        myUserArr: [],
        myLuckJudge: true,
        tabCon: true,
        rule: false,
        code: false,
        win: false, // 中奖
        noWin: false, // 没中奖、没机会等
        noText: '',
        yesText: '',
        yesThing: '',
        yesPosi: '背包',
        scrollLock1: false,
        scrollLock2: false,
        modPage: 1,
        userPage: 1,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/children/userInfo')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.id
                    if (!this.uid) {
                        return common.goLogin()
                    }
                    this.userMesArr = data.data.userMes
                }
            })
            .catch(err => {
                console.log(err)
            })

        // 抽奖信息
        axios.get('/children/profile')
            .then(res => {
                let data = res.data
                this.mesArr = data.data
                $('.step').eq(this.mesArr.circleIndex).addClass('now')
            })
            .catch(err => {
                console.log(err)
            })

        // 主播榜单
        axios.get('/children/getRank?tag=m')
            .then(res => {
                let data = res.data
                this.modArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })

        // 用户榜单
        axios.get('/children/getRank?tag=u')
            .then(res => {
                let data = res.data
                this.userArr = data.data.ranks
            })
            .catch(err => {
                console.log(err)
            })

        // 我的主播排名
        axios.get('/children/myrank?type=mod')
            .then(res => {
                let data = res.data
                this.myModArr = data.data
            })
            .catch(err => {
                console.log(err)
            })

        // 我的用户排名
        axios.get('/children/myrank?type=user')
            .then(res => {
                let data = res.data
                this.myUserArr = data.data
            })
            .catch(err => {
                console.log(err)
            })
    },

    mounted: function () {
        // 滚动加载
        this.initScrollLoadMod()
        this.initScrollLoadUser()
    },

    methods: {
        // 抽奖
        drew () {
            if (drewJudge) {
                drewJudge = false
                axios.get('/children/lottery')
                    .then(res => {
                        let data = res.data
                        let _this = this
                        // 抽奖成功
                        if (data.errno == 0) {
                            this.drewArr = data.data
                            // 再次更新进度与次数
                            this.mesArr.currentNum = this.drewArr.currentNum
                            this.mesArr.targetNum = this.drewArr.targetNum
                            this.mesArr.leftTimes = this.drewArr.leftTimes

                            // 获取位置
                            var nowIndex = this.drewArr.currentIndex
                            var nextIndex = this.drewArr.nextIndex
                            var moveStep = 0
                            // 如果+1圈
                            if (nowIndex > nextIndex) {
                                moveStep = (nextIndex + (24 - nowIndex) + 1)
                            } else {
                                moveStep = (nextIndex - nowIndex)
                            }
                            // 创建骰子
                            var timer = Math.floor(Math.random() * 1000 + 1500)
                            var result = 'stop stop' + moveStep
                            $('.gif').show()
                            setTimeout(() => {
                                $('.gif').hide()
                                $('.stop').show()
                                $('.stop').attr('class', result)
                            }, timer)

                            // 500ms后开始移动
                            setTimeout(() => {
                                var x = setInterval(function () {
                                    nowIndex++
                                    if (nowIndex == nextIndex) {
                                        clearInterval(x)
                                    } else
                                    if (nowIndex > 24) {
                                        nowIndex = nowIndex - 25
                                        // 如果刚好等于0，回到起点
                                        if (nowIndex == nextIndex) {
                                            clearInterval(x)
                                        }
                                    }
                                    move(nowIndex)
                                }, 400)

                                function move (index) {
                                    if (index == 0) {
                                        $('.step').eq(index).addClass('now')
                                        $('.step').eq(24).removeClass('now')
                                    } else {
                                        $('.step').eq(index).addClass('now')
                                        $('.step').eq(index - 1).removeClass('now')
                                    }
                                    // 停止后
                                    if (nowIndex == nextIndex) {
                                        setTimeout(() => {
                                        // 重置
                                        // 结果提示延迟300ms
                                            $('.gif').hide()
                                            $('.stop').hide()
                                            // 解锁
                                            drewJudge = true
                                            // 没有中奖
                                            if (!_this.drewArr.award) {
                                                _this.noWin = !_this.noWin
                                                _this.noText = _this.drewArr.tip
                                            } else {
                                                if (_this.drewArr.tip == '50000克拉' || _this.drewArr.tip == '100克拉') {
                                                    _this.yesPosi = '账户'
                                                } else {
                                                    _this.yesPosi = '背包'
                                                }
                                                _this.yesThing = _this.drewArr.tip
                                                _this.win = !_this.win
                                            }
                                        }, 800)
                                    }
                                }
                            }, timer + 300)
                        } else
                        if (data.errno == 100) {
                            return common.goLogin()
                            drewJudge = true
                        } else
                        if (data.errno == 102) {
                            this.noWin = !_this.noWin
                            this.noText = '呀，机会用完了，快去送大富翁吧~'
                            drewJudge = true
                        } else {
                            this.noText = data.msg
                            this.noWin = !_this.noWin
                            drewJudge = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
        },

        // 我的记录
        mycode () {
            this.code = !this.code
            if (!this.uid) {
                return common.goLogin()
            } else {
                axios.get('/children/myawardlist')
                    .then(res => {
                        let data = res.data
                        this.myLuckArr = data.data
                        if (this.myLuckArr.length > 0) {
                            this.myLuckJudge = true
                        } else {
                            this.myLuckJudge = false
                            console.log(1)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            common.goRoom(rid) // 主播房间id //主播用户id
        },

        attention (e, index) {
            axios.get('/children/Attention', {
                params: {
                    mid: e.target.getAttribute('data-id')
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        this.modArr[index]['is_attention'] = true
                    } else if (!this.uid) {
                        return common.goLogin()
                    }
                })
                .catch(err => {
                    console.log(err)
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
        },

        // 主播榜滚动加载
        initScrollLoadMod () {
            const that = this
            that.scrollLoad('.mod-other', 150, function () {
                if (that.scrollLock1) return
                that.scrollLock1 = true
                that.modPage++
                that.getModRank(that.modPage)
            })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            const that = this
            that.scrollLoad('.user-other', 150, function () {
                if (that.scrollLock2) return
                that.scrollLock2 = true
                that.userPage++
                that.getUserRank(that.userPage)
            })
        },

        // ajax获取主播列表
        getModRank (modPage) {
            const that = this
            axios.get('/children/getRank?tag=m', {
                params: {
                    page: modPage
                }
            })
                .then(res => {
                    let data = res.data.data.ranks
                    if (data.length > 0) {
                        that.modArr = that.modArr.concat(data)
                        that.scrollLock1 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取用户列表
        getUserRank (userPage) {
            const that = this
            axios.get('/children/getRank?tag=u', {
                params: {
                    page: userPage
                }
            })
                .then(res => {
                    let data = res.data.data.ranks
                    if (data.length > 0) {
                        that.userArr = that.userArr.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

// 中奖滚动
var liHe = 0
var codeLen = 0
var arr = []
var scroxtVertical
var str = ''
window.onload = function () {
    $.ajax({
        url: '/children/awardlist',
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            var strArr = data.data
            codeLen = strArr.length
            for (var i = 0; i < codeLen; i++) {
                var str = `
                    <li>
                        <span>${strArr[i].nickname}</span> 
                        <span>中了</span> 
                        <span>${strArr[i].prizeName}</span>
                    </li>
                    `
                arr.push(str)
            }
            if (os.isPhone) {
                scroxtVertical = new window.scroxt.Vertical({
                    target: '.scroll-out',
                    data: arr,
                    speed: -5
                })
            } else {
                scroxtVertical = new window.scroxt.Vertical({
                    target: '.scroll-out',
                    data: arr,
                    speed: -10
                })
            }
            if (codeLen < 7) {
                scroxtVertical.stopMove()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 纪录滚动
var scrollJudge = true

$('.scroll-out').on('touchstart', function () {
    if (codeLen >= 7) {
        if (scrollJudge) {
            scroxtVertical.stopMove()
            scrollJudge = false
        }
    }
})
$('.scroll-out').on('touchend', function () {
    if (codeLen >= 7) {
        if (!scrollJudge) {
            scroxtVertical.startMove()
            scrollJudge = true
        }
    }
})
