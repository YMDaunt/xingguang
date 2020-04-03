
<template>
  <article>
    <ul class="store_list">
      <li
        v-for="(item,index) in listData"
        v-cloak
        :key="index"
        :data-pid="item.id"
        class="clearfix">
        <div class="img_wrap fl">
          <img
            class="round_bg"
            src="../../img/store/img_4.png">
          <img
            :alt="item.name"
            :src="item.image | filterHttp"
            class="main_img">
        </div>

        <div class="desc_wrap fl">
          <h3>{{ item.name }} <span>({{ item.price }}{{ unit }})</span></h3>
          <p class="expire_time">有效期：永久</p>
          <small class="desc">{{ item.description }}</small>

        </div>
        <button
          class="buy_btn"
          @click="initBuy(item.id,item.name,item.price)">购买</button>
      </li>

    </ul>

    <p
      v-cloak
      v-show="isLoading"
      class="click_load_more" >
      <i v-show="!isEnd"/>
    </p>

    <div
      v-show="isLineShow"
      v-cloak
      class="rule_wrap">
      <p>说明：道具卡为用户个性化特色功能，使用后全平台{{ voiceLive }}通用，主播不参与分成收益。</p>
    </div>
  </article>

</template>

<script type="text/javascript">

import axios from 'axios'
import layer from 'layer'
import common from 'common'
import payLayer from '../component/gj.payLayer.js'
import $ from 'webpack-zepto'
import 'babel-polyfill'

export default {
    filters: {
        filterHttp (url) {
            return common.filterHttp(url)
        }
    },
    props: {
        unit: {
            type: String,
            default: '克拉'
        }
    },
    data: function () {
        return {
            packageId: common.getPackageId(),
            platform: common.getPlatformType(),
            coin: 0,
            listData: [],
            uInfo: [],
            page: 0,
            loadTag: true,
            isEnd: false,
            isLoading: false,
            isLineShow: false,
            buyInfo: {
                id: 0,
                name: '',
                num: 1,
                price: 0
            }
        }
    },
    computed: {
        voiceLive () {
            if (['27'].indexOf(this.packageId) >= 0 && this.platform === 'ios_webview') {
                // 27 分包将直播间改为房间
                return '房间'
            }
            return '直播间'
        }
    },
    created: function () {
        let vm = this
        // 支付成功后回调，app调用
        window.payResultCallback = function (code, errMsg) {
            if(common.getChannel() === 'and-hwly-cps-7'){
                location.reload()   
            }else{
                if (code) {
                    layer.closeAll()
                    if(common.getChannel() === 'and-hwly-cps-7'){
                        vm.buyProp(false)
                    }else{
                        vm.buyProp(true)
                    }
                }
            }
        }
        // 用于切换不同的页面时，重新调用自定义右上角信息的接口
        window.addEventListener('pageshow', function () {
            vm.showMyBackpackMenu()
        })
    },
    mounted: function () {
        let vm = this
        this.$nextTick(function () {
            // 显示右上角背包入口
            $(window).on('load', function () {
                vm.showMyBackpackMenu()
            })

            this.getProductList()

            let screenH = $(window).height()
            $(window).on('scroll', function () {
                let scrollT = $(window).scrollTop()

                let docH = $(document).height()

                if (docH - scrollT - screenH <= 30 && vm.loadTag) {
                    vm.loadTag = false
                    vm.page++

                    vm.isLoading = true
                    vm.getProductList()
                }
            })
        })
    },
    methods: {
        showMyBackpackMenu () {
            let version = common.getVersion()
            let versionNum = parseInt(version.replace(/\./g, ''))
            if (versionNum >= 500) {
                console.log('versionNum > 500')
                common.hideRightTopMenu()
                return
            }

            setTimeout(function () {
                try {
                    gBridge.changeMenuButton('我的背包', location.protocol + '//' + location.host + '/dist/backpack/list.html')
                } catch (e) {
                    console.log(e.name + ':' + e.message)
                }
            }, 500)
        },
        getProductList () {
            let vm = this
            common.showLoading()
            axios.get('/store/getProductList', {
                params: {
                    page: vm.page,
                    type: 7
                }
            })
                .then((res) => {
                    common.hideLoading()
                    vm.loadTag = true
                    vm.isLineShow = true

                    let data = res.data

                    if (data.errno === 0) {
                        let propList = vm.listData.concat(data.data.list)
                        for (let i = 0, len = propList.length; i < len; i++) {
                            // 测试环境 id 342 线上环境 324
                            if (propList[i]['id'] === '324' && this.packageId === '27' && this.platform === 'ios_webview') {
                                propList[i]['description'] = '道具功能：在房间发言时使用，可将发言内容广播到全站房间。给主播打call神器，每次使用消耗一张。'
                                break
                            }
                        }
                        vm.listData = propList
                        vm.uInfo = data.data.uInfo
                        vm.coin = data.data.uInfo['coin']
                    } else if (data.errno === -100) {
                        common.goLogin()
                    } else if (data.errno === 101) {
                        vm.isEnd = true
                        vm.isLoading = false

                        $(window).off()
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                },
                (err) => {
                    console.log(err)
                })
        },

        initBuy (pid, name, price) {
            // cnzz统计
            _czc.push(['_trackEvent', '商城道具', '购买按钮'])

            // 版本控制
            let version = common.getVersion()
            let versionArr = parseInt(version.replace(/\./g, ''))
            if (versionArr < 415) {
                layer.open({
                    content: '请升级到4.1.5及以上版本购买使用哦',
                    skin: 'msg',
                    time: 3
                })
                return
            }

            let vm = this
            this.buyInfo.id = pid
            this.buyInfo.name = name
            this.buyInfo.price = price

            // 余额购买
            if (parseInt(this.coin) >= parseInt(price)) {
                let _html = `<h4>${name}</h4>
                        <p>总计需要：${price}${vm.unit}</p>
                        <p>当前余额：${vm.coin}${vm.unit}</p>`
                layer.open({
                    content: _html,
                    skin: 2,
                    className: 'prop_buy',
                    btn: ['确定购买'],
                    yes: function () {
                        vm.buyProp()
                    }
                })
                return
            }
            // 支付购买
            // 存储sessionStorage支付成功后调用
            sessionStorage.setItem('giftPackNum', 1)

            let gapCoin = parseInt(price) - parseInt(this.coin)
            payLayer.goPay({
                coin: vm.coin,
                unitPrice: parseInt(price) / 100,
                hasCounter: true,
                headlineText: name,
                customContent: function (num) {
                    num = parseInt(num)
                    let newGapCoin = gapCoin + price * (num - 1)
                    return `<div class="pl_custom">
                            <p>总计需要：${parseInt(price) * num} ${vm.unit}</p>
                            <p>当前余额：${vm.coin} ${vm.unit}</p>
                            <p>还差 ${newGapCoin} ${vm.unit} ￥ ${newGapCoin / 100} </p>
                        </div>`
                },
                callback: function (num) {
                    vm.buyInfo.num = num
                }
            })
        },

        buyProp (isPay) {
            common.showLoading()
            let vm = this
            axios.get('/store/BuyProperty', {
                params: {
                    pid: this.buyInfo.id,
                    num: this.buyInfo.num
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        common.hideLoading()

                        if (data.errno === 0) {
                            // 刷新app余额
                            vm.coin = isPay ? 0 : parseInt(vm.coin) - parseInt(vm.buyInfo.price) * parseInt(vm.buyInfo.num)
                            common.refreshAppInfo({'coin': vm.coin})

                            // 刷新广播卡
                            try {
                                gBridge.refreshBroadcastCard()
                            } catch (e) {
                                alert(e.name + ': ' + e.message)
                            }

                            layer.closeAll()

                            // 道具首页购买成功
                            layer.open({
                                title: '恭喜您',
                                content: `成功获得${vm.buyInfo.num}张${vm.buyInfo.name}，快去直播间选择使用吧`,
                                btn: ['朕知道了'],
                                skin: 2
                            })
                        } else if (data.errno === -100) {
                            common.goLogin()
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
}

</script>
