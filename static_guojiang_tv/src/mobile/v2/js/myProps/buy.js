import '../../css/myProps/buy.less'
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'
import payLayer from '../component/gj.payLayer.js?v=0503'

window.vm = _vm
let _vm = new Vue({
    el: 'article',
    data: {
        isReadyBuy: false,
        clickIndex: -1,
        cardNum: '--',
        coin: 0,
        isIOSAppInVerify: false,
        cardsInfo: {}
    },
    mounted: function () {
        this.$nextTick(function () {
            // _vm.getCardNum()
        })
    },
    methods: {
        getCardNum: function () {
            common.showLoading()

            axios.get('/myProps/GetUserInfo')
                .then(function (res) {
                    common.hideLoading()
                    _vm.isReadyBuy = true

                    let data = res.data
                    if (data.errno == -100) {
                        common.goLogin()
                    } else if (data.errno == 0) {
                        _vm.cardNum = data.data.num
                        _vm.coin = data.data.coin
                        _vm.isIOSAppInVerify = data.data.isIOSAppInVerify

                        for (var key in data.data.cardsInfo) {
                            _vm.cardsInfo[key] = data.data.cardsInfo[key]
                        }

                        localStorage.uid = data.data.uid

                        console.log(data.data.coin)
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 2
                        })
                    }
                }, function (err) {
                    console.log(err)
                })
        },

        readyBuy: function (cardType) {
            if (!_vm.isReadyBuy) return

            _vm.clickIndex = cardType

            if (_vm.coin >= _vm.cardsInfo[cardType]) {
                // 余额直接购买
                _vm.showAffirmLayer(cardType)
            } else {
                if (_vm.isIOSAppInVerify) {
                    layer.open({
                        content: '请到“我的个人主页-泡泡充值”页面进行充值后再购买哦~',
                        btn: ['确定']
                    })
                    return
                }

                // 充值购买
                let gap_coin_default = _vm.cardsInfo[cardType] - parseInt(_vm.coin)
                payLayer.goPay({
                    gapMoney: gap_coin_default / 100,
                    unitPrice: _vm.cardsInfo[cardType] / 100,
                    customContent: function (num) {
                        let gap_coin = _vm.cardsInfo[cardType] - parseInt(_vm.coin) + _vm.cardsInfo[cardType] * (parseInt(num) - 1)

                        return `<div class="pl_custom">
								<p>当前余额：${_vm.coin} 泡泡</p>
								<p>还差 ${gap_coin} 泡泡 ￥ ${gap_coin / 100} </p>
							</div>`
                    }
                })
            }

            try {
                gBridge.onEvent('clickBuyButtonInMyPropPage', '{}')
            } catch (e) {}
        },

        showAffirmLayer: function (cardType) {
            layer.open({
                content: '确定购买' + cardType + '张私信卡？',
                btn: ['确定', '取消'],
                yes: function (index) {
                    _vm.buyMessageCard(cardType)
                    layer.close(index)
                },
                no: function () {}
            })
        },

        buyMessageCard: function (cardType) {
            axios.get('/myProps/BuyMessageCard', {
                params: {
                    num: cardType
                }
            })
                .then(function (res) {
                    let data = res.data
                    if (data.errno == -100) {
                        common.goLogin()
                    } else if (data.errno == 0) {
                        _vm.coin = JSON.parse(_vm.coin) - _vm.cardsInfo[cardType]
                        _vm.cardNum = JSON.parse(_vm.cardNum) + JSON.parse(cardType)

                        console.log(_vm.coin)
                        layer.open({
                            content: '恭喜您获得' + cardType + '张私信卡，快去和主播畅聊升温感情吧',
                            btn: ['确定']
                        })

                        // 刷新app余额和数量
                        try {
			        	gBridge.updateMyInfo('{"coin":' + _vm.coin + ', "messageCardNum":' + _vm.cardNum + '}')
			        } catch (e) {}
                    } else if (data.errno == 106) {
                        layer.open({
                            content: '余额不足，可能是充值未到账，请联系客服',
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
        }

    }
})
