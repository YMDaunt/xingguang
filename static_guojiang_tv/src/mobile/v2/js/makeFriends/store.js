/*
 * @Date: 2020-01-15 15:15:36
 * @LastEditors  : Jesse
 * @LastEditTime : 2020-02-17 17:30:16
 */
import Vue from 'vue'
import Axios from 'axios'
import layer from 'layer'
import '../../css/makeFriends/store.less'

new Vue({
    el: '#app',
    data: {
        currentProduct: {}, // 当前正购买的商品
        showPopup: false,
        balance: 0, // 当前用户金币余额
        showPreview: false,
        previewUrl: '',
        productList: []
    },
    created () {
        this.getProductList()
    },
    methods: {
        getProductList () {
            Axios.get('/mfUser/backgroundList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.productList = data.data.list
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
        preview (url) {
            this.showPreview = true
            this.previewUrl = url
        },
        async toBuy (item) {
            this.currentProduct = item
            const res = await this.getBalance()
            const data = res.data
            if (data.errno === 0) {
                this.balance = data.data.info.mfCoin
                this.showPopup = true
            } else {
                layer.open({
                    content: data.msg,
                    time: 3
                })
            }
        },
        // 获取余额
        getBalance () {
            return new Promise((resolve, reject) => {
                Axios.get('/income/getSocialExchangeList')
                    .then((res) => {
                        resolve(res)
                    }).catch((err) => {
                        reject(err)
                    })
            })
        },
        cancel () {
            this.currentProduct = {}
            this.showPopup = false
        },
        sureToBuy (id) {
            Axios.post('/mfUser/buyBackground', `id=${id}`)
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.getProductList()
                        this.showPopup = false
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
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
        use (item) {
            Axios.post('/mfUser/useBackground', `id=${item.id}`)
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        try {
                            gBridge.useBackground(data.data.url)
                            this.getProductList()
                        } catch (e) {
                            alert(e.name + ':' + e.message)
                        }
                        layer.open({
                            content: '设置成功',
                            skin: 'msg',
                            time: 3
                        })
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
