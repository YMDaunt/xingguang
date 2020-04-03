import Snow from '../component/gj.snow.js'
import Scroxt from '../component/gj.scroxt.js'
import TouchTransform from '../component/gj.touchTransform.js'
import common from '../common/common.js'

require('../../css/activity/christmas17.less')

var anchorPage = 0
var userPage = 0

var unitPrice = 0
var giftNum = 0

var anchorGift = ['至尊热门礼包', '豪华热门礼包', '惊喜热门礼包']
var userGift = ['至尊圣诞礼包', '豪华圣诞礼包', '惊喜圣诞礼包']

var scrollLock = false

var touchTransformEntity

function toastTips (txt) {
    $('.toast-tips').show()
    $('.tips-box').html(txt)
    setTimeout(function () {
        $('.toast-tips').hide()
    }, 1500)
}

function buyGift (productId, num) {
    $.ajax({
        type: 'get',
        url: '/Christmas17/BuyGift',
        dataType: 'json',
        data: {
            productId: productId,
            num: num
        },
        success: function (data) {
            if (data.data.uid === '0000') {
                return common.goLogin()
            }
            if (data.data.result) {
                toastTips('购买成功')
            } else {
                toastTips(data.data.error)
            }
            $('.buy-bomb-box').hide()
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 生成svg动画
function svgAni (path) {
    $('.svn-bg').show().empty()
    var svgWrap = document.querySelector('.svn-bg')
    bodymovin.loadAnimation({
        wrapper: svgWrap,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: path
    })
}

function generatorAnchor (data) {
    var top = []
    var str = ''
    data.forEach(function (value, index) {
        var live
        if (anchorPage === 1 && index < 3) {
            live = value.is_playing === '1' ? '<span class="live-status sprite"></span>' : ''
            var attend = !value.is_attention ? '<div class="attend-btn sprite" data-id="' + value.id + '">+ 关注</div>' : '<div class="attend-btn attend-had sprite">已关注</div>'
            var topStr = '<div class="sort-top-' + index + '">\
                    <div class="top-avator sprite js-go-room" data-rid="' + value.rid + '">\
                        <img src="' + value.head_pic_1 + '" class="avator">\
                        ' + live + '\
                        <span class="avator-no sprite avator-no-' + index + '">No.' + (index + 1) + '</span>\
                    </div>\
                     <div class="top-user-msg">\
                         <p class="top-user-nickname">' + value.nickname + '</p>\
                         <p class="top-user-num">收到 ' + value.num + '</p>\
                         ' + attend + '\
                     </div>\
                </div>'
            top.push(topStr)
        } else {
            live = value.is_playing === '1' ? '<span class="item-live sprite"></span>' : ''
            str += '<li class="lists-item clearfix">\
                       <span class="item-index">' + ((anchorPage - 1) * 30 + index + 1) + '</span>\
                       <span class="item-avator js-go-room" data-rid="' + value.rid + '">\
                           <img src="' + value.head_pic_1 + '" class="avator">\
                           ' + live + '\
                       </span>\
                       <span class="item-nickname">' + value.nickname + '</span>\
                       <span class="item-num">收到 ' + value.num + '</span>\
                   </li>'
        }
    })
    if (anchorPage === 1) {
        $('.js-lists-rank').html('')
        $('.js-sort-rank').html(top.join(''))
    }
    $('.js-lists-rank').append(str)
}

function generatorUser (data) {
    var top = []
    var str = ''
    data.forEach(function (value, index) {
        if (userPage === 1 && index < 3) {
            var topStr = '<div class="sort-top-' + index + '">\
                   <div class="top-avator sprite">\
                       <img src="' + value.head_pic_1 + '" class="avator">\
                       <span class="avator-no sprite avator-no-' + index + '">No.' + (index + 1) + '</span>\
                   </div>\
                    <div class="top-user-msg">\
                        <p class="top-user-nickname"><em class="user-nickname-top">' + value.nickname + '</em><em class="level_icon u_level_icon_' + value.level + '"></em></p>\
                        <p class="top-user-num">送出 ' + value.num + '</p>\
                    </div>\
               </div>'
            top.push(topStr)
        } else {
            str += '<li class="lists-item clearfix">\
                       <span class="item-index">' + ((userPage - 1) * 30 + index + 1) + '</span>\
                       <span class="item-avator">\
                           <img src="' + value.head_pic_1 + '" class="avator">\
                       </span>\
                       <span class="item-nickname"><em class="user-nickname-top">' + value.nickname + '</em><em class="level_icon u_level_icon_' + value.level + '"></em></span>\
                       <span class="item-num">送出 ' + value.num + '</span>\
                   </li>'
        }
    })
    if (userPage === 1) {
        $('.js-lists-rank').html('')
        $('.js-sort-rank').html(top.join(''))
    }
    $('.js-lists-rank').append(str)
}

// 主播、用户榜单
function getRank (type, page) {
    $.ajax({
        type: 'get',
        url: '/Christmas17/GetRank',
        dataType: 'json',
        data: {
            type: type,
            page: page
        },
        success: function (data) {
            var _data = data.data.result.data
            if (_data.length === 0) return
            scrollLock = false
            if (type === 'mod') {
                generatorAnchor(_data)
            } else {
                generatorUser(_data)
            }

            if (!touchTransformEntity) {
                // 滚动加载
                var scrollWrap = document.querySelector('.sort-lists')
                var scrollContent = document.querySelector('.lists-wrap')

                var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))
                touchTransformEntity = new TouchTransform('.sort-lists', '.lists-wrap', function (distance) {
                    var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                    if (contentHeight + distance - scrollWrapHeight < 200) {
                        if (scrollLock) return
                        scrollLock = true
                        if (anchorPage) {
                            anchorPage++
                            getRank('mod', anchorPage)
                        } else {
                            userPage++
                            getRank('user', userPage)
                        }
                    }
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 祝福语
function getBless () {
    $.ajax({
        type: 'get',
        url: '/Christmas17/GetBless',
        dataType: 'json',
        success: function (data) {
            var _data = data.data.result
            var scroxtWrap = []
            _data.forEach(function (value, index) {
                var user = value['user_nickname']
                var mod = value['mod_nickname']
                var str = '<div class="bless-item">\
                        <div class="bless-user">\
                            <span class="bless-user-item bless-user-left">' + user + '</span>\
                            <span class="bless-user-item bless-user-right">' + mod + '</span>\
                            <span class="bless-icon sprite"></span>\
                        </div>\
                        <p class="bless-msg">' + value['content'] + '</p>\
                    </div>'
                scroxtWrap.push(str)
            })
            if (_data.length > 4) {
                new window.scroxt.Vertical({
                    target: '.bless-lists',
                    data: scroxtWrap,
                    speed: -4
                })
            } else {
                $('.bless-lists').html(scroxtWrap.join(''))
            }
            if ($('.bless-table').find('.bless-item').length === 0) {
                $('.bless-table .bg-little-maozi').hide()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 往期记录
function getLastRank () {
    $.ajax({
        type: 'get',
        url: '/Christmas17/GetLastRank',
        dataType: 'json',
        success: function (data) {
            var _data = data.data.result
            var strArr = []
            for (var i in _data) {
                var str = ''
                str += '    <div class="log-lists">\
                    <p class="log-time">' + i + '</p>\
                    <ul>'
                for (var j = 0, jLen = _data[i]['mod'].length; j < jLen; j++) {

                }
                _data[i]['mod'].forEach(function (value, index) {
                    str += '<li class="log-item clearfix">\
                                <span class="log-item-nickname">' + value.nickname + '</span>\
                                <span class="log-item-get">获得</span>\
                                <span class="log-item-prize">' + anchorGift[index] + '</span>\
                            </li>'
                })

                _data[i]['user'].forEach(function (value, index) {
                    str += '<li class="log-item clearfix">\
                                <span class="log-item-nickname">' + value.nickname + '</span>\
                                <span class="log-item-get">获得</span>\
                                <span class="log-item-prize">' + userGift[index] + '</span>\
                            </li>'
                })

                str += '</ul>\
                    </div>'
                strArr.push(str)
            }
            var strContent = strArr.length > 0 ? strArr.reverse().join('') : '<p class="log-no">啊哦，还没有信息哦！</p>'
            $('.log-lists-wrap').html(strContent)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function getDaily () {
    $.ajax({
        type: 'get',
        url: '/Christmas17/GetDaily',
        dataType: 'json',
        success: function (data) {
            var _data = data.data.result

            var modStr = ''
            var userStr = ''

            var modArr = []
            var userArr = []

            var modGift0 = [12, 8, 5]
            var modGift1 = [20, 15, 10]

            var userGift0 = ['雪人派对*3、姜饼屋*3', '雪人派对*3', '姜饼屋*3']

            modStr += '<div class="today-sort-top clearfix">'
            _data.mod.forEach(function (value, index) {
                modArr.push('<div class="today-item clearfix">\
                   <div class="today-item-avator">\
                       <div class="today-avator-bg avator-bg-' + index + ' sprite js-go-room" data-rid="' + value.rid + '">\
                           <img src="' + value.head_pic_1 + '" class="avator">\
                       </div>\
                       <span class="avator-no sprite avator-no-' + index + '">No.' + (index + 1) + '</span>\
                       <p class="today-user-nickname">' + value.nickname + '</p>\
                   </div>\
                   <div class="today-item-msg">\
                       <p class="today-user-num">收到祝福 ' + value.score + '</p>\
                       <div class="tody-gift today-user-gift">\
                           <p>' + anchorGift[index] + ':</p>\
                           <p>' + modGift0[index] + '小时活动推荐</p>\
                           <p>上头条*' + modGift1[index] + '</p>\
                       </div>\
                   </div>\
               </div>')
            })
            modStr += (modArr.join('') + '</div>')

            userStr += '<div class="today-sort-top clearfix">'
            _data.user.forEach(function (value, index) {
                userArr.push('<div class="today-item clearfix">\
                       <div class="today-item-avator">\
                           <div class="today-avator-bg avator-bg-' + index + ' sprite">\
                               <img src="' + value.head_pic_1 + '" class="avator">\
                           </div>\
                           <span class="avator-no sprite avator-no-' + index + '">No.' + (index + 1) + '</span>\
                           <p class="today-user-nickname">' + value.nickname + '</p>\
                       </div>\
                       <div class="today-item-msg">\
                           <p class="today-user-num">送出祝福 ' + value.score + '</p>\
                           <div class="tody-gift today-user-gift">\
                               <p>' + userGift[index] + ':</p>\
                               <p>' + userGift0[index] + '</p>\
                               <p>圣诞快车（7日体验卡）</p>\
                           </div>\
                       </div>\
                   </div>')
            })
            userStr += (userArr.join('') + '</div>')
            $('.today-table').append(modStr + userStr)
            if ($('.today-table').find('.today-item').length === 0) {
                $('.today-table .bg-little-maozi').hide()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function initXHR () {
    getBless()
    getLastRank()
    getDaily()
    anchorPage++
    getRank('mod', anchorPage)
}

function initEvent () {
    new window.Snow({
        level: 4,
        imgBox: ['//static.guojiang.tv/mobile/v2/img/activity/christmas17/2.png', '//static.guojiang.tv/mobile/v2/img/activity/christmas17/2.png', '//static.guojiang.tv/mobile/v2/img/activity/christmas17/1.png']
    })
    // 活动规则
    $('.act-rules-btn').click(function () {
        $('.prize-boxbg').show()
    })
    $('.close').click(function () {
        $('.boxbg').hide()
        $('.cover-bg').hide()
    })
    // 往期记录
    $('.check-log').click(function () {
        $('.log-boxbg').show()
    })
    // 预览
    $('.prev-view').click(function () {
        var id = $(this).data('id')
        if (!id) svgAni('//static.guojiang.tv/src/pc/img/activity/christmas17/home/data.json')
        else svgAni('//static.guojiang.tv/src/pc/img/activity/christmas17/party/data.json')
    })
    $('.svn-bg').click(function () {
        $(this).hide()
    })
    // 购买输入
    var znInput = false
    $('.buy-bomb').on('compositionstart', '.buy-input-num', function () {
        znInput = true
    })
    $('.buy-bomb').on('compositionend', '.buy-input-num', function () {
        znInput = false
        giftNum = $(this).val().replace(/[^0-9]/g, '')
        $(this).val(giftNum)
        $('.price-num').html(giftNum * unitPrice)
    })
    $('.buy-bomb').on('input', '.buy-input-num', function () {
        if (znInput) return
        giftNum = $(this).val().replace(/[^0-9]/g, '')
        $(this).val(giftNum)
        $('.price-num').html(giftNum * unitPrice)
    })
    // 购买
    $('.buy-gift').click(function () {
        $('.buy-input-num').val('')
        $('.price-num').html(0)
        var id = $(this).data('id')
        unitPrice = id === 0 ? 2999 : 6666
        $('.buy-bomb-box').show()
    })
    $('.buy-gift-sure').click(function () {
        if (!giftNum) return
        var productId = unitPrice === 2999 ? 400 : 401
        buyGift(productId, giftNum)
    })

    // 跳转到房间
    $('.wrapper').on('click', '.js-go-room', function () {
        var rid = $(this).data('rid')
        common.goRoom(rid, 2)
    })
    // 榜单切换
    // $(".js-rank-head").click(function(){

    // });
    var allRankHead = document.querySelectorAll('.js-rank-head')
    for (var i = 0, len = allRankHead.length; i < len; i++) {
        allRankHead[i].addEventListener('touchstart', function () {
            touchTransformEntity && touchTransformEntity.refresh()
            var id = $(this).data('id')
            $('.js-rank-head').addClass('head-normal').removeClass('head-act')
            $(this).addClass('head-act').removeClass('head-normal')
            userPage = anchorPage = 0
            if (!id) {
                anchorPage++
                getRank('mod', anchorPage)
            } else {
                userPage++
                getRank('user', userPage)
            }
        })
    }

    // 关注
    $('.js-sort-rank').on('click', '.attend-btn', function () {
        if ($(this).hasClass('attend-had')) return
        var id = $(this).data('id')
        var tempEle = $(this)
        $.ajax({
            type: 'get',
            url: '/Christmas17/AddLove',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (data) {
                if (data.data.uid === '0000') {
                    return common.goLogin()
                }
                if (data.data.result) {
                    tempEle.addClass('attend-had')
                } else {
                    toastTips(data.data.error)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
}

initEvent()
initXHR()
