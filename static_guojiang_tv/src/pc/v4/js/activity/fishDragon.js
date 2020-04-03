import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.PolyfillScroll.js'
import layer from 'layer'
import user from 'user'

require('../../css/activity/fishDragon.less')

var giftId = 0
var Fjudge = true
var Djudge = true
var ruleJudge = true
new Vue({
    el: '#app',
    data: {
        showWin: false,
        showRule: false,
        showCode: false,
        isFollow: false,
        scrollLock1: false,
        scrollLock2: false,
        scrollLock3: false,
        animate: false,
        userMesArr: [], // 用户相关信息
        codeArr: [], // 抽奖数据
        mycodeArr: [], // 我的抽奖数据
        modRankArr: [], // 主播榜单
        userRankArr: [], // 用户榜单
        fishPage: 0,
        dragonPage: 0,
        transformEntity: undefined,
        transformEntity2: undefined,
        codePage: 1,
        uid: 0
    },
    created: function () {
        // 个人初始化信息
        axios.get('/FishActivity/Init')
            .then(res => {
                let data = res.data
                if (data.errno == 0) {
                    this.uid = data.data.uid
                    if (!this.uid) {
                        return common.goLogin()
                    }
                    this.userMesArr = data.data.userMes
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
        // 滚动加载
        this.getUserRank(0)
        this.initScrollLoadFish()
    },
    methods: {

        // 分享
        share: function () {
            layer.msg('请移步APP分享')
        },

        myDrew: function () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                this.showWin = !this.showWin
                this.showCode = !this.showCode
                this.mycodeArr = []
                this.codePage = 1
                this.getMyCode(1)
            }
        },

        showRules: function () {
            let that = this
            this.showWin = !this.showWin
            this.showRule = !this.showRule
            if (ruleJudge) {
                const sortWrapElement = document.querySelector('.rule-show-cover')
                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                const sortListElement = document.querySelector('.rule-show')
                that.transformEntity = new PolyfillScroll({
                    scrollWrap: '.rule-show-cover',
                    scrollContent: '.rule-show',
                    bar: {
                        width: '10px',
                        height: '40px',
                        right: '2px',
                        'background': 'rgba(0,0,0,0.3)'
                    }
                })
                ruleJudge = false
            }
        },

        // 没机会
        nodrew: function () {
            $('.tip-win').show()
            $('.drew-tips').show()
            $('.nothing').find('strong').text('抽奖次数无库存 快去送小锦鲤吧！')
            $('.nothing').show().siblings().hide()
            $('.knowed').show()
            $('.close-btn').show()
        },

        // 抽奖
        drew: function () {
            if (!this.uid) {
                user.showLoginPanel()
            } else {
                if (!drewLock) {
                    drewLock = true
                    axios.get('/FishActivity/Drew')
                        .then(res => {
                            let data = res.data
                            // 抽奖成功
                            giftId = data.data.drew // 礼物id
                            var error = data.data.subCode
                            if (typeof (giftId) === 'number') {
                                $('.drew-btn').removeClass('drew-btn').addClass('drew-btned')
                                generatorImage(0)
                                // 未中奖
                                if (giftId == 0) {
                                } else
                                // 20克拉
                                if (giftId == 854 || giftId == 864) {
                                    generatorImage(854)
                                } else
                                // 共享单车
                                if (giftId == 855 || giftId == 865) {
                                    generatorImage(855)
                                } else
                                // 小锦鲤
                                if (giftId == 856 || giftId == 866) {
                                    generatorImage(856)
                                } else
                                // 炸房
                                if (giftId == 857) {
                                    generatorImage(857)
                                } else
                                // 50000克拉
                                if (giftId == 858) {
                                    generatorImage(858)
                                } else
                                // 10000克拉
                                if (giftId == 859) {
                                    generatorImage(859)
                                } else
                                // 皮皮虾座驾
                                if (giftId == 860) {
                                    generatorImage(860)
                                } else
                                // 筋斗云座驾
                                if (giftId == 861) {
                                    generatorImage(861)
                                } else
                                // 旺财来了
                                if (giftId == 862) {
                                    generatorImage(862)
                                } else
                                // 姜饼屋
                                if (giftId == 863) {
                                    generatorImage(863)
                                }
                                this.userMesArr.leftDrawTimes--
                                if (this.userMesArr.leftDrawTimes < 0) {
                                    this.userMesArr.leftDrawTimes = 0
                                }
                            } else if (!giftId) {
                                if (error == 201) {
                                    var msg = '系统错误，请稍后再试！'
                                } else
                                if (error == 202) {
                                    var msg = '活动未开始！'
                                } else
                                if (error == 203) {
                                    var msg = '活动已结束！'
                                } else
                                if (error == 204) {
                                    var msg = '用户不存在！'
                                } else
                                if (error == 205) {
                                    var msg = '抽奖次数无库存 快去送小锦鲤吧！'
                                } else
                                if (error == 206) {
                                    var msg = '抽奖频繁啦！'
                                } else
                                if (error == 207) {
                                    var msg = '抽奖类型获取出错！'
                                } else {
                                    var msg = '抽奖错误！'
                                }

                                $('.nothing').find('strong').text(msg)
                                $('.nothing').show().siblings().hide()
                                $('.drew-tips').show()
                                $('.tip-win').show()
                                $('.knowed').show()
                                $('.close-btn').show()
                                drewLock = false
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }
        },

        // 展示
        showF: function () {
            if (Fjudge) {
                $('.fish-top-other').css({
                    'height': '1026px',
                    'overflow': 'visible'
                })
                $('.fish-top').find('.click-btn').text('收起')
                Fjudge = false
            } else {
                $('.fish-top-other').css({
                    'height': '0px',
                    'overflow': 'hidden'
                })
                $('.fish-top').find('.click-btn').text('展开')
                Fjudge = true
            }
        },
        showD: function () {
            this.initScrollLoadDragon()
            if (Djudge) {
                $('.dragon-top-other').css({
                    'height': '1026px',
                    'overflow': 'visible'
                })
                $('.dragon-top').find('.click-btn').text('收起')
                Djudge = false
            } else {
                $('.dragon-top-other').css({
                    'height': '0px',
                    'overflow': 'hidden'
                })
                $('.dragon-top').find('.click-btn').text('展开')
                Djudge = true
            }
        },

        // 关注
        attention (e, index) {
            axios.get('/DatuanziActivity/Attention', {
                params: {
                    mid: e.target.getAttribute('data-mid')
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    console.log(_data)
                    if (_data.errno == 0) {
                        this.modRankArr[index]['is_attention'] = true
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

        // 跳转直播
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid) // 主播用户id
        },

        // 鱼榜滚动加载
        initScrollLoadFish () {
            let that = this
            axios.get('/FishActivity/GetModRank', {
                params: {
                    page: that.fishPage
                }
            })
                .then(res => {
                    const data = res.data
                    const modArr = data.data.ranks
                    if (modArr.length > 0) {
                        that.modRankArr = that.modRankArr.concat(modArr)
                        that.scrollLock1 = false
                        if (!that.transformEntity) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.log-wrap')
                                console.log(sortWrapElement)
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.top-scroll-fish')
                                that.transformEntity = new PolyfillScroll({
                                    scrollWrap: '.log-wrap',
                                    scrollContent: '.top-scroll-fish',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        console.log(sortListHeight)
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                            if (that.scrollLock1) return
                                            that.scrollLock1 = true
                                            that.fishPage++
                                            that.initScrollLoadFish(that.fishPage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '40px',
                                        right: '2px',
                                        'background': 'rgba(0,0,0,0.3)'
                                    }
                                })
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // 龙榜滚动加载
        initScrollLoadDragon () {
            let that = this
            axios.get('/FishActivity/GetUserRank', {
                params: {
                    page: that.dragonPage
                }
            })
                .then(res => {
                    const data = res.data
                    const userArr = data.data.useranks
                    if (userArr.length > 0) {
                        if (that.dragonPage == 0) {
                            that.userRankArr = that.userRankArr
                        } else {
                            that.userRankArr = that.userRankArr.concat(userArr)
                        }
                        that.scrollLock2 = false
                        if (!that.transformEntity2) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.log-wrap2')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.top-scroll-dragon')
                                that.transformEntity2 = new PolyfillScroll({
                                    scrollWrap: '.log-wrap2',
                                    scrollContent: '.top-scroll-dragon',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        console.log(sortListHeight)
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                            if (that.scrollLock2) return
                                            that.scrollLock2 = true
                                            that.dragonPage++
                                            that.initScrollLoadDragon(that.dragonPage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '40px',
                                        right: '2px',
                                        'background': 'rgba(0,0,0,0.3)'
                                    }
                                })
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取用户列表
        getUserRank (dragonPage) {
            const that = this
            axios.get('/FishActivity/GetUserRank', {
                params: {
                    page: dragonPage
                }
            })
                .then(res => {
                    let data = res.data.data.useranks
                    if (data.length > 0) {
                        that.userRankArr = that.userRankArr.concat(data)
                        that.scrollLock2 = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        // ajax获取我的中奖纪录
        getMyCode (codePage) {
            let that = this
            axios.get('/FishActivity/MyCode', {
                params: {
                    pageNo: codePage
                }
            })
                .then(res => {
                    const _data = res.data.data.myCode
                    let judgePage = _data.hasNext
                    const codeArr = _data.data
                    console.log(codeArr)
                    if (codeArr.length > 0) {
                        that.mycodeArr = that.mycodeArr.concat(_data.data)
                        that.scrollLock3 = false
                        if (codePage === 1) {
                            that.transformEntity2 && that.transformEntity2.refresh()
                        }
                        if (!that.transformEntity2) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.mycode-list-cover')
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.mycode-list')
                                that.transformEntity2 = new PolyfillScroll({
                                    scrollWrap: '.mycode-list-cover',
                                    scrollContent: '.mycode-list',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 120) {
                                            if (that.scrollLock3) return
                                            that.scrollLock3 = true
                                            that.codePage++
                                            that.getMyCode(that.codePage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '40px',
                                        right: '2px',
                                        'background': 'rgba(0,0,0,0.3)'
                                    }
                                })
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

// jQ抽奖等
var drewLock = false
function generatorImage (result) {
    const map = {
        0: [], // 没中奖
        854: [3, 3], // 20克拉
        855: [1, 1], // 共享单车
        856: [4, 4], // 小锦鲤
        857: [0, 0, 0], // 炸房
        858: [2, 2, 2], // 50000克拉
        859: [3, 3, 3], // 10000克拉
        860: [1, 1, 1], // 皮皮虾
        861: [4, 4, 4], // 筋斗云
        862: [0, 0], // 旺财来了
        863: [2, 2], // 姜饼屋
        864: [3, 3], // 20克拉
        865: [1, 1], // 共享单车
        866: [4, 4] // 小锦鲤
    }
    const gift = [0, 1, 2, 3, 4] // = > 索引值 0~4 分别对应 6 熊 allin 车 星星
    const giftValue = map[result]

    const giftArr = []
    if (giftValue.length === 0) {
        for (var i = 0; i < 3; i++) {
            giftArr.push(gift.splice(~~(Math.random() * gift.length), 1)[0])
        }
        // return giftArr;
        console.log(giftArr)
        drewNum(giftArr, result)
    } else {
        for (let i = 3, len = giftValue.length; i > len; i--) {
            const currentLen = giftValue.length
            const temp = [].concat(gift) // = > 礼物副本
            temp.splice(giftValue[0], 1) // = > 把中奖礼物在副本中去掉
            const giftRandom = ~~(Math.random() * temp.length) // = > 在副本中取出一个礼物
            giftValue.splice(Math.floor(Math.random() * (currentLen + 1)), 0, temp[giftRandom]) // = > 随机插入取出的礼物
        }
        console.log(giftValue)
        drewNum(giftValue, result)
    }
}

function drewNum (arr) {
    // 重置抽奖位置
    $('.drew-box').find('ul').css({
        'transition-duration': '0s',
        'transform': 'translateY(0px)'
    })
    $('.drew-box > div').eq(2).find('ul')[0].removeEventListener('webkitTransitionEnd', showWin)

    // 开始抽奖
    $('.drew-box').find('div').each(function (i) {
        var picHeight = $(this).find('li').height()
        var tranY = -picHeight * (arr[i] + 30)
        var time = 5 + i
        $('.drew-box').find('div').eq(i).find('ul').css({
            'transition-duration': time + 's',
            'transform': 'translateY(' + tranY + 'px)'
        })
    })

    $('.drew-box > div').eq(2).find('ul')[0].addEventListener('webkitTransitionEnd', showWin)
}

// tab
function tab () {
    $('.tab-btn > div').find('b').on('click', function () {
        var tabIndex = $(this).parent().index()
        if (tabIndex == 0) {
            $(this).addClass('fish-choose')
            $('.dragon-choose').removeClass('dragon-choose')
        } else {
            $(this).addClass('dragon-choose')
            $('.fish-choose').removeClass('fish-choose')
        }
        $('.top-tab').children('div').eq(tabIndex).show().siblings('div').hide()
    })
}tab()

// 弹窗显示
function showWin () {
    $('.drew-btned').removeClass('drew-btned').addClass('drew-btn')
    if (giftId == 0) {
        $('.nothing').find('strong').text('什么也没有！再来一次！')
        $('.nothing').show().siblings().hide()
        $('.knowed').show()
        $('.close-btn').show()
    } else
    if (giftId == 854 || giftId == 864) {
        threeDom()
        $('.other-drew').find('span').text('20克拉')
    } else
    if (giftId == 855 || giftId == 865) {
        threeDom()
        $('.other-drew').find('span').text('共享单车1日体验卡')
    } else
    if (giftId == 856 || giftId == 866) {
        threeDom()
        $('.other-drew').find('span').text('小锦鲤X1')
    } else
    if (giftId == 857) {
        $('.speacial').show().siblings().hide()
        $('.knowed').show()
        $('.close-btn').show()
        $('.speacial').find('p').eq(0).find('span').text('全平台撒钱机会')
    } else
    if (giftId == 858) {
        threeDom()
        $('.other-drew').find('span').text('50000克拉')
    } else
    if (giftId == 859) {
        threeDom()
        $('.other-drew').find('span').text('10000克拉')
    } else
    if (giftId == 860) {
        threeDom()
        $('.other-drew').find('span').text('皮皮虾座驾（标准版）7日体验卡')
    } else
    if (giftId == 861) {
        threeDom()
        $('.other-drew').find('span').text('筋斗云座驾（7日体验卡）')
    } else
    if (giftId == 862) {
        threeDom()
        $('.other-drew').find('span').text('旺财来了X1')
    } else
    if (giftId == 863) {
        threeDom()
        $('.other-drew').find('span').text('姜饼屋X1')
    }
    $('.tip-win').show()
    $('.drew-tips').show()
    drewLock = false

    // 如果用户抽奖时手动弹出其他弹窗，则强制关闭
    $('.rule-con').hide()
}

$('.close-btn').on('click', function () {
    $(this).parent().hide()
    $('.tip-win').hide()
})

$('.knowed').on('click', function () {
    $(this).parent().hide()
    $('.tip-win').hide()
})

function threeDom () {
    $('.other-drew').show().siblings().hide()
    $('.knowed').show()
    $('.close-btn').show()
}

// 中奖数据
var liHe = 0
var scroxtVertical
var codeLen = 0
window.onload = function () {
    $.ajax({
        url: '/FishActivity/Code',
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            var strArr = data.data.drewCode
            codeLen = strArr.length
            var arr = []
            for (var i = 0; i < codeLen; i++) {
                var str = `
                    <span class="drew-user-name">${strArr[i].nickname}</span>
                    <span>抽中</span>
                    <span class="prize">${strArr[i].prizeName}</span>
                    `
                arr.push(str)
            }
            scroxtVertical = new scroxt.Vertical({
                target: '.drew-scroll-box',
                data: arr,
                speed: -10
            })
        },
        error: function (err) {
            console.log(err)
        }
    })
}

$('.drew-scroll').on('mouseover', '.drew-scroll-box', function () {
    if (codeLen > 10) {
        scroxtVertical.stopMove()
    }
})

$('.drew-scroll').on('mouseout', '.drew-scroll-box', function () {
    if (codeLen > 10) {
        scroxtVertical.startMove()
    }
})
