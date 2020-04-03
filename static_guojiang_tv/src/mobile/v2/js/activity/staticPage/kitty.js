import '../../../css/activity/staticPage/kitty.less'
import axios from 'axios'
import common from 'common'

var isAttent = false // 是否关注
var isTime = false // 活动开始状态
var attentionUid = 8784607
// var attentionUid = 1387882;
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
    document.head.innerHTML += '<link rel="shortcut icon" href="//static.guojiang.tv/pc/v3/img/common/title/title_icon.png?v=73153053ec?v=0807" type="image/x-icon"><link rel="apple-touch-icon" href="//static.guojiang.tv/pc/v3/img/common/title/title_icon.png?v=73153053ec?v=0807" sizes="144x144">'
    document.querySelector('.wrapper').className += ' gjbg'
} else {
    document.querySelector('.wrapper').className += ' thbg'
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
    var addBtn = document.querySelector('.js-add-btn.add-btn')
    addBtn.innerHTML = '已关注'
    addBtn.style.backgroundColor = '#c1c1c1'
    addBtn.style.color = '#fff'
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
// 播放音乐
// var audio;
// window.onload = function(){
//     createMusic();
// }
// function createMusic () {
//     audio = document.createElement("audio");
//     audio.src = "//static.guojiang.tv/src/mobile/v2/img/activity/staticPage/wangxuejing/music.mp3";

//     audio.addEventListener("ended",function(){
//         document.querySelector(".add-attent-copy").children[0].innerHTML="点击欣赏最新单曲";
//     });
// }
// eleEvent(".add-attent-copy","click",function(e){
//     if(!audio){
//         createMusic();
//     }
//     if(audio.paused){
//         audio.play();
//         this.children[0].innerHTML="暂停";
//     }else{
//         audio.pause();
//         this.children[0].innerHTML="点击欣赏最新单曲";
//     }
// });
