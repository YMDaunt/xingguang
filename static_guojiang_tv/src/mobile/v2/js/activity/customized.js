import axios from 'axios'
import common from '../common/common.js'
import scroxt from '../component/gj.scroxt.js'
import TouchTransform from '../component/gj.touchTransform.js'

require('../../css/activity/customized.less')

document.body.addEventListener('click', function () {})
// cnzz统计PV
if (typeof _czc !== 'undefined') {
    _czc.push(['_trackPageview', '//m.kuaishouvideo.com/dist/activity/customized.html'])
}

var currentTime // 当前时间
var boxOpendArr = [] // 已经打开的宝箱
var boxOpenTime = []
var uid
var page = 0
var limit = 10
var goodsListLock = false
var hstate // 用户是否填写了信息
var touchEntity

axios.get('/CustomizedActivity/Init')
    .then(function (res) {
        return res.data.data
    })
    .then(function (data) {
        uid = data.uid
        if (!uid) return common.goLogin()

        var boxCompleted = []
        for (var i = 1; i <= 7; i++) {
            data['getBox'][i]['completed'] ? boxCompleted.push(true) : boxCompleted.push(false)
            if (data['getBox'][i]['opened']) {
                boxOpendArr.push(true)
                boxOpenTime.push(data['getBox'][i]['open_time'].replace(/-/g, '/'))
            } else {
                boxOpendArr.push(false)
                boxOpenTime.push(false)
            }
        }

        initProcess(data.getLevel)

        generateScrollMsg(data['getBd'])

        currentTime = new Date(data['nowTime']).getTime()
        calcTime()

        initBox(boxOpendArr, boxCompleted, boxOpenTime)

        $('.recharge').html(data.getCost)
        $('.user-avator img').attr('src', data.user['userHeadPic'])

        // 剩余广告位数量
        $('.advertisement-num').html(data.getAdvertisement)
        // 获取礼物列表
        getGiftList(function () {
            // 模拟滚动
            var scrollWrap = document.querySelector('.scroll-wrap')
            var scrollContent = document.querySelector('.scroll-content')
            var scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap, null).getPropertyValue('height'))

            new TouchTransform('.scroll-wrap', '.scroll-content', function (distance) {
                var contentHeight = parseFloat(window.getComputedStyle(scrollContent, null).getPropertyValue('height'))
                if (contentHeight + distance - scrollWrapHeight < 120) {
                    if (goodsListLock) return
                    goodsListLock = true
                    page++
                    getGiftList()
                }
            })
        })
    })
    .catch(function (error) {
        console.log(error)
    })

function changeContent (nowMonth, nowDate) {
    $('.act-month').html(nowMonth + 1)
    if (nowMonth >= 11 && nowDate <= 15) {
        $('.js-three-day').html(4)
        $('.js-three-num').html('二十个')
    }
    if (nowMonth < 11) {
        $('.js-banner').addClass('old-banner')
    }
}

// 初始化宝箱
function initBox (arr1, arr2, arr3) {
    for (var i = 1; i <= 7; i++) {
        var boxElement = $('.gift-box-' + i)
        boxElement.data('completed', arr2[i - 1])
        boxElement.data('opened', arr1[i - 1])
        if (arr1[i - 1]) {
            boxElement.append('<span class="gift-check sprite"></span>')
            if (i <= 2 && (new Date(arr3[i - 1]).getDate()) <= 15) {
                boxElement.addClass('qiang qiang-gray')
            }
        } else {
            if (i <= 2 && (new Date(currentTime).getDate()) <= 15) {
                boxElement.addClass('qiang')
            }
        }
    }
}
// 初始化进度条
function initProcess (level) {
    var i = 1
    var str = ''
    while (i < 7) {
        if (i === level - 1) {
            str += '<div class="process-leaf process-leaf-had process-had sprite"></div>'
        } else if (i < level) {
            str += '<div class="process-leaf process-leaf-had sprite"></div>'
        } else {
            if (level === 1 && i == 1) {
                str += '<div class="process-leaf process-level-1 sprite"></div>'
            } else {
                str += '<div class="process-leaf sprite"></div>'
            }
        }

        i++
    }
    $('.process-tree').html(str)
    $('.process-leaf').eq(5).append('<span class="unit-money">单位:人民币(元)</span>')
}

var timeST // 时间定时器
var activityEnd = false // 活动结束
var activityStart = false // 活动未开始

/**
 * [calcTime 计算时间]
 * @return {[type]} [description]
 */
function calcTime () {
    var nowYear = (new Date(currentTime)).getFullYear()
    var nowMonth = (new Date(currentTime)).getMonth()
    var nowDate = (new Date(currentTime)).getDate()
    var tempYear
    var tempMonth
    var endDate
    var END_TIME
    /**
      * 第四期页面内容修改
      */
    changeContent(nowMonth, nowDate)

    /**
      * [END_TIME 得到本期定制结束时间]
      * @type {[string]}
      */
    tempYear = nowMonth === 11 ? nowYear + 1 : nowYear
    tempMonth = nowMonth === 11 ? 1 : nowMonth + 2
    endDate = new Date((+new Date(tempYear + '/' + tempMonth + '/01 00:00:00')) - 1000).getDate()
    END_TIME = nowYear + '/' + (nowMonth + 1) + '/' + endDate + ' 23:59:59'
    console.log(END_TIME)

    nowMonth = (nowMonth + 1) >= 10 ? (nowMonth + 1) : '0' + (nowMonth + 1)
    nowDate = nowDate >= 10 ? nowDate : '0' + nowDate

    /**
      * 活动时间更改
      */
    $('.js-acttime').html(nowYear + '年' + nowMonth + '月1日 00:00:00-' + nowYear + '年' + nowMonth + '月' + endDate + '日 23:59:59')
    $('.js-boxend-time').html(nowYear + '年' + nowMonth + '月' + endDate + '日 23:59:59')

    var diffTime = (new Date(END_TIME)) - currentTime
    culTime(diffTime)
    timeST = setInterval(function () {
        currentTime += 1000
        var diffTime = (new Date(END_TIME)) - currentTime
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
    new window.scroxt.Horizontal({
        target: '.msg-wrapper',
        data: dataArr,
        speed: -5,
        gap: 20
    }, 10)
}

function prefixesTransitionEnd () {
    var transEndEventNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd otransitionend',
        transition: 'transitionend'
    }
    var style = document.body.style
    for (var name in transEndEventNames) {
        if (typeof style[name] === 'string') {
            return transEndEventNames[name]
        }
    }
    return null
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
            var str = ''
            _data.list.forEach(function (value, index) {
                var overRealse = currentTime > (new Date(value['releaseTime'].replace(/-/g, '/'))) ? '1' : '0'
                var SendWord = value['ownerSendWord']
                if (SendWord.length === 0) SendWord = '他很酷，啥也没说！'
                /* 礼物价格 */
                var priceBtn = ''
                if (value['price'].length == 5) {
                    priceBtn = 'price-btn-1'
                } else if (value['price'].length > 5) {
                    priceBtn = 'price-btn-2'
                }
                /* 是否是svg动画 */
                var svgUrl = ''
                if (value['h5AnimationJsonUrl'] && value['h5AnimationJsonUrl'].length > 0) {
                    svgUrl = value['h5AnimationJsonUrl']
                }

                var type = value['type'] // type=2:普通定制  type=3:座驾
                var carClass = type == 2 ? '' : 'buy-car-sty'
                var priceContont = type == 2 ? value['price'] + '克拉/个' : '暂未公布'
                var releaseContent = type == 2 ? value['releaseTime'] : '待定'
                str += '\
                <li class="buy-gift-item">\
                  <div class="gift-avator">\
                    <img src="' + value['image'] + '">\
                    <div class="gift-intro">\
                      <p>名称：<span>' + value['name'] + '</span></p>\
                      <p>定制者：<span>' + value['owner'] + '</span></p>\
                      <p>开放售卖日：<span>' + releaseContent + '</span></p>\
                      <p class="red-color">已售出：<span>' + value['salesVolume'] + '个</span></p>\
                      <p class="clamp2">定制原因：<span>' + SendWord + '</span></p>\
                    </div>\
                  </div>\
                  <div class="gift-money ' + priceBtn + '">' + priceContont + '</div>\
                  <div class="gift-btn-box c_clearfix">\
                    <div class="gift-btn-buy sprite ' + carClass + '" data-id="' + value['id'] + '" data-price="' + value['price'] + '" data-release="' + overRealse + '">购买</div>\
                    <div class="gift-btn-show sprite" data-id="' + value['id'] + '" data-img="' + value['imagePreview'] + '" data-svg="' + svgUrl + '" data-type="' + type + '">预览</div>\
                  </div>\
                </li>\
            '
            })

            $('.buy-gift-list').append(str)
            if (typeof cb !== 'undefined') {
                cb()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

// 弹框
function showMsgBox (content, btn) {
    $('.layout-cover').show()
    $('.layout-content').html(content)
    $('.layout-btn').html(btn)
}
function tipsBox (content) {
    showMsgBox('<div class="buy-gift-result"><p>' + content + '</p></div>', '朕知道了')
    $('.layout-btn').one('click', function () {
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
function buyGift (id, num, numEle) {
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
                var temp = parseInt(numEle.html())
                numEle.html(temp + parseInt(num) + '个')
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
        error: function () {

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
        return $('.user-msg-tel').after('<p class="user-msg-error">信息填写不正确，请重新填写。<p>')
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

    var startTime
    var endTime
    var touhST
    function touchStart (e) {
        (function (target) {
            touhST = setTimeout(function () {
                $('.box-tips').hide()
                $(target.target).find('.box-tips').show()
            }, 500)
        })(e)
    }
    function touchMove (e) {
        clearTimeout(touhST)
    }
    function touchEnd () {
        clearTimeout(touhST)
    }

    $('.wrapper').click(function () {
        $('.box-tips').hide()
    })
    $('.gift-box').click(function (e) {
        e.stopPropagation()
    })
}

// svg动画
var animItem
function svgAni (path) {
    // 生成svg动画

    $('.cover-bg').empty()
    var svgWrap = document.querySelector('.cover-bg')
    animItem = bodymovin.loadAnimation({
        wrapper: svgWrap,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: path
    })
}

function initEvent () {
    // body模拟滚动
    var offsetTop = -$('.scroll-bg').offset().top
    var tempDistance = 0
    touchEntity = new TouchTransform('body', '.wrapper', function (distance) {
        // 消息滚动置顶
        console.log(distance)
        if (('transform' in document.body.style) || ('webkitTransform' in document.body.style)) {
            if (distance < offsetTop) {
                tempDistance = distance
                document.querySelector('.scroll-bg').setAttribute('style', 'position:fixed;top:0px;left:' + (61 / 108) + 'rem;;')
                var temp = $('.scroll-bg').clone()
                $('.scroll-bg').remove()
                $('body').append(temp)
            }

            if (distance > tempDistance && tempDistance !== 0) {
                tempDistance = 0
                document.querySelector('.scroll-bg').setAttribute('style', 'position:absolute;top:inherit;')
                var temp = $('.scroll-bg').clone()
                $('.scroll-bg').remove()
                $('.list-tap').after(temp)
            }
            document.body.addEventListener('touchmove', function (evt) {
                evt.preventDefault()
            })
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
                    'top': 'inherit'
                })
            }
        })
    }

    // 预览
    $('.buy-gift-list').on('click', '.gift-btn-show', function () {
        var id = $(this).data('id')
        var svg = $(this).data('svg')
        var type = $(this).data('type')
        $('.cover-bg').show()

        // 座驾动效
        if (type == 3) {
            // 雷麒麟
            if (id == 90) {
                return svgAni('//static.guojiang.tv/src/mobile/img/room/svg/mount/10/data.json')
            }
            // 雪橇
            if (id == 300) {
                // return svgAni('//static.guojiang.tv/src/mobile/img/room/svg/mount/11/APPxueqiao/data.json');
                return svgAni('//static.guojiang.tv/src/mobile/img/room/svg/mount/13/data.json')
            }
        }
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
    })
    // 长按宝箱显示介绍
    longTap()

    // 选项卡切换
    $('.tap-item').click(function () {
        $('.tap-active').removeClass('tap-active')
        $(this).addClass('tap-active')
        if ($(this).hasClass('goods-all')) {
            $('.buy-gift-list').show()
            $('.famous-man').hide()
        } else {
            $('.buy-gift-list').hide()
            $('.famous-man').show()
            touchEntity.refresh()
        }
    })

    // 开启宝箱
    $('.gift-box').click(function () {
        if (activityEnd) {
            return tipsBox('活动已结束！')
        }
        if (activityStart) {
            return tipsBox('活动未开始！')
        }
        var that = $(this)
        var boxId = that.data('id')
        var openLock = false
        if (!that.data('completed') || that.data('opened') || openLock) return
        openLock = true
        that.addClass('shake')

        if (boxId <= 2 && (new Date(currentTime).getDate()) <= 15) {
            that.addClass('qiang-gray')
        }

        openBox(boxId, function () {
            openLock = false
            boxOpendArr[boxId - 1] = true
            that.append('<span class="gift-check sprite"></span>')

            // 宝箱开启的服务器时间
            $.ajax({
                type: 'GET',
                url: '/CustomizedActivity/CurrentTime',
                dataType: 'json',
                success: function (data) {
                    boxOpenTime[boxId - 1] = data.data.time
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
    })

    // 购买礼物
    var unitPrice = 0
    var giftId = 0
    var giftNum = 0
    $('.buy-gift-list').on('click', '.gift-btn-buy', function () {
        // 座驾
        if ($(this).hasClass('buy-car-sty')) return

        giftId = $(this).data('id')
        unitPrice = $(this).data('price')
        var release = $(this).data('release')

        if (release == '0') {
            tipsBox('礼物还没过独享期！等等再来吧')
            return
        }

        showMsgBox('<input type="text" class="input-num" placeholder="填写购买数量"><p class="user-money">消耗：<span><em class="user-money-num"></em>克拉</span></p>', '确定')

        var that = $(this).parents('.buy-gift-item').find('.red-color span')
        $('.layout-btn').one('click', function () {
            if (giftNum == 0) return
            buyGift(giftId, giftNum, that)
        })
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
        for (var i = 7; i >= 1; i--) {
            if (boxOpendArr[i - 1]) {
                hasPower = true
                if ((new Date(boxOpenTime[i - 1])).getDate() <= 15) {
                    if (i === 1) {
                        str += '<li class="power-item sprite power-item-10"></li>'
                        continue
                    }
                    if (i === 2) {
                        str += '<li class="power-item sprite power-item-11"></li>'
                        continue
                    }
                }
                str += '\
                    <li class="power-item sprite power-item-' + i + '"></li>\
                '
            }
        }
        if (!hasPower) {
            return tipsBox('请先开启特权哦！')
        }

        getHstate(function (data) {
            var btnContont = ''
            if (data.result) {
                btnContont = '填写信息'
            } else {
                btnContont = '修改信息'
            }
            showMsgBox('<div class="power-header sprite"></div><ul class="power-lists"></ul>', btnContont)
            $('.power-lists').html(str)
            $('.layout-btn').one('click', function () {
                showMsgBox('<div class="user-msg-title sprite"></div><input type="text" class="input-num user-msg-id" placeholder="填写用户ID" readonly="readonly"><span class="choose-one">以下内容二选一填写</span><input type="text" class="input-num user-msg-tel" placeholder="填写手机号码"><input type="text" class="input-num user-msg-qq" placeholder="填写QQ号码">', '确定')
                $('.user-msg-id').val(uid)
                $('.layout-btn').one('click', function () {
                    regSaveCont()
                })
            })
        })
    })
}

initEvent()
