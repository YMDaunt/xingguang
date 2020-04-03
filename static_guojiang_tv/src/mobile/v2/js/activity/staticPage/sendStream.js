import '../../../css/activity/staticPage/beautyBoy.less'
import layer from 'layer'

var common = require('../../common/common.js')
var mid = 1323964 // 1323964;      //主播ID
var rid = 781871// 781871;      //房间ID
var actTime = 0 // 活动时间
var actAttent = false // 是否关注
var actLogin = false // 是否登陆
function clickEvent (ele, handle) {
    var eleArr = document.querySelectorAll(ele)
    for (var i = 0, len = eleArr.length; i < len; i++) {
        eleArr[i].addEventListener('click', handle, false)
    }
}

function init () {
    $.ajax({
        type: 'GET',
        url: '/BeautyBoy/Init',
        dataType: 'json',
        data: {
            attentionUid: mid
        },
        success: function (data) {
            actTime = data.data.actTime
            if (data.data.uid == '0000') return
            actLogin = true
            if (data.data.attent) {
                $('.attent').html('已关注')
                actAttent = true
            }
        }
    })
}

// 预约直播间
clickEvent('.js-live-book', function () {
    if (actTime == 0) {
        // 活动未开始
        if (actLogin) {
            $.ajax({
                type: 'GET',
                url: '/BeautyBoy/AddAttent',
                dataType: 'json',
                data: {
                    attentionUid: mid
                },
                success: function (data) {
                    if (data.errno == 0) {
                        layer.open({
                            content: '预定成功！倒计时期待花美男的精彩厨艺吧~',
                            time: 3000
                        })
                        actAttent = true
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3000
                        })
                    }
                }
            })
        } else {
            common.goLogin()
        }
    } else {
        // 如果正在直播，点击直接跳转直播间
        common.goRoom(rid, 0)
    }
})

// 关注主播
clickEvent('.js-attent', function () {
    if (!actLogin) return common.goLogin()
    $.ajax({
        type: 'GET',
        url: '/BeautyBoy/AddAttent',
        dataType: 'json',
        data: {
            attentionUid: mid
        },
        success: function (data) {
            if (data.errno == 0) {
                $('.js-attent').html('已关注')
                actAttent = true
            } else {
                layer.open({
                    content: data.msg,
                    time: 3000
                })
            }
        }
    })
})

init()
