/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:53:49
 */
/* eslint-disable */
import '../../css/fans/moderatorRule.less'
import Vue from 'vue'
import Rule from './rule.vue'
import axios from 'axios'
import layer from 'layer'

const querystring = require('querystring')

new Vue({
    el: 'article',
    components: {
        'rule': Rule
    },
    filters: {
        formatHeadpic (url) {
            return '//static.guojiang.tv/pc/medals/' + url
        },

        formatLevel (nextlevel, level) {
            return nextlevel == level ? '满级' : nextlevel
        }
    },
    data: {
        info: [],
        mid: '',
        showLock: false
    },
    created: function () {
        this.mid = querystring.parse(location.search.split('?')[1])['mid']
        this.getFansInfo()
    },
    methods: {
        getFansInfo () {
            axios.get('/fans/getFansInfo', {
                params: {
                    mid: this.mid
                }
            })
                .then(
                    (res) => {
                        res = res.data
                        if (res.errno == 0) {
                            this.info = res.data.info
                            this.showLock = true
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },
        barStyle (score, currentLevelScore, nextLevelScore) {
            let total = parseInt(nextLevelScore) - parseInt(currentLevelScore)

            let finished = parseInt(score) - parseInt(currentLevelScore)
            return 'width:' + (finished / total).toFixed(4) * 100 + '%'
        },

        formatLevelIconClass (level) {
            return 'm_level_icon_' + level
        }
    }
})
