'use strict';

import Vue from 'vue';
import axios from 'axios';
import common from 'common';
import $ from 'jquery';

import '../../css/activity/treasure.less';

new Vue({
    el: '#app',
    data: {
        uid: false,
        tabCon1: true,
        tabCon2: false,
        tabCon3: false,
        ruleShow: false,
        buyBox: false,
        luckNum: false,
        tostBox: false,
        timer: null,
        yeBox: false,
        codeBox: false,
        canBuy: true,
        showTime: false,
        goodArr: [],
        chooseImg: '',
        goodId: null,    // 商品id
        perMoney: 10,    // 单价
        buyTotal: 0,     // 总价
        lastNum: 0,
        buyTips: false,  // 购买提示判断
        luckNumber: '',  // 幸运号码
        scrollLock1: false,
        scrollLock2: false,
        scrollLock3: false,
        page1: 1,
        page2: 1,
        page3: 1,
        openArr: [],     // 开奖记录
        getAwardArr: [], // 中奖记录
        buyArr: [],      // 夺宝记录    
        tostText: '',
        timeCount: null,
        restTime: ['-', '-', '小时', '-', '-', '分', '-', '-', '秒'], 
        currentTime: 0,
        endTime: 0,
        judgeTime: true, // 活动时间
        typeCz: false,
    },
    created: function(){
        this.init();
        this.getOpen(this.page1);
        this.getGet(this.page2);
        this.getBuy(this.page3);
    },
    methods: {
        // 适配机型重定向
        adaptation() {
            let href = window.location;
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname;
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '');
                }
            }
        },

        // 活动初始化
        init() {
            axios.get('/crowdFunding/init')
            .then(res => {
                let data = res.data;
                this.uid = data.data.isLogin;
                this.goodArr = data.data.products;
                if (this.timeCount) {
                    clearTimeout(this.timeCount);
                };
                this.showTime = data.data.countDown;
                this.endTime = data.data.endTime;
                // 提前5分钟进入倒计时 +300000
                this.currentTime = new Date(data.data.now).getTime() + 300000; 
                this.caclTime();
                if (data.data.canBuy) {
                    this.canBuy = true;
                } else {
                    this.canBuy = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        tab(num) {
            if (num == '1') {
                this.tabCon1 = true;
                this.tabCon2 = false;
                this.tabCon3 = false;
            } else
            if (num == '2') {
                if (!this.uid) {
                    return common.goLogin();
                } else {
                    this.tabCon1 = false;
                    this.tabCon2 = true;
                    this.tabCon3 = false;
                }
            } else {
                if (!this.uid) {
                    return common.goLogin();
                } else {
                    this.tabCon1 = false;
                    this.tabCon2 = false;
                    this.tabCon3 = true;
                }
            }
        },

        refresh() {
            this.init();
            this.page1 = 1;
            this.page2 = 1;
            this.page3 = 1;
            this.openArr = [];
            this.getAwardArr = [];
            this.buyArr = [];
            Vue.nextTick(()=> {
                this.getOpen(this.page1);
                this.getGet(this.page2);
                this.getBuy(this.page3);
            })
        },

        // 实时
        caclTime () {
            if (!this.judgeTime) {
                return this.restTime = ['-', '-', '小时', '-', '-', '分', '-', '-','秒']
            }
            let restHou = (new Date(this.endTime).getHours()) - (new Date(this.currentTime).getHours())
            let restMin = 59 - (new Date(this.currentTime)).getMinutes()
            let restSec = 59 - (new Date(this.currentTime)).getSeconds()
            if (restHou <= 0 && restMin <= 0 && restSec <= 0) {
                // 最后5分钟
                this.showTime = false;
                this.canBuy = false;
            }

            let tempTimeArr = []
            if (restHou < 10) tempTimeArr = [].concat(tempTimeArr, [0, restHou])
            else tempTimeArr = [].concat(tempTimeArr, String(restHou).split(''))
            tempTimeArr.push('小时')
            if (restMin < 10) tempTimeArr = [].concat(tempTimeArr, [0, restMin])
            else tempTimeArr = [].concat(tempTimeArr, String(restMin).split(''))
            tempTimeArr.push('分')
            if (restSec < 10) tempTimeArr = [].concat(tempTimeArr, [0, restSec])
            else tempTimeArr = [].concat(tempTimeArr, String(restSec).split(''))
            tempTimeArr.push('秒')
            this.restTime = tempTimeArr

            this.timeCount = setTimeout(() => {
                this.currentTime += 1000
                this.caclTime()
            }, 1000)
        },

        // 购买
        buy(e) {
            // 购买判断
            if (!this.uid) {
                return common.goLogin();
            } else {
                if (this.canBuy) {
                    this.goodId = e.target.getAttribute('data-id');
                    this.chooseImg = e.target.getAttribute('data-img');
                    this.lastNum = e.target.getAttribute('data-last');
                    $('#totalMoney').val(1);
                    this.buyBox = !this.buyBox;
                    this.buyTotal = this.perMoney;
                } else {
                    this.buyTips = !this.buyTips;
                    this.buyText = data.tip;
                }
            }
        },

        // add
        add() {
            var num = $('#totalMoney').val();
            num++;
            if (num >= this.lastNum) {
                num = this.lastNum;
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
            num = Number(num.replace(/[^0-9]+/g,''));
            if (num >= this.lastNum) {
                num = this.lastNum;
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
                axios.get('/crowdFunding/buy?productId='+ this.goodId + '&num=' + num)
                .then(res => {
                    let data = res.data;
                    this.buyBox = false;
                    if (data.errno == 0) {
                        this.luckNumber = data.data.result;
                        this.luckNum = true;
                        // 购买完后刷新
                        this.refresh();
                    } else
                    if (data.errno == 210) {
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

        // 跳转充值
        charge() {
            common.goRecharge();
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

        //滚动加载已开奖
        initScrollLoadOpen() {
            const that = this;
            that.scrollLoad(".ed-out", 150, function() {
                if (that.scrollLock1) return;
                that.scrollLock1 = true;
                that.page1 ++;
                that.getOpen(that.page1);
            });
        },

        //滚动加载中奖记录
        initScrollLoadGet() {
            const that = this;
            that.scrollLoad(".my-out", 150, function() {
                if (that.scrollLock2) return;
                that.scrollLock2 = true;
                that.page2 ++;
                that.getGet(that.page2);
            });
        },

        //滚动加载夺宝记录
        initScrollLoadBuy() {
            const that = this;
            that.scrollLoad(".treasure-out", 150, function() {
                if (that.scrollLock3) return;
                that.scrollLock3 = true;
                that.page3 ++;
                that.getBuy(that.page3);
            });
        },

        //ajax获取开奖记录
        getOpen(page) {
            const that = this;
            axios.get('/crowdFunding/awardList', {
                    params: {
                        pageNo: page
                    }
                })
            .then(res => {
                let data = res.data.data.result.data;
                if (data.length > 0) {
                    that.openArr = that.openArr.concat(data);
                    that.scrollLock1 = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        //ajax获取中奖记录
        getGet(page) {
            const that = this;
            axios.get('/crowdFunding/MyAwardList', {
                    params: {
                        pageNo: page
                    }
                })
            .then(res => {
                let data = res.data.data.result.data;
                if (data.length > 0) {
                    that.getAwardArr = that.getAwardArr.concat(data);
                    that.scrollLock2 = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },

        //ajax获取夺宝记录
        getBuy(page) {
            const that = this;
            axios.get('/crowdFunding/MyPurchaseList', {
                    params: {
                        pageNo: page
                    }
                })
            .then(res => {
                let data = res.data.data.result.data;
                if (data.length > 0) {
                    that.buyArr = that.buyArr.concat(data);
                    that.scrollLock3 = false;
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
        this.adaptation();
        // 滚动加载
        this.initScrollLoadOpen();
        this.initScrollLoadGet();
        this.initScrollLoadBuy();
    }
});
