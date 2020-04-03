/**
 * 支付类型弹框，从底部弹起
 * @Author   smy
 * @DateTime 2018-08-08T12:51:56+0800
 * 应用场景：
 * 1. 首冲页面
 *
 * 参数：
 * 1. money: 下单金额
 * 2. eventIds: array 用于埋点上报在什么渠道下的支付
 * ['微信', '支付宝', 'ios'], 不统计则传空字符串或者为空，比如: ['','ClickAlipayOfSchemeOne']
 */
import '../../css/component/gj.payType.less'
import {initPay, goOtherPay} from './gj.initPay.js'
import common from 'common'
import axios from 'axios'
import layer from 'layer'
import report from 'report'

export function goBottomLayerPay (money, eventIds) {
    // 判断是否跳到其他第三方支付
    // common.showLoading()
    getRechargeNum().then((data) => {
        let isIOSAppInVerify = data.isIOSAppInVerify
        let useApplePay = data.useApplePay
        // common.hideLoading()

        // 华为支付
        let isSkipRechargePage = goOtherPay(money, useApplePay)
        if (isSkipRechargePage || typeof isSkipRechargePage === 'undefined') return

        // 判断是否是苹果审核状态
        if (isIOSAppInVerify) {
            layer.open({
                content: '请到“我的个人主页-克拉充值”页面进行充值后再购买哦~',
                btn: ['确定']
            })
            return
        }

        // 苹果充值页充值
        if (useApplePay && common.getPlatformType() == 'ios_webview') {
            // 记录支付方式，供支付完成后用于埋点统计
            window.sessionStorage['noviceWelfarePayType'] = 'iospay'

            // 埋点上报
            if (eventIds && eventIds[2]) {
                report.stat(eventIds[2])
            }

            try {
                console.log('gBridge.recharge is called. useApplePay: ' + useApplePay)
                gBridge.recharge()
            } catch (e) {
                alert(e.name + ': ' + e.message)
            }
            return
        }

        // 调起微信支付宝支付弹框
        showBottomPayLayer(money, eventIds)
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

export function showBottomPayLayer (money, eventIds) {
    const platform = common.getPlatformType()
    // 插入充值方式选项
    var _alipayList = `<li class="clearfix" data-type="alipay">
                                  <span class="alipay_icon fl"></span>
                                  <span class="arrow fr"></span>
                              </li>`

    var _wechatList = `<li class="clearfix" data-type="wechat">
                                  <span class="wechat_icon fl"></span>
                                  <span class="arrow fr"></span>
                              </li>`

    var _payTypeList = platform == 'wechat' ? (_wechatList) : (_alipayList + _wechatList)

    let payListHtml = `<span class="mask"></span>
                              <div class="pb_content fadeIn">
                                  <h3>请选择支付方式<span><i></i></span></h3>
                                  <ul class="pl_paytype_wrap"> ${_payTypeList}</ul>
                              </div>`

    let wrap = document.createElement('div')
    wrap.className = 'pay_bottom_layer'
    wrap.innerHTML = payListHtml

    // 加载样式之后吊起选择面板
    let payBottomLayer = document.querySelector('.pay_bottom_layer')

    if (!payBottomLayer) {
        document.querySelector('body').appendChild(wrap)
    } else {
        payBottomLayer.style.display = 'block'
    }
    initPayEvent(money, eventIds)
}

function initPayEvent (money, eventIds) {
    let payBottomLayer = document.querySelector('.pay_bottom_layer')
    if (payBottomLayer) {
        if(location.href.indexOf('makeFriends')>=0){
            //社交包传金额
            initPay(money, eventIds, 'noPayId')
        }else{
            initPay(money, eventIds, undefined)
        }
        initPayLayerClose()
    } else {
        clearTimeout(timeout)
        var timeout = setTimeout(function () {
            initPayEvent()
        }, 50)
    }
}

function initPayLayerClose () {
    // 初始化关闭事件
    let domClose = document.querySelector('.pay_bottom_layer h3 span')
    let domMask = document.querySelector('.pay_bottom_layer .mask')

    if (domClose) {
        domClose.removeEventListener('click', closeBottomPayLayer)
    }
    if (domMask) {
        domMask.removeEventListener('click', closeBottomPayLayer)
    }

    domClose.addEventListener('click', closeBottomPayLayer)
    domMask.addEventListener('click', closeBottomPayLayer)
}

export function closeBottomPayLayer () {
    document.querySelector('.pay_bottom_layer').style.display = 'none'
}

export default {
    showBottomPayLayer,
    closeBottomPayLayer,
    goBottomLayerPay
}
