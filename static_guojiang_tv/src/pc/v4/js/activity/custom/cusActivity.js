/* eslint-disable */
// 'use strict'
/* 定制活动改版 2018/9 */
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import '../../component/niceScroll.js'
import user from 'user' // eslint-disable-line
import headerNav from '../../component/headerNav.vue'
import bodymovin from '../../component/bodymovin.min.js'

import '../../../css/activity/custom/cusActivity.less'

var playSvg = function (path) {
    var svgContainer = document.querySelector('.svg-container')
    return bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: path
    })
}

const service = {
    _errMiddlerWaver: function (data) {
        if (data.status === 200) {
            return data.data
        } else {
            console.log(data.msg)
            throw new Error(data.msg)
        }
    },
    getCurrentTime: function () {
        // 宝箱开启的服务器时间
        return axios.get('/CustomizedActivity/CurrentTime').then(this._errMiddlerWaver)
    },
    submitInfo: function (info) {
        // 提交用户信息
        return axios.get('/CustomizedActivity/SaveCont', {
            params: {
                uid: info.uid,
                mobile: info.mobile,
                qq: info.qq
            }
        }).then(this._errMiddlerWaver)
    },
    getGiftsList: function (page, limit) {
        // 获取礼物列表
        return axios.get('/CustomizedActivity/GiftsList', {
            params: {
                page: page,
                limit: limit
            }
        }).then(this._errMiddlerWaver)
    },
    getLimitedGiftsList: function (page, limit) {
        // 获取限定礼物列表
        return axios.get('/CustomizedActivity/LimitGiftList', {
            params: {
                page: page,
                limit: limit
            }
        }).then(this._errMiddlerWaver)
    },
    openBX: function (boxId) {
        // 开启宝箱
        return axios.get('/CustomizedActivity/OpenBox', {
            params: {
                boxId: boxId
            }
        }).then(this._errMiddlerWaver)
    },
    buyGifts: function (pid, num) {
        // 购买礼物
        return axios.get('/CustomizedActivity/BuyGifts', {
            params: {
                productId: pid,
                num: num
            }
        }).then(this._errMiddlerWaver)
    },
    getTequan: function () {
        // 查看特权
        return axios.get('/CustomizedActivity/GetHstate').then(this._errMiddlerWaver)
    },
    getBXList: function () {
        // 获取宝箱列表
        return axios.get('/CustomizedActivity/GetBoxesList').then(this._errMiddlerWaver)
    },
    initInfo: function () {
        // 初始化信息
        return axios.get('/CustomizedActivity/Init').then(this._errMiddlerWaver)
    },
    searchGifts: function (value, page, limit) {
        // 列表搜索
        return axios.get('/CustomizedActivity/GetSearchList', {
            params: {
                midOrNick: value,
                page: page,
                limit: limit
            }
        }).then(this._errMiddlerWaver)
    }
}

const con = {
    msgSpeed: 5,
    fadeDuration: 2000
}
var SVG_INS = null
var searchTimer = null

new Vue({
    el: '#app',
    components: {headerNav},
    filters: {
        transTime (time) {
            if (!time) {
                return ''
            }
            var timearr = time.trim().split(' ')
            var datearr = timearr[0].split('-')
            // var tarr = timearr[1].split(':')
            return [datearr[0], '/', +datearr[1], '/', +datearr[2], ' ', timearr[1]].join('')
        },
        timeDate (time) {
            if (!time) {
                return ''
            }
            var timearr = time.trim().split(' ')
            var datearr = timearr[0].split('-')
            // var tarr = timearr[1].split(':')
            return [+datearr[1], '.', +datearr[2]].join('')
        },
        timeAll (time) {
            if (!time) {
                return ''
            }
            var timearr = time.trim().split(' ')
            var datearr = timearr[0].split('-')
            return [+datearr[1], '月', +datearr[2], '日', ' ', timearr[1]].join('')
        },
        formateDate (time) {
            if (!time) {
                return
            }
            var d = new Date(time)

            var hours = d.getHours()
            if (hours < 9) {
                hours = '0' + hours
            }

            var miuntes = d.getMinutes()
            if (miuntes < 9) {
                miuntes = '0' + miuntes
            }

            var ss = d.getMinutes()
            if (ss < 9) {
                ss = '0' + ss
            }

            return [d.getFullYear(), '年', d.getMonth() + 1, '月', d.getDate(), '日 ', hours, ':', miuntes, ':', ss].join('')
        }
    },
    data: {
        ui: {
            /* 宝箱弹出说明框的显示状态 */
            bxInfoShowInd: '',
            /* Modal弹出层显示 */
            toastShow: false,
            toastType: '',
            toastMsg: [],
            /* tab切换 */
            tabType: 'total',
            tabSpecHasNew: false, // 限定礼物新标签
            /* toast显示 */
            tooltip: false,
            tooltipMsg: '',
            tooltipTimer: null,
            /* 动画显示 */
            svgShow: false,
            svgShowType: 'svg',
            svgShowImg: '', // image -> 对应的图片地址
            /* 控制banner的期数及时间限时 */
            qishu: '13',
            stageTime: '',
            /* fixed box */
            fixedMsgBox: false,
            showMes: false,
        },
        user: {
            uid: '',
            uname: '',
            userHeadPic: '',
            getCost: '0.00'
        },
        app: {
            tagTime: 0,
            nowTime: 0,
            startTime: 0,
            endTime: 0,
            leftTime: 0,
            deadline: 0,
            msgs: [],
            boxes: {},
            boxesStage: 0, // 完成宝箱阶段
            boxesOpenedStage: 0, // 开启宝箱阶段
            msgStyle: {},
            isNew: false,  // 12.01新奖励判断依据
            bannerBoxNum: 0 // APPbanner名额剩余数量
        },
        alllist: {
            list: [],
            hasNext: true,
            load: false,
            currPage: -1
        },
        speclist: {
            list: [],
            hasNext: true,
            load: false,
            currPage: -1
        },
        slist: {
            currKey: '',
            list: [],
            hasNext: true,
            load: false,
            currPage: -1
        },
        searchInput: '',
        tequan: {
            hasClick: false,
            isAddOrMod: true // 填写信息 / 修改信息
        },
        tequanInfo: {
            userId: '',
            phone: '',
            qqnumber: ''
        },
        buyInfo: {
            buyPid: null,
            buyNum: 1,
            buyPrice: 0,
            buyInputNum: 1,
            payMoney: '请输入正确的购买数量',
            buyType: '2'
        },
        phoneInputState: '',
        qqInputState: ''
    },
    computed: {
        countTime () { // 倒计时显示
            if (this.app.leftTime <= 0) {
                return '活动已结束！'
            }
            var day = this.app.leftTime / 86400000 >> 0
            var hours = (this.app.leftTime % 86400000) / 3600000 >> 0
            var minutes = (this.app.leftTime % 3600000) / 60000 >> 0
            var seconds = (this.app.leftTime % 60000) / 1000 >> 0
            return [day, '天', hours, '时', minutes, '分', seconds, '秒'].join('')
        },
        boxesState () { // 宝箱状态显示
            var res = []
            for (var ind = 1, len = 8; ind < len; ind++) {
                var className = ''
                if (ind === 1 && this.app.nowTime < this.app.deadline) {
                    className += 'hoted '
                }
                if (ind === 2) { // 计算宝箱的hoted
                    if (this.app.nowTime < this.app.deadline) {
                        if (this.app.bannerBoxNum > 0) {
                            className += 'hoted '
                        } else {
                            className += 'unhoted '
                        }
                    }
                }
                if (!this.app.boxes[ind] || !this.app.boxes[ind].completed) {
                    res.push(className)
                    continue
                }

                if (this.app.boxes[ind].shakeStyle) {
                    className += 'shake '
                }

                if (this.app.boxes[ind].opened) { // 完成并开启
                    res.push(className + 'completed checked')
                } else { // 完成并未开启
                    res.push(className + 'completed')
                }
            }
            return res
        }
    },
    watch: {
        'buyInfo.buyInputNum': function (value) {
            value = +value
            if (Number.isNaN(value) || value === 0 || (value + '').indexOf('.') > -1 || value > 9999) {
                this.buyInfo.payMoney = '请输入正确的购买数量'
            } else {
                this.buyInfo.payMoney = value * this.buyInfo.buyPrice + '克拉'
            }
        },
        'searchInput': function (value) {
            if (value === '') {
                return
            }

            searchTimer && clearTimeout(searchTimer)
            searchTimer = setTimeout(() => {
                this.search()
                searchTimer = null
            }, 1000)
        }
    },
    mounted: function () {
        this.adaptation()

        this.init()

        this.initList()

        var wH = window.innerHeight || 600
        if (wH < 1200) {
            console.log('监听滚动')
            var _self = this
            window.addEventListener('scroll', function () {
                _self.scrollMsgBox()
            })
        }
    },
    methods: {
        adaptation () {
            let href = window.location
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.tuho.tv/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.tuho.tv' + href.pathname.replace('/dist', '')
                }
            }
        },
        /* UI交互 */
        onLongTap (ind) { // 控制宝箱弹出说明框的显示状态
            this.ui.bxInfoShowInd = ind
        },
        showModal (type) { // 显示对话框
            if (type === 'tequan' && this.app.boxesOpenedStage === 0) {
                this.ui.toastShow = true
                this.ui.toastType = 'msg'
                this.ui.toastMsg = ['请先开启特权哦！']
                return
            }

            if (type === 'fillInfo') {
                this.tequanInfo.userId = this.user.uid + ' ' + this.user.uname
            }

            this.ui.toastShow = true
            this.ui.toastType = type

            if (type === 'tequan' && this.tequan.hasClick === false) {
                this.getTequan()
            }
        },
        closeModal () { // 关闭对话框
            this.buyInfo.buyInputNum = 1
            this.$refs.buyInput.value = 1
            this.tequanInfo.phone = ''
            this.tequanInfo.qqnumber = ''

            this.ui.toastShow = false
            this.ui.toastType = ''
        },
        confirm () { // 确认填写信息
            if (!this.phoneInputOnBlur() || !this.qqInputOnBlur()) {
                return
            }

            if (!this.user.uid || (!this.tequanInfo.qqnumber && !this.tequanInfo.phone)) {
                this.toast('信息填写不正确，请重新填写') // 信息填写不正确，请重新填写
                return
            }
            if (/[^\d]+/g.test(this.tequanInfo.qqnumber) || /[^\d]+/g.test(this.tequanInfo.phone)) {
                this.toast('信息填写不正确，请重新填写') // 信息填写不正确，请重新填写
                return
            }
            if (this.tequanInfo.phone !== '' && !/^1[3|4|5|7|8][0-9]{9}$/.test(this.tequanInfo.phone)) {
                this.toast('手机号码格式不正确')
                return
            }
            service.submitInfo({
                // uid: this.tequanInfo.userId,
                uid: this.user.uid,
                mobile: this.tequanInfo.phone,
                qq: this.tequanInfo.qqnumber
            }).then((res) => {
                if (res.errno === 0) {
                    if (res.data.result) {
                        this.toast('信息提交成功！')
                        this.closeModal()
                        this.tequan.isAddOrMod = false
                    } else {
                        this.toast(res.data.error)
                    }
                } else {
                    throw new Error(res.msg)
                }
            })
        },
        tabChange (type) { // tab切换
            this.ui.tabType = type
            this.searchInput = ''
        },
        buy (item) {
            // console.log(item)

            var releaseTime = new Date(item.releaseTime.replace(/-/g, '/')).getTime()
            if (this.app.nowTime < releaseTime) { // 没有过独享期
                this.ui.toastShow = true
                this.ui.toastType = 'msg'
                this.ui.toastMsg = ['礼物还没过独享期！等等再来吧']
                return
            }

            this.buyInfo.buyPid = item.id // item.virtualProductId
            this.buyInfo.buyPrice = +item.price
            this.buyInfo.payMoney = 1 * this.buyInfo.buyPrice + '克拉'
            this.buyInfo.buyType = item.type
            this.$refs.buyInput.value = 1

            this.showModal('buy')
        },
        preview (item) { // 预览动画
            this.ui.svgShow = true
            if (item.pcAnimationJsonUrl && item.pcAnimationJsonUrl.length > 0) {
                this.ui.svgShowType = 'svg'
                SVG_INS = playSvg(item.pcAnimationJsonUrl.replace(/^http:/, ''))
            } else {
                // 普通图片效果
                this.ui.svgShowType = 'image'
                this.ui.svgShowImg = item.imagePreview || item.image
            }
        },
        stopSvg () { // 关闭动画层
            this.ui.svgShow = false
            if (SVG_INS) {
                SVG_INS.stop()
                SVG_INS.destroy()
                SVG_INS = null
            }
        },
        openBox (ind) {
            if (!this.app.boxes[ind]) {
                return
            }
            var box = this.app.boxes[ind]
            if (box.completed && !box.opened) { // 完成任务 但是没有开启宝箱
                service.openBX(this.app.boxes[ind].id)
                    .then((res) => {
                        if (res.errno === 0) {
                            if (!res.data.errCode && res.data.isOpened) {
                                this.app.boxes[ind].opened = true
                                this.app.boxes[ind].shakeStyle = true
                                this.app.boxesOpenedStage += 1
                                if (ind === 2) {
                                    this.app.bannerBoxNum > 0 ? (this.app.bannerBoxNum -= 1) : ''
                                }
                            } else {
                                this.toast(res.data.error)
                            }
                        } else {
                            throw new Error(res.msg)
                        }
                    })
            }
        },
        toast (msg) {
            clearTimeout(this.ui.tooltipTimer)
            this.ui.tooltip = true
            this.ui.tooltipMsg = msg
            this.ui.tooltipTimer = setTimeout(() => {
                this.ui.tooltip = false
            }, con.fadeDuration)
        },
        buyInput (evt) {
            var value = evt.target.value
            if (value === '') {
                this.buyInfo.buyInputNum = ''
                evt.target.value = ''
                return
            }
            var num = value.replace(/[^0-9]+/g, '')
            num = +num
            if (num > 9999) {
                this.buyInfo.buyInputNum = 9999
                evt.target.value = 9999
                return
            }
            if (num < 0) {
                this.buyInfo.buyInputNum = 1
                evt.target.value = 1
                return
            }
            // return num
            this.buyInfo.buyInputNum = num
            evt.target.value = num
        },
        scrollMsgBox () {
            var msgBox = this.$refs.msgScrollBox
            if (msgBox.getBoundingClientRect().top <= 0) {
                this.ui.fixedMsgBox = true
            } else {
                this.ui.fixedMsgBox = false
            }
        },
        phoneInputOnBlur () {
            if (this.tequanInfo.phone === '') {
                this.phoneInputState = ''
                return true
            }
            if (/[^\d]+/g.test(this.tequanInfo.phone) || !/^1[3|4|5|7|8][0-9]{9}$/.test(this.tequanInfo.phone)) {
                this.phoneInputState = '信息填写不正确，请重新填写'
                return false
            } else {
                this.phoneInputState = ''
                return true
            }
        },
        qqInputOnBlur () {
            if (/[^\d]+/g.test(this.tequanInfo.qqnumber)) {
                this.qqInputState = '信息填写不正确，请重新填写'
                return false
            } else {
                this.qqInputState = ''
                return true
            }
        },
        clearPhoneInput () {
            this.phoneInputState = ''
        },
        clearQQInput () {
            this.qqInputState = ''
        },
        /* 业务逻辑部分 */
        init () { // 初始化
            service.initInfo().then(res => {
                if (res.errno !== 0) {
                    return
                }
                var data = res.data
                // 1. 判断登录状态
                if (!data.uid) {
                    user.showLoginPanel()
                }

                this.app.isNew = data.isNew
                this.ui.showMes = data.isShow
                console.log(this.ui.showMes)

                this.ui.qishu = data.timeMsg.stage

                // 2. 加载宝箱进度
                this.app.boxes = data.getBox
                this.progress(data.getBox)
                this.app.bannerBoxNum = (!data.getAdvertisement || data.getAdvertisement < 0) ? 0 : data.getAdvertisement

                // 3. 加载用户信息
                if (data.user) {
                    this.user.uid = data.user.uid
                    this.user.uname = data.user.nickname
                    this.tequanInfo.userId = data.user.uid
                    this.user.userHeadPic = data.user.userHeadPic
                }
                this.user.getCost = data.getCost || 0

                // 4. 开始倒计时
                this.ui.stageTime = data.timeMsg.deadline
                this.app.tagTime = Date.now()
                this.app.nowTime = new Date(data.nowTime).getTime()
                this.app.startTime = new Date(data.timeMsg.startTime.replace(/-/g, '/')).getTime()
                this.app.endTime = new Date(data.timeMsg.endTime.replace(/-/g, '/')).getTime()
                this.app.deadline = new Date(data.timeMsg.deadline.replace(/-/g, '/')).getTime()
                this.timeCount()

                // 4. 加载滚动信息框
                this.app.msgs = data.getBd
                this.runMsg()

                // 5. 加载tab new标签
                this.ui.tabSpecHasNew = data.hasNewProduct
            })
        },
        progress (boxes) { // 加载宝箱进度
            var stage = 0
            var openedStage = 0
            for (var i in boxes) {
                if (boxes[i].completed) {
                    stage++
                }
                if (boxes[i].opened) {
                    openedStage++
                }
            }
            this.app.boxesStage = stage
            this.app.boxesOpenedStage = openedStage
        },
        timeCount () { // 倒计时
            function count () {
                var pass = Date.now() - this.app.tagTime // 1. 计算过去的时间
                var stime = this.app.nowTime + pass // 2. 计算服务器时间
                var leftTime = this.app.endTime - stime // 3. 计算剩余时间
                this.app.leftTime = leftTime

                if (leftTime > 0) {
                    setTimeout(count.bind(this), 1000)
                }
            }
            count.bind(this)()
        },
        runMsg () { // 消息滚动条
            this.$nextTick(() => {
                var allWidth = this.$refs.msgs.childNodes[0].clientWidth
                var cWidth = this.$refs.msgs.clientWidth

                if (allWidth > cWidth) {
                    var speed = (allWidth / cWidth) * con.msgSpeed >> 0
                    this.app.msgStyle['animation-name'] = 'msgScroll'
                    this.app.msgStyle['animation-duration'] = speed + 's'
                    this.app.msgStyle['animation-timing-function'] = 'linear'
                    this.app.msgStyle['animation-iteration-count'] = 'infinite'
                    this.app.msgStyle['animation-delay'] = '0s'
                }
            })
        },
        initList () { // 加载礼物列表
            var scrollBox = function initScroll (ele, cb, ctx) {
                var bh = 150
                var _self = ctx
                var scrollEle = ele

                scrollEle.addEventListener('scroll', function () {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH < bh) {
                        cb.call(_self)
                    }
                }, false)

                $(ele).niceScroll({
                    cursorwidth: 8,
                    cursorcolor: 'rgba(250, 221, 155, .8)', // 设置滚动条滑块的颜色
                    cursorborder: 'none', // CSS方式定义滚动条边框颜色
                    autohidemode: false,
                    cursorfixedheight: 60,
                    horizrailenabled: false,
                    hwacceleration: true,
                    railpadding: { top: 0, right: 4, left: 0, bottom: 4 }
                })
            }

            // 1."全部"礼物
            this.getListAllData()
            scrollBox(this.$refs.alllist, this.getListAllData, this)

            // 2. "限定"礼物
            this.getListCusData()
            scrollBox(this.$refs.speclist, this.getListCusData, this)

            // 3. "搜索"结果
            scrollBox(this.$refs.slist, this.getListCusData, this)
        },
        getListAllData () {
            if (!this.alllist.hasNext) {
                console.log('全部礼物 - 没有下一页了')
                return
            }
            if (this.alllist.load) {
                console.log('正在加载下一页 - 全部礼物 - 请稍后')
                return
            }

            this.alllist.load = true
            service.getGiftsList(this.alllist.currPage + 1, 15)
                .then(res => {
                    if (res.errno === 0) {
                        this.alllist.list = this.alllist.list.concat(res.data.list)

                        if (res.data.list.length === 0) {
                            this.alllist.hasNext = false
                        }

                        this.alllist.currPage += 1
                        this.alllist.load = false
                    } else {
                        throw new Error(res.msg)
                    }
                })
        },
        getListCusData () {
            if (!this.speclist.hasNext) {
                console.log('限定礼物 - 没有下一页了')
                return
            }
            if (this.speclist.load) {
                console.log('正在加载下一页 - 限定礼物 - 请稍后')
                return
            }

            this.speclist.load = true
            service.getLimitedGiftsList(this.speclist.currPage + 1, 15)
                .then(res => {
                    if (res.errno === 0) {
                        this.speclist.list = this.speclist.list.concat(res.data.list)

                        if (res.data.list.length === 0) {
                            this.speclist.hasNext = false
                        }

                        this.speclist.currPage += 1
                        this.speclist.load = false
                    } else {
                        throw new Error(res.msg)
                    }
                })
        },
        getSearchData (firstFlag) {
            if (!this.slist.hasNext) {
                console.log('搜索礼物 - 没有下一页了')
                return
            }
            if (this.slist.load) {
                console.log('正在加载下一页 - 搜索礼物 - 请稍后')
                return
            }

            this.slist.load = true
            service.searchGifts(this.slist.currKey, this.slist.currPage + 1, 15)
                .then(res => {
                    if (res.errno === 0) {
                        if (firstFlag) {
                            this.ui.tabType = 'search'
                            this.slist.list = res.data.list
                        } else {
                            this.slist.list = this.slist.list.concat(res.data.list)
                        }

                        if (res.data.list.length === 0) {
                            this.slist.hasNext = false
                        }

                        this.slist.currPage += 1
                        this.slist.load = false
                    } else {
                        throw new Error(res.msg)
                    }
                })
        },
        search () { // 搜索
            console.log('searchInput')
            this.slist.currKey = this.searchInput
            this.slist.currPage = -1
            this.slist.hasNext = true
            this.slist.load = false
            this.getSearchData(true)
        },
        getTequan () { // 查看填写信息的状态(是否填写过)
            service.getTequan()
                .then(res => {
                    if (res.errno === 0) {
                        this.tequan.hasClick = true
                        if (res.data.result) {
                            this.tequan.isAddOrMod = true
                        } else {
                            this.tequan.isAddOrMod = false
                        }
                    } else {
                        throw new Error(res.msg)
                    }
                })
        },
        buyGifts () {
            if (this.buyInfo.buyInputNum === '' || this.buyInfo.buyInputNum <= 0 || this.buyInfo.buyInputNum > 9999) {
                this.toast('请输入正确的购买数量')
                return
            }
            service.buyGifts(this.buyInfo.buyPid, this.buyInfo.buyInputNum)
                .then((res) => {
                    if (res.errno === 0) {
                        if (res.data.result) {
                            console.log('购买成功!')
                            this.ui.toastShow = true
                            this.ui.toastType = 'msg'
                            this.ui.toastMsg = ['购买成功', '礼物已放入您的背包！']
                            this.triggerListItemChange(this.buyInfo.buyPid, this.buyInfo.buyInputNum, this.buyInfo.buyType)
                        } else {
                            // TODO 余额不足请充值再来
                            // this.toast(res.data.error)
                            this.ui.toastShow = true
                            this.ui.toastType = 'msg'
                            this.ui.toastMsg = [res.data.error]
                        }
                    } else {
                        throw new Error(res.msg)
                    }
                })
        },
        triggerListItemChange (id, num, type) { // 购买成功后用于列表数据的重新渲染
            var list = null
            if (this.ui.tabType === 'total') {
                list = this.alllist.list
            } else if (this.ui.tabType === 'spec') {
                list = this.speclist.list
            } else if (this.ui.tabType === 'search') {
                if (type == '2') { // eslint-disable-line
                    list = this.alllist.list
                } else if (type == '20') { // eslint-disable-line
                    list = this.speclist.list
                }

                var slist = this.slist.list
                for (var j = 0, slen = slist.length; j < slen; j++) {
                    if (slist[j].id == id) { // eslint-disable-line
                        slist[j].salesVolume = (+slist[j].salesVolume) + num
                        break
                    }
                }
            }

            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].id == id) { // eslint-disable-line
                    list[i].salesVolume = (+list[i].salesVolume) + num
                    break
                }
            }
        }
    }
})
