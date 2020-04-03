import '../../../../css/activity/weekstar/spread/spread1.less';

import Vue from 'vue';
import axios from 'axios';
import $ from 'jquery';
import common from '../../../common/common.js';

// 获取URL的参数
var urlId = GetQueryString('stage');
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


new Vue({
    el: '#app',
    data: {
        banner: '',
        contentText: '',
        modArr: [],
    },
    created() {
        // 主播
        axios.get('/anchorLiveModule/getMsg?id='+ urlId + '')
        .then(res => {
            let data = res.data;
            this.banner = data.data.activeMsg.banner;
            this.contentText = data.data.activeMsg.text.replace(/<p>&nbsp;<\/p>/g,'');
            this.modArr = data.data.userMsg;
        })
        .catch(err => {
            console.log(err);
        })
    },
    methods: {
        // 跳转直播间
        inlive(e){
            var rid = e.target.getAttribute('data-rid');
            common.goRoom(rid); //主播房间id //主播用户id
        },

        // 关注
        attention(e,index) {
            axios.get('/anchorLiveModule/loveAttention', {
                params: {
                    id: e.target.getAttribute('data-id'),
                }
            })
            .then(res => {
                var data = res.data.data;
                if(!data.uid) {
                    return common.goLogin();
                }
                if(data.addAtt) {
                    this.modArr[index]["isAttention"] = true;
                    console.log(this.modArr[index]["isAttention"])
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
    }
});



