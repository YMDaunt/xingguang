'use strict';

import Vue from 'vue';
import axios from 'axios';
import common from 'common';
import $ from 'jquery';
import bodymovin from '../component/bodymovin.min.js'

import '../../css/activity/sdyd.less';

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
if(os.isPc) location.href="https://www.kuaishouvideo.com/activity/sdyd.html";

new Vue({
    el: '#app',
    data: {
        uid: false,
        tostBox: false,
        svgPlayer: false,
        tabCon: true,
        tabRankCon: true,
        secCon: true,
        showRule: false, 
        stage: 0,
        rankTitle: '暖冬值',
        activityId: 1980,    // 1980圣诞  1979元旦
        canBuySd: true,      // 圣诞是否可以购买
        canBuyYd: true,      // 元旦是否可以购买
        buyBox: false,       // 购买弹窗
        yeBox: false,        // 余额不足弹窗
        buyTotal: 0,
        goodId: null,        // 商品id
        perMoney: 0,         // 单价
        buyTotal: 0,         // 总价
        buyTips: false,      // 购买提示判断
        tostText: '',        // tost提示
        modArr: [],
        userArr: [],
        myModArr: [],
        myUserArr: [],
        modPage: 1,
        userPage: 1,
        scrollLock1: false,
        scrollLock2: false,
    },
    created: function(){
        axios.get('/doubleEgg/init')
        .then(res => {
            let data = res.data;
            this.uid = data.data.isLogin;
            this.stage = data.data.stage;
            if (this.stage == 0) {
                this.canBuySd = false;
                this.canBuyYd = false;
            } else 
            if (this.stage == 1) {
                this.canBuySd = true;
                this.canBuyYd = false;
            } else
            if (this.stage == 2) {
                this.canBuySd = false;
                this.canBuyYd = true;
                this.activityId = 1979;
                this.tabCon = false;
                this.tabRankCon = false;
                this.rankTitle = '福气值';
            } else {
                this.canBuySd = false;
                this.canBuyYd = false;
                this.activityId = 1979;
                this.tabCon = false;
                this.tabRankCon = false;
                this.rankTitle = '福气值';
            }

            axios.get('/doubleEgg/ranks?activityId=' + this.activityId + '&type=mod')
            .then(res => {
                let data = res.data
                this.modArr = data.data.data;
                this.myModArr = data.data.myRank;
            })
            .catch(err => {
                console.log(err)
            })

            axios.get('/doubleEgg/ranks?activityId=' + this.activityId + '&type=user')
            .then(res => {
                let data = res.data
                this.userArr = data.data.data;
                this.myUserArr = data.data.myRank;
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
    methods: {
        // remove svg
        removeSvg() {
            this.svgPlayer = !this.svgPlayer;
            var doc = $('.svg-con').find('div');
            doc.remove();
        },

        // svg
        doSdSvg1() {
            this.svgPlayer = !this.svgPlayer;
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/sdyd/sd/sd_1/data.json');
        },
        doSdSvg2() {
            this.svgPlayer = !this.svgPlayer;
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/sdyd/sd/sd_2/data.json');
        },
        doYdSvg1() {
            this.svgPlayer = !this.svgPlayer;
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/sdyd/yd/yd_1/data.json');
        },
        doYdSvg2() {
            this.svgPlayer = !this.svgPlayer;
            playSvg('//static.guojiang.tv/src/mobile/svg/activity/sdyd/yd/yd_2/data.json');
        },

        tab(tabN) {
            if (tabN == 'choose') {
                this.tabCon = true;
            } else {
                this.tabCon = false;
            }
        },

        tabRank(tabN) {
            if (tabN == 'choose') {
                this.rankTitle = '暖冬值';
                this.tabRankCon = true;
                this.activityId = 1980;
                // 重置页数、我的信息、拉取榜单
                this.modPage = 1;
                this.userPage = 1;
                this.modArr = [];
                this.userArr = [];
                this.secCon = true;
                this.getModRank(this.modPage, true);
                this.getUserRank(this.userPage, true);
            } else {
                if (this.stage < 2) {
                    this.disapperTost(2500, '元旦活动12.29 00:00开始！');
                } else {
                    this.rankTitle = '福气值';
                    this.tabRankCon = false;
                    this.activityId = 1979;
                    // 重置页数、我的信息、拉取榜单
                    this.modPage = 1;
                    this.userPage = 1;
                    this.secCon = true;
                    this.modArr = [];
                    this.userArr = [];
                    this.getModRank(this.modPage, true);
                    this.getUserRank(this.userPage, true);
                }
            }
        },

        secTab(tabN) {
            if (tabN == 'choose') {
                this.secCon = true;
            } else {
                this.secCon = false;
            }
        },

        // 购买
        buy(e, type) {
            // 购买判断
            if (!this.uid) {
                return common.goLogin();
            } else {
                if (this.stage < 1 && type == 1) {
                    this.disapperTost(2500, '12.24 12:00才可购买!')
                } else
                if (this.stage < 2 && type == 2) {
                    this.disapperTost(2500, '12.29 00:00才可购买!')
                } else {
                    this.goodId = e.target.getAttribute('data-id');
                    this.perMoney = e.target.getAttribute('data-value');
                    $('#totalMoney').val(1);
                    this.buyBox = !this.buyBox;
                    this.buyTotal = this.perMoney;
                };
            }
        },

        // add
        add() {
            var num = $('#totalMoney').val();
            num++;
            if (num >= 9999) {
                num = 9999;
            };
            $('#totalMoney').val(num);
            this.buyTotal = this.perMoney * num;
        },

        dev() {
            var num = $('#totalMoney').val();
            num--;
            if (num <= 1) {
                num = 1;
            };
            $('#totalMoney').val(num);
            this.buyTotal = this.perMoney * num;
        },

        inputNumber() {
            var num = $('#totalMoney').val();
            num = num.replace(/[^0-9]+/g,'');
            if (num > 9999) {
                num = 9999;
            }
            else if (num == 0) {
                num = '';
            }
            else if (num < 0) {
                num = 1;
            } 
            $('#totalMoney').val(num);
            this.buyTotal = this.perMoney * num;
        },

        sureBuy() {
            var num = $('#totalMoney').val();
            if (num == '' || num == 0) {
                this.tostBox = !this.tostBox;
                this.disapperTost(2000, '请输入正确购买个数');
            } else {
                axios.get('/doubleEgg/buyProduct?pid='+ this.goodId + '&num=' + num)
                .then(res => {
                    let data = res.data;
                    this.buyBox = !this.buyBox;
                    if (data.errno == 0) {
                        this.disapperTost(2500, '礼物已放至您的背包，请注意查收！');
                    } else
                    if (data.errno == 111) {
                        this.yeBox = !this.yeBox;
                    }
                    else {
                        this.disapperTost(2500, data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
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

        // 跳转充值
        charge() {
            // common.goRecharge();
            function getPlatformType(){
                if(/MicroMessenger/i.test(navigator.userAgent)){
                        //这是微信平台下浏览器
                    return 'wechat';
                }else if(/QQ\//i.test(navigator.userAgent)){
                        //qq客户端
                    return 'qq';
                }else if(/guojiang_android/i.test(navigator.userAgent)){
                    return 'android_webview';
                }else if(/android/i.test(navigator.userAgent) ){
                    return 'android';
                }else if(/guojiang_iphone/i.test(navigator.userAgent)){
                    return 'ios_webview';
                }else if( /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ){
                    return 'ios';
                }else{
                    return 'pc';
                }
            }

            var platform = getPlatformType();
            if (platform === 'ios_webview') { // ios app
                if (this.typeCz) { // 苹果的原生充值页
                    try {
                        console.log('gBridge.recharge is called. useApplePay: ');
                        gBridge.recharge();
                    } catch(e) {
                        alert(e.name+':'+e.message);
                    }
                } else {
                    location.href = "/rechargeApp";
                }
            } else if (platform === 'android_webview') { // 安卓 app
                location.href = '/rechargeApp'; // app h5充值页
            } else { // app 外
                location.href = '/recharge'; // h5充值页
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

        //主播榜滚动加载
        initScrollLoadMod() {
            const that = this;
            that.scrollLoad(".mod-other", 150, function() {
                if (that.scrollLock1) return;
                that.scrollLock1 = true;
                that.modPage ++;
                that.getModRank(that.modPage, false);
            });
        },

        //用户榜滚动加载
        initScrollLoadUser() {
            const that = this;
            that.scrollLoad(".user-other", 150, function() {
                if (that.scrollLock2) return;
                that.scrollLock2 = true;
                that.userPage ++;
                that.getUserRank(that.userPage, false);
            });
        },

        //ajax获取主播列表
        getModRank(page, judge) {
            const that = this;
            axios.get('/doubleEgg/ranks?activityId=' + this.activityId + '&type=mod&pageNo=' + page)
            .then(res => {
                if (judge) {
                    that.myModArr = res.data.data.myRank;
                };
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
        getUserRank(page, judge) {
            const that = this;
            axios.get('/doubleEgg/ranks?activityId=' + this.activityId + '&type=user&pageNo=' + page)
            .then(res => {
                if (judge) {
                    that.myUserArr = res.data.data.myRank;
                };
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
    },
    mounted: function() {
        // 滚动加载
        this.initScrollLoadMod();
        this.initScrollLoadUser();
    }
});


// svg方法
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