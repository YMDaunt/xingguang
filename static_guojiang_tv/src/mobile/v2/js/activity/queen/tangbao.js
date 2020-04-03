'use strict'

import Vue from 'vue'
import axios from 'axios'
import common from 'common'
import PolyfillScroll from '../../component/gj.polyfillScroll'

import '../../../css/activity/queen/tangbao.less'

// const ENV = 'dev'; // production
// const config = {
//     mid: ENV === 'dev' ? '1389908' : '14827075',
//     rid: ENV === 'dev' ? '44445294' : '956606'
// };
const config = {
    mid: '14827075',
    rid: '956606'
}

const DEFAULT_LIST = {
    'headPic': '',
    'nickname': '暂无',
    'score': '0'
}

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
        listThrone () {
            let res = this.blist.slice(0, 3)
            // if (res.length === 0) {
            //     return [DEFAULT_LIST, DEFAULT_LIST, DEFAULT_LIST];
            // }
            // if (res.length === 1) {
            //     res.push(DEFAULT_LIST);
            //     res.push(DEFAULT_LIST);
            // }
            // if (res.length === 2) {
            //     res.push(DEFAULT_LIST);
            // }
            return res
        },
        listLefed () {
            return this.blist.slice(3)
        }
    },
    mounted: function () {
        // pc / mobile 重定向
        this.adaptation()

        this.initScroll()

        this.getListData()
    },
    methods: {
        // 适配机型重定向
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
        goToRoom () {
            common.goRoom(config.rid)
        },
        listRender (data) {
            this.blist.push(...data.ranks)
        },
        /* Service Ajax */
        getListData () {
            if (!this.hasNextPage) {
                console.log('没有下一页数据了~')
                return
            }

            if (this.loadListState) {
                console.log('正在加载上一页，请稍等~')
                return
            }

            let query = '&page=' + this.currPage + '&pageSize=' + this.currPageSize

            this.loadListState = true
            // axios.get('http://localhost:3002?' + query.slice(1))
            axios.get('/ChenChen/getRank?tag=u' + query)
                .then((res) => {
                    res = res.data
                    if (res.errno === 0) {
                        this.listRender(res.data)

                        this.hasNextPage = res.data.hasNext
                        this.currPage++
                        this.loadListState = false
                    } else {
                        console.log(res.msg)
                    }
                })
        },
        // getLeftListData (pageSum) {
        //     let urls = [];
        //     for(let i=2, len=pageSum; i<=len; i++) {
        //         urls.push(axios.get('/ChenChen/getRank?tag=m&page=' + i));
        //     }
        //     Promise.all(urls)
        //         .then(allRes => {
        //             let items = allRes.map((value) => {
        //                 if (value.errno !== 0) {
        //                     return value.data;
        //                 } else {
        //                     console.log(value.msg);
        //                     return [];
        //                 }
        //             });
        //             this.listRender([].concat(items));
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         });
        // },
        initScroll () {
            var ele = document.querySelector('.bill-list')
            var bh = 150
            var _self = this
            ele.addEventListener('scroll', function () {
                ele.scrollTop
                var toBottomH = ele.scrollHeight - ele.scrollTop - ele.clientHeight
                if (toBottomH < bh) {
                    _self.getListData()
                }
            }, false)
        }
    }
})
