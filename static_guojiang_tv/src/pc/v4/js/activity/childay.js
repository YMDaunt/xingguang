import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import user from 'user'
import layer from 'layer'

require('../../css/activity/childay.less')

var drewJudge = true
var codeJudge = true
var ruleJudge = true

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
        transformEntity1: undefined,
        transformEntity2: undefined,
        transformEntity3: undefined,
        transformEntity4: undefined,
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
                            user.showLoginPanel()
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

        codes () {
            let that = this
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                axios.get('/children/myawardlist')
                    .then(res => {
                        let data = res.data
                        this.myLuckArr = data.data
                        if (this.myLuckArr.length > 0) {
                            this.myLuckJudge = true
                            this.code = !this.code
                            that.transformEntity4 && that.transformEntity4.refresh()
                            if (!that.transformEntity4) {
                                Vue.nextTick(() => {
                                    if (codeJudge) {
                                        const sortWrapElement = document.querySelector('.code-con')
                                        const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                        const sortListElement = document.querySelector('.code-out')
                                        that.transformEntity4 = new PolyfillScroll({
                                            scrollWrap: '.code-con',
                                            scrollContent: '.code-out',
                                            bar: {
                                                width: '10px',
                                                height: '40px',
                                                right: '4px',
                                                'background': 'rgba(200,237,204,1)'
                                            }
                                        })
                                        codeJudge = false
                                    }
                                })
                            }
                        } else {
                            this.myLuckJudge = false
                            this.code = !this.code
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },

        rules () {
            let that = this
            this.rule = !this.rule
            Vue.nextTick(() => {
                console.log(1)
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-out')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-con')
                    that.transformEntity4 = new PolyfillScroll({
                        scrollWrap: '.rule-out',
                        scrollContent: '.rule-con',
                        bar: {
                            width: '10px',
                            height: '40px',
                            right: '4px',
                            'background': 'rgba(200,237,204,1)'
                        }
                    })
                    ruleJudge = false
                }
            })
        },

        tab (tabN) {
            if (tabN == 'choose') {
                this.tabCon = true
            } else {
                this.tabCon = false
            }
            Vue.nextTick(() => {
                let that = this
                if (!that.transformEntity2) {
                    const sortWrapElement = document.querySelector('.user-other')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.other-user')
                    that.transformEntity2 = new PolyfillScroll({
                        scrollWrap: '.user-other',
                        scrollContent: '.other-user',
                        cb: function (distance) {
                            const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                            if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                if (that.scrollLock2) return
                                that.scrollLock2 = true
                                that.userPage++
                                that.initScrollLoadUser(that.userPage)
                            }
                        },
                        bar: {
                            width: '10px',
                            height: '60px',
                            right: '10px',
                            'background': 'rgba(200,237,204,1)'
                        }
                    })
                }
            })
        },

        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
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
                        user.showLoginPanel()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 主播榜滚动加载
        initScrollLoadMod () {
            let that = this
            axios.get('/children/getRank?tag=m', {
                params: {
                    page: that.modPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addModArr = data.data.ranks
                    if (addModArr.length > 0) {
                        that.modArr = that.modArr.concat(addModArr)
                        that.scrollLock1 = false
                        if (!that.transformEntity) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.mod-other')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.other-mod')
                                that.transformEntity = new PolyfillScroll({
                                    scrollWrap: '.mod-other',
                                    scrollContent: '.other-mod',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                            if (that.scrollLock1) return
                                            that.scrollLock1 = true
                                            that.modPage++
                                            that.initScrollLoadMod(that.modPage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '60px',
                                        right: '10px',
                                        'background': 'rgba(200,237,204,1)'
                                    }
                                })
                            })
                        }
                    }
                })
        },

        // 用户榜滚动加载
        initScrollLoadUser () {
            let that = this
            axios.get('/children/getRank?tag=u', {
                params: {
                    page: that.userPage
                }
            })
                .then(res => {
                    const data = res.data
                    const addUserArr = data.data.ranks
                    if (addUserArr.length > 0) {
                        that.userArr = that.userArr.concat(addUserArr)
                        that.scrollLock2 = false
                    }
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
            scroxtVertical = new window.scroxt.Vertical({
                target: '.scroll-out',
                data: arr,
                speed: -5
            })
            if (codeLen < 7) {
                scroxtVertical.stopMove()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

$('.scroll-out').on('mouseover', function () {
    if (codeLen >= 7) {
        scroxtVertical.stopMove()
    }
})

$('.scroll-out').on('mouseout', function () {
    if (codeLen >= 7) {
        scroxtVertical.startMove()
    }
})
