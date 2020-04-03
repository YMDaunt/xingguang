import axios from 'axios'
import common from '../common/common.js'

require('../../css/activity/valentine.less')

document.body.addEventListener('click', function () {})

var resttime // 当前时间
var boxOpendArr = [] // 已经打开的宝箱
var uid
var page = 0
var limit = 10
var goodsListLock = false
var hstate // 用户是否填写了信息

// 滚动加载
function scrollLoad (ele, bottomHeight, callback) {
    var _ele = document.querySelector(ele)

    var cliHeight = _ele.clientHeight

    var bH = bottomHeight || 100

    var scrollTop = _ele.scrollTop

    var scrollHeight = _ele.scrollHeight

    _ele.addEventListener('scroll', function () {
        // if(scrollHeight <= cliHeight){return false};

        cliHeight = _ele.clientHeight

        scrollTop = _ele.scrollTop

        scrollHeight = _ele.scrollHeight

        if (scrollHeight - cliHeight - scrollTop < bH) {
            callback()
        }
    }, false)
}

// scrollLoad('.buy-gift-list',120,function(){
//     if(goodsListLock) return;
//     goodsListLock = true;
//     page++;
//     getGiftList();
// });
var animItem
function svgAni () {
    $('.cover-bg').show()
    var svgWrap = document.querySelector('.cover-bg')
    animItem = bodymovin.loadAnimation({
        wrapper: svgWrap,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: '//static.guojiang.tv/src/mobile/v2/js/svg/valentine/data.json'
    })
}

// 装备-卸下
function setEquit (has) {
    axios.get('/ValentineActivity/useMount', {
        params: {
            pid: 11
        }
    })
        .then(function (res) {
            if (res.data.data.result) {
                getBird()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function initEvent () {
    // 夺冠列表
    $('.prize-btn').click(function () {
        $('.champion-lists').show()
    })
    $('.champion-close').click(function () {
        $('.champion-lists').hide()
    })

    // 装备
    $('.equip').click(function () {
        if (!$(this).data('has')) return
        setEquit()
    })

    // 点击七夕预览
    $('.valentine-ani').click(function () {
        svgAni()
    })
    $('.cover-bg').click(function () {
        $('.cover-bg').hide().empty()
    })

    // 跳转到主播房间
    $('.content').on('click', '.js-goroom', function () {
        var rid = $(this).data('rid')
        if (rid) common.goRoom(rid, 2)
    })
    // 充值返利
    $('.code-attent').click(function () {
        $('.recharge-msgbox').show()
    })
    $('.recharge-msgbox').click(function () {
        $(this).hide()
    })
}

function modRank () {
    axios.get('/ValentineActivity/GetModRank', {
        params: {
            activityId: 170
        }
    })
        .then(function (res) {
            var _data = res.data.data
        })
        .catch(function (error) {
            console.log(error)
        })
}

function userRank () {
    axios.get('/ValentineActivity/GetUserRank', {
        params: {
            activityId: 170
        }
    })
        .then(function (res) {
            var _data = res.data.data
        })
        .catch(function (error) {
            console.log(error)
        })
}
// 奖励者表单
function generateSort (data) {
    var str = ''
    if (data.length === 0 || !data) {
        $('.champion-sort').append('<div class=\'sort-nodata\'>啊哦，还没有信息哦！</div>')
        return
    }
    for (var i in data) {
        str += `<p class="champion-time">${i.replace(/-/g, '/')}</p>`
        str += '<ul class="champion-item">'
        var len = data[i].length > 3 ? 3 : data[i].length
        for (var j = 0; j < len; j++) {
            var value = data[i][j]
            str += `
                    <li class="c_clearfix">
                        <span class="champion-name">${value['nickname']}</span>
                        <span class="champion-txt">获得</span>
                        <span class="champion-prizeName">比翼鸟(7日体验卡)</span>
                    </li>
            `
        }
        str += '</ul>'
    }
    $('.champion-sort').append(str)
}
// 当天前3
function nowDateTop3 (data) {
    if (data.length === 0) return
    for (var i = 0; i < data.length; i++) {
        var str = `
            <span class="today-title">第${i + 1}名</span>
            <div class="today-avator">
                <img src="${data[i]['pic']}">
            </div>
            <p class="pale-pink">${data[i]['nickname']}</p>
            <p>数量：${data[i]['num']}</p>
        `
        $('.today-top-' + i).html(str)
    }
}
// 前10主播和对应的用户
function correspond (mod) {
    var len = mod.length
    if (len === 0) {
        return
    }
    $('.js-top1-num').html(mod[0]['pnum'])
    $('.js-top1-left').attr('src', mod[0]['headPic']).data('rid', mod[0]['rid'])
    $('.js-top1-right').attr('src', mod[0]['userHeadPic'])
    $('.js-top1-left-nickname').html(mod[0]['nickname'])
    $('.js-top1-right-nickname').html(mod[0]['userNick'])

    var str = ''
    var sortAvator = ''
    var sortAvatorBG = ''
    for (var i = 1; i < len; i += 2) {
        if (i > 2) {
            sortAvator = 'bottom-avator'
            sortAvatorBG = 'bottom-avator-bg'
        }
        str += `
            <div class="sort-item c_clearfix">
                <div class="sort-item-left">
                    <p class="sort-top">第${i + 1}名</p>
                    <p class="sort-top gray-color">相爱值:<em>${mod[i]['pnum']}</em></p>
                    <div class="sort-top-bg ${sortAvatorBG}">
                        <div class="sort-top-avator js-goroom ${sortAvator}" data-rid="${mod[i]['rid']}">
                            <img src="${mod[i]['headPic']}">
                            <div class="avator-nickname">${mod[i]['nickname']}</div>
                        </div>
                        <div class="sort-top-avator ${sortAvator}">
                            <img src="${mod[i]['userHeadPic']}">
                            <div class="avator-nickname">${mod[i]['userNick']}</div>
                        </div>
                    </div>
                </div>`
        if (i + 1 >= len) break
        str += `<div class="sort-item-left">
                    <p class="sort-top">第${i + 2}名</p>
                    <p class="sort-top gray-color">相爱值:<em>${mod[i + 1]['pnum']}</em></p>
                    <div class="sort-top-bg ${sortAvatorBG}">
                        <div class="sort-top-avator js-goroom ${sortAvator}" data-rid="${mod[i + 1]['rid']}">
                            <img src="${mod[i + 1]['headPic']}">
                            <div class="avator-nickname">${mod[i + 1]['nickname']}</div>
                        </div>
                        <div class="sort-top-avator ${sortAvator}">
                            <img src="${mod[i + 1]['userHeadPic']}">
                            <div class="avator-nickname">${mod[i + 1]['userNick']}</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    $('.sort-item-box').html(str)
}
// 奖励者信息
function prizeRank () {
    axios.get('/ValentineActivity/GetPrizeRank')
        .then(function (res) {
            var _data = res.data.data

            nowDateTop3(_data['GetNowRank'])
            correspond(_data['modRank'])
            generateSort(_data['prizeRank'])
        })
        .catch(function (error) {
            console.log(error)
        })
}
// 装备倒计时
function equitLoadTime (time) {
    var time = time
    function getTime () {
        var date = ~~(time / 60 / 60 / 24)
        date = date < 10 ? '0' + date : date
        var hour = ~~((time - date * 24 * 60 * 60) / 60 / 60)
        hour = hour < 10 ? '0' + hour : hour
        $('.equip').html(date + '天' + hour + '小时')
    }
    getTime()
    setInterval(getTime, 10 * 60 * 1000)
}
// 比翼鸟装备
function getBird () {
    axios.get('/ValentineActivity/GetBird')
        .then(function (res) {
            var _data = res.data.data
            if (!_data.uid) return common.goLogin()
            if (!_data.result) {
                $('.equip').data('has', '0').addClass('no-equip')
            } else {
                if (_data.result['is_equipment']) {
                    $('.equip').data('has', '0')
                    equitLoadTime(_data.result['time_left'])
                } else {
                    $('.equip').data('has', '1')
                }
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}
function initData () {
    modRank()
    userRank()
    prizeRank()
    getBird()
}

initEvent()
initData()
