import common from '../common/common.js'
import runwayCanvas from './runwayCanvas.js'
import {scrollLoad} from '../common/api.js'

require('../../css/activity/singleDog.less')

var userPage = 1 // 用户榜单页数
var userPageLock = false

var subObj = [{
    subPage: 1,
    subLock: false
}, {
    subPage: 1,
    subLock: false
}, {
    subPage: 1,
    subLock: false
}, {
    subPage: 1,
    subLock: false
}, {
    subPage: 1,
    subLock: false
}]

// 跑道
function generateRace (data) {
    runwayCanvas(data)
}

// [1-5]区段的主播
var max_stage = 0
function generateAnchor (data, level) {
    var _data = data.data
    var cn = ['一', '二', '三', '四', '五']
    var wrap = $('.competition-sub-' + level)
    if (_data.length === 0) {
        wrap.html('<div class="sub-head sub-head-close line-border">第' + cn[level] + '赛段</div><div class="sub-content clearfix"><p class="no-dog line-border">啊哦~还没有狗子跑到这里！</p></div>')
        return
    }
    max_stage = level
    var str = '<div class="sub-head sub-head-close line-border">第' + cn[level] + '赛段</div><div class="sub-content clearfix">'
    for (var i = 0, len = _data.length; i < len; i++) {
        var liveStatus = _data[i]['is_playing'] === '1' ? '<span class="live-status sprite"></span>' : ''
        str += '<div class="sub-content-item clearfix">\
                        <span class="user-sort">' + _data[i]['rank'] + '</span>\
                        <div class="anchor-avator" data-id="' + _data[i]['rid'] + '">\
                            <img src="' + _data[i]['head_pic_1'] + '">\
                            ' + liveStatus + '\
                        </div>\
                        <div class="anchor-msg">\
                            <p class="anchor-nickname">' + _data[i]['nickname'] + '</p>\
                            <p class="anchor-distance">成绩：' + _data[i]['num'] + '米</p>\
                        </div>\
                    </div>'
    }
    str += '</div>'
    wrap.html(str)
}

// 用户榜单
function generateUser (data) {
    var str = ''
    var _data = data.data
    for (var i = 0, len = _data.length; i < len; i++) {
        var icons = ''
        for (var j = 0; j < _data[i]['icons']; j++) {
            icons += '<span class="prize-gift-' + j + ' sprite"></span>'
        }
        var sortIdx = ((data.pageNo - 1) * 32 + i + 1)
        var sort = sortIdx <= 3 ? '<span class="user-prize-top sprite user-prize-' + (sortIdx - 1) + '"></span>' : sortIdx
        str += '<li class="user-lists-item clearfix">\
                    <span class="user-sort">' + sort + '</span>\
                    <span class="user-avator"><img src="' + _data[i]['head_pic_1'] + '"></span>\
                    <div class="user-detail">\
                        <p class="user-nickname">' + _data[i]['nickname'] + '</p>\
                        <p class="user-num">送出' + _data[i]['num'] + '个</p>\
                        <div class="prize-gift">\
                            <span class="prize-font">获得奖励:</span>' + icons + '\
                        </div>\
                    </div>\
                </li>'
    }
    $('.user-lists-box').append(str)
}

// 前三主播
function generateAnchorTop3 (data) {
    var str = ''
    data.forEach(function (value, index) {
        var live = value['isPlay'] === '1' ? '<span class="top-avator-live sprite"></span>' : ''
        var love = value['isLoved'] ? '<div class="top-intro-btn attented-btn">已关注</div>' : '<div class="top-intro-btn" data-id="' + value['mid'] + '">+关注</div>'
        str += '<div class="report-top-lists clearfix">\
                <div class="top-avator" data-id="' + value['rid'] + '">\
                    <img src="' + value['headPic'] + '">\
                    ' + live + '\
                    <span class="top-avator-no avator-no-' + index + ' sprite"></span>\
                </div>\
                <div class="top-anchor-intro">\
                    <p class="top-anchor-nickname">' + value['nickname'] + '</p>\
                    <p class="top-anchor-nickname">成绩' + value['pnum'] + '米</p>\
                </div>\
                ' + love + '\
            </div>'
    })
    $('.report-top').html(str)
}

function addAttentd (id, ele) {
    $.ajax({
        type: 'get',
        url: '/SingleDogActivity/AddLove',
        dataType: 'json',
        data: {
            id: id
        },
        success: function (data) {
            var _data = data.data
            if (_data.uid === '0000') {
                return common.goLogin()
            }
            if (_data.attResult) {
                ele.addClass('attented-btn')
                ele.html('已关注')
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function initEvent () {
    // 主播榜单展开
    $('.competition-sub').on('click', '.sub-head', function () {
        var that = $(this)
        if (that.hasClass('sub-head-open')) {
            $('.sub-head').removeClass('sub-head-open').addClass('sub-head-close')
            that.next().hide()
        } else {
            $('.sub-content').hide()
            that.next().show()
            $('.sub-head-open').removeClass('sub-head-open').addClass('sub-head-close')
            that.addClass('sub-head-open')
        }
    })
    // 规则弹框
    $('.act-close').click(function () {
        $('.cover-bg').hide()
    })
    $('.runway-rule').click(function () {
        $('.cover-bg').show()
    })

    // 关注主播
    $('.report-top').on('click', '.top-intro-btn', function () {
        var that = $(this)
        var id = that.data('id')
        if (that.hasClass('attented-btn')) return
        addAttentd(id, that)
    })

    // 跳转主播
    $('.report-top').on('click', '.top-avator', function () {
        var rid = $(this).data('id')
        common.goRoom(rid, 2)
    })
    $('.competition-sub').on('click', '.anchor-avator', function () {
        var rid = $(this).data('id')
        common.goRoom(rid, 2)
    })
}

// 绑定滚动
function bindScroll () {
    // 用户榜单滚动加载
    scrollLoad('.user-lists-box', 120, function () {
        if (userPageLock) return
        userPageLock = true
        userPage++
        $.ajax({
            type: 'get',
            url: '/SingleDogActivity/GetUserRank',
            dataType: 'json',
            data: {
                page: userPage
            },
            success: function (data) {
                var _data = data.data.userRank
                if (_data.data.length > 0) {
                    userPageLock = false
                    generateUser(_data)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    for (var i = 0; i < 5; i++) {
        (function (i) {
            scrollLoad('.competition-sub-' + i + ' .sub-content', 120, function () {
                if (subObj[i]['subLock']) return
                subObj[i]['subLock'] = true
                subObj[i]['subPage']++
                subAnchor(subObj[i]['subPage'], i, subObj[i])
            })
        })(i)
    }
}

function subAnchor (page, subNumber, lock) {
    $.ajax({
        type: 'get',
        url: '/SingleDogActivity/GetAnchorRank',
        dataType: 'json',
        data: {
            page: page,
            level: subNumber + 1
        },
        success: function (data) {
            var _data = data.data.anchorRank
            if (_data.data.length > 0) {
                lock['subLock'] = false
                generateSubAnchor(_data, subNumber)
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function generateSubAnchor (data, level) {
    var _data = data.data
    var wrap = $('.competition-sub-' + level + ' .sub-content')
    var str = ''
    for (var i = 0, len = _data.length; i < len; i++) {
        var liveStatus = _data[i]['is_playing'] === '1' ? '<span class="live-status sprite"></span>' : ''
        str += '<div class="sub-content-item clearfix">\
                        <span class="user-sort">' + _data[i]['rank'] + '</span>\
                        <div class="anchor-avator" data-id="' + _data[i]['rid'] + '">\
                            <img src="' + _data[i]['head_pic_1'] + '">\
                            ' + liveStatus + '\
                        </div>\
                        <div class="anchor-msg">\
                            <p class="anchor-nickname">' + _data[i]['nickname'] + '</p>\
                            <p class="anchor-distance">成绩：' + _data[i]['num'] + '米</p>\
                        </div>\
                    </div>'
    }
    wrap.append(str)
}

function initXHR () {
    $.ajax({
        type: 'get',
        url: '/SingleDogActivity/Init',
        dataType: 'json',
        success: function (data) {
            var _data = data.data
            generateRace(_data.raceList)
            generateUser(_data.userRank)
            generateAnchorTop3(_data.anchorTop3)
            for (var i = 0; i < 5; i++) {
                generateAnchor(_data.anchorRank[i], i)
            }
            $('.competition-sub-' + max_stage).find('.sub-head').click()
            bindScroll()
        },
        error: function (err) {

        }
    })
}

initEvent()
initXHR()
