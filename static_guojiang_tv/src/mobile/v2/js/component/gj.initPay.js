import layer from 'layer'
import common from 'common'
import $ from 'webpack-zepto'
import report from 'report'

var platform = common.getPlatformType()
var appChannel = common.getChannel()

var recharge_flag = 1
// 防止连击产生多次请求

var rcId

var rcOrderNum

var old_money

window.hasUnpayOrder = 0 // 标志是否已经生成订单

/**
 * 初始化创建订单和调起支付
 * {array} eventIds: 用于埋点上报在什么渠道下的支付
 * ['微信', '支付宝', 'ios'], 不统计则传空字符串或者为空，比如: ['','ClickAlipayOfSchemeOne']
 */

function initPay (money, eventIds, hasPayId) {
    // 保留两位小数
    var temMoney = new Number(money)
    money = temMoney.toFixed(2)

    if (old_money != money) {
        hasUnpayOrder = 0
    }
    old_money = money
    $('.pl_paytype_wrap').off().on('click', 'li', function () {
        if (!navigator.onLine) {
            layer.open({ time: 3, content: '网络不给力' })
            return false
        }
        var type = $(this).data('type')

        if (!recharge_flag) return
        recharge_flag = 0

        if (hasUnpayOrder) {
            // 如果有未支付订单，直接支付此订单
            startPay(type, rcId, rcOrderNum)
        } else {
            // 用于埋点统计，上报事件名
            if (typeof (eventIds) !== 'undefined') {
                reportEventId(eventIds, type)
            }

            if (hasPayId === 'noPayId') {
                startPay(type, money) // 只传money充值
            } else {
                var ajaxData = {money: money}

                // 生成订单请求链接
                var ajax_url = '/recharge/createOrder'

                $.ajax({
                    url: ajax_url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: ajaxData,
                    beforeSend: function () {
                        // common.showLoading();
                    },
                    success: function (data) {
                        // common.hideLoading();

                        var data = JSON.parse(data)
                        if (data.errno == -100) {
                            common.goLogin()
                        } else if (data.errno == 0) {
                            // 全局保存订单信息
                            rcId = data.data.payId
                            rcOrderNum = data.data.payOrderNum
                            hasUnpayOrder = 1

                            startPay(type, rcId, rcOrderNum)

                            // 存储订单信息，支付成功后回调
                            localStorage.payMoney = money
                            localStorage.orderId = rcId

                            // 创建订单成功，调用app统计
                            try {
                                gBridge.onEvent('__submit_payment', '{"userid": "' + localStorage.uid + '","orderid": ' + rcId + ',"item":"生成订单","amount": ' + money + ' }')
                            } catch (e) {
                            }
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                            recharge_flag = 1
                        }
                    }
                })
            }
        }

        // cnzz统计
        _czc.push(['_trackEvent', 'payLayer充值' + type, '充值类型'])
    })
}

/**
 * 获取创建订单时的eventid 以及 上报点击支付方式的事件, 并存储支付方式供支付完成后使用
 * @Author   smy
 * @DateTime 2018-07-16T15:48:26+0800
 * @param    {array}                 eventIds [description]
 * @param    {string}                 type     支付方式
 * @return   {string}                 返回用于埋点的事件id
 */
function reportEventId (eventIds, type) {
    var eventId = ''
    if (type == 'wechat') {
        eventId = eventIds[0]
    } else if (type == 'alipay') {
        eventId = eventIds[1]
    } else if (type == 'iospay') {
        eventId = eventIds[2]
    }

    if (eventId && eventId != '') {
        report.stat(eventId)
    }
    // 记录支付方式，供支付完成后用于埋点统计
    window.sessionStorage['noviceWelfarePayType'] = type
}

function startPay (type, payId) {
    if (platform == 'android_webview' || platform == 'ios_webview') {
        goNativePay(type, payId)
    } else {
        goWebPay(type, payId)
    }
}

function goNativePay (type, payId) {
    if (/android/i.test(navigator.userAgent) && type == 'alipay') {
    	try {
       		gBridge.alipay(payId)
       	} catch (e) {
            alert(e.name + ': ' + e.message)
        }
    } else if (/android/i.test(navigator.userAgent) && type == 'wechat') {
        try {
        	recharge.toPay(payId)
        } catch (e) {
            alert(e.name + ': ' + e.message)
        }
    } else if (/iPhone|iPod|iPad/i.test(navigator.userAgent) && type == 'alipay') {
       	try {
        	if (isIosNewVersion()) {
                gBridge.aUGF5(payId)
            } else {
                gBridge.alipay(payId)
            }
        } catch (e) {
            alert(e.name + ': ' + e.message)
        }
    } else if (/iPhone|iPod|iPad/i.test(navigator.userAgent) && type == 'wechat') {
        try {
        	if (isIosNewVersion()) {
                gBridge.wUGF5(payId)
            } else {
                gBridge.wxPay(payId)
            }
        } catch (e) {
            alert(e.name + ': ' + e.message)
        }
    } else if (/iPhone|iPod|iPad/i.test(navigator.userAgent) && type == 'iospay') {
        try {
        	gBridge.recharge()
        } catch (e) {
            alert(e.name + ': ' + e.message)
        }
    }

    recharge_flag = 1
}

function goWebPay (type, payId) {
    if (type == 'alipay') {
        location.href = '/recharge/alipay/pay_id/' + payId + '/platform/webApp?callback=' + encodeURIComponent(location.href)
    } else if (type == 'wechat') {
        if (platform == 'wechat') {
            goWxpay(payId)
        } else {
            goOutWxpay(payId)
        }
    }
}

function goOutWxpay (payId) {
    $.ajax({
        url: '/recharge/BeecloudWxpayOut/payId/' + payId + '/platform/webApp?callback=' + encodeURIComponent(location.href),
        type: 'GET',
        dataType: 'JSON',
        beforeSend: function () {
            common.showLoading()
        },
        success: function (data) {
            common.hideLoading()

            if (typeof data === 'string') data = JSON.parse(data)

            if (data.errno == 0) {
                location.href = data.data.url
            } else {
                layer.open({
                    content: data.msg,
                    time: 2
                })
            }
        }
    })
}

function goWxpay (payId) {
    $.ajax({
        url: '/recharge/WxPay/pay_id/' + payId + '/platform/webApp',
        type: 'get',
        dataType: 'json',
        beforeSend: function () {
            common.showLoading()
        },
        success: function (ret) {
        	if (typeof ret === 'string') ret = JSON.parse(ret)

            if (ret.errno == 0) {
                common.hideLoading()
                recharge_flag = 1

                function onBridgeReady () {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                    	'appId': ret.data.appId, // 公众号名称，由商户传入
                    	'timeStamp': '' + ret.data.timeStamp + '', // 时间戳，自1970年以来的秒数
                    	'nonceStr': ret.data.nonceStr, // 随机串
                    	'package': ret.data.package,
                    	'signType': ret.data.signType, // 微信签名方式：
                    	'paySign': ret.data.sign // 微信签名
                        },
                        function (res) {
	                   if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        	common.showLoading()
                                // 定时获取支付结果
                        	var payResIntvar = setInterval(function () {
                        		$.ajax({
                        			url: '/recharge/WxPayResult/tradeno/' + payId,
                        			dataType: 'json',
                        			success: function (ret) {
				                        if (typeof ret === 'string') ret = JSON.parse(ret)

                        				if (ret.errno == 0) {
                        					common.hideLoading()
                        					clearInterval(payResIntvar)
                        					// 用于购买大保健支付成功后的购买操作
                                                document.cookie = 'rechargeSucc=1;domain=.' + location.host.replace(/^m\./, '') + ';path=/'
                                                location.reload()
                        				}
                        			}
                        		})
                        	}, 2000)
                                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。//因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面
	                   } else if (res.err_code == '3') {
                        	var html = '<p style="text-align:center;width:100%;">长按识别二维码继续支付</p><img src="http://static.guojiang.tv/mobile/img/common/tuhao/th_pay.png?v=0978366cb4"/>'
                        	layer.open({
                        		content: html,
                        		shadeClose: false,
                        		btn: ['刷新本页'],
                        		yes: function () {
                        			location.reload()
                        		}
                        	})
                    	}
                        }
                    )
                }
                if (typeof WeixinJSBridge === 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                    }
                } else {
                    onBridgeReady()
                }
            } else {
                // $('#register-captcha').click();
                recharge_flag = 1
                alert(ret.msg)
                common.hideLoading()
            }
        }
    })
}

var payResIntvar
function getPayResult (rechargeId, callback) {
    // 定时获取支付结果

    // 设置超时时间为20分钟
    var timeout = 20 * 60

    var queryTime = 0

    clearInterval(payResIntvar)
    payResIntvar = setInterval(function () {
        // 查询时间累计
        queryTime += 2
        if (queryTime > timeout) {
            clearInterval(payResIntvar)
            return
        }

        $.ajax({
            url: '/recharge/PayResult/rechargeId/' + rechargeId,
            dataType: 'json',
            success: function (ret) {
                if (ret.errno == 0 && ret.data.status == 1) {
                    clearInterval(payResIntvar)

                    $('.wechat_pay_success').show()
                        .siblings('.wechat_pay_article').hide()
                        .siblings('.wechat_pay_wait').hide()

                    setTimeout(function () {
                        layer.close(payTypeLayer)
                        layer.close(wxPayLayer)
                    }, 2000)

                    // 支付成功后的回调
                    callback(buyNum)
                }
            }
        })
    }, 2000)
}

var version = common.getVersion()

var gjpackage = common.getPackageId()

var versionNum = parseInt($.trim(version).replace(/\./g, ''))

function isIosNewVersion () {
    // ios版本是否大于等于2.8.5，使用新支付接口
    return (versionNum >= 285 || (versionNum == 265 && gjpackage == '0')) && platform == 'ios_webview'
}

/**
 * 跳转到其他充值方式：华为, vivo 苹果
 * ios, 包13 以及3.1.5版本以上的包2跳到苹果支付
 * 渠道and-huawei-3弹出华为支付
 * @Author   smy
 * @DateTime 2017-06-07T17:04:48+0800
 * @param    {num}                 money 需要支付的金额
 * @param    {num}                 rechargeCount 已充值订单数
 * @return   {boolean}             true: 跳转其他支付方式  false: 不跳转到其他充值方式
 */
function goOtherPay (money, useApplePay) {
    var appChannel = common.getChannel()

    if (platform == 'android_webview' && (appChannel == 'and-huawei-4' || (appChannel == 'and-huawei-2' && versionNum >= 441)) && versionNum < 512) {
        // 华为渠道支付
        try {
            console.log('recharge.hmsPay is called: ' + money)
            recharge.hmsPay(money)
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
        return true
    } else if (platform == 'android_webview' && appChannel == 'and-hwly-cps-7') {
        // 去原生华为充值页
        try {
            console.log('gBridge.toHWRecharge is called:')
            gBridge.toHWRecharge()
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
        return true
    } else if (platform === 'android_webview' && appChannel === 'and-vivo.lianyun-24') {
        // vivo渠道支付
        try {
            console.log('gBridge.vivoAliPay is called: ' + money)
            gBridge.vivoPay(money)
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
        return true
    } else {
        return false
    }
    /* else if(platform == 'ios_webview' && useApplePay){
		setTimeout(function(){
            //特殊渠道为了增加苹果支付流水，防查
			try{
				console.log('gBridge.recharge is called. useApplePay: ' + useApplePay );
				gBridge.recharge();
			}catch(e){
				alert(e.name+':'+e.message);
			}
			return true;
		}, 300);
	} */
}

export {initPay, goOtherPay}
