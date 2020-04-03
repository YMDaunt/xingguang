// 在loader里面完成less的编译
import '../../../css/activity/queen/yingmeng.less'

// 通用库类的引用
import common from 'common'
import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import PolyfillScroll from '../../component/gj.polyfillScroll.js'
import layer from 'layer'

new Vue({
    el: '#app',
    data: {
        userRank: [],
        userPage: 0,
        scrollLock: false
    },
    created: function () {

    },
    mounted: function () {
    	this.initScrollLoadUser()
    },
    methods: {
    	// 跳转直播
    	inlive () {
    		var rid = 10841945
            // var rid = 1389908;  // 测试
            window.open('/' + rid) // 主播用户id
    	},

        initScrollLoadUser () {
            let that = this
            axios.get('/YingMengActivity/GetUserRank', {
                params: {
                    page: that.userPage
                }
            })
                .then(res => {
                    const data = res.data
                    const _data = data.data.useranks
                    if (_data.length > 0) {
                        that.userRank = that.userRank.concat(_data)
                        that.scrollLock = false
                        if (!that.transformEntity) {
                            Vue.nextTick(() => {
                                const sortWrapElement = document.querySelector('.other-cover')
                                console.log(sortWrapElement)
                                const sortWrapHeight = parseFloat(window.getComputedStyle(sortWrapElement, null).getPropertyValue('height'))
                                const sortListElement = document.querySelector('.scroll-elem')
                                that.transformEntity = new PolyfillScroll({
                                    scrollWrap: '.other-cover',
                                    scrollContent: '.scroll-elem',
                                    cb: function (distance) {
                                        const sortListHeight = parseFloat(window.getComputedStyle(sortListElement, null).getPropertyValue('height'))
                                        console.log(sortListHeight)
                                        if (sortListHeight - sortWrapHeight - (Math.abs(distance)) < 200) {
                                            if (that.scrollLock) return
                                            that.scrollLock = true
                                            that.userPage++
                                            that.initScrollLoadUser(that.userPage)
                                        }
                                    },
                                    bar: {
                                        width: '10px',
                                        height: '80px',
                                        right: '2px',
                                        'background': 'rgba(0,0,0,0.3)'
                                    }
                                })
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})
