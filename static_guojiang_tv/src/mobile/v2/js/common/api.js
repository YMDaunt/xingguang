// 存放common.js里面公共的对象
let globalObj = {

}
// 移动端进入直播间
export var goRoom = function (rid, packageId) {
    if (/guojiang_android/i.test(navigator.userAgent)) {
        if ((typeof recharge !== 'undefined') && recharge.roomDetail) {
            recharge.roomDetail(rid.toString()) // 进入直播间
        } else {
            layer.open({
                content: '快去app直播列表页围观主播的精彩表演吧'
            })
        }
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        try {
            gBridge.roomDetail(rid) // 进入直播间
        } catch (e) {}
    } else {
        if (packageId == 2) location.href = '//m.tuho.tv/room/' + rid + '?packageId=' + packageId
        else location.href = '//m.guojiang.tv/room/' + rid + '?packageId=' + packageId
    }
}

// get请求
export var getXHR = function (url, data, callback) {
    $.ajax({
        type: 'get',
        url,
        dataType: 'json',
        data,
        success (res) {
            callback(null, res)
        },
        error (err) {
            console.log(err.msg)
            callback(err)
        }
    })
}
// post请求
export var postXHR = function (url, data, callback) {
    $.ajax({
        type: 'post',
        url,
        dataType: 'json',
        data,
        success (res) {
            callback(null, res)
        },
        error (err) {
            console.log(err.msg)
            callback(err)
        }
    })
}
// 滚动加载
export var scrollLoad = function (ele, bottomHeight, callback) {
    const _ele = document.querySelector(ele)

    let cliHeight = _ele.clientHeight

    let bH = bottomHeight || 100

    let scrollTop = _ele.scrollTop

    let scrollHeight = _ele.scrollHeight

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

// 判断是果酱还是土豪域名
export var getPlatform = function () {
    /* 根据域名来判断 */
    var domain = document.domain
    /* 根据参数来判断 */
    var paramer = GetQueryString('packageId')

    if (domain.indexOf('tuho') !== -1 || paramer == 2) return 'tuho'
    if (domain.indexOf('guojiang') !== -1 || paramer == 0) return 'guojiang'
}

// 获取url参数
export function GetQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}
// app跳转登录
export function authLogin () {
    const url = location.href
    const host = document.domain
    location.href = `//${host}/user/login?callback=${url}`
}

// 刷新背包
export function refreshBackpack () {
    var platform = getPlatformType()
    if (platform == 'android_webview') {
        try {
            recharge.refreshPackage()
        } catch (err) {

        }
    } else if (platform == 'ios_webview') {
        try {
            gBridge.refreshPackage()
        } catch (err) {

        }
    }
}

// 获取平台类型
function getPlatformType () {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        // 这是微信平台下浏览器
        return 'wechat'
    } else if (/QQ\//i.test(navigator.userAgent)) {
        // qq客户端
        return 'qq'
    } else if (/guojiang_android/i.test(navigator.userAgent)) {
        return 'android_webview'
    } else if (/android/i.test(navigator.userAgent)) {
        return 'android'
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        return 'ios_webview'
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'ios'
    } else {
        return 'pc'
    }
}
