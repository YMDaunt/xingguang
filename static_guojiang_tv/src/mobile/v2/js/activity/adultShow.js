import axios from 'axios'
import common from '../common/common.js'

require('../../css/activity/adultShow.less')
// import {ScrollText} from "../component/gj.scrollText.js";

document.body.addEventListener('click', function () {})

var leftDrawTimes = 0 // 剩余抽奖次数
var recordId // 补全信息ID
var scrollEntity
var nickname = ''
var lock = false // 抽奖锁

var turnDeg = 0
function rotate (count, step) {
    turnDeg = -(360 * count + 360 / 8 * step + 360 / 8 / 2)
    $('.lucky-turn-bg').css({
        'transform': 'rotate(' + turnDeg + 'deg)',
        '-webkit-transform': 'rotate(' + turnDeg + 'deg)',
        'transition': 'all 3s ease-out',
        '-webkit-transition': 'all 3s ease-out'
    })
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
// 抽奖
var lotteryBox = ['开心杯', '女神海报', '液体羞羞套', '滑滑乐', '萌鲤开心杯', '舔舔乐', '液体羞羞套', '女友抱枕']
function lottery () {
    axios.get('/AdultShowActivity/Lottery')
        .then(function (res) {
            var result = res.data.data.result
            if (result) {
                rotate(4, lotteryBox.indexOf(result.prize))
                var str = `
                    <li class="record-item c_clearfix">
                        <span class="record-name">${nickname}</span>
                        <span class="record-gift">${result.prize}</span>
                    </li>
                `
                recordId = result.drawId
                scrollEntity.addPieceData(str, 0)
            }
        })
        .catch(err => console.log(err))
}

function initEvent () {
    // 抽奖
    $('.lucky-turn-arrow').click(function () {
        if (lock) return
        lock = true
        if (leftDrawTimes > 0) {
            lottery()
            leftDrawTimes--
            $('.cawayi-count').html(leftDrawTimes)
        } else {
            $('.js-tips').show()
            $('.tips-content').html('<p>机会库存不足！<br />快去充值吧！</p>')
        }
    })
    var prefixes = prefixesTransitionEnd()
    document.querySelector('.lucky-turn-bg').addEventListener(prefixes, function () {
        if (!lock) return
        turnDeg %= 360
        $('.lucky-turn-bg').css({
            'transform': 'rotate(' + turnDeg + 'deg)',
            '-webkit-transform': 'rotate(' + turnDeg + 'deg)',
            'transition': 'none',
            '-webkit-transition': 'none'
        })
        setTimeout(function () {
            $('.js-my-record').hide()
            $('.js-input-msg').show()
            lock = false
        }, 500)
    }, false)

    // 关注主播
    $('.live-show-box').on('click', '.live-attend', function () {
        if ($(this).hasClass('has-attend')) return
        var id = $(this).data('id')
        axios.get('/AdultShowActivity/AddLove', {
            params: {
                id
            }
        })
            .then(res => {
                $(this).addClass('has-attend').html('已关注')
            })
            .catch(err => {

            })
    })
    // 进入直播间
    $('.live-show-box').on('click', '.live-avator', function () {
        var rid = $(this).data('rid')
        common.goRoom(rid, 2)
    })
    // 我的中奖记录
    $('.my-btn').click(function () {
        $('.js-my-record').show()
        getMyRecord()
    })
    $('.cover-bg').click(function () {
        $(this).hide()
    })
    $('.win-record,.input-wrapper,.tips-content').click(function (e) {
        e.stopPropagation()
    })
    // 补全信息
    $('.win-wrap').on('click', '.bug-msg', function () {
        recordId = $(this).data('id')
        $('.js-my-record').hide()
        $('.js-input-msg').show()
    })
    // 提交信息
    $('.submit-btn').click(function () {
        var username = $('.js-username').val().trim()
        var phone = $('.js-phone').val().trim()
        var address = $('.js-address').val().trim()
        $('.js-reg').remove()
        submitMsg(username, phone, address)
    })
    $('.reset-btn').click(function () {
        $('.js-input-msg').hide()
        $('.js-giveup').show()
    })
    $('.giveup-sure').click(function () {
        $('.js-giveup').hide()
    })
    $('.giveup-no').click(function () {
        $('.js-input-msg').show()
        $('.js-giveup').hide()
    })
    // 按住榜单停止滚动
    document.querySelector('.record-container').addEventListener('touchstart', function () {
        scrollEntity.clearTimeRun()
    }, false)
    document.querySelector('.record-container').addEventListener('touchend', function () {
        scrollEntity.setTimeRun()
    }, false)
    document.querySelector('.record-container').addEventListener('touchcancel', function () {
        scrollEntity.setTimeRun()
    }, false)
}

function submitMsg (username, phone, address) {
    if (username.length === 0) {
        return $('.js-username').after('<p class="input-tips js-reg">请填写收货人姓名<p>')
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        return $('.js-phone').after('<p class="input-tips js-reg">电话号码格式不正确，请重新填写<p>')
    }
    if (address.length === 0) {
        return $('.js-address').after('<p class="input-tips js-reg">请填写收货地址<p>')
    }

    axios.get('/AdultShowActivity/Submit', {
        params: {
            id: recordId,
            name: username,
            tel: phone,
            addr: address
        }
    })
        .then(res => {
            const _data = res.data.data
            if (_data.result) {
                $('.js-tips').show()
                $('.tips-content').html('提交信息成功')
                $('.js-input-msg').hide()
            }
        })
        .catch(err = {

        })
}
// 展会主播
function generateMode (data) {
    var str = ''
    data.forEach(value => {
        const attend = value[3] ? 'has-attend' : ''
        const attendTxt = value[3] ? '已关注' : ''
        const attendPlaying = value[5] ? '<div class="model-playing sprite"></div>' : ''
        str += `
            <li class="live-show">
                <div class="live-avator" data-rid="${value[4]}">
                    <img src="${value[0]}" />
                    ${attendPlaying}
                </div>
                <div class="live-name">${value[1]}</div>
                <div class="live-attend sprite ${attend}" data-id="${value[2]}">${attendTxt}</div>
            </li>
        `
    })
    $('.live-show-box').html(str)
}
// 抽奖信息
function getProfile (data) {
    $('.cawayi-count').html(data.leftDrawTimes)
    $('.had-rechar').html(data.rechargeMount)
    leftDrawTimes = data.leftDrawTimes
}
// 我的中奖记录
function getMyRecord () {
    $('.js-win-item').remove()
    axios.get('/AdultShowActivity/Record')
        .then(function (res) {
            var _data = res.data.data.record
            var str = ''
            if (_data.length === 0) {
                return $('.win-container').html('<p class="no-record">还没记录哦！快去充值吧！</p>')
            }
            _data.forEach(function (value) {
                const time = getGiftTime(value['add_time'])
                const status = value['status'] == '0' ? `<span class="bug-msg" data-id="${value['id']}">${value['statusText']}</span>` : `${value['statusText']}`
                str += `
                    <li class="win-item c_clearfix js-win-item">
                        <span>${time}</span>
                        <span>${value['award']}</span>
                        <span>${status}</span>
                    </li>
                `
            })
            $('.win-container').append(str)
        })
        .catch(function (err) {
            console.log(err)
        })
}

function getGiftTime (time) {
    var arr = time.split(' ')
    var ymd = arr[0].split('-')
    var md = ymd[1] + '/' + ymd[2]
    return md + ' ' + arr[1]
}
// 所有用户记录

function generateRecord (data) {
    var arr = []
    data.forEach(value => {
        var str = `
            <li class="record-item c_clearfix">
                <span class="record-name">${value['nickname']}</span>
                <span class="record-gift">${value['award']}</span>
            </li>
        `
        arr.push(str)
    })
    // scrollEntity = new ScrollText(arr,'.record-container',['.record-box'])
}

// 自己头像和充值倒计时
var globLeftTime = 0
var leftST
function initShowPicTime (actTime, myPic) {
    $('.my-avator img').attr('src', myPic)
    $('.my-intro-nickname').html(nickname)
    globLeftTime = actTime
    leftST = setInterval(function () {
        globLeftTime -= 1
        generateLeftTime(globLeftTime)
    }, 1000)
}
function generateLeftTime (actTime) {
    if (globLeftTime <= 0) {
        $('.js-lefttime').html('00天00小时00分00秒')
        return clearInterval(leftST)
    }
    let day = ~~(actTime / 60 / 60 / 24)
    day = day < 10 ? '0' + day : day
    let hour = (~~(actTime / 60 / 60)) % 24
    hour = hour < 10 ? '0' + hour : hour
    let min = (~~(actTime / 60)) % 60
    min = min < 10 ? '0' + min : min
    let sec = actTime % 60
    sec = sec < 10 ? '0' + sec : sec
    $('.js-lefttime').html(day + '天' + hour + '小时' + min + '分' + sec + '秒')
}

function initXHR () {
    axios.get('/AdultShowActivity/Init')
        .then(function (res) {
            var _data = res.data.data
            if (_data.uid == '0000') {
                return common.goLogin()
            }
            generateMode(_data.modeInfo)
            getProfile(_data.profile)
            generateRecord(_data.allRecord)
            nickname = _data.nickname
            initShowPicTime(_data.actTime, _data.myPic)
        })
        .catch(function (err) {
            console.log(err)
        })
}

initEvent()
initXHR()
