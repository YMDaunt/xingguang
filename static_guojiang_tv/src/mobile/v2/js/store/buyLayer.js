/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 15:51:54
 */
/* eslint-disable */
import '../../css/store/buyLayer.less'
import layer from 'layer'
import axios from 'axios'
import $ from 'webpack-zepto'
import {goLogin, getUnit, refreshAppInfo, getVersion} from 'common'
import {initPay, goOtherPay} from '../component/gj.initPay.js'

let buyList = [{days: 30, text: '1个月', money: '', desc: '注：1个月按30天计算'},
    {days: 365, text: '1年', money: '', desc: '注：1年按365天计算'}]
let myCoin = 0
let isCoinEnough
let pid, buyDays, pName, buyCost, vpid // 购买商品和座驾的id和购买的天数以及购买商品的名字
let buyCallback, isReBuy, gapMoney
// 全局记录是否使用苹果支付，提供合适的支付类型
let isIOSAppInVerify = false
let useApplePay = false
let unit = getUnit()

exports.buy = function (opt) {
    let defaults = {
        pid: '',
        vpid: '',
        pName: '',
        coin: '',
        cost: '',
        buyArr: [],
        callback: null,
        isReBuy: false
    }
    opt = $.extend(defaults, opt)

    // 判断是否跳到其他第三方支付
    getRechargeNum().then((data) => {
        isIOSAppInVerify = data.isIOSAppInVerify
        useApplePay = data.useApplePay

        // 继续显示支付弹框
        myCoin = opt.coin
        pid = opt.pid
        vpid = opt.vpid
        pName = opt.pName
        buyCost = opt.cost
        isCoinEnough = app.getIsCoinEough(opt.cost)
        buyCallback = opt.callback
        isReBuy = opt.isReBuy

        // 初始化购买天数
        if (opt.buyArr.length == 0) {
            buyList[0].money = opt.cost
            buyList[1].money = opt.cost * 12
        } else {
            buyList = app.formatBuylist(opt.buyArr)
        }
        console.log(buyList)
        buyDays = buyList[0]['days']

        // 判断是否
        if (!isCoinEnough) {
            // 判断是否是苹果审核状态
            if (data.isIOSAppInVerify) {
                layer.open({
                    content: `请到“我的个人主页-充值${unit}”页面进行充值后再购买哦~`,
                    btn: ['确定']
                })
                return
            }

            let needPay = parseInt(buyCost) - parseInt(myCoin)
            let isSkipRechargePage = goOtherPay(needPay / 100, data.useApplePay)
            if (isSkipRechargePage || typeof isSkipRechargePage === 'undefined') return
        }

        let _layer_content = app.getContent(0)

        layer.open({
            content: _layer_content,
            type: 1,
            className: 'payLayer'
        })

        app.init()
    }, (err) => {
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

let app = {
    init () {
        app.initTypeSelect()
        initPay(gapMoney)
    },
    formatBuylist (obj) {
        let buyList = []
        for (let val in obj) {
            switch (true) {
            case val < 30:
                buyList.push({days: `${val}`, text: `${val}天`, money: `${obj[val]}`, desc: ''})
                break
            case val >= 30 && val < 365:
                buyList.push({days: `${val}`, text: '1个月', money: `${obj[val]}`, desc: '注：1个月按30天计算'})
                break
            case val >= 365:
                buyList.push({days: `${val}`, text: '1年', money: `${obj[val]}`, desc: '注：1年按365天计算'})
                break
            }
        }

        return buyList
    },
    getContent (type) {
        let buyList_html = ''
        buyList.forEach(function (val, index) {
            let active_class = type == index ? 'active' : ''
            buyList_html += `<li class="${active_class}"
								data-index="${index}"
								data-money="${val['money']}">
							${val['text']}<span class="check_icon"></span>
							</li>`
        })

        let _customContent = app.getContentDesc(type)

        let _pay_type_content = app.getPayTypeContent()

        let layerui = `<div class="payLayer-ui-2">
			<div class="pu2_top">
				<h4>购买座驾</h4>
				<ul class="buy_list">${buyList_html}</ul>
				<div class="custom_content_wrap">${_customContent}</div>
			</div>
			<span class="split_line_2"></span>
			<ul class="pl_paytype_wrap">
				${_pay_type_content}
			</ul>
		</div>`

        return layerui
    },
    getPayTypeContent () {
        if (isCoinEnough) {
            return '<button onclick="app.goBuy()">确认购买</button>'
        } else if (isIOSAppInVerify || useApplePay) {
            return `<li data-type="iospay">
					<span class="pay_icon pay_ios"></span> Pay
				</li>`
        } else {
            return `<li data-type="alipay">
					<span class="pay_icon pay_alipay"></span>
				</li>
				<li data-type="wechat">
					<span class="pay_icon pay_wechat"></span>
				</li>`
        }
    },
    getContentDesc (type) {
        let type_desc = buyList[type]['desc']

        let price = buyList[type]['money']

        let gap_coin = parseInt(price) - parseInt(myCoin)

        gapMoney = gap_coin / 100
        buyCost = price

        let gapCoinDesc = isCoinEnough ? '' : `<p>还差:￥${gapMoney}<small>(${gap_coin}${unit})</small> </p>`
        return `<small>${type_desc}</small>
				<h5>应付金额：<span>${price}${unit}</span></h5>
				<p>当前余额：${myCoin} ${unit}</p>
				${gapCoinDesc}
				`
    },
    getIsCoinEough (cost) {
        return parseInt(myCoin) >= parseInt(cost)
    },
    initTypeSelect () {
        let lis = $('.payLayer-ui-2 .buy_list li')
        lis.on('click', function () {
            lis.removeClass('active')
            $(this).addClass('active')

            // 重新获取购买信息和支付方式
            let _index = $(this).data('index')
            isCoinEnough = app.getIsCoinEough(buyList[_index]['money'])

            let _content_desc = app.getContentDesc(_index)

            let _pay_type_content = app.getPayTypeContent()

            document.querySelector('.payLayer .custom_content_wrap').innerHTML = _content_desc
            document.querySelector('.payLayer .pl_paytype_wrap').innerHTML = _pay_type_content

            buyDays = buyList[_index]['days']
            initPay(gapMoney)
        })
    },
    goBuy (isPay) {
        let isThirdPay = !!isPay

        axios.get('/store/buyVehicle', {
            params: {
                pid,
                buyDays
            }
        })
            .then(
                (res) => {
                    let data = res.data

                    if (data.errno == 0) {
                        // 刷新app余额
                        let myRemainCoin = isPay ? 0 : parseInt(myCoin) - parseInt(buyCost)
                        refreshAppInfo({'coin': myRemainCoin})

                        layer.closeAll()

                        if (isReBuy) {
                            // 续期成功
                            layer.open({
                                content: `恭喜您成功续期${pName}座驾`,
                                skin: 2,
                                btn: ['朕知道了']
                            })

                            buyCallback(buyDays, isThirdPay)
                        } else {
                            let version = getVersion()
                            let versionNum = parseInt(version.replace(/\./g, ''))
                            let targetPage = versionNum >= 500 ? '我的座驾' : '我的背包-座驾'

                            let content_1 = vpid == 10001 ? `成功获得${pName}，您也可以到“${targetPage}”页面选择使用装备哦` : `成功获得${pName}座驾，您也可以到“${targetPage}”页面选择使用装备哦`
                            // 商城首页购买成功
                            layer.open({
                                title: '恭喜您',
                                content: content_1,
                                btn: ['开始装备', '取消'],
                                shadeClose: false,
                                skin: 2,
                                yes: function (e) {
                                    app.goUse()
                                    layer.close(e)
                                },
                                no: function (e) {
                                    let content_2 = vpid == 10001 ? `您可以去“我的-${targetPage}”页面使用隐身进场哦~` : `您可以去“我的-${targetPage}”页面使用该座驾哦~`

                                    layer.open({
                                        content: content_2,
                                        btn: ['朕知道了'],
                                        shadeClose: false,
                                        skin: 2,
                                        yes: function (e) {
                                            buyCallback(buyDays, isThirdPay)
                                            layer.close(e)
                                        }
                                    })
                                }
                            })
                        }
                    } else if (data.errno == -100) {
                        goLogin()
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                },
                (err) => {
                    layer.open({
                        content: err,
                        skin: 'msg'
                    })
                }
            )
    },
    goUse (productId, buyProductDays, callback) {
        // common.showLoading()

        // 判断是否是商城首页进行的使用
        let isShopIndex = typeof (productId) === 'undefined'

        if (isShopIndex) {
            // cnzz统计
            _czc.push(['_trackEvent', '商城', '装备按钮'])
        } else {
            // cnzz统计
            _czc.push(['_trackEvent', '我的背包', '使用/装备按钮'])
        }

        if (typeof (productId) !== 'undefined') {
            vpid = productId
        }

        if (typeof (buyProductDays) !== 'undefined') {
            buyDays = buyProductDays
        }

        axios.get('/backpack/UseMount', {
            params: {
                pid: vpid
            }
        })
            .then(
                (res) => {
                    let data = res.data
                    // common.hideLoading()

                    if (data.errno == 0) {
                        if (!isShopIndex) {
                            callback()
                        } else {
                            // 刷新app
                            let isLowkeyEnter = vpid == 10001
                            refreshAppInfo({'lowkeyEnter': isLowkeyEnter})

                            let _content = vpid == 10001 ? `隐身进场有效期为：${buyDays}天，可以偷偷进入直播间看主播啦！` : `座驾有效期为：${buyDays}天，快去直播间看看炫酷的座驾进场特效吧！`

                            layer.open({
                                title: '装备成功',
                                content: _content,
                                shadeClose: false,
                                btn: ['朕知道了'],
                                skin: 2,
                                yes: function (e) {
                                    buyCallback(buyDays)
                                    layer.close(e)
                                }
                            })
                        }
                    } else if (data.errno == -100) {
                        goLogin()
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                },
                (err) => {
                    layer.open({
                        content: err,
                        skin: 'msg'
                    })
                }
            )
    }
}

window.app = app
exports.goUse = app.goUse
exports.formatBuylist = app.formatBuylist
