import '../../css/activity/foolsDay.less'

import Vue from 'vue'
import axios from 'axios'
// import PolyfillScroll from '../component/gj.polyfillScroll.js';
import common from 'common'
import Rank from './components/Rank.vue'
Vue.prototype.axios = axios

// ios中激活active伪类
document.body.addEventListener('touchstart', function () {})

new Vue({
    el: '#app',
    components: {
        Rank
    },
    data: {
        recommendList: [], // 推荐主播列表
        showRules: false, // 活动规则
        showAward: false, // 展示领奖弹窗
        isMatter: true, // 是否是实物奖励
        showAwardBtn: false, // 是否显示领奖按钮
        info: {
            type: '',
            address: '',
            name: '',
            phone: ''
        },
        noAddress: false,
        noName: false,
        fallPhone: false,
        commitLock: false
        // entity:'',
    },
    created: function () {
        // 获取初始化页面数据
        axios.get('/FoolsDayActivity/Init')
            .then(res => {
                let data = res.data
                // console.log('初始页面数据', data);
                if (data.errno == 0) {
                    this.showAwardBtn = data.data.acceptPrize
                    this.recommendList = data.data.recommendList
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted: function () {
        // 适配机型重定向
        this.adaptation()
        // body加模拟滚动解决安卓手机滑动卡顿
        // this.$nextTick(()=>{
        //     if(!this.entity){
        //         let scrollWrap = document.body;
        //         let scrollContent = document.querySelector('#app');
        //         let scrollWrapHeight = parseFloat(window.getComputedStyle(scrollWrap,null).getPropertyValue('height'));
        //         this.entity = new PolyfillScroll({
        //             scrollWrap:'body',
        //             scrollContent: '#app',
        //             bar:{}
        //         });
        //     }
        // })
    },
    methods: {
        adaptation () {
            let href = window.location
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '')
                }
            }
        },
        // 点击领奖按钮获取已经填写过的信息
        getInfo () {
            axios.get('/FoolsDayActivity/GetInfo')
                .then(res => {
                    let info = res.data.data.Info
                    // console.log('领奖信息',info);
                    if (info.type == 1) {
                        this.isMatter = true
                        this.info = info
                    } else {
                        this.isMatter = false
                        this.info = {type: '2', address: '', name: '', phone: ''}
                    }
                    this.showAward = true
                })
                .catch(err => {
                    console.log(err)
                })
            this.clearValidateWarning()
        },
        // 选择实物奖励
        selectMatter () {
            this.isMatter = true
            this.info.type = 1
            axios.get('/FoolsDayActivity/GetInfo')
                .then(res => {
                    let info = res.data.data.Info
                    // console.log('领奖信息',info);
                    if (info.name) {
                        this.info = info
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 选择返现
        selectMoney () {
            this.isMatter = false
            this.info = {type: '2', address: '', name: '', phone: ''}
            this.clearValidateWarning()
        },
        validateAddress () {
            if (this.info.address === '') {
                this.noAddress = true
            } else {
                this.noAddress = false
            }
        },
        validateName () {
            if (this.info.name === '') {
                this.noName = true
            } else {
                this.noName = false
            }
        },
        validatePhone () {
            if (!/^1[0-9]{10}$/.test(this.info.phone)) {
                this.fallPhone = true
            } else {
                this.fallPhone = false
            }
        },
        clearValidateWarning () {
            this.noAddress = false
            this.noName = false
            this.fallPhone = false
        },
        // 提交信息
        commitInfo () {
            if (!this.commitLock) {
                this.commitLock = true
                axios.get('/FoolsDayActivity/CommitInfo', {
                    params: this.info
                })
                    .then(res => {
                        // console.log('提交信息',res.data);
                        this.commitLock = false
                        if (res.data.data.commitInfo) {
                            layer.open({
                                content: '信息提交成功！',
                                time: 3000
                            })
                            this.showAward = false
                            this.info = {}
                            this.clearValidateWarning()
                        } else {
                            layer.open({
                                content: '信息提交失败，请重新填写',
                                time: 3000
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        // 点击主播头像，跳转直播间
        inlive (rid) {
            common.goRoom(rid)
        },
        // 点击关注按钮，关注主播
        attention (mid, index, tag, rank) {
            this.axios.get('/FoolsDayActivity/Attention', {
                params: {
                    mid: mid
                }
            })
                .then(res => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    let _data = res.data
                    // console.log(_data);
                    if (_data.errno == 0) {
                        if (tag === 'mRank') {
                            rank[index].is_attention = true
                        } else {
                            this.recommendList[index].is_attention = true
                        }
                    } else {
                        layer.open({
                            content: _data.msg,
                            time: 3000,
                            closeBtn: 0
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
