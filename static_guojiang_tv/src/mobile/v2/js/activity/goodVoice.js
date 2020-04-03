import axios from 'axios'
import $ from 'jquery'
import common from 'common'
require("../../css/activity/goodVoice.less");

import Vue from 'vue'
import { setInterval, clearInterval } from 'timers';

var platform = common.getPlatformType();
var time1 = null, time2 = null 

new Vue({
    el:"#app",
    data: {
          isLogin: true,
          music: '',
          modArr: [],     // 主播信息组
          nowArr: [],     // 当前展示
          number: 1,
          max: 0,
          moveClass: '',
          play: true,
          tostBox: false,
          tostText: '',        // tost提示
          showBtn: true,
          dlUrl: 'https://m.kuaishouvideo.com/dist/vmaker/iosGuide.html',
    },
    created: function(){
          // 初始化
          axios.get('/voice/InitInfo')
          .then(res => {
               let data = res.data
               this.isLogin = data.data.isLogin
          })
          .catch(err => {
               console.log(err)
          })

          // 获取信息
          axios.get('/voice/getRecommend')
          .then(res => {
               let data = res.data
               this.modArr = data.data
               this.max = this.modArr.length
               this.nowArr = data.data[this.number - 1]
               // 载入音乐
               this.music = this.nowArr.audioUrl;
               if(!this.music) {
                    // this.disapperTost(2500, '该主播没有录音哦！')
                    this.play = false
                    this.showBtn = false
               } else
               if(document.getElementById('playMusic')){
                    document.getElementById('playMusic').play();
               }
               // 调用滚动
               Vue.nextTick(()=> {
                    scroll();
               })
          })
          .catch(err => {
               console.log(err)
          })

          if (platform == 'android' || platform == 'android_webview') {
               this.dlUrl = 'https://sj.qq.com/myapp/detail.htm?apkName=com.tuhao.kuaishou'
          }
    },
    methods: { 
          // 下一个
          nextMod() {
               this.number ++
               if(this.number > this.max) {
                    this.number = 1
               }
               this.nowArr = this.modArr[this.number - 1]
               if(!this.modArr[this.number - 1].audioUrl) {
                    document.getElementById('playMusic').pause()
                    // this.disapperTost(2500, '该主播没有录音哦！')
                    this.music = null
                    this.play = false
                    this.showBtn = false
               } else {
                    this.music = this.modArr[this.number - 1].audioUrl
                    Vue.nextTick(()=> {
                         this.play = true
                         this.showBtn = true
                         document.getElementById('playMusic').play()
                    })
               }
               this.moveClass = 'move'
               setTimeout(() => {
                    this.moveClass = ''
               }, 1200)
               Vue.nextTick(()=> {
                    // 调用滚动
                    scroll()
               })
          },
          
          // 暂停
          stop() {
               document.getElementById('playMusic').pause()
               this.play = false
          },

          // 开始
          start() {
               if(!this.music) {
                    // this.disapperTost(2500, '该主播没有录音哦！')
                    return false;
               } else {
                    document.getElementById('playMusic').play()
                    this.play = true
               }
          },

          // 跳转直播间
          inlive(e){
               var isPlay = e.target.getAttribute('data-play');
               var rid = e.target.getAttribute('data-rid');
               if(!isPlay) {
                    this.disapperTost(2500, '该语音厅正在休息，点击关注不迷路哟~')
               } else {
                    common.goRoom(rid); //主播房间id //主播用户id
               }
          },

          // 关注
          attention(e) {
               if (!this.isLogin) {
                    return common.goLogin();
               } else {
               axios.get('/voice/addAttention', {
                         params: {
                              mid: e.target.getAttribute('data-id'),
                         }
                    })
                    .then(res => {
                         if (typeof data == 'string') {
                              data = JSON.parse(data)
                         }
                         let _data = res.data;
                         if (_data.errno == 0) {
                              this.nowArr.isLoved = true;
                              this.modArr[this.number-1].isLoved = true;
                         }
                    })
                    .catch(err => {
                         console.log(err);
                    })
               }
          },

          // 下载埋点
          codeTimes() {
                _czc.push(["_trackEvent", "好声音", "好声音下载次数"]);
          },

          // tost
          disapperTost(time, text) {
               this.tostBox = true
               this.tostText = text
               if (this.timer) {
                   clearTimeout(this.timer)
               }
               this.timer = setTimeout(()=> {
                   this.tostBox = false
               }, time)
          }
    },
    mounted: function() {
          let that = this
          // 监听播放完     
          if(this.music) {
               document.getElementById('playMusic').addEventListener('ended', function() { 
                    that.play = false
                    // that.disapperTost(2500, '该录音以播放完毕！')
               })
          }
    }
})

// 自由滚动
var time1 = null
var time2 = null
function scroll() {
     if(time1) {clearInterval(time1); time1=0}
     if(time2) {clearInterval(time2); time2=0}

     // 区域1
     $('.word').scrollTop(0)
     var i = 0;
     var wordOut = $('.word').height()
     var wordP = $('.word-p').height()
     var dis = wordP - wordOut;
     if(dis > 10) {
          time1 = setInterval(()=> {
               i++;
               if(i > dis) {
                    i = 0;
               }
               $('.word').scrollTop(i)
          }, 90)
     }

     // 区域2
     $('.type-out').scrollTop(0)
     var x = 0;
     var ulOut = $('.type-out').height()
     var ulCon = $('.type-out > ul').height()
     var disUl = ulCon - ulOut
     if(disUl > 10) {
          time2 = setInterval(()=> {
               x++;
               if(x > disUl) {
                    x = 0;
               }
               $('.type-out').scrollTop(x)
          }, 90)
     }
}