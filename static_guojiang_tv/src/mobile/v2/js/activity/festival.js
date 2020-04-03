import axios from 'axios'
import common from '../common/common.js'

require('../../css/activity/festival.less')

document.body.addEventListener('click', function () {})

function generateAnchor (data) {
    var str0 = ''
    var str1 = ''
    var topAvatorLen = data.length > 3 ? 3 : data.length
    for (var i = 0; i < topAvatorLen; i++) {
        var liveStatus = data[i][6] !== '0' ? '<span class="live-status sprite anchor-top-live"></span>' : ''
        var bigAvator = i === 0 ? 'avator-bigimg' : ''
        str0 += '<span class="top-avator-' + (i + 1) + ' top-small sprite">\
                    <img data-rid="' + data[i][5] + '" src="' + data[i][1] + '" class="avator-img ' + bigAvator + ' js-avator-img" />\
                    <span class="crown sprite"></span>\
                    <span class="silk-' + (i + 1) + ' sprite"></span>' + liveStatus + '\
                </span>'

        var attendStatus = data[i][4] ? 'had-attend' : ''
        str1 += '<div class="anchor-item anchor-item-' + (i + 1) + '">\
                    <p class="anchor-nickname">' + data[i][2] + '</p>\
                    <span class="gift-wrap">\
                        <i class="gift-icon sprite"></i>\
                        <em class="gift-num">' + data[i][0] + '</em>\
                    </span>\
                    <span data-id="' + data[i][3] + '" class="attend-status sprite ' + attendStatus + '"></span>\
                </div>'
    }
    $('.js-top-anchor').html(str0)
    $('.js-anchor-msg').html(str1)

    /* 剩余7条榜单 */
    if (data.length > 3) {
        var str2 = ''
        var temp = data.slice(3)
        temp.forEach(function (value, index) {
            var liveStatus = value[6] !== '0' ? '<span class="live-status sprite"></span>' : ''
            str2 += '<li class="sort-item clearfix">\
                    <div class="sort-avator sprite">\
                        <img data-rid="' + value[5] + '" src="' + value[1] + '" class="sort-img js-avator-img" />\
                        <i class="sort-ranking">' + (index + 4) + '</i>\
                    </div>\
                    <div class="sort-nickname">\
                        <div class="nickname-box">\
                            <p text-ellipsis>' + value[2] + '</p>\
                            ' + liveStatus + '\
                        </div>\
                    </div>\
                    <div class="sort-gift-num">\
                        <i class="gift-icon sprite"></i>\
                        <em class="gift-num">' + value[0] + '</em>\
                    </div>\
                </li>'
        })
        $('.js-sort-anchor').html(str2)
    }
}

function generateUser (data) {
    var str0 = ''
    var str1 = ''
    var topAvatorLen = data.length > 3 ? 3 : data.length
    for (var i = 0; i < topAvatorLen; i++) {
        var bigAvator = i === 0 ? 'avator-bigimg' : ''
        str0 += '<span class="top-avator-' + (i + 1) + ' sprite">\
                    <img src="' + data[i][1] + '" class="avator-img ' + bigAvator + '" />\
                    <span class="crown sprite"></span>\
                    <span class="silk-' + (i + 1) + ' sprite"></span>\
                </span>'

        var attendStatus = data[i][4] ? 'had-attend' : ''
        str1 += '<div class="anchor-item anchor-item-' + (i + 1) + '">\
                    <p class="anchor-nickname">' + data[i][2] + '</p>\
                    <span class="vip-icon level_icon u_level_icon_' + data[i][4] + '"></span>\
                    <p class="give-money">贡献值：' + data[i][0] + '</p>\
                </div>'
    }
    $('.js-top-user').html(str0)
    $('.js-user-msg').html(str1)

    /* 剩余7条榜单 */
    if (data.length > 3) {
        var str2 = ''
        var temp = data.slice(3)
        temp.forEach(function (value, index) {
            str2 += '<li class="sort-item clearfix">\
                    <div class="sort-avator sprite">\
                        <img src="' + value[1] + '" class="sort-img" />\
                        <i class="sort-ranking">' + (index + 4) + '</i>\
                    </div>\
                    <div class="sort-nickname">\
                        <div class="nickname-box">\
                            <p text-ellipsis>' + value[2] + '</p>\
                            <span class="rank-vip-icon level_icon u_level_icon_' + value[4] + '"></span>\
                        </div>\
                    </div>\
                    <div class="sort-gift-num">\
                        贡献值：<em class="gift-num">' + value[0] + '</em>\
                    </div>\
                </li>'
        })
        $('.js-sort-user').html(str2)
    }
}

function getRank () {
    $.ajax({
        type: 'GET',
        url: '/FestivalActivity/GetRank',
        dataType: 'json',
        success: function (data) {
            var _data = data.data
            var anchorRank = _data.infoLeft
            var userRank = _data.infoRight
            generateAnchor(anchorRank)
            generateUser(userRank)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function addAttend (that) {
    $.ajax({
        type: 'GET',
        url: '/FestivalActivity/AddLove',
        dataType: 'json',
        data: {
            id: that.data('id')
        },
        success: function (data) {
            if (data.data.uid === '0000') {
                return common.goLogin()
            }
            if (data.data.attResult) {
                that.addClass('had-attend')
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function initXHR () {
    getRank()
}

function initEvent () {
    // 榜单切换
    $('.achievement').click(function () {
        $('.achievement').addClass('rank-head-act').removeClass('rank-head-normal')
        $('.contribution').addClass('rank-head-normal').removeClass('rank-head-act')
        $('.anchor-wrap').show()
        $('.user-wrap').hide()
    })
    $('.contribution').click(function () {
        $('.achievement').addClass('rank-head-normal').removeClass('rank-head-act')
        $('.contribution').addClass('rank-head-act').removeClass('rank-head-normal')
        $('.anchor-wrap').hide()
        $('.user-wrap').show()
    })
    // 规则
    $('.act-rule').click(function () {
        $('.cover-bg').show()
    })
    $('.rule-close').click(function () {
        $('.cover-bg').hide()
    })
    $('.cover-bg').click(function () {
        $('.cover-bg').hide()
    })
    $('.rule-content').click(function (e) {
        e.stopPropagation()
    })
    // 关注
    $('.js-anchor-msg').on('click', '.attend-status', function () {
        if ($(this).hasClass('had-attend')) return
        addAttend($(this))
    })
    // 进入房间
    $('.anchor-wrap').on('click', '.js-avator-img', function () {
        common.goRoom($(this).data('rid'), 2)
    })
}

initXHR()
initEvent()
