import '../../css/family/credits.less'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'

let vm = new Vue({
    el: 'article',
    filters: {
        getListCredits (bonus_point, discount_point) {
            return discount_point == 0 ? `+${bonus_point}` : `-${discount_point}`
        }
    },
    data: {
        myCredits: 0,
        creditsList: [],
        loadFlag: true,
        page: 0,
        isLoading: false,
        isEnd: false,
        screenH: 0
    },
    mounted: function () {
        this.screenH = window.screen.height

        this.$nextTick(function () {
            this.getMyCredits()
            this.getCreditsList(this.page)

            window.addEventListener('scroll', vm.getList)
        })
    },
    methods: {
        showHelp () {
            let html = `
			<h3>如何得积分</h3>
			<p>每日签到可获得积分，连续签到可获得更多积分哦~</p>

			<h3>如何使用积分</h3>
			<p>积分可以用来在商城兑换稀有座驾和成就勋章哦~</p>
			`

            layer.open({
                content: html,
                skin: 2,
                className: 'help',
                btn: ['朕知道了']
            })
        },

        getMyCredits () {
            axios.get('/family/userpoint')
                .then(
                    (res) => {
                        res = res.data
                        if (res.errno == 0) {
                            this.myCredits = res.data.points
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

        getList () {
            let scrollT = document.body.scrollTop

            let docH = document.body.scrollHeight

            if (docH - scrollT - this.screenH <= 30 && vm.loadFlag) {
                this.page++
                this.loadFlag = false
                this.isLoading = true

                this.getCreditsList(this.page)
            }
        },

        getCreditsList (page) {
            common.showLoading()

            axios.get('/family/userpointlist', {
                params: {
                    page
                }
            })
                .then(
                    (res) => {
                        this.loadFlag = true
                        vm.isLoading = false
                        common.hideLoading()

                        res = res.data
                        if (res.errno == 0) {
                            if (res.data.length == 0) {
                                vm.isEnd = true
                                window.removeEventListener('scroll', vm.getList)
                            }

                            this.creditsList = this.creditsList.concat(res.data)
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
        }
    }
})
