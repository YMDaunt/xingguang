require("../../css/activity/dbEleven.less");

import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import {scroxt} from '../component/gj.scroxt.js'
import bodymovin from '../component/bodymovin.min.js'

const os = (function(){
     var ua = navigator.userAgent,  
     isWindowsPhone = /(?:Windows Phone)/.test(ua),  
     isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,   
     isAndroid = /(?:Android)/.test(ua),   
     isFireFox = /(?:Firefox)/.test(ua),   
     isChrome = /(?:Chrome|CriOS)/.test(ua),  
     isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),  
     isPhone = /(?:iPhone)/.test(ua) && !isTablet,  
     isPc = !isPhone && !isAndroid && !isSymbian;  
     return {  
          isTablet: isTablet,  
          isPhone: isPhone,  
          isAndroid : isAndroid,  
          isPc : isPc  
     };  
}());

if(os.isPc) location.href="//www.kuaishouvideo.com/activity/dbEleven.html";

new Vue({
    el:"#app",
    data: { 
        uid: false,
        showRule: false,
        showCh: false,
        svgPlayer: false,
        currentTime: 0,
        broadArr: [],
        modArr: [],
        userArr: [],
        xdArr: [],
        myModArr: [],
        myUserArr: [],
        xdTopArr: [],
        myXdArr: [],
        topPage: 1,
        modPage: 1,
        userPage: 1,
        chChoose: true,
        firstTab: [true, false, false],
        modTitle: [],
        userTitle: [],
        dayArr: [],
        stage: -1,
        secTab: [],
        todayStage: 1,
        restTime: ['-', '-', '分', '-', '-', '秒'], // 抢榜时间还剩
        currentTime: 0,
        scrollLock1: false,
        scrollLock2: false,
        scrollLock3: false,
        tostBox: false,
        tostText: '',
    },
    created: function(){
        //个人初始化信息
        axios.get('/SingleDogActivity/initInfo')
        .then(res => {
            let data = res.data;
            if (data.errno == 0) {
                this.uid = data.data.isLogin;
                this.dayArr = data.data.date;
                this.stage = data.data.day;
                for (var i = 0; i < this.dayArr.length; i++) {
                    this.secTab.push(false);
                };

                if (this.stage == -1) {
                    this.stage = 1;
                } else 
                if (this.stage == -2) {
                    this.stage = this.dayArr.length;
                };
                this.todayStage = this.stage;
                this.secTab[this.stage - 1] = true;

                // TOP1榜单初始化
                this.getTopRank(this.stage, this.topPage) 
            }
        })
        .catch(err => {
            console.log(err);
        })

        // 广播
        axios.get('/SingleDogActivity/Broadcast')
        .then(res => {
            let data = res.data;
            this.broadArr = data.data;
            if (this.broadArr.length == 0) {
                this.broadArr.push('希望今年是你过的最后一个光棍节，以后每年这个时候都是狂欢节！');
                this.broadArr.push('希望今年是你过的最后一个光棍节，以后每年这个时候都是狂欢节！');
            };
            Vue.nextTick(()=> {
                var speed = 25;
                var scrollOut = $('.scroll-con');
                var scrollEle1 = $('#scrollEle');
                var scrollEle2 = $('#scrollEle2');
                if (scrollEle1.find('span').length > 1) {
                    scrollEle2.html(scrollEle1.html());
                    function Marquee(){
                        if(scrollEle2[0].offsetWidth - scrollOut[0].scrollLeft <=0) {   
                           scrollOut[0].scrollLeft = 0;
                        }else{
                           scrollOut[0].scrollLeft ++;
                        }
                    }
                    var timer = setInterval(Marquee,speed);
                };
            })
        })
        .catch(err => {
            console.log(err);
        })

        this.timeLoadRank();
        this.getModRank(this.modPage);
        this.getUserRank(this.userPage);
    },

    mounted: function() {
        // 滚动加载
        this.initScrollLoadTop();
        this.initScrollLoadMod();
        this.initScrollLoadUser();
    },

    methods:{
        firTab(tabNum, judge) {
            this.firstTab = [false, false, false];
            this.firstTab[tabNum] = true;
        },

        dayTab(e, index) {
            var day = e.target.getAttribute('data-day');
            if (this.stage == day) {
                return false;
            } else 
            if (this.todayStage < day) {
                this.disapperTost(2500, '还未到该阶段日期哦！');
            } 
            else {
                this.secTab = [false, false, false, false, false, false],
                this.secTab[index] = true;
                this.topPage = 1;
                this.stage = day;
                this.xdTopArr = [];
                this.scrollLock3 = false;
                this.getTopRank(this.stage, this.topPage) 
            }
        },

        // 称号
        seeCh() {
            if (!this.uid) {
                return common.goLogin();
            } else {
                this.showCh = true;
                axios.get('/SingleDogActivity/myTitle')
                .then(res => {
                    let data = res.data;
                    this.modTitle = data.data.mod;
                    this.userTitle = data.data.user;
                })
                .catch(err => {
                    console.log(err);
                })
            }
        },

        // 实时排行
        timeLoadRank() {
            // 获取心动首位
            let string = new Date().getTime();
            axios.get('/SingleDogActivity/heart?=' + string + '')
            .then(res => {
                let data = res.data;
                this.xdArr = data.data.data;
                this.myXdArr = data.data.myRank;
                this.currentTime = data.data.time;
                // 调用倒计时
                this.caclTime();
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 跳转直播间
        inlive(e){
            var rid = e.target.getAttribute('data-rid');
            common.goRoom(rid); //主播房间id //主播用户id
        },

        // 关注
        attention(e,index) {
            if (!this.uid) {
                return common.goLogin();
            } else {
                axios.get('/PKStar/Attention', {
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
                            this.modArr[index]["isLoved"] = true;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        },

        //滚动加载
        scrollLoad(ele, bottomHeight, callback) {
            var _ele = document.querySelector(ele);
            var bH = bottomHeight || 100;
            _ele.addEventListener('scroll', function() {
                var scrollTop = _ele.scrollTop,
                    cliHeight = _ele.clientHeight,
                    scrollHeight = _ele.scrollHeight;
                if (scrollHeight - cliHeight - scrollTop < bH) {
                    callback();
                }
            }, false);
        },

        //top1榜滚动加载
        initScrollLoadTop() {
            const that = this;
            that.scrollLoad(".top-other", 150, function() {
                if (that.scrollLock3) return;
                that.scrollLock3 = true;
                that.topPage ++;
                that.getTopRank(that.stage, that.topPage);
            });
        },


        //主播榜滚动加载
        initScrollLoadMod() {
            const that = this;
            that.scrollLoad(".other-mod", 150, function() {
                if (that.scrollLock1) return;
                that.scrollLock1 = true;
                that.modPage ++;
                that.getModRank(that.modPage);
            });
        },

        //用户榜滚动加载
        initScrollLoadUser() {
            const that = this;
            that.scrollLoad(".other-user", 150, function() {
                if (that.scrollLock2) return;
                that.scrollLock2 = true;
                that.userPage ++;
                that.getUserRank(that.userPage);
            });
        },

        // ajax获取top榜单
        getTopRank(stage,topPage) {
            const that = this;
            axios.get('/SingleDogActivity/history?day=' + stage, {
                    params: {
                        pageNo: topPage
                    }
                })
            .then(res => {
                let data = res.data.data.data;
                if (data.length > 0) {
                    that.xdTopArr = that.xdTopArr.concat(data);
                    that.scrollLock3 = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        //ajax获取主播列表
        getModRank(modPage) {
            const that = this;
            axios.get('/SingleDogActivity/getRanks?type=mod', {
                    params: {
                        pageNo: modPage
                    }
                })
            .then(res => {
                this.myModArr = res.data.data.myRank;
                let data = res.data.data.data;
                if (data.length > 0) {
                    that.modArr = that.modArr.concat(data);
                    that.scrollLock1 = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        //ajax获取用户列表
        getUserRank(userPage) {
            const that = this;
            axios.get('/SingleDogActivity/getRanks?type=user', {
                    params: {
                        pageNo: userPage
                    }
                })
            .then(res => {
                this.myUserArr = res.data.data.myRank;
                let data = res.data.data.data;
                if (data.length > 0) {
                    that.userArr = that.userArr.concat(data);
                    that.scrollLock2 = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 实时
        caclTime () {
            if (this.currentTime == null) {
                return this.restTime = ['-', '-', '分', '-', '-', '秒'];
            }
            let restMin = parseInt(this.currentTime / 60);
            let restSec = this.currentTime % 60;
            if (restMin <= 0 && restSec <= 0) {
                // 获取心动首位
                return this.timeLoadRank();
            } 

            let tempTimeArr = [];
            if (restMin < 10) tempTimeArr = [].concat(tempTimeArr, [0, restMin])
            else tempTimeArr = [].concat(tempTimeArr, String(restMin).split(''))
            tempTimeArr.push('分')
            if (restSec < 10) tempTimeArr = [].concat(tempTimeArr, [0, restSec])
            else tempTimeArr = [].concat(tempTimeArr, String(restSec).split(''))
            tempTimeArr.push('秒')
            this.restTime = tempTimeArr

            setTimeout(() => {
                this.currentTime--;
                this.caclTime()
            }, 1000)
        },

        // remove svg
        removeSvg() {
            this.svgPlayer = !this.svgPlayer;
            var doc = $('.svg-con').find('div');
            doc.remove();
        },

        // svg
        doPkSvg() {
            this.svgPlayer = !this.svgPlayer;
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/dbEleven/qrl/data.json');
        },
        doLbSvg() {
            this.svgPlayer = !this.svgPlayer;
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/dbEleven/qrls/data.json');
        },

        disapperTost(time, text) {
            this.tostBox = true;
            this.tostText = text;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(()=> {
                this.tostBox = false;
            }, time)
        }
    }
})


function playSvg(path) {
    var svgContainer = document.querySelector(".svg-con");
    var giftSvg = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'html',
        loop: true,
        autoplay: true,
        path: path
    });
} 





        
