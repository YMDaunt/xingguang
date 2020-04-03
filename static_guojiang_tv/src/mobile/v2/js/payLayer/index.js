/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:53:39
 */
/* eslint-disable */
import common from 'common'
import payLayer from '../component/gj.payLayer.js'

const querystring = require('querystring')

// 支付成功之后回调函数
window.payResultCallback = function (code, errMsg) {
    layer.closeAll()
    common.closeWebview()
}

// 提供给app调用的支付方法
let goPay = function (opt) {
    var defaults = {
        title: '请支付',
        unitPrice: 0,
        coin: 0
    }
    opt = extend(defaults, opt)

    let gapCoin = parseFloat(opt.unitPrice) * 100 - parseInt(opt.coin)
    payLayer.goPay({
        gapMoney: gapCoin / 100,
        unitPrice: opt.unitPrice,
        headlineText: opt.title,
        customContent: function () {
            return `<div class="pl_custom">
						<p>当前余额：${opt.coin} 克拉</p>
						<p>还差 ${gapCoin} 克拉 ￥ ${gapCoin / 100} </p>
					</div>`
        },
        layerEndCallback: function () {
            common.closeWebview()
        }
    })
}

let urlParams = querystring.parse(decodeURIComponent(location.search).replace(/(^\?)|(\s)/g, ''))
goPay({
    title: urlParams['title'],
    unitPrice: urlParams['unitPrice'],
    coin: urlParams['coin']
})
