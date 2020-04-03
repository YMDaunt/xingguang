import axios from 'axios'
require('../../css/makeFriends/makeMoney.less')

import Vue from 'vue'

new Vue({
    el: '#app',
    data: {
        version: '5.6.0',
        isNew: false,
        tabArr: ['入门篇', '进阶篇', '达人篇'],
        stage: 1,

        // 3个阶段是否完成状态 s1为老版本 one为新版本
        s1: false,
        one: {
            isTruePerson: false,
            isUpload: false
        },
        s2: false,
        s3: false,

        tostBox: false,
        tostText: ''
    },
    created: function () {
        this.version = this.getUrlPrame('version')
        if (!this.version) {
            // this.disapperTost(2500, '页面版本有误！')
            // 老版本拿不到统一设置为5.6.1
            this.version = '5.6.1'
            this.isNew = false
        } else {
            if (this.version === '5.6.0' || this.version === '5.6.1') {
                this.isNew = false
            } else {
                this.isNew = true
            }
        }
        this.getStage(this.version)
    },
    mounted: function () {

    },
    methods: {
        tab (index) {
            this.stage = index + 1
        },
        setImg () {
            gBridge.userEdit()
        },
        setAuth () {
            gBridge.jumpMFAuth()
        },

        getStage (v) {
            axios.get('/mfUser/getStageInfo?version=' + v)
                .then(res => {
                    let data = res.data.data
                    if (v === '5.6.0' || v === '5.6.1') {
                        this.s1 = data.one
                        this.s2 = data.two
                        this.s3 = data.three

                        if (!this.s1) {
                            this.stage = 1
                            return false
                        } else
                        if (!this.s2) {
                            this.stage = 2
                            return false
                        } else {
                            this.stage = 3
                        }
                    } else {
                        // 5.6.5以上版本
                        this.one.isTruePerson = data.oneInfo.isTruePerson
                        this.one.isUpload = data.oneInfo.isUpload
                        this.s2 = data.two
                        this.s3 = data.three

                        if (!this.one.isTruePerson || !this.one.isUpload) {
                            this.stage = 1
                            return false
                        } else
                        if (!this.s2) {
                            this.stage = 2
                            return false
                        } else {
                            this.stage = 3
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        sayHellow () {
            axios.get('/mfUser/autoGreetAuth?authStatus=1')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.s2 = true // 完成阶段2
                        // 刷新客户端状态
                        gBridge.autoGreet()
                    } else {
                        this.disapperTost(2500, data.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        voicePhone () {
            gBridge.messagePage()
        },

        getUrlPrame (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return decodeURI(r[2]) // 转换中文
            } else {
                return null
            }
        },

        // tost计时器
        disapperTost (time, text) {
            this.tostBox = true
            this.tostText = text
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.tostBox = false
            }, time)
        }
    }
})
