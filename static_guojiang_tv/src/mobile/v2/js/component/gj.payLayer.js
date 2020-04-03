import layer from 'layer'
import common from 'common'
import $ from 'webpack-zepto'
import {initPay, goOtherPay} from './gj.initPay.js'
import axios from 'axios'
import keyboard from './gj.keyboard.js'
import report from 'report'

import '../../css/component/gj.payLayer.less'

let customContentFunc = new Function()
let counterNum

/**
 * [goPay description]
 * @Author   smy
 * @DateTime 2017-05-06T18:51:05+0800
 * @param    {int}                 coin  用户余额，单位：克拉
 * @param    {Function}            customContent 自定义说明内容，不传或传空字符串即不显示, 示例：
 *				function customContent(num){
 *					//num为购买的份数 或购买的类型 1,2...
 *					return '<p>' + money*num + '</p>'
 *				}
 * @param    {string}              headlineText   大标题文案， 默认显示 '请选择支付方式'
 * @param    {Boolean}             hasCounter     是否显示计数器， 默认不显示
 * @param    {number}             maxCounter     计数器最大数量，超过则输入不了，结合maxCounterCb, 默认没有限制
 * @param    {float}               unitPrice      每一份的单价，单位：元
 * @param    {array}              eventIds      用于埋点上报的事件ID，[ '微信', '支付宝', 'ios'], 不统计则传空字符串或者为空，比如: ['','ClickAlipayOfSchemeOne']
 * @param    {function}            callback      购买的份数回调,参数为购买的份数
 * @param    {function}            maxCounterCb     增加到最大数量时的回调函数
 * @param    {function}            layerEndCallback   弹框关闭的回调
 * @param    {function}            buyCallback   用余额购买回调的函数
 * @param    {Boolean}             orderPrice    是否用用总价创建订单
 * @param    {function}            getOrderPrice   获取订单总价函数
 */
// 全局记录是否使用苹果支付，提供合适的支付类型
let isIOSAppInVerify = false
let useApplePay = false
let eventIds = []
let orderPrice = 0

exports.goPay = function (opt) {
    let defaults = {
        coin: 0,
        headlineText: '',
        hasCounter: false,
        maxCounter: -1,
        unitPrice: 0,
        eventIds: [],
        useOrderPrice: false,
        getOrderPrice: 0,
        maxCounterCb: function () {},
        customContent: function (num) {},
        callback: function (num) {},
        layerEndCallback: function () {},
        buyCallback: function () {}
    }

    opt = $.extend(defaults, opt)
    // 购买一份的差价，值为正代表余额不足， 值为负代表余额充足
    opt.gapMoney = opt.unitPrice - parseInt(opt.coin) / 100

    // 埋点上报事件数组
    eventIds = opt.eventIds

    // 判断是否跳到其他第三方支付
    // common.showLoading()
    getRechargeNum().then((data) => {
        isIOSAppInVerify = data.isIOSAppInVerify
        useApplePay = data.useApplePay
        // common.hideLoading()

        let isSkipRechargePage = goOtherPay(opt.gapMoney, useApplePay)
        if (isSkipRechargePage || typeof isSkipRechargePage === 'undefined') return

        // 判断是否是苹果审核状态
        if (data.isIOSAppInVerify) {
            layer.open({
                content: `请到“我的个人主页-${data.unit}充值”页面进行充值后再购买哦~`,
                btn: ['确定']
            })
            return
        }

        opt.headlineText = opt.headlineText || '请选择支付方式'

        let layer_content = getContent(opt)
        layer.open({
            content: layer_content,
            type: 1,
            className: 'payLayer',
            end: function () {
                opt.layerEndCallback()
            }
        })

        // 需要重新生成订单
        hasUnpayOrder = 0
        if (opt.hasCounter) {
            initCounter(opt)
            initKeyboard(opt)
        }
    }, (err) => {
        // common.showLoading()
        console.log(err)
    })
}

function getRechargeNum () {
    return new Promise((resolve, reject) => {
        axios.get('/rechargeApp/useApplePay')
            .then(
                (res) => {
                    let data = res.data
                    if (data.errno == 0) {
                        resolve(data.data)
                    }
                },
                (err) => {
                    console.log(err)
                    reject(err)
                }
            )
    })
}

function getContent (opt) {
    let _customContent = ''
    if (opt.customContent && opt.customContent != '') {
        // 默认购买一份或类型为1的商品
        _customContent = opt.customContent(1)
        // 供修改份数或购买类型的时候全局调用
        customContentFunc = opt.customContent
    }

    let headline = '<h4>' + opt.headlineText + '</h4>'

    let counter = opt.hasCounter ? '<div class="counter_wrap"><span class="minus_icon" data-type="-1">－</span><input type="text" value=1 id="countNum"  readonly="readonly"/><span class="add_icon"  data-type="1">＋</span></div>' : ''

    let pay_btn = getPayType(opt, 1)

    let layerui = '<div class="payLayer-ui"><div class="pu2_top">\
					' + headline + '\
					' + counter + '\
					<div class="custom_content_wrap">' + _customContent + '</div></div>\
					<span class="split_line_2"></span>\
					<ul class="pl_paytype_wrap">\
						' + pay_btn + '\
					</ul>\
				</div>'

    return layerui
}
/**
 * 获取支付方式
 * @Author   smy
 * @DateTime 2018-07-12T17:13:10+0800
 * @param    {object}                 opt    支付选项，见初始传值
 * @param    {num}                 buyNum 购买的数量，供计数器的回调
 * @return   {string}                        返回支付方式字符串
 */
function getPayType (opt, buyNum) {
    let isCoinEnough = false

    // 判断余额是否充足
    let gapMoney
    if (opt.useOrderPrice) {
        gapMoney = parseInt(opt.coin) / 100 - opt.getOrderPrice(buyNum)
    } else {
        gapMoney = parseInt(opt.coin) / 100 - opt.unitPrice * parseInt(buyNum)
    }
    if (gapMoney < 0) {
        isCoinEnough = false
    } else {
        isCoinEnough = true
    }

    let pay_btn = ''
    if (isCoinEnough) {
        pay_btn = '<button class="coin_buy_btn">确认购买</button>'
    } else if (isIOSAppInVerify || useApplePay) {
        pay_btn = `<li data-type="iospay">
				<span class="pay_icon pay_ios"></span> Pay
			</li>`
    } else {
        pay_btn = `<li data-type="alipay">
					<span class="pay_icon pay_alipay"></span>
				</li>
				<li data-type="wechat">
					<span class="pay_icon pay_wechat"></span>
				</li>`
    }

    // 初始化支付类型点击事件
    function initBuyType () {
        if ($('.pl_paytype_wrap').length != 0) {
            if (isCoinEnough) {
                // 初始化直接购买点击事件
                initCoinBuy(opt)
            } else {
                // 初始化第三方支付点击事件
                initPay(Math.abs(gapMoney), eventIds)
            }
        } else {
            setTimeout(function () {
                initBuyType()
            }, 100)
        }
    }
    setTimeout(function () {
        initBuyType()
    }, 0)

    return pay_btn
}

/**
 * 初始化余额购买事件
 * @Author   smy
 * @DateTime 2018-07-19T17:34:38+0800
 */
function initCoinBuy (opt) {
    $('.pl_paytype_wrap').off().on('click', '.coin_buy_btn', function () {
        if (!navigator.onLine) {
            layer.open({ time: 3, content: '网络不给力' })
            return false
        }
        layer.closeAll()
        opt.buyCallback()
    })
}

/**
 * 初始化计数器
 * @Author   smy
 * @DateTime 2018-07-20T10:17:12+0800
 * @param    {object}                 opt 初始参数对象
 */
function initCounter (opt) {
    counterNum = 1

    $('.payLayer-ui .counter_wrap span').off().on('click', function () {
        // 需要重新生成订单
        hasUnpayOrder = 0

        let count_type = $(this).data('type')
        if (count_type == -1 && counterNum > 1) {
            counterNum--
        } else if (count_type == 1) {
            counterNum++
        }

        if (parseInt(opt.maxCounter) != -1 && counterNum > parseInt(opt.maxCounter)) {
            // 限制最大数
            counterNum = opt.maxCounter
            opt.maxCounterCb()
            return
        }

        let new_money = opt.gapMoney + opt.unitPrice * (counterNum - 1)
        // 更新要支付的数量
        updateBuyNum(counterNum, new_money.toFixed(2))
        // 更新要购买的数量
        opt.callback(counterNum)

        // 更新支付方式
        updatePayType(opt, counterNum)
    })
}

/**
 * 用于计数器变化后动态更新支付方式
 * @Author   smy
 * @DateTime 2018-07-12T17:53:26+0800
 * @param    {object}                 opt 初始参数
 * @param    {number}                 num 购买份数
 */
function updatePayType (opt, num) {
    let newContent = getPayType(opt, num)
    $('.payLayer-ui .pl_paytype_wrap').html(newContent)
}

function updateBuyNum (num, newmoney) {
    let new_custom_content = customContentFunc(num)
    $('.payLayer-ui .custom_content_wrap').html(new_custom_content)

    $('#countNum').val(num)

    // 存储sessionStorage支付成功后调用
    sessionStorage.setItem('giftPackNum', num)
    // initPay(newmoney, eventIds);
}

/**
 * 初始化键盘
 * @Author   smy
 * @DateTime 2018-07-20T10:17:48+0800
 * @param    {object}                 opt 初始参数
 */
function initKeyboard (opt) {
    $('#countNum').on('click', function () {
        let _this = $(this)

        let maxNum = -1
        if (parseInt(opt.maxCounter) != -1) {
            maxNum = parseInt(opt.maxCounter)
        }

        keyboard({
            placeholder: _this.val(),
            minNum: 1,
            maxNum: maxNum,
            yes: function (num) {
            	counterNum = num

            	let new_money = opt.gapMoney + opt.unitPrice * (parseInt(num) - 1)
                // 更新要支付的数量
                updateBuyNum(num, new_money.toFixed(2))
                // 更新要购买的数量
                opt.callback(num)

                // 更新支付方式
                updatePayType(opt, num)
            }
        })
    })
}
