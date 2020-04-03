import '../../css/makeFriends/recharge.less'
import Vue from 'vue'
import layer from 'layer'
import axios from 'axios'
import {formatDate} from 'common'

new Vue({
    el: '#app',
    filters: {
        regularTime: function (time) {
            return formatDate(time)
        }
    },
    data: {
        currentPage: 0,
        getMoreTips: '点击加载更多',
        requestLock: false,
        noData: false,
        historyList: []
    },
    created () {
        this.getRechargeHistoryList()
    },
    mounted () {
    },
    methods: {
        getRechargeHistoryList () {
            if (this.requestLock) return
            axios.get('/recharge/getRechargeHistoryList', {
                params: {
                    page: this.currentPage
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.historyList = this.historyList.concat(data.data.rechargeHistoryList)
                        this.currentPage++
                    } else if (data.errno === 102) {
                        if (this.currentPage === 0) {
                            this.noData = true
                        } else {
                            this.getMoreTips = '偶是有底线滴~'
                        }
                        this.requestLock = true
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }
})
