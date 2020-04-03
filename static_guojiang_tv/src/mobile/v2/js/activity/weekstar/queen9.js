/* eslint-disable*/
import '../../../css/activity/weekstar/queen9.less';

import Vue from 'vue';
import axios from 'axios';
import common from '../../common/common.js';

//ios中激活active伪类
document.body.addEventListener('touchstart', function() {});

new Vue({
    el: '#app',
    data: {
        uid: false,
        ruleBox: false,
        useBox: false,
        tostBox: false,
        showLastWeek: false, // 是否显示上周榜单
        tostText: '',
        cardNum: 0,
        useNum: 1,           // 使用卡的数量
        chooseId: 0,         // 选择的活动礼物id
        chooseUserId: 0,     // 选择的护星礼物id
        chooseLastId: 0,     // 选择的上周礼物Id
        chooseMine: true,    // 选择个人总榜或者日榜 true为总榜
        giftArrNow: [],      // 本周礼物
        giftArrLast: [],     // 上周礼物
        newModRank: [],      // 新星
        modRank: [],         // 周星
        allNewRank: [],      // 总榜新星
        allRank: [],         // 总榜周星
        myModMes: [],        // 主播身份
        myModDayMes: [],     // 预存主播日榜
        myModAllMes: [],     // 预存主播总榜
        myUserMes: [],       // 用户身份
        protectRank: [],     // 护星榜
        lastRank: [],        // 上周榜
        lastRankArr:[],      // 上周榜用于渲染
        tabArr1: [true, false, false],
        tabArr2: [true, false, false],
        tabArr3: [true, false, false],
        dayArr: ['周一', '周二', '周三', '周四', '周五'],
        dayId: 1,
        today: 1,
        dayJudge: true,
        isDayRank: false,  //是否显示日榜榜单 && 我的日榜按钮
    },
    created() {
        //适配机型重定向
        let href = window.location;
        if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
            if (href.host.indexOf('www') >= 0) {
                window.location.href = '//m.tuho.tv/dist' + href.pathname;
            }
        } else {
            if (href.host.indexOf('www') < 0) {
                window.location.href = '//www.tuho.tv' + href.pathname.replace('/dist', '');
            }
        }

        // 获取礼物信息,时间
        axios.get('/NewWeekStar/giftInfo')
        .then((res) => {
            const data = res.data.data
            if (!data.isActivity || data.day == '6' || data.day == '7') {
                this.isDayRank = false
            } else {
                this.isDayRank = true
            }
            // this.isDayRank = false
            this.giftArrNow = data.giftInfo
            this.giftArrLast = data.giftedInfo
            this.showLastWeek = data.show
            // this.showLastWeek = 1
            this.cardNum = data.cardNum
            this.uid = data.isLogin
            this.dayId = data.day
            this.today = data.day
            switch(this.today) {
                case '1' :
                    this.dayArr = ['周一', '周二', '周三', '周四', '周五']
                    break;
                case '2' :
                    this.dayArr = ['周二', '周一', '周三', '周四', '周五']
                    break;
                case '3' :
                    this.dayArr = ['周三', '周一', '周二', '周四', '周五']
                    break;
                case '4' :
                    this.dayArr = ['周四', '周一', '周二', '周三', '周五']
                    break;
                case '5' :
                    this.dayArr = ['周五', '周一', '周二', '周三', '周四']
                    break;
            }

            // 获取活动榜单
            this.getRank('act', this.chooseId, this.dayId)
            // 获取护星榜单
            this.getRank('hx', this.chooseId, this.dayId)

            if (this.showLastWeek) {
                axios.get('/NewWeekStar/GetLastRank')
                .then((res) => {
                    const data = res.data.data
                    this.lastRank = data.resultWrap
                    // 默认显示第一个礼物
                    this.lastRankArr = this.lastRank[0]
                    console.log(this.lastRankArr)
                })
                .catch((err) => console.log(err))
            };
        })
        .catch((err) => console.log(err))
    },
    methods: {
        tabThree(posi, index) {
            if (posi == 1) {
                this.tabArr1 = [false, false, false]
                this.tabArr1[index] = true
                this.chooseId = index
                this.getRank('act', this.chooseId, this.dayId)
            } else 
            if (posi == 2) {
                this.tabArr2 = [false, false, false]
                this.tabArr2[index] = true
                this.chooseUserId = index
                this.getRank('hx', this.chooseUserId, this.dayId)
            } else {
                this.tabArr3 = [false, false, false]
                this.tabArr3[index] = true
                this.chooseLastId = index
                this.lastRankArr = this.lastRank[this.chooseLastId]
                console.log(this.lastRankArr)
            }
        },
        useCard() {
            if (!this.uid) {
               return common.goLogin() 
            } else {
                axios.get('/NewWeekStar/UseCard?num=-1')
                .then((res) => {
                    const data = res.data
                    if (data.errno == 0) {
                        this.useBox = true
                    } else {
                        this.disapperTost(2500, data.msg)
                    }
                })
                .catch((err) => console.log(err))
            }
        },
        valueNum(e) {
            this.useNum = this.useNum.replace(/[^0-9]+/g,'')
            if (this.useNum > 9999) {
                this.useNum = 9999
            }
            else if (this.useNum == 0) {
                this.useNum = ''
            }
            else if (this.useNum < 0) {
                this.useNum = 1
            } 
        },
        sureUse() {
            if (this.useNum == '') {
                this.disapperTost(2500, '请输入正确数量')
            } else {
                axios.get('/NewWeekStar/UseCard?num=' + this.useNum)
                .then((res) => {
                    const data = res.data
                    // 返回最新数目
                    if (data.errno == 0) {
                        this.cardNum = data.data.num
                    };
                    this.disapperTost(2500, data.msg)
                    this.useBox = false
                })
                .catch((err) => console.log(err))
            }
        },
        chooseDay(e) {
            if (this.dayJudge) {
                e.target.parentNode.style.overflow = 'visible'
                e.target.className = 'day-icon day-icon-180'
                this.dayJudge = false
            } else {
                e.target.parentNode.style.overflow = 'hidden'
                e.target.className = 'day-icon'
                this.dayJudge = true
            }
        },
        valueDay(e) {
            if (!this.dayJudge) {
                switch(e.target.innerText) {
                    case '周一' :
                        this.dayArr = ['周一', '周二', '周三', '周四', '周五']
                        this.dayId = 1
                        // 获取对应榜单
                        this.getRank('act', this.chooseId, this.dayId)
                        break;
                    case '周二' :
                        if (this.today < 2) {
                            this.disapperTost(2500, '时间还没到哦~。')
                        } else {
                            this.dayArr = ['周二', '周一', '周三', '周四', '周五']
                            this.dayId = 2
                            // 获取对应榜单
                            this.getRank('act', this.chooseId, this.dayId)
                        }
                        break;
                    case '周三' :
                        if (this.today < 3) {
                            this.disapperTost(2500, '时间还没到哦~。')
                        } else {
                            this.dayArr = ['周三', '周一', '周二', '周四', '周五']
                            this.dayId = 3
                            // 获取对应榜单
                            this.getRank('act', this.chooseId, this.dayId)
                        }
                        break;
                    case '周四' :
                        if (this.today < 4) {
                            this.disapperTost(2500, '时间还没到哦~。')
                        } else { 
                            this.dayArr = ['周四', '周一', '周二', '周三', '周五']
                            this.dayId = 4
                            // 获取对应榜单
                            this.getRank('act', this.chooseId, this.dayId)
                        }
                        break;
                    case '周五' :
                        if (this.today < 5) {
                            this.disapperTost(2500, '时间还没到哦~。')
                        } else {
                            this.dayArr = ['周五', '周一', '周二', '周三', '周四']
                            this.dayId = 5
                            // 获取对应榜单
                            this.getRank('act', this.chooseId, this.dayId)
                        }
                        break;
                } 
                e.target.parentNode.parentNode.style.overflow = 'hidden'
                e.target.parentNode.previousSibling.className = 'day-icon'
                e.target.parentNode.previousElementSibling.className = 'day-icon'
                this.dayJudge = true
            }
        },
        getRank(type, id, day) {
            axios.get('/NewWeekStar/GetRank?idx='+ id + '&day=' + day)
            .then((res) => {
                const data = res.data.data
                // act仅操作活动榜单，否则操作护星榜单
                if (type == 'act') {
                    this.newModRank = data.newModRank
                    this.modRank = data.weekModRank
                    this.allNewRank = data.totalNewModRank  
                    this.allRank = data.totalWeekModRank     
                    this.myModDayMes = data.myRank.dailyMod
                    this.myModAllMes = data.myRank.mod
                    if(this.isDayRank) {
                        // 活动期间优先显示个人日榜
                        this.myModMes = this.myModDayMes
                        this.chooseMine = false
                    } else {
                        this.myModMes = this.myModAllMes
                        this.chooseMine = true
                    }
                } else {
                    this.protectRank = data.userRank
                    this.myUserMes = data.myRank.user
                }
            })
            .catch((err) => console.log(err))
        },

        // 跳转直播间
        inlive(e){
            var rid = e.target.getAttribute('data-rid');
            common.goRoom(rid); //主播房间id //主播用户id
        },

        tabMyMes(index) {
            if (index == 1) {
                this.myModMes = this.myModDayMes
                this.chooseMine = false
            } else {
                this.myModMes = this.myModAllMes
                this.chooseMine = true
            }
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
});