import '../../../css/activity/staticPage/iceGirl.less'
import axios from 'axios'
import common from 'common'

var isAttent = false // 是否关注
var isTime = false // 活动开始状态
var attentionUid = 1381334
// var attentionUid = 1387717;
var rid = 0

axios.get('/BeautyBoy/InitAttent', {
    params: {
        attentionUid: attentionUid
    }
})
    .then(function (res) {
        if (res.data.data.actTime == 1) {
            rid = res.data.data.rid
            isTime = true
            document.querySelector('.js-add-btn.add-btn').innerHTML = '进入直播间'
            document.querySelector('.js-add-btn.add-attent-copy').innerHTML = '进入直播间'
            return false
        }
        if (res.data.data.attent) {
            setAttent()
        }
    })
    .catch(function (err) {
        console.log(err)
    })

// 改变icon
if (GetQueryString('packageId') != 2) {
    document.head.innerHTML += '<link rel="shortcut icon" href="//static.guojiang.tv/mobile/img/common/title_icon.png" type="image/x-icon"><link rel="apple-touch-icon" href="//static.guojiang.tv/mobile/img/common/touch_icon.png" sizes="144x144">'
}

// 获取url参数
function GetQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}

function addAttent () {
    axios.get('/BeautyBoy/AddAttent', {
        params: {
            attentionUid: attentionUid
        }
    })
        .then(function (res) {
            if (res.data.data.uid == '0000') return common.goLogin()
            if (res.data.data.result) {
                setAttent()
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

function setAttent () {
    isAttent = true
    document.querySelector('.js-add-btn.add-btn').innerHTML = '已预定'
    document.querySelector('.js-add-btn.add-btn').style.backgroundColor = '#c1c1c1'
    document.querySelector('.js-add-btn.add-btn').style.color = '#fff'
    document.querySelector('.js-add-btn.add-attent-copy').innerHTML = '已关注'
    document.querySelector('.js-add-btn.add-attent-copy').style.backgroundColor = '#c1c1c1'
}

function eleEvent (ele, event, callback) {
    var eleArr = document.querySelectorAll(ele)
    eleArr = Array.prototype.slice.apply(eleArr)
    eleArr.forEach(function (value, index) {
        value.addEventListener(event, callback)
    })
}

// 关注主播
eleEvent('.js-add-btn', 'click', function () {
    if (isTime) return common.goRoom(rid, GetQueryString('packageId'))
    if (isAttent) return
    addAttent()
})
