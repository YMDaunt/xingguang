import '../../css/family/level.less'

import Vue from 'vue'
import axios from 'axios'

const querystring = require('querystring')

const familyLevelDetail = [
    {
        'members': 10,
        'medalLevel': 0,
        'giftName': ['交个朋友', '荧光棒' ],
        'leaderNum': 1
    },
    {
        'members': 15,
        'medalLevel': 0,
        'giftName': ['约麻辣烫', '求签名'],
        'leaderNum': 1
    },
    {
        'members': 20,
        'medalLevel': 0,
        'giftName': ['表白', '粉丝灯牌' ],
        'leaderNum': 2
    },
    {
        'members': 25,
        'medalLevel': 1,
        'giftName': ['求包养', '打call' ],
        'leaderNum': 2
    },
    {
        'members': 30,
        'medalLevel': 1,
        'giftName': ['来栋房', '上电视' ],
        'leaderNum': 3
    },
    {
        'members': 35,
        'medalLevel': 1,
        'giftName': ['兜风', '小金人' ],
        'leaderNum': 3
    },
    {
        'members': 40,
        'medalLevel': 2,
        'giftName': ['看流星雨', 'showtime' ],
        'leaderNum': 4
    },
    {
        'members': 45,
        'medalLevel': 2,
        'giftName': ['花海', '爆灯'],
        'leaderNum': 4
    },
    {
        'members': 50,
        'medalLevel': 2,
        'giftName': ['烛光晚餐', '助理' ],
        'leaderNum': 5
    },
    {
        'members': 60,
        'medalLevel': 3,
        'giftName': ['生猴子', '红地毯'],
        'leaderNum': 6
    }
]

let vm = new Vue({
    el: 'article',
    data: {
        level: 1,
        nextLevel: 2,
        gapScore: 0,
        familyLevelDetail,
        completePercent: 0,
        familyType: 0 // 1: 跑骚， 2：造星
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getFamilyLevelInfo()
        })
    },
    methods: {
        getFamilyLevelInfo () {
            let fid = querystring.parse(location.search.replace(/^\?/, ''))['fid']
            axios.get('/family/familyLevel', {
                params: {
                    familyId: fid
                }
            })
                .then(
                    (res) => {
                        res = res.data
                        if (res.errno == 0) {
                            this.level = res.data.level
                            this.nextLevel = res.data.nextLevel
                            this.gapScore = res.data.needScore
                            this.completePercent = res.data.completeScore
                            this.familyType = res.data.type

                            this.nextLevel = this.nextLevel == 11 ? '满级' : this.nextLevel
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (err) => {
                        alert(err)
                    }
                )
        },

        fMedalIcon (level) {
            return 'family_medals_icon_' + level
        },

        getProcessWidth () {
            return 'width:' + 100 * this.completePercent + '%'
        }
    }
})
