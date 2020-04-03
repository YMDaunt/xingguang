/**
 * @author  Jesse 
 * @date    2018-03-29 10:48:10
 */

require('../../css/activity/boss.less');

import Vue from 'vue';
import axios from 'axios';
import layer from 'layer';
Vue.prototype.axios = axios;
import common from 'common';
import Rank from './components/Rank3.vue';


new Vue({
    el: '#app',
    data: {
        recordList: {}, //我的打击记录榜
        showRules: false, //活动规则
        trackInfo: {} ,//boss追踪信息
        noBoss:false,//此时刻是否有boss
        countDownTime:'00:00:00',//倒计时
        intDiff:0,//倒计时差值
    },
    components: {
        Rank
    },
    computed:{
        attacked:function(){
            if(localStorage.attacked){
                return true;
            }else{
                return false;
            }
        }
    },
    created: function() {
        this.getHitList();
        this.getTrackInfo();
    },
    mounted: function() {
        this.adaptation();
        this.countDown();
        //执行倒计时
        setInterval(this.countDown, 1000);
        //轮询请求boss位置信息
        setInterval(()=>{
            this.getTrackInfo();
        },8000);
    },
    methods: {
        //适配机型重定向
        adaptation() {
            let href = window.location;
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                if (href.host.indexOf('www') >= 0) {
                    window.location.href = '//m.kuaishouvideo.com/dist' + href.pathname;
                }
            } else {
                if (href.host.indexOf('www') < 0) {
                    window.location.href = '//www.kuaishouvideo.com' + href.pathname.replace('/dist', '');
                }
            }
        },
        //倒计时
        countDown() {
            let hour = 0,
                minute = 0,
                second = 0; //时间默认值
            if (this.intDiff >= 0) {
                // day = Math.floor(this.intDiff / (60 * 60 * 24));
                hour = Math.floor(this.intDiff / (60 * 60) % 24);
                minute = Math.floor(this.intDiff / 60 % 60);
                second = Math.floor(this.intDiff % 60);
            } else {
                return false;
            }
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            this.countDownTime = hour + ':' + minute + ':' + second;
            this.intDiff--;
        },
        //我的击打记录
        getHitList() {
            axios.get('/boss/getHitList')
                .then(res => {
                    let data = res.data;
                    //console.log('我的击打记录', data);
                    if (data.errno == 0) {
                        this.recordList = data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //获取最新boss信息
        getTrackInfo(callback) {
            axios.get('/boss/getTrackInfo')
                .then(res => {
                    let data = res.data;
                    //console.log('boss位置信息', data);
                    if (data.errno == 0) {
                        this.noBoss = false;
                        this.trackInfo = data.data;
                        this.intDiff = this.trackInfo.runAwayTime - this.trackInfo.nowTime;
                        if (callback) { callback(); }
                    }else if(data.errno == 203 || 204){
                        this.noBoss = true;
                        this.intDiff = 0;
                    }else if(data.errno == 201){
                        layer.msg('活动未开始');
                        this.noBoss = true;
                        this.intDiff = 0;
                    }else if(data.errno == 202){
                        layer.msg('活动已结束');
                        this.noBoss = true;
                        this.intDiff = 0;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        attack() {
            this.getTrackInfo(()=>{
                localStorage.attacked = true;
                common.goRoom(this.trackInfo.rid);
            });
        },
        popup(bool){
            if(bool){
                this.showRules = true;
                document.getElementsByTagName('html')[0].style.cssText += 'height:100%;overflow-y:hidden;';
                document.body.style.cssText = 'height:100%;overflow-y:hidden;';
            }else{
                this.showRules = false;
                document.getElementsByTagName('html')[0].style.cssText += 'height:auto;overflow-y:auto;';
                document.body.style.cssText = '';
            }
        }
    }
});