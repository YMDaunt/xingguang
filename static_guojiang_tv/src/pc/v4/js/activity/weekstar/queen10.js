/* eslint-disable*/
import '../../../css/activity/weekstar/queen10.less';

import Vue from 'vue'
import axios from 'axios'
import user from 'user'
import common from '../../common/common.js'
import polyfillScroll from '../../component/gj.polyfillScroll.js'

var ruleJudge = true
new Vue({
    el: '#app',
    data: {
        uid: false,
        ruleBox: false,
        useBox: false,
        tostBox: false,
        tostText: '',
        cardNum: 0,
        showLast: true,
        showStarTab: true,
        myModMes: [],
        useNum: 1,           // 使用卡的数量
        chooseId: 0,         // 选择的活动礼物id
        chooseUserId: 0,     // 选择的护星礼物id
        chooseLastId: 0,     // 选择的上周礼物Id
        lastId: 0,           // 上周类型id
        chooseMine: true,    // 选择个人总榜或者日榜 true为总榜
        dayNum: 0,           // 星期几
        chooseNew: false,    // 周星新星选择
        tabArr1: [true, false, false],
        tabArr2: [true, false, false],
        tabArr3: [true, false, false],
        giftArrNow: [],      // 当前礼物
        giftArrLast: [],     // 上周礼物
        dayZx: ['周一', '周二', '周三', '周四', '周五', '总榜'],
        dayNew: ['周一', '周二', '周三', '周四', '周五', '总榜'],
        last: ['周星', '新星', '护星'],
        chooseDayZx: 0,     //周星日期选择
        chooseDayNew: 0,    //新星日期选择
        zxArr: [],
        newArr: [],
        hxArr: [],
        lastArr: [],
        bestMod: [],
        bestUser: [],
        lastType: 'week',
        myZxMes: [],        //主播身份个人中心周星
        myNewMes: [],       //主播身份个人中心新星
        dayId: 0,
        dayJudge: true,
        isDayRank: false,  //是否显示日榜榜单 && 我的日榜按钮
        transformEntity1: undefined
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
        axios.get('/weekStar10/giftInfo')
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

            this.cardNum = data.cardNum
            this.uid = data.isLogin
            this.showLast = data.show

            // 总榜时段为-1
            if (data.day <= '-1') {
                this.chooseDayZx = 6
                this.chooseDayNew = 6
                if (data.day == '-2') {
                    this.dayId = -1
                    this.dayNum = data.day
                } else {
                    this.dayNum = data.day
                    this.dayId = data.day
                }
            } else {
                this.chooseDayZx = data.day
                this.chooseDayNew = data.day
                this.dayNum = data.day
                this.dayId = data.day
            }

            // 获取周星榜单
            this.getRank('week', this.chooseId, this.dayId)
            // 获取新星榜单
            this.getRank('new', this.chooseId, this.dayId)
            // 获取护星榜单
            this.getRank('user', this.chooseUserId, this.dayId)
            // 获取上周榜单
            this.getLastRank(this.lastType, this.chooseLastId)
        })
        .catch((err) => console.log(err))

        // 获取历史最强
        axios.get('/weekStar10/bestStar')
        .then((res) => {
            let data = res.data.data
            this.bestMod = data.mod
            this.bestUser = data.user
        })
        .catch((err) => console.log(err))
    },
    methods: {
        firTab(ele) {
            if (ele === '1') {
                this.chooseNew = false
            } else {
                this.chooseNew = true
                this.chooseId = 0 //新星不区分礼物，默认为0
            }
        },

        lastTab(index) {
            this.lastId = index
            console.log(this.lastId)
            switch(this.lastId) {
                case 0 :
                    this.lastType = 'week'
                    this.showStarTab = true
                    break;
                case 1 :
                    this.lastType = 'new'
                    this.showStarTab = false
                    break;
                case 2 :
                    this.lastType = 'user'
                    this.showStarTab = true
                    break;
            }
            this.getLastRank(this.lastType, this.chooseLastId)
        },

        chooseDay(index, obj) {
            // 超前不可点击
            if (this.dayNum >= -2 && this.dayNum != -1 && index > this.dayNum - 1 && index != 5) {
                this.disapperTost(2500, '暂未开启')
                return
            }
            if (obj === '0') {  //周星
                this.chooseDayZx = index + 1
                if (index == 5) {
                    this.dayId = -1  //总榜为-1
                } else {
                    this.dayId = index + 1
                }
                // 获取周星榜单
                this.getRank('week', this.chooseId, this.dayId)
            } else {
                this.chooseDayNew = index + 1
                if (index == 5) {
                    this.dayId = -1  //总榜为-1
                } else {
                    this.dayId = index + 1
                }
                // 获取新星榜单
                this.getRank('new', this.chooseId, this.dayId)
            }
        },

        tabThree(posi, index) {
            if (posi == 1) {
                this.tabArr1 = [false, false, false]
                this.tabArr1[index] = true
                this.chooseId = index
                this.getRank('week', this.chooseId, this.dayId)
            } else 
            if (posi == 2) {
                this.tabArr2 = [false, false, false]
                this.tabArr2[index] = true
                this.chooseUserId = index
                this.getRank('user', this.chooseUserId, this.dayId)
            } else {
                this.tabArr3 = [false, false, false]
                this.tabArr3[index] = true
                this.chooseLastId = index
                this.getLastRank(this.lastType, this.chooseLastId)
            }
        },
        useCard() {
            if (!this.uid) {
               return common.goLogin() 
            } else {
                axios.get('/weekStar10/UseCard?num=-1')
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
        
        getRank(type, id, day) {
            axios.get('/weekStar10/getRank?type=' + type +'&idx='+ id + '&day=' + day)
            .then((res) => {
                const data = res.data.data
                if (type === 'week') {
                    this.zxArr = data
                } else 
                if (type === 'new') {
                    this.newArr = data
                } else {
                    this.hxArr = data
                }
            })
            .catch((err) => console.log(err))
        },

        getLastRank(type, id) {
            axios.get('/weekStar10/getLastRank?type=' + type +'&idx='+ id)
            .then((res) => {
                const data = res.data.data
                this.lastArr = data.rank
            })
            .catch((err) => console.log(err))
        },

        // 跳转直播间
        // 跳转直播间
        inlive (e) {
            var rid = e.target.getAttribute('data-rid')
            window.open('/' + rid)
        },

        showRule () {
            this.ruleBox = true
            console.log(this.ruleBox)
            let that = this
            Vue.nextTick(() => {
                if (ruleJudge) {
                    const sortWrapElement = document.querySelector('.rule-con')
                    const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                    const sortListElement = document.querySelector('.rule-scroll')
                    that.transformEntity1 = new polyfillScroll({
                        scrollWrap: '.rule-con',
                        scrollContent: '.rule-scroll',
                        bar: {
                            width: '8px',
                            height: '60px',
                            right: '6px',
                            'background': 'rgba(90, 147, 219,0.9)'
                        }
                    })
                    ruleJudge = false
                }
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
    }
});
