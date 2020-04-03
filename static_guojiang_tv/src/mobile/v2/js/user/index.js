require('../../css/user/index.less')

/* 渠道handler */
function getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}

var callback = getQueryString('callback')

document.querySelector('.wrapper').addEventListener('click', function () {
    location.href = '/user/qqLogin?callback=' + callback
}, false)

// 微信登陆
document.querySelector('.wx-login').addEventListener('click', function (e) {
    e.stopPropagation()
    location.href = '/user/wxLogin?callback=' + callback
}, false)
// 微博登陆
document.querySelector('.wb-login').addEventListener('click', function (e) {
    e.stopPropagation()
    location.href = '//www.tuho.tv/user/weiboLogin?callback=' + callback
}, false)

var num = 4663333694
var userNumEle = document.querySelector('.user-num em')
function setNum () {
    setTimeout(function () {
        num += ~~(Math.random() * 150)
        userNumEle.innerHTML = num
        setNum()
    }, 500)
}

setNum()
