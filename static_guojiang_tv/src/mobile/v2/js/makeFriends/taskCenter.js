import Vue from 'vue'
import Axios from 'axios'
import layer from 'layer'
import {goWebviewUrl, getVersion} from 'common'
import '../../css/makeFriends/taskCenter.less'
import bodymovin from '../component/bodymovin.min.js'

new Vue({
    el: '#app',
    filters: {
        progress (item) {
            switch (item.taskType) {
            case 104:
            case 105:
            case 110:
            case 1002:
            case 1003:
            case 1004:
                return `(${item.finishNum}/${item.targetNum})`
            }
        }
    },
    data: {
        showRedPackage: false,
        showSingleRedPackage: false,
        showResult: false,
        showSingleResult: false,
        showDoubleResult: false,
        male: true, // 默认男性 显示金币单位
        singleResult: 0, // 单个任务红包奖励
        doubleResult: 0, // 多个任务红包奖励
        redPackageNum: 0, // 多个任务红包数量
        currentItem: {},
        redSvgContainer: '',
        redAnimItem: '',
        newerTask: [],
        taskLock: false,
        everydayTask: []
    },
    computed: {
        unit () {
            return this.male ? '金币' : '元'
        },
        version () {
            const versionNum = getVersion()
            return parseInt((versionNum.trim()).replace(/\./g, ''))
        }
    },
    created () {
        this.getTaskList()
    },
    mounted () {
        this.redSvgContainer = document.querySelector('.red-package-container')
        document.addEventListener('visibilitychange', () => {
            // 当页面可见时，刷新任务列表
            if (document.visibilityState === 'visible') {
                this.getTaskList()
                this.taskLock = false
            }
        })
    },
    methods: {
        getTaskList () {
            Axios.post('/mfUser/TaskList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.everydayTask = data.data.day
                        let taskArr = data.data.new
                        let newTaskArr = []
                        // 不同版本任务不同，最新版本的写上面
                        if (this.version < 583) {
                            newTaskArr = taskArr.filter((item) => {
                                return item.taskType !== 109 && item.taskType !== 110
                            })
                        }

                        if (this.version < 573) {
                            newTaskArr = taskArr.filter((item) => {
                                return item.taskType !== 108
                            })
                        }

                        if (this.version < 570) {
                            newTaskArr = newTaskArr.filter((item) => {
                                return item.taskType !== 107
                            })
                        }
                        if (newTaskArr.length > 0) {
                            this.newerTask = newTaskArr
                        } else {
                            this.newerTask = taskArr
                        }
                        if (data.data.isShowDaySign === 1) {
                            // 动态加载签到组件
                            import(/* webpackChunkName: "makeFriends/signComponent" */'./sign.vue').then(component => {
                                const SignBoxComponent = Vue.extend(component)
                                const signInstance = new SignBoxComponent()
                                signInstance.isModal = true
                                signInstance.$mount('#signBox')
                            })
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
        },
        goTask (item) {
            if (this.taskLock) { return false }
            switch (item.taskType) {
            case 101:case 103:case 104:
                try {
                // 进入个人资料编辑页
                    gBridge.userEdit()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 102:
                try {
                    // 进入真人认证页面
                    gBridge.jumpMFAuth()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 105:case 1002:case 1003:
                try {
                // 进入交友列表页
                    gBridge.jumpMFList()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 106: // 撩妹
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/matching.html?canMatchNum=${item.canMatchNum}`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 107: // 进入录音设置页
                try {
                    gBridge.uploadRecord()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 108: // 进入基础资料设置页
                try {
                    gBridge.goSetProfile()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 109: // 发布动态
                try {
                    gBridge.goPublish()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 110: // 评论动态
                try {
                    gBridge.goComments()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 1000: // 签到弹窗
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/sign.html`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 1001: // 邀请好友
                try {
                    goWebviewUrl(`https://${location.host}/dist/makeFriends/share.html`)
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            case 1004:case 1005:
                try {
                    // 进入消息列表页
                    gBridge.messagePage()
                } catch (e) {
                    alert(e.name + ':' + e.message)
                }
                break
            }
            this.taskLock = true
        },
        goRedPackage (item) {
            this.currentItem = item
            this.showRedPackage = true
            if (item.taskType !== 1001) {
                // 单个任务红包
                this.showSingleRedPackage = true
            } else if (item.redPacketNum === 1) {
                // 单个任务红包
                this.showSingleRedPackage = true
            } else {
                // 多个任务红包
                this.showSingleRedPackage = false
                this.redPackageNum = item.redPacketNum
            }
        },
        openRedPackage () {
            if (!navigator.onLine) {
                layer.open({ time: 3, content: '网络不给力' })
                return false
            }
            this.showResult = true
            this.showRedPackage = false
            Axios.post('/mfUser/taskRedPacket', `taskType=${this.currentItem.taskType}&taskIds=${this.currentItem.taskIds}`)
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        if (this.showSingleRedPackage) {
                            // 单个红包抽奖
                            this.showSingleResult = true
                            this.showDoubleResult = false
                            if (data.data.mfCoin > 0) {
                                this.singleResult = data.data.mfCoin
                                this.male = true
                            } else if (data.data.incomeY > 0) {
                                this.singleResult = data.data.incomeY
                                this.male = false
                            }
                        } else {
                            // 多个红包抽奖
                            this.showSingleResult = false
                            this.showDoubleResult = true
                            this.doubleResult = data.data.mfCoin
                        }
                        this.redAnimItem = bodymovin.loadAnimation({
                            wrapper: this.redSvgContainer,
                            animType: 'svg',
                            loop: false,
                            prerender: true,
                            autoplay: true,
                            path: 'https://static.guojiang.tv/app/effect/H5/star/data.json'
                        })
                        // 动画播放完成回调
                        this.redAnimItem.addEventListener('complete', () => {
                            this.redSvgContainer.innerHTML = ''
                            this.showResult = false
                            this.getTaskList()
                        })
                    } else {
                        this.showResult = false
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
