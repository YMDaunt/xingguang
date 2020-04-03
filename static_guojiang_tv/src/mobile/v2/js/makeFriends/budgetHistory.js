import '../../css/makeFriends/recharge.less'
import Vue from 'vue'
import layer from 'layer'
import axios from 'axios'

new Vue({
    el: '#app',
    data: {
        currentPage: 1, // 从1开始
        getMoreTips: '点击加载更多',
        requestLock: false,
        noData: false,
        budgetList: []
    },
    created () {
        this.getBudgetHistoryList()
    },
    methods: {
        getBudgetHistoryList () {
            if (this.requestLock) return
            this.requestLock = true
            axios.get('/mfUser/coinLog', {
                params: {
                    page: this.currentPage
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.requestLock = false
                        let resData = data.data
                        const len = this.budgetList.length
                        if (resData.length > 0) {
                            if (this.budgetList[len - 1] && this.budgetList[len - 1]['date'] === resData[0]['date']) {
                                // 处理翻页后后一页的第一条数据和前一页的最后一条数据是同一天的情况
                                this.budgetList[len - 1]['list'] = [
                                    ...this.budgetList[len - 1]['list'], ...resData[0]['list']
                                ]
                                // 删除第一项
                                resData = resData.slice(1)
                            }
                            this.budgetList = this.budgetList.concat(resData)
                            this.currentPage++
                        } else {
                            if (this.currentPage === 1) {
                                this.noData = true
                            } else {
                                this.getMoreTips = '偶是有底线滴~'
                            }
                        }
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
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
