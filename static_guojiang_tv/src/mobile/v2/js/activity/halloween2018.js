'use strict'

import Vue from 'vue'
import axios from 'axios'
import { goRoom, goLogin, goRecharge } from 'common'
import bodymovin from '../component/bodymovin.min.js'
import '../../css/activity/halloween2018.less'
// import './directive/xgSkeleton'

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

Vue.directive('skt', {})

var playSvg = function (path, type) {
    var svgContainer = document.querySelector('.svg-container')
    return bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: type || 'html',
        loop: true,
        autoplay: false,
        path: path
    })
}

/* ajax */
var service = {
    state: {
        searchById: false
    },
    _apiHandler: function (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error(res.msg)
            throw new Error(res.msg)
        }
    },
    // 活动初始化
    initPage: function () {
        return axios.get('/Hallo2018/initInfo').then(this._apiHandler)
    },
    // 主播top9榜
    getTop9: function () {
        return axios.get('/Hallo2018/getRanks', {
            params: {
                pageNo: 1,
                pageSize: 9,
                type: 'ticket'
            }
        }).then(this._apiHandler)
    },
    // 主播总榜
    getZhuboList: function (pageNo, pageSize) {
        return axios.get('/Hallo2018/getRanks', {
            params: {
                pageNo,
                pageSize,
                type: 'total'
            }
        }).then(this._apiHandler)
    },
    // 主播日期1榜
    getZhuboDays1: function (pageNo, pageSize) {
        // 10.29
        return axios.get('/Hallo2018/getRanks', {
            params: {
                pageNo,
                pageSize,
                type: 'mod',
                date: 1
            }
        }).then(this._apiHandler)
    },
    // 主播日期2榜
    getZhuboDays2: function (pageNo, pageSize) {
        // 10.30
        return axios.get('/Hallo2018/getRanks', {
            params: {
                pageNo,
                pageSize,
                type: 'mod',
                date: 2
            }
        }).then(this._apiHandler)
    },
    // 主播日期3榜
    getZhuboDays3: function (pageNo, pageSize) {
        // 10.31
        return axios.get('/Hallo2018/getRanks', {
            params: {
                pageNo,
                pageSize,
                type: 'mod',
                date: 3
            }
        }).then(this._apiHandler)
    },
    // 用户榜
    getUserList: function (pageNo, pageSize) {
        return axios.get('/Hallo2018/getRanks', {
            params: {
                pageNo,
                pageSize,
                type: 'user'
            }
        }).then(this._apiHandler)
    },
    // 购买
    buyGifts: function (gid, gnum) {
        return axios.get('/Hallo2018/buyProduct', {
            params: {
                pid: gid,
                num: gnum
            }
        }).then(this._apiHandler)
    },
    // 投票
    vote: function (zhuboId, tickets) {
        return axios.get('/Hallo2018/vote', {
            params: {
                num: tickets,
                mid: zhuboId
            }
        }).then(this._apiHandler)
    },
    // 我的奖品
    getMyAwards: function (pageNo, pageSize) {
        return axios.get('/Hallo2018/award', {
            params: {
                pageNo, pageSize
            }
        }).then(this._apiHandler)
    },
    // 兑换
    exchange: function (type) {
        // 1 万圣大party 2 南瓜礼盒
        return axios.get('/Hallo2018/exchange', {
            params: { type }
        }).then(this._apiHandler)
    },
    searchById (id) { // 根据用户id获取昵称
        console.log('searchById')
        if (this.state.searchById) return
        this.state.searchById = true

        return axios.get('/Hallo2018/search', {
            params: {
                mid: id
            }
        }).then(data => {
            this.state.searchById = false
            return data
        }).then(this._apiHandler)
    }
}

var xglist = { // 列表组件
    template: document.querySelector('#xg-list'),
    props: ['type', 'list', 'sktState', 'sktList'],
    // data: {},
    filters: {
        daylistTxt (index) {
            if (index > 9) return

            // return `排名第${index + 1}获得${10 - index}开播全站飘屏`
            return `获得${10 - index}开播全站飘屏`
        }
    },
    methods: {
        goroom (rid) {
            this.$parent.goroom(rid)
        },
        clickVote (zhubo) {
            this.$parent.clickVote(zhubo)
        }
    }
}

var xgmeinfo = { // 个人中心组件
    template: document.querySelector('#xg-meinfo'),
    props: ['type', 'myRank'],
    // data: {},
    methods: {
        goroom (rid) {
            this.$parent.goroom(rid)
        }
    }
}

var con = {
    toastTimer: null,
    toastDuration: 2000,
    svgIns: null,
    svgAniIns: [null, null],
    svgAniPath: ['//static.guojiang.tv/app/gift/pc_animation/4993/data.json', '//static.guojiang.tv/app/gift/pc_animation/4992/data.json']
}

var mobileMixins = {
    methods: {
        /* goroom */
        goroom (rid) {
            rid && goRoom(rid)
        },
        gologin () {
            goLogin()
        }
    }
}

new Vue({
    el: '#app',
    components: {
        'xg-list': xglist,
        'xg-meinfo': xgmeinfo
    },
    mixins: [mobileMixins],
    data: {
        page: {
            gifts: [{
                gid: 1999, // 万圣大party
                price: 2999
            }, {
                gid: 1998, // 南瓜礼盒
                price: 6666
            }],
            stage: 0 // 活动阶段
        },
        ui: {
            toast: false,
            toastMsg: '',
            modal: false,
            modalType: 0, // [0, 1, 2, 3, 4] => ['活动规则', '我的奖励', '购买', '余额不足', '为TA投票']
            svgShow: false,
            tabType: 0, // [0, 1] -> ['主播榜', '用户榜']
            zhuboTabType: 0, // [0, 1, 2, 3] -> ['总榜', 'day1', 'day2', 'day3']
            searchActive: false
        },
        forms: {
            // 购买礼物
            buyInput: 1,
            buyPerPrice: 6666,
            buyPrice: 100,
            buyGid: 0,
            // 投票
            voteInput: 1,
            voteId: 0,
            voteUserAvatar: 'https://static.guojiang.tv/mobile/v2/img/activity/halloween2018/share.jpg',
            votePlaying: true,
            // 搜索用户昵称
            searchId: '',
            searchResult: {}
        },
        meInfos: {
            segs: [0, 0], // 碎片数量 ['化装舞会', '南瓜碎片']
            segsTarget: [3, 6], // 目标数量
            tickets: 0, // 票数
            isLogined: false
        },
        // 妖言惑众榜
        top9: [],
        myAwards: { // 我的奖励
            list: [],
            currPage: 0,
            isLoading: false,
            hasNext: true,
            inited: false
        },
        userList: { // 用户榜
            list: [],
            currPage: 0,
            isLoading: false,
            hasNext: true,
            inited: false,
            sktState: false,
            myRank: {
                pairInfos: [{
                    name: '榜单排名', value: '未上榜'
                }, {
                    name: '狂欢值', value: 0
                }, {
                    name: '距离上榜还差', value: 0
                }, {
                    name: '领先后一名', value: '-'
                }]
            }
        },
        mList: { // 主播总榜
            list: [],
            currPage: 0,
            isLoading: false,
            hasNext: true,
            inited: false,
            sktState: false,
            myRank: {
                pairInfos: [{
                    name: '榜单排名', value: '未上榜'
                }, {
                    name: '狂欢值', value: 0
                }, {
                    name: '距离上榜还差', value: 0
                }, {
                    name: '领先后一名', value: '-'
                }]
            }
        },
        mDay1List: { // 主播day1
            list: [],
            currPage: 0,
            isLoading: false,
            hasNext: true,
            inited: false,
            sktState: false
        },
        mDay2List: { // 主播day2
            list: [],
            currPage: 0,
            isLoading: false,
            hasNext: true,
            inited: false,
            sktState: false
        },
        mDay3List: { // 主播day3
            list: [],
            currPage: 0,
            isLoading: false,
            hasNext: true,
            inited: false,
            sktState: false
        }
    },
    computed: {
        getTop3User () {
            var top3 = this.userList.list.slice(0, 3)
            if (top3.length < 3) {
                for (var i = top3.length, len = 3; i < len; i++) {
                    top3.push({})
                }
            }
            return top3
        }
    },
    mounted: function () {
        this.initPage()

        this.getTicketTop9()

        this._tabCheck() // 加载默认的榜单
    },
    methods: {
        /* service */
        initPage () {
            // 初始数据
            service.initPage()
                .then(res => {
                    if (res.errno === 0) {
                        var data = res.data
                        this.meInfos.isLogined = data.isLogin
                        this.meInfos.tickets = data.ticketNum
                        this.meInfos.segs = [data.hzFraNum, data.ngFraNum]
                        this.meInfos.segsTarget = [data.hzFraTarNum, data.ngFraTarNum]

                        this.page.stage = data.date

                        if (!data.isLogin) {
                            this.gologin()
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.toast('初始化页面信息失败!')
                })
        },
        checkLogin () {
            if (this.page.stage === 4) {
                this.toast('活动已结束')
                return false
            }

            if (this.page.stage === 0) {
                this.toast('活动未开始')
                return false
            }

            if (!this.meInfos.isLogined) {
                this.gologin()
                return false
            } else {
                return true
            }
        },
        /* toast */
        toast (msg) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.ui.toast = true
            this.ui.toastMsg = msg

            con.toastTimer = setTimeout(() => {
                this.ui.toast = false
                this.ui.toastMsg = ''
            }, con.toastDuration)
        },
        /* modal */
        showModal (type) {
            if (type < 0 || type > 4) return

            if (type === 1 && !this.myAwards.inited) {
                this.checkList('myAwards')
            }

            this.ui.modal = true
            this.ui.modalType = type
        },
        closeModal () {
            this.ui.modal = false
        },
        _tabCheck () {
            if (this.ui.tabType === 1) {
                this.checkList('userList')
            }

            if (this.ui.tabType === 0) {
                switch (this.ui.zhuboTabType) {
                case 0: this.checkList('mList'); break
                case 1: this.checkList('mDay1List'); break
                case 2: this.checkList('mDay2List'); break
                case 3: this.checkList('mDay3List'); break
                }
            }
        },
        /* tab */
        changeTab (type) {
            if (type !== 0 && type !== 1) return

            this.ui.tabType = type

            this._tabCheck()
        },
        changeZhuboTab (type) {
            if ([0, 1, 2, 3].indexOf(type) === -1) return

            if (type - this.page.stage > 0) { // type点击大于可进行stage
                return
            }

            this.ui.zhuboTabType = type

            this._tabCheck()
        },
        _inputFilter (value) {
            if (value === '') {
                return 0
            }

            value = +value.replace(/[^0-9]+/g, '')

            if (value > 9999) {
                value = 9999
            }
            if (value <= 0) {
                value = 1
            }

            return value
        },
        // 加减购买数量
        calcBuyNum (num) {
            if (typeof num !== 'number') return

            var output = this.forms.buyInput + num

            if (output > 9999) {
                output = 9999
            }

            if (output < 1) {
                output = 1
            }

            this.forms.buyInput = output
            this.forms.buyPrice = output * this.forms.buyPerPrice
        },
        /* form input */
        inputBuy (evt) {
            var price = this.forms.buyPerPrice
            var value = this._inputFilter(evt.target.value)

            this.forms.buyInput = value
            evt.target.value = value
            this.forms.buyPrice = value * price
        },
        inputFocus (evt) { // fastclick input focus
            evt.target.focus()
        },
        /* 点击购买按钮 */
        showBuyModal (type) {
            if (type !== 0 && type !== 1) return

            if (!this.checkLogin()) return

            this.forms.buyInput = 1
            this.forms.buyPerPrice = this.page.gifts[type].price
            this.forms.buyGid = this.page.gifts[type].gid
            this.forms.buyPrice = this.forms.buyInput * this.forms.buyPerPrice

            this.showModal(2)
        },
        /* 点击购买 */
        buyGift () {
            // console.log('购买 : ', [this.forms.buyGid, this.forms.buyInput])
            service.buyGifts(this.forms.buyGid, this.forms.buyInput)
                .then(res => {
                    if (res.errno === 0) {
                        this.toast('礼物已放至您的背包，请注意查收！')
                        this.closeModal()
                    } else {
                        if (res.msg === '余额不足，请充值再来！') {
                            this.showModal(3)
                        } else {
                            this.toast(res.msg)
                        }
                    }
                })
        },
        cancelCharge () {
            this.closeModal()
        },
        goCharge () {
            goRecharge()
        },
        /* 点击预览 */
        preview (type) {
            if (type !== 0 && type !== 1) return

            if (con.svgAniIns[type]) {
                con.svgAniIns[type].play()
            } else {
                con.svgAniIns[type] = playSvg(con.svgAniPath[type])

                con.svgAniIns[type].play()
            }

            con.svgIns = con.svgAniIns[type]

            this.ui.svgShow = true
        },
        // 终止动效 隐藏layer
        stopSvg () {
            this.ui.svgShow = false
            if (con.svgIns) {
                con.svgIns.stop()
                con.svgIns = null
            }
        },
        // 兑换
        exchange (type) {
            if (type !== 0 && type !== 1) return

            if (!this.checkLogin()) return

            if (this.meInfos.segs[type] < this.meInfos.segsTarget[type]) {
                this.toast('呜呜呜，碎片不足！')
                return
            }

            service.exchange(type + 1)
                .then(res => {
                    if (res.errno === 0) {
                        this.toast('成功兑换，礼物已放至您的背包，请注意查收！')

                        // 我的奖品处需要扣除对应数量的碎片
                        this.meInfos.segs[type] = res.data.num
                    } else {
                        this.toast('呜呜呜，碎片不足！')
                    }
                })
        },
        // 加减票数
        calcVote (num) {
            if (typeof num !== 'number') return

            var output = this.forms.voteInput + num

            if (output > 9999) {
                output = 9999
            }

            if (output < 1) {
                output = 1
            }

            if (output > this.meInfos.tickets) {
                this.toast('请输入正确的票数！')
                return
            }

            this.forms.voteInput = output
        },
        // 输入票数
        inputVote (evt) {
            var value = this._inputFilter(evt.target.value)

            this.forms.voteInput = value
            evt.target.value = value
        },
        // 确认投票
        vote () {
            if (this.forms.voteInput > this.meInfos.tickets || this.forms.voteInput === 0 || !this.forms.voteId) {
                this.toast('请输入正确的票数！')
                return
            }

            console.log('投票 : ', [this.forms.voteId, this.forms.voteInput])

            service.vote(this.forms.voteId, this.forms.voteInput)
                .then(res => {
                    if (res.errno === 0) {
                        this.toast('投票成功！')
                        this.meInfos.tickets -= this.forms.voteInput
                        this._refreshTickets(this.forms.voteId, this.forms.voteInput)
                    } else {
                        this.toast(res.msg)
                    }

                    this.closeModal()
                })
        },
        // 点击投票
        clickVote (zhubo) {
            if (!zhubo) return

            if (!this.checkLogin()) return

            this.forms.voteInput = 1
            this.forms.voteId = zhubo.id
            this.forms.voteUserAvatar = zhubo.headPic
            this.forms.votePlaying = zhubo.isPlaying

            this.showModal(4)
        },
        // 点击搜索结果的投票
        clickVote2 (zhuboR) {
            if (!zhuboR) return

            if (!this.checkLogin()) return

            this.forms.voteInput = 1
            this.forms.voteId = +zhuboR.mid
            this.forms.voteUserAvatar = zhuboR.headPic
            this.forms.votePlaying = zhuboR.isPlaying

            this.showModal(4)
        },
        // 刷新榜单数据 (投票成功 数据变化)
        _refreshTickets (uid, voteNum) {
            // 刷新对应 uid 的主播总榜
            var target = this.mList.list
            for (var i = 0, len = target.length; i < len; i++) {
                if (target[i].id === uid) {
                    target[i].ticket += voteNum
                    break
                }
            }

            if (uid == this.forms.searchResult.mid) { // eslint-disable-line
                this.forms.searchResult.voteScore += voteNum
            }

            // 刷新top-ticket-9榜单
            // target = this.top9
            // for (var j = 0, jlen = target.length; j < jlen; j++) {
            //     if (target[j].id === uid) {
            //         target[j].score += voteNum
            //         break
            //     }
            // }
            // 重新排序
            // target.sort((a, b) => {
            //     return b.score - a.score
            // })
            this.getTicketTop9()
        },
        // 搜索框输入
        searchInput (evt) {
            var value = evt.target.value

            value = value.replace(/[^0-9]+/g, '')

            if (value.length > 8) {
                value = value.slice(0, 8)
            }

            this.forms.searchId = value
            evt.target.value = value

            if (value === '') {
                this.ui.searchActive = false
                this.forms.searchResult = {}
            }
        },
        // 点击搜索
        clickSearch () {
            if (this.forms.searchId === '') return

            // var targetId = this.forms.searchId
            service.searchById(this.forms.searchId)
                .then(res => {
                    if (res.errno === 0) {
                        // this.forms.searchResult = res.data.nickname
                        // this.forms.searchResultUid = +res.data.mid
                        // this.forms.searchResultHeadPic = res.data.headPic
                        // this.forms.searchResultCanVote = true
                        this.forms.searchResult = res.data
                        this.ui.searchActive = true
                    } else {
                        this.toast('您搜索的主播不存在！请仔细确认ID！')
                    }
                })
        },
        // 点击快速投票
        // quickVote () {
        //     if (!this.forms.searchResultCanVote) return

        //     this.clickVote({
        //         id: this.forms.searchResultUid,
        //         headPic: this.forms.searchResultHeadPic
        //         // isPlaying: this.forms.searchResult
        //     })
        // },
        // 获取票数榜
        getTicketTop9 () {
            service.getTop9()
                .then(res => {
                    if (res.errno === 0) {
                        this.top9 = res.data.data
                    }
                })
        },
        // 滚动加载
        _scrollBox (ele, cb, ctx) {
            var bh = 150
            var _self = ctx
            var scrollEle = ele
            scrollEle.addEventListener('scroll', function () {
                var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                if (toBottomH < bh) {
                    cb.call(_self)
                }
            }, false)
        },
        checkList (type) {
            var hash = {
                'myAwards': {
                    el: this.$refs.myawards,
                    source: this.myAwards,
                    service: 'getMyAwards',
                    sourceName: '我的奖励'
                },
                'userList': {
                    el: this.$refs.userList.$refs.list,
                    source: this.userList,
                    service: 'getUserList',
                    sourceName: '用户榜',
                    firstInit: (res) => {
                        if (res.errno === 0) {
                            if (res.data.myRank) {
                                this.userList.myRank = res.data.myRank
                            } else {
                                // this.userList.myRank = {}
                            }
                        }
                    }
                },
                'mList': {
                    el: this.$refs.mList.$refs.list,
                    source: this.mList,
                    service: 'getZhuboList',
                    sourceName: '主播总榜',
                    firstInit: (res) => {
                        if (res.errno === 0) {
                            if (res.data.myRank) {
                                this.mList.myRank = res.data.myRank
                            } else {
                                // this.mList.myRank = {}
                            }
                        }
                    }
                },
                'mDay1List': {
                    el: this.$refs.mDay1List.$refs.list,
                    source: this.mDay1List,
                    service: 'getZhuboDays1',
                    sourceName: '主播日榜1'
                },
                'mDay2List': {
                    el: this.$refs.mDay2List.$refs.list,
                    source: this.mDay2List,
                    service: 'getZhuboDays2',
                    sourceName: '主播日榜2'
                },
                'mDay3List': {
                    el: this.$refs.mDay3List.$refs.list,
                    source: this.mDay3List,
                    service: 'getZhuboDays3',
                    sourceName: '主播日榜3'
                }
            }

            var target = hash[type]
            if (!target || target.source.inited) return

            this._scrollBox(target.el, () => {
                this._loadListFactory(target.source, target.service, target.sourceName)
            }, this)
            this._loadListFactory(target.source, target.service, target.sourceName, target.firstInit)
        },
        _loadListFactory (source, serviceName, sourceName, firstInitCB) {
            if (source.isLoading) {
                console.info(sourceName + '数据 -> 正在加载上一页: 请稍后')
                return
            }
            if (!source.hasNext) {
                console.info(sourceName + '数据 -> 无更多数据')
                return
            }

            // -> 加入sktstate
            if (source.currPage === 0) {
                source.sktState = true
            }
            // -> 优化skt
            var time = Date.now()

            source.isLoading = true
            service[serviceName] && service[serviceName](source.currPage + 1, 15).then(data => {
                source.isLoading = false
                if (data.errno === 0) {
                    if (source.currPage === 0) {
                        source.list = data.data.data
                        source.inited = true

                        if (Date.now() - time < 1000) {
                            setTimeout(() => {
                                source.sktState = false
                            }, 600) // 延迟 避免闪烁
                        } else {
                            source.sktState = false
                        }

                    } else {
                        source.list = source.list.concat(data.data.data)
                    }
                    source.currPage += 1
                    source.hasNext = data.data.hasNext
                } else {
                    console.error(data.msg)
                }
                return data
            }).then(firstInitCB)
        }
    }
})
