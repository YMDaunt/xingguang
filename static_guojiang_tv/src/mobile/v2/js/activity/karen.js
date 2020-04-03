'use strict';

import Vue from 'vue';
import axios from 'axios';
import common from 'common';

import '../../css/activity/karen.less';
 
var config = {
    mid: '10091464',
    rid: '847708'
};

new Vue({
    el: '#app',
    data: {
        blist: [],
        currPage: 1,
        currPageSize: 20,
        hasNextPage: true,
        loadListState: false
    },
    computed: {
        listThrone() {
            let res = this.blist.slice(0, 3);
            if (!res[0]) {
                res[0] = {};
            }
            if (!res[1]) {
                res[1] = {};
            }
            if (!res[2]) {
                res[2] = {};
            }
            return res;
        },
        listLefed() {
            return this.blist.slice(3);
        }
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
        goToRoom() {
            common.goRoom(config.rid);
        },
        listRender(data) {
            this.blist.push(...data.ranks); 
        },
        /* Service Ajax */
        getListData() {
            if (!this.hasNextPage) {
                console.log('没有下一页数据了~');
                return;
            }

            if (this.loadListState) {
                console.log('正在加载上一页，请稍等~');
                return;
            }

            let query = '&page=' + this.currPage + '&pageSize=' + this.currPageSize;

            this.loadListState = true;
            axios.get('/ChenChen/getRank?tag=u' + query)
                .then((res) => {
                    res = res.data;
                    if (res.errno === 0) {
                        this.listRender(res.data);

                        this.hasNextPage = res.data.hasNext;
                        this.currPage++;
                        this.loadListState = false;
                    } else {
                        console.log(res.msg);
                    }
                });
        },
        initScroll() {
            var ele = this.$refs.billlist;
            var bh = 150;
            var _self = this;
            ele.addEventListener('scroll', function() {
                var toBottomH = ele.scrollHeight - ele.scrollTop - ele.clientHeight;
                if (toBottomH < bh) {
                    _self.getListData();
                }
            }, false);
        }
    },
    mounted: function() {
        // pc / mobile 重定向
        this.adaptation();

        this.initScroll();

        this.getListData();
    }
});
