import axios from 'axios'
import common from 'common'
import bodymovin from '../component/bodymovin.min.js'
import scroxt from '../component/gj.scroxt.js'
import PolyfillScroll from '../component/gj.polyfillScroll.js'
import keyboard from '../component/gj.keyboard.js'

require('../../css/activity/customized18.less')

// ios中激活active伪类
document.body.addEventListener('touchstart', function () {});

// 适配机型重定向
(function () {
    let href = window.location
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
        if (href.host.indexOf('www') >= 0) {
            window.location.href = 'http://m.kuaishouvideo.com/dist/activity/customized18.html'
        }
    } else {
        if (href.host.indexOf('www') < 0) {
            window.location.href = '//www.kuaishouvideo.com/customizedActivity'
        }
    }
})()

var currentTime // 当前时间
// var timeMsg;
var startTime
var endTime
var deadline
var boxOpendArr = [] // 已经打开的宝箱
var boxOpenTime = []
var boxCompleted = []
var uid
var page = 0// 购买礼物列表页数
var limitPage = 0// 限定礼物列表页数
var searchPage = 0// 搜索礼物列表页数
var limit = 10
var goodsListLock = false
var limitGoodsListLock = false
var searchListLock = false
// var hstate; //用户是否填写了信息
var bodyScrollEntity
// var goodScrollEntity;
// var goodLimitScrollEntity;
var getAdvertisement = 0 // 剩余广告数量
var limitScrollEnity = false // 限定礼物实例

axios.get('/CustomizedActivity/Init')
    .then(function (res) {
        return res.data.data
    })
    .then(function (data) {
        uid = data.uid
        if (!uid) return common.goLogin()
        var completedCount = 0
        for (var i in data.getBox) {
            if (data['getBox'][i].completed) {
                completedCount++
            }
        }
        initProcess(completedCount)

        generateScrollMsg(data['getBd'])

        currentTime = new Date(data['nowTime']).getTime()
        initTime(data['timeMsg'])
        calcTime()

        // 剩余广告位数量
        getAdvertisement = data.getAdvertisement
        // 限定礼物是否有新品
        if (data.hasNewProduct) {
            $('.goods-men').append('<span class="new"></span>')
        }

        initBox(data.getBox)

        $('.recharge').html(data.getCost)
        $('.user-avator img').attr('src', data.user['userHeadPic'])

        // 获取礼物列表
        getGiftList(function () {
            // 模拟滚动
            var scrollWrap = document.querySelector('.goods-list-wrap')
            var scrollContent = document.querySelector('.goods-content')
            var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))

            new PolyfillScroll({
                scrollWrap: '.goods-list-wrap',
                scrollContent: '.goods-content',
                bar: {
                    background: 'rgba(0,0,0,0)'
                },
                cb (distance) {
                    var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                    if (contentHeight - distance - scrollWrapHeight < 150) {
                        if (goodsListLock) return
                        goodsListLock = true
                        page++
                        getGiftList()
                    }
                }
            })
        })

        // 分享文案
        window.gjShareParam = JSON.stringify({
            title: data.shareInfo.title,
            content: data.shareInfo.content,
            link: location.href,
            imgLink: data.shareInfo.image
        })
    })
    .catch(function (error) {
        console.log(error)
    })

// 初始化进度条
function initProcess (level) {
    var i = 1
    var str = ''
    // while (i <= level) {
    //     // if (i === level - 1) {
    //     //     str += '<div class="process-leaf process-leaf-had process-had sprite2"></div>';
    //     // } else if (i < level) {
    //     //     str += '<div class="process-leaf process-leaf-had sprite2"></div>';
    //     // } else {
    //     // }
    //     if (level === 1 && i == 1) {
    //         str += '<div class="process-leaf process-level-1 sprite2"></div>';
    //     } else {
    //         str += '<div class="process-leaf sprite2"></div>';
    //     }

    //     i++;
    // }
    if (level === 1) {
        str += '<li class="process-level-1 sprite2"></li>'
    } else {
        while (i < level) {
            str += '<li class="process-leaf sprite2"></li>'
            i++
        }
    }
    $('.process-tree').html(str)
    $('.process-leaf').eq(5).append('<span class="unit-money">单位:人民币(元)</span>')
}

var timeST // 时间定时器
var activityEnd = false // 活动结束
var activityStart = false // 活动未开始

// [calcTime 计算时间]
function calcTime () {
    if (currentTime < (new Date(startTime).getTime())) {
        activityStart = true
    }
    var diffTime = (new Date(endTime).getTime()) - currentTime
    culTime(diffTime)
    timeST = setInterval(function () {
        currentTime += 1000
        var diffTime = (new Date(endTime).getTime()) - currentTime
        culTime(diffTime)
    }, 1000)
}

function culTime (mil) {
    if (mil <= 0) {
        activityEnd = true
        clearInterval(timeST)
        return $('.recharge-loadtime').html('00天00时00分00秒')
    }

    var d = ~~(mil / (1000 * 60 * 60 * 24))
    var h = ~~((mil - d * 24 * 60 * 60 * 1000) / (1000 * 60 * 60))
    var i = ~~((mil - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (1000 * 60))
    var s = ~~((mil % (60 * 1000)) / 1000)
    d = d < 10 ? '0' + d : d
    h = h < 10 ? '0' + h : h
    i = i < 10 ? '0' + i : i
    s = s < 10 ? '0' + s : s
    $('.recharge-loadtime').html(d + '天' + h + '时' + i + '分' + s + '秒')
}

// 广播滚动消息
function generateScrollMsg (dataArr) {
    new scroxt.Horizontal({
        target: '.msg-wrapper',
        data: dataArr,
        speed: -5,
        gap: 20
    }, 10)
}

// 搜索
function getSearchList (cb) {
    var value = $('.search').val().trim()
    axios.get('/CustomizedActivity/GetSearchList', {
        params: {
            midOrNick: value,
            page: searchPage,
            limit: limit
        }
    })
        .then((res) => {
            var _data = res.data.data
            if (_data.list.length > 0) {
                searchListLock = false
                $('.search-list').empty()
                $('.search-list').append(renderGiftList(_data.list))
                cb && cb()
            } else {
                if (searchPage == 0) {
                    $('.search-list').empty()
                    $('.search-list').append('<li class="no-result">未搜到相关礼物</li>')
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

// 购买礼物列表
function getGiftList (cb) {
    axios.get('/CustomizedActivity/GiftsList', {
        params: {
            page: page,
            limit: limit
        }
    })
        .then(function (res) {
            var _data = res.data.data
            if (_data.list.length != 0) goodsListLock = false

            $('.buy-gift-list').append(renderGiftList(_data.list))
            if (typeof cb !== 'undefined') {
                cb()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

// 渲染礼物列表
function renderGiftList (data) {
    var str = ''
    data.forEach(function (value) {
        var overRealse = currentTime > (new Date(value['releaseTime'].replace(/-/g, '/'))) ? '1' : '0'
        var sendWord = value['ownerSendWord']
        if (sendWord.length === 0) sendWord = '他很酷，啥也没说！'
        /* 礼物价格 */
        var priceBtn = ''
        if (value['price'].length == 5) {
            priceBtn = 'price-btn-1'
        } else if (value['price'].length > 5) {
            priceBtn = 'price-btn-2'
        }
        var cyclePlan = ''// 购买座驾的天数
        if (value['cyclePlan']) {
            for (var i in value['cyclePlan']) {
                cyclePlan = parseInt(i)
                break
            }
        }
        /* 是否是svg动画 */
        var svgUrl = ''
        if (value['h5AnimationJsonUrl'] && value['h5AnimationJsonUrl'].length > 0) {
            svgUrl = value['h5AnimationJsonUrl']
        } else {
            if (value['pcAnimationJsonUrl'] && value['pcAnimationJsonUrl'].length > 0) {
                svgUrl = value['pcAnimationJsonUrl']
            }
        }

        var carClass = ''
        var priceContont = value['price'] + '克拉/个'
        var releaseContent = value['releaseTime']
        if (value['price'] == 0) {
            carClass = 'buy-car-sty'
            priceContont = '待定'
            releaseContent = '待定'
        }
        str += '\
        <li class="buy-gift-item">\
          <div class="gift-avator">\
            <img src="' + value['image'] + '">\
            <div class="gift-intro">\
              <p>名称：<span>' + value['name'] + '</span></p>\
              <p>定制者：<span>' + value['owner'] + '</span></p>\
              <p>开放售卖日：<span>' + releaseContent + '</span></p>\
              <p class="red-color">已售出：<span>' + value['salesVolume'] + '个</span></p>\
              <p class="clamp2">定制原因：<span>' + sendWord + '</span></p>\
              <div class="gift-btn-box c_clearfix">\
                <div class="gift-btn-buy sprite2 ' + carClass + '" data-id="' + value['id'] + '" data-price="' + value['price'] + '" data-release="' + overRealse + '" data-type="' + value['type'] + '"  data-cyclePlan="' + cyclePlan + '"></div>\
                <div class="gift-btn-show sprite2" data-id="' + value['id'] + '" data-img="' + value['imagePreview'] + '" data-svg="' + svgUrl + '"></div>\
              </div>\
            </div>\
          </div>\
          <div class="gift-money ' + priceBtn + '">' + priceContont + '</div>\
        </li>\
    '
    })
    return str
}

// 限定礼物列表
function getLimitGiftList (cb) {
    axios.get('/CustomizedActivity/LimitGiftList', {
        params: {
            page: limitPage,
            limit: limit
        }
    })
        .then(function (res) {
            var _data = res.data.data
            if (_data.list.length != 0) {
                limitGoodsListLock = false
            } else {
                if (limitPage === 0) {
                    return $('.famous-man-content').html('<div class="waitting-limit">敬请期待...</div>')
                }
            }

            var str = ''
            _data.list.forEach(function (value) {
                var overRealse = currentTime > (new Date(value['releaseTime'].replace(/-/g, '/'))) ? '1' : '0'
                /* 礼物价格 */
                var priceBtn = ''
                if (value['price'].length == 5) {
                    priceBtn = 'price-btn-1'
                } else if (value['price'].length > 5) {
                    priceBtn = 'price-btn-2'
                }
                var cyclePlan = ''// 购买座驾的天数
                if (value['cyclePlan']) {
                    for (var i in value['cyclePlan']) {
                        cyclePlan = parseInt(i)
                        break
                    }
                }
                /* 是否是svg动画 */
                var svgUrl = ''
                if (value['pcAnimationJsonUrl'] && value['pcAnimationJsonUrl'].length > 0) {
                    svgUrl = value['pcAnimationJsonUrl']
                }

                var carClass = ''
                var priceContont = value['price'] + '克拉/个'
                if (value['price'] == 0) {
                    carClass = 'buy-car-sty'
                    priceContont = '待定'
                }
                var releaseContent = value['releaseTime'] ? value['releaseTime'] : '0000-00-00 00:00:00'
                var endContent = value['downTime'] ? value['downTime'] : '0000-00-00 00:00:00'
                str += '\
                    <li class="buy-gift-item">\
                      <div class="gift-avator">\
                        <img src="' + value['image'] + '">\
                        <div class="gift-intro">\
                          <p>名称：<span>' + value['name'] + '</span></p>\
                          <p>开放售卖日：<span>' + releaseContent + '</span></p>\
                          <p>结束售卖日：<span>' + endContent + '</span></p>\
                          <p class="red-color">已售出：<span>' + value['salesVolume'] + '个</span></p>\
                          <div class="gift-btn-box c_clearfix">\
                            <div class="gift-btn-buy sprite2 ' + carClass + '" data-id="' + value['id'] + '" data-price="' + value['price'] + '" data-release="' + overRealse + '" data-type="' + value['type'] + '" data-cyclePlan="' + cyclePlan + '"></div>\
                            <div class="gift-btn-show sprite2" data-id="' + value['id'] + '" data-img="' + value['imagePreview'] + '" data-svg="' + svgUrl + '"></div>\
                          </div>\
                        </div>\
                      </div>\
                      <div class="gift-money ' + priceBtn + '">' + priceContont + '</div>\
                    </li>\
                '
            })

            $('.famous-man-content').append(str)
            if (typeof cb !== 'undefined') {
                cb()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

// 初始化宝箱
function initBox (data) {
    var str = ''
    boxCompleted = []
    boxOpendArr = []
    boxOpenTime = []

    // 是否处于活动奖励时间
    var dealLineBool = false
    if ((new Date(currentTime).getTime()) > (new Date(startTime).getTime()) && (new Date(currentTime).getTime()) < (new Date(deadline).getTime())) dealLineBool = true

    for (var i = 1; i <= 7; i++) {
        data[i]['completed'] ? boxCompleted.push(true) : boxCompleted.push(false)
        if (data[i]['opened']) {
            boxOpendArr.push(true)
            boxOpenTime.push(data[i]['open_time'].replace(/-/g, '/'))
        } else {
            boxOpendArr.push(false)
            boxOpenTime.push(false)
        }
        // 已开启宝箱标志
        var checkClass = data[i]['opened'] ? '<span class="gift-check sprite1"></span>' : ''
        var qiangClass = ''
        if (i <= 2) {
            if (dealLineBool) {
                qiangClass = data[i]['opened'] ? 'qiang qiang-gray' : 'qiang'
            } else {
                qiangClass = boxOpendArr[i - 1] && +new Date(boxOpenTime[i - 1]) <= +new Date(deadline) ? 'qiang qiang-gray' : ''
            }
        }
        var remark = data[i]['remark'].replace('<em>XXX</em>', '<em class="js-adver-num">' + getAdvertisement + '</em>')
        str += `<div class="gift-box gift-box-${i} ${qiangClass} sprite1" data-id="${i}">
                ${checkClass}
                <span class="gift-price">${data[i]['money']}</span>
                <div class="box-tips">
                  <h2>${data[i]['name']}</h2>
                  <p>开启条件：累计充值${data[i]['money']}</p>
                  <p>${remark}</p>
                </div>
            </div>`

        // 总金额
        if (i === 7) {
            $('.sum-recharge').html(data[7]['money'])
        }
    }
    $('.box-tree').html(str)
    // 长按宝箱显示介绍
    longTap()
}

function initTime (timeMsg) {
    startTime = timeMsg.startTime.replace(/-/g, '/')
    endTime = timeMsg.endTime.replace(/-/g, '/')
    deadline = timeMsg.deadline.replace(/-/g, '/')
    $('.periods').html(timeMsg.stage)
    var startTemp = startTime.split(' ')
    var endTemp = endTime.split(' ')
    var deadlineTemp = deadline.split(' ')
    var s = startTemp[0].split('/')
    var e = endTemp[0].split('/')
    var d = deadlineTemp[0].split('/')

    $('.js-acttime').html(s[0] + '年' + s[1] + '月' + s[2] + '日 ' + startTemp[1] + '-' + e[0] + '年' + e[1] + '月' + e[2] + '日 ' + endTemp[1])
    $('.js-boxend-time').html(e[0] + '年' + e[1] + '月' + e[2] + '日 ' + endTemp[1])
    $('.act-month').html(d[1] + '月' + d[2] + '日' + deadlineTemp[1])
    $('.banner-duration-time').html(s[0] + '/' + s[1] + '/' + s[2] + '-' + e[0] + '/' + e[1] + '/' + e[2])
    $('.deadline-time').html(d[0] + '年' + (d[1].replace(/^0/, '')) + '月' + (d[2].replace(/^0/, '')) + '日')
}

// 弹框
function showMsgBox (headerContent, content, btn) {
    $('.layout-cover').show()
    $('.layout-head').html(headerContent)
    $('.layout-content').html(content)
    $('.layout-btn').html(btn)
}

function tipsBox (content) {
    $('.layout-head').show()
    // $('.layout-close').css('top', 0);
    showMsgBox('', '<div class="buy-gift-result"><p>' + content + '</p></div>', '朕知道了')
    $('.layout-btn').one('click', function () {
        // $('.layout-head').hide();
        $('.layout-cover').hide()
    })
}

// 开启宝箱
function openBox (boxId, cb) {
    $.ajax({
        type: 'GET',
        url: '/CustomizedActivity/OpenBox',
        dataType: 'json',
        data: {
            boxId: boxId
        },
        success: function (data) {
            var _data = data.data
            if (!_data.uid) return common.goLogin()

            if (_data.isOpened) {
                typeof cb === 'function' && cb()
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 购买礼物
function buyGift (id, num, Ele) {
    $.ajax({
        type: 'GET',
        url: '/CustomizedActivity/BuyGifts',
        dataType: 'json',
        data: {
            productId: id,
            num: num
        },
        success: function (data) {
            var _data = data.data
            if (!_data.uid) return common.goLogin()

            if (_data.result) {
                tipsBox('<p>购买成功</p><p>礼物已放入您的背包</p>')
                var numEle = Ele.parents('.buy-gift-item').find('.red-color span')
                if (!Ele.data('cycleplan')) {
                    numEle.html(parseInt(numEle.html()) + parseInt(num) + '个')
                } else {
                    numEle.html(parseInt(numEle.html()) + 1 + '个')
                }
            } else {
                tipsBox('<p>' + _data.error + '</p>')
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 查看特权
function getHstate (callback) {
    $.ajax({
        type: 'GET',
        url: '/CustomizedActivity/GetHstate',
        dataType: 'json',
        success: function (data) {
            var _data = data.data;
            (typeof callback === 'function') && callback(_data)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function regSaveCont () {
    $('.user-msg-error').remove()
    if (!uid) return common.goLogin()
    var tel = $('.user-msg-tel').val().trim()
    var qq = $('.user-msg-qq').val().trim()
    var reg = /^1[3|4|5|7|8][0-9]{9}$/
    var regQQ = /^\d+$/
    if ((tel.length > 0 && !reg.test(tel)) || (qq.length > 0 && !regQQ.test(qq))) {
        $('.layout-btn').one('click', function () {
            regSaveCont()
        })
        return $('.user-msg-tel').after('<p class="user-msg-error">信息填写不正确，请重新填写。</p>')
    }
    if (tel.length === 0 && qq.length === 0) {
        $('.layout-btn').one('click', function () {
            regSaveCont()
        })
        return
    }
    SaveCont(tel, qq)
}
// 提交表单信息
function SaveCont (mobile, qq) {
    $.ajax({
        type: 'GET',
        url: '/CustomizedActivity/SaveCont',
        dataType: 'json',
        data: {
            uid: uid,
            mobile: mobile,
            qq: qq
        },
        success: function (data) {
            var _data = data.data
            if (_data.result) {
                tipsBox('信息提交成功！')
            } else {
                tipsBox(_data.error)
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 长按宝箱显示介绍
function longTap () {
    var giftBoxEleArr = document.querySelectorAll('.gift-box')
    giftBoxEleArr = Array.prototype.slice.call(giftBoxEleArr)
    giftBoxEleArr.forEach(function (ele) {
        ele.addEventListener('touchstart', touchStart, false)
        ele.addEventListener('touchmove', touchMove, false)
        ele.addEventListener('touchend', touchEnd, false)
        ele.addEventListener('touchcance', touchEnd, false)
    })

    // var startTime;
    // var endTime;
    var touhST

    function touchStart (e) {
        (function (target) {
            touhST = setTimeout(function () {
                $('.box-tips').hide()
                $(target.target).find('.box-tips').show()
            }, 500)
        })(e)
    }

    function touchMove () {
        clearTimeout(touhST)
    }

    function touchEnd () {
        clearTimeout(touhST)
    }
    document.addEventListener('scroll', function () {
        $('.box-tips').hide()
    }, false)

    $('.wrapper').click(function () {
        $('.box-tips').hide()
    })
    $('.box-tips').click(function (e) {
        e.stopPropagation()
    })
}

// svg动画
function svgAni (path) {
    // 生成svg动画
    $('.cover-bg').empty()
    var svgWrap = document.querySelector('.cover-bg')
    bodymovin.loadAnimation({
        wrapper: svgWrap,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: path
    })
}

function initEvent () {
    // body模拟滚动
    var offsetTop = $('.scroll-bg').offset().top
    var tempDistance = 0
    bodyScrollEntity = new PolyfillScroll({
        scrollWrap: 'body',
        scrollContent: '.wrapper',
        bar: {
            background: 'rgba(0,0,0,0)'
        },
        cb (distance) {
            // 消息滚动置顶
            var temp
            if (distance >= offsetTop) {
                tempDistance = distance
                document.querySelector('.scroll-bg').setAttribute('style', 'position:fixed;top:0px;width:100%;background:#000;')
                temp = $('.scroll-bg').clone()
                $('.scroll-bg').remove()
                $('body').append(temp)
            }
            if (distance < tempDistance && tempDistance !== 0) {
                tempDistance = 0
                document.querySelector('.scroll-bg').setAttribute('style', 'position:absolute;top:-9px;')
                temp = $('.scroll-bg').clone()
                $('.scroll-bg').remove()
                $('.list-tab').after(temp)
            }
            // document.body.addEventListener('touchmove', function(evt) {
            //     evt.preventDefault();
            // });
        }
    })
    if (!('transform' in document.body.style) && !('webkitTransform' in document.body.style)) {
        offsetTop = $('.scroll-bg').offset().top
        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop()
            if (offsetTop < scrollTop) {
                $('.scroll-bg').css({
                    'position': 'fixed',
                    'top': '0px'
                })
            } else {
                $('.scroll-bg').css({
                    'position': 'absolute',
                    'top': '-9px'
                })
            }
        })
    }

    // 预览
    $('.buy-gift-list,.famous-man-content,.search-list').on('click', '.gift-btn-show', function () {
        var svg = $(this).data('svg')
        $('.cover-bg').show()
        if (svg) return svgAni(svg)
        var imgSrc = $(this).data('img')
        var IMG = document.createElement('img')
        IMG.src = imgSrc

        $('.cover-bg').empty()
        IMG.onload = function () {
            $('.cover-bg').append(IMG)
        }
    })
    $('.cover-bg').click(function () {
        $('.cover-bg').hide()
    })
    // 关闭弹框
    $('.layout-close').click(function () {
        $('.layout-cover').hide()
        $('.layout-btn').off()
        // $('.layout-head').hide();
        // $('.layout-close').css('top', '-.91666667rem');
    })

    // 模糊搜索
    $('.search').bind('input propertychange', function () {
        searchPage = 0
        $('.tab-item').removeClass('tab-active')
        $('.goods-list-wrap').hide()
        $('.famous-man-wrap').hide()
        $('.search-list-wrap').show()

        $('.search-list').siblings().remove()
        getSearchList(function () {
            var scrollWrap = document.querySelector('.search-list-wrap')
            var scrollContent = document.querySelector('.search-list')
            var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))
            if (isNaN(scrollWrapHeight)) scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('max-height'))
            new PolyfillScroll({
                scrollWrap: '.search-list-wrap',
                scrollContent: '.search-list',
                bar: {
                    background: '#fef0cc',
                    height: '80px',
                    borderRadius: '5px'
                },
                cb: function (distance) {
                    var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                    if (contentHeight - distance - scrollWrapHeight < 150) {
                        if (searchListLock) return
                        searchListLock = true
                        searchPage++
                        getSearchList()
                    }
                }
            })
        })
    })

    // 选项卡切换
    $('.tab-item').click(function () {
        $('.tab-active').removeClass('tab-active')
        $('.search-list-wrap').hide()
        $('.search').val('')
        $(this).addClass('tab-active')
        if ($(this).hasClass('goods-all')) {
            $('.goods-list-wrap').show()
            $('.famous-man-wrap').hide()
        } else {
            $('.goods-list-wrap').hide()
            $('.famous-man-wrap').show()

            if (!limitScrollEnity) {
                limitScrollEnity = true
                getLimitGiftList(function () {
                    // 模拟滚动
                    var scrollWrap = document.querySelector('.famous-man-wrap')
                    var scrollContent = document.querySelector('.famous-man-content')
                    var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))
                    if (isNaN(scrollWrapHeight)) scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('max-height'))
                    new PolyfillScroll({
                        scrollWrap: '.famous-man-wrap',
                        scrollContent: '.famous-man-content',
                        bar: {
                            background: 'rgba(0,0,0,0)'
                        },
                        cb (distance) {
                            var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                            if (contentHeight - distance - scrollWrapHeight < 150) {
                                if (limitGoodsListLock) return
                                limitGoodsListLock = true
                                limitPage++
                                getLimitGiftList()
                            }
                        }
                    })
                })
            }
        }
        bodyScrollEntity.refresh($('.wrapper').data('dist'))
    })

    // 开启宝箱
    document.querySelector('.box-tree').addEventListener('click', function (e) {
        if (e.target.className.indexOf('gift-box') > -1) {
            if (activityEnd) {
                return tipsBox('活动已结束！')
            }
            if (activityStart) {
                return tipsBox('活动未开始！')
            }
            var that = $(e.target)
            var boxId = that.data('id')
            var openLock = false
            if (!boxCompleted[boxId - 1] || boxOpendArr[boxId - 1] || openLock) return
            openLock = true
            that.addClass('shake')

            if (boxId <= 2 && +new Date(currentTime) <= +new Date(deadline)) {
                that.addClass('qiang-gray')
            }

            openBox(boxId, function () {
                openLock = false
                boxOpendArr[boxId - 1] = true
                that.append('<span class="gift-check sprite"></span>')

                $.ajax({
                    type: 'GET',
                    url: '/CustomizedActivity/GetBoxesList',
                    dataType: 'json',
                    success: function (data) {
                        initBox(data.data.boxes)
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })

                // 剩余广告位
                if (boxId == 2) {
                    var num = +$('.advertisement-num').html()
                    if (num > 0) {
                        $('.advertisement-num').html(num - 1)
                    }
                }
            })
        }
    })

    // 购买礼物
    var unitPrice = 0
    var giftNum = 0
    var giftId = 0
    var _that
    $('.buy-gift-list,.famous-man-content,.search-list').on('click', '.gift-btn-buy', function () {
        var release = $(this).data('release')
        var giftType = $(this).data('type')
        giftId = $(this).data('id')
        unitPrice = $(this).data('price')
        _that = $(this)
        if (release == '0') {
            tipsBox('礼物还没过独享期！等等再来吧')
            return
        }
        // 待定礼物不能购买
        if ($(this).hasClass('buy-car-sty')) { return false }
        // 座驾
        if (giftType === 3 || giftType === 30) {
            giftNum = $(this).data('cycleplan')
            showMsgBox('购买', '<div class="buy-gift-result"><p>您是否确认购买' + $(this).parents('.gift-intro').find('p:first-child span').text() + '</p></div>', '确定')
            $('.layout-btn').one('click', function () {
                if (giftNum == 0) return
                buyGift(giftId, giftNum, _that)
                giftNum = 0
            })
        } else { // 礼物
            showMsgBox('购买', '<input type="tel" class="input-num" placeholder="填写购买数量"><p class="user-money">消耗：<span><em class="user-money-num"></em>克拉</span></p>', '确定')
        }

        // $('.layout-head').show();
        // $('.layout-close').css('top', 0);
    })

    // 购买数量
    var znInput = false
    $('.layout-content').on('compositionstart', '.input-num', function () {
        znInput = true
    })
    $('.layout-content').on('compositionend', '.input-num', function () {
        znInput = false
        giftNum = $(this).val().replace(/[^0-9]/g, '')
        $(this).val(giftNum)
        $('.user-money-num').html(giftNum * unitPrice)
    })
    $('.layout-content').on('input', '.input-num', function () {
        if (znInput) return
        giftNum = $(this).val().replace(/[^0-9]/g, '')
        $(this).val(giftNum)
        $('.user-money-num').html(giftNum * unitPrice)
        $('.layout-btn').one('click', function () {
            if (giftNum == 0 || giftId == 0) return
            buyGift(giftId, giftNum, _that)
            giftNum = 0; giftId = 0
        })
    })

    // 查看我的特权
    $('.my-power').click(function () {
        if (activityEnd) {
            return tipsBox('活动已结束！')
        }
        if (activityStart) {
            return tipsBox('活动未开始！')
        }
        var str = ''
        var hasPower = false
        var powerValue = ['十个"上头条"礼物', '定制主播banner(有效期2天)', '定制直播间小额礼物(无特效)', '定制app闪屏(有效期2天)', '定制直播间大额礼物(有特效)', '定制座驾', '活动冠名或活动形式定制权', '二十个"上头条"礼物', '定制主播banner(有效期4天)']
        for (var i = 7; i >= 1; i--) {
            if (boxOpendArr[i - 1]) {
                hasPower = true
                if (+new Date(boxOpenTime[i - 1]) <= +new Date(deadline)) {
                    if (i === 1) {
                        str += '<li class="power-item sprite3">' + powerValue[7] + '</li>'
                        continue
                    }
                    if (i === 2) {
                        str += '<li class="power-item sprite3">' + powerValue[8] + '</li>'
                        continue
                    }
                }
                str += '\
                    <li class="power-item sprite3">' + powerValue[i - 1] + '</li>\
                '
            }
        }
        if (!hasPower) {
            return tipsBox('请先开启特权哦！')
        }

        // $('.layout-close').css('top', '-0.916667rem');

        getHstate(function (data) {
            var btnContont = ''
            if (data.result) {
                btnContont = '填写信息'
            } else {
                btnContont = '修改信息'
            }
            showMsgBox('达成特权', '<ul class="power-lists"></ul>', btnContont)
            $('.power-lists').html(str)
            $('.layout-btn').one('click', function () {
                showMsgBox(btnContont, '<input type="text" class="input-num user-msg-id" placeholder="填写用户ID" readonly="readonly"><span class="choose-one">以下内容二选一填写</span><input type="tel" class="input-num user-msg-tel" placeholder="填写手机号码" readonly="readonly"><input type="tel" class="input-num user-msg-qq" placeholder="填写QQ号码" readonly="readonly">', '确定')
                $('.input-num').click(function () {
                    var that = $(this)
                    keyboard({
                        model: 0,
                        yes: function (num) {
                            that.val(parseInt(num))
                        }
                    })
                })
                $('.user-msg-id').val(uid)
                $('.layout-btn').one('click', function () {
                    regSaveCont()
                })
            })
        })
    })
}

initEvent()
