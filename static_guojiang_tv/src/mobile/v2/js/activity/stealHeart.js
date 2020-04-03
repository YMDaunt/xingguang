import '../../css/activity/stealHeart.less'
import {scrollLoad, goRoom} from '../common/api'

class Rank {
    constructor () {
        this.modPage = 0
        this.userPage = 0
        this.stealListWidth = 246 / 108
        this.stealLength = 0
        this.currentIndex = 0
        this.modLock = true
        this.userLock = true
        this.init()
        this.getMod()
        this.getUser()
        this.getSteal()
    }
    init () {
        const that = this
        $('.arrow-right').click(function () {
            that.nextList()
        })
        $('.arrow-left').click(function () {
            that.preList()
        })
        // 跳转到房间页
        $('.js-mod-box').on('click', '.js-goroom', function () {
            const rid = $(this).data('rid')
            goRoom(rid, 2)
        })
        $('.anchor-list').on('click', '.anchor-avatar', function () {
            const rid = $(this).data('rid')
            goRoom(rid, 2)
        })

        // 滚动加载表单
        scrollLoad('.js-mod-box', 120, function () {
            if (that.modLock) return
            that.modLock = true
            that.getMod()
        })
        scrollLoad('.js-user-box', 120, function () {
            if (that.userLock) return
            that.userLock = true
            that.getUser()
        })
    }
    // 获取主播榜单
    getMod () {
        const that = this
        let data = {
            activityId: 160,
            page: that.modPage
        }
        this._sendXHR('/StealHeart/GetModRank', data, function (res) {
            const modRank = res.data.modRank
            if (modRank.length == 20) that.modLock = false

            let str = ''
            modRank.forEach((value, index) => {
                str += `
                    <li class="sort-item c-clearfix">
                        <span class="sort-top">${that.modPage * 20 + index + 1}</span>
                        <span class="sort-name js-goroom" data-rid="${value.rid}">${value.nickname}</span>
                        <span class="sort-num">${value.pnum}</span>
                    </li>
                `
            })
            that.modPage++
            $('.js-mod-box').append(str)
        })
    }
    // 获取用户榜单
    getUser () {
        const that = this
        let data = {
            activityId: 160,
            page: that.userPage
        }
        this._sendXHR('/StealHeart/GetUserRank', data, function (res) {
            const userRank = res.data.userRank
            if (userRank.length == 20) that.userLock = false

            let str = ''
            userRank.forEach((value, index) => {
                str += `
                    <li class="sort-item c-clearfix">
                        <span class="sort-top">${that.userPage * 20 + index + 1}</span>
                        <span class="sort-name">${value.nickname}</span>
                        <span class="sort-num">${value.pnum}</span>
                    </li>
                `
            })
            that.userPage++
            $('.js-user-box').append(str)
        })
    }
    // 偷心小分队
    getSteal () {
        const that = this
        let data = {}
        this._sendXHR('/StealHeart/GetSteal', data, function (res) {
            const stealList = res.data.stealList

            let str = ''
            stealList.forEach((value, index) => {
                str += `
                    <li>
                        <span class="anchor-avatar" data-rid="${value.rid}">
                            <img src="${value.headPic}">
                        </span>
                        <span class="anchor-name">${value.nickname}</span>
                    </li>
                `
            })
            // that.userPage++;
            that.stealLength = stealList.length
            $('.anchor-list').css('width', that.stealLength * that.stealListWidth + 'rem').html(str)
        })
    }
    // 下一个
    nextList () {
        if (this.currentIndex + 3 >= this.stealLength) return
        this.currentIndex++
        $('.anchor-list').css({
            'marginLeft': -this.currentIndex * this.stealListWidth + 'rem'
        })
    }
    // 上一个
    preList () {
        if (this.currentIndex <= 0) return
        this.currentIndex--
        $('.anchor-list').css({
            'marginLeft': -this.currentIndex * this.stealListWidth + 'rem'
        })
    }
    _sendXHR (url, data, callback) {
        $.ajax({
            type: 'GET',
            url,
            dataType: 'json',
            data,
            success (res) {
                callback(res)
            },
            error (err) {
                console.log(err)
            }
        })
    }
}

new Rank()
