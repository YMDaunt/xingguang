<!--
 * @Author: Jesse
 * @Date: 2018-08-14 17:49:06
 -->
<template>
  <article>
    <ul class="store_list">
      <p class="classify">
        <span>1F</span>
        隐身进场
      </p>
      <li
        v-for="(item,index) in listData"
        v-if="item.virtualProductId == 10001"
        v-cloak
        :key="index"
        :data-pid="item.id"
        class="clearfix">

        <img
          v-if="isShowCorner(item.isNew, item.id)"
          :src="item.cornerMark | filterHttp"
          class="corner_icon"
          alt="new角标">

        <div
          class="img_wrap fl"
          @click="goPreview(item)">
          <img
            class="round_bg"
            src="../../img/store/img_4.png">
          <img
            :src="item.image | filterHttp"
            class="main_img"
            alt="座驾图">

          <span
            v-if="item.virtualProductId != 10001 && showPreview"
            class="play_icon"/>
        </div>

        <div class="desc_wrap fl">
          <h3>{{ item.name }}</h3>
          <p class="price_wrap"><span>{{ item.price }}</span> {{ unit }}/{{ item.cyclePlan | getUnit(item.price) }}</p>
          <div><small class="desc">{{ item.description }}</small></div>

        </div>
        <button
          class="buy_btn"
          @click="initBuy(item.id,item.name,item.price,item.cyclePlan,item.virtualProductId)">购买</button>
      </li>

      <p class="classify">
        <span>2F</span>
        超级英雄系列
      </p>
      <li
        v-for="(item,index) in listData"
        v-if="inArray(item.virtualProductId, heroList)"
        v-cloak
        :key="index"
        :data-pid="item.id"
        class="clearfix">

        <img
          v-if="isShowCorner(item.isNew, item.id)"
          :src="item.cornerMark | filterHttp"
          class="corner_icon"
          alt="new角标">

        <div
          class="img_wrap fl"
          @click="goPreview(item)">
          <img
            class="round_bg"
            src="../../img/store/img_4.png">
          <img
            :src="item.image | filterHttp"
            class="main_img"
            alt="座驾图">

          <span
            v-if="item.virtualProductId != 10001 && showPreview"
            class="play_icon"/>
        </div>

        <div class="desc_wrap fl">
          <h3>{{ item.name }}</h3>
          <p class="price_wrap"><span>{{ item.price }}</span> {{ unit }}/{{ item.cyclePlan | getUnit(item.price) }}</p>
          <div><small class="desc">{{ item.description }}</small></div>

        </div>
        <button
          class="buy_btn"
          @click="initBuy(item.id,item.name,item.price,item.cyclePlan,item.virtualProductId)">购买</button>
      </li>

      <p class="classify">
        <span>3F</span>
        机车系列
      </p>
      <li
        v-for="(item,index) in listData"
        v-if="item.virtualProductId != 10001 && !inArray(item.virtualProductId, heroList)"
        v-cloak
        :key="index"
        :data-pid="item.id"
        class="clearfix">

        <img
          v-if="isShowCorner(item.isNew, item.id)"
          :src="item.cornerMark | filterHttp"
          class="corner_icon"
          alt="new角标">

        <div
          class="img_wrap fl"
          @click="goPreview(item)">
          <img
            class="round_bg"
            src="../../img/store/img_4.png">
          <img
            :src="item.image | filterHttp"
            class="main_img"
            alt="座驾图">

          <span
            v-if="item.virtualProductId != 10001 && showPreview"
            class="play_icon"/>
        </div>

        <div class="desc_wrap fl">
          <h3>{{ item.name }}</h3>
          <p class="price_wrap"><span>{{ item.price }}</span> {{ unit }}/{{ item.cyclePlan | getUnit(item.price) }}</p>
          <div><small class="desc">{{ item.description }}</small></div>

        </div>
        <button
          class="buy_btn"
          @click="initBuy(item.id,item.name,item.price,item.cyclePlan,item.virtualProductId)">购买</button>
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
      <p>说明：座驾为用户个性化特色功能，使用后全平台{{ voiceLive }}通用，主播不参与分成收益。</p>
    </div>
  </article>

</template>

<script type="text/javascript">

import axios from 'axios'
import layer from 'layer'
import common from 'common'
import buyLayer from './buyLayer.js'
import $ from 'webpack-zepto'
import 'babel-polyfill'

export default {
    filters: {
        getUnit (arr, price) {
            let keys = []
            for (let key in arr) {
                keys.push(key)
            }

            for (let val of keys) {
                // console.log('val:'+arr[val] + ' price:'+ price)
                if (arr[val] == price) {
                    return parseInt(val) < 30 ? `${val}天` : '月'
                }
            }
        },

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
            isNewBoy: false,
            heroList: [18, 19, 20, 21, 22]
        }
    },
    computed: {
        showPreview () {
            // ios 分包不展示座驾预览
            if (['4', '14', '27'].indexOf(this.packageId) >= 0 && this.platform === 'ios_webview') {
                return false
            }
            return true
        },
        voiceLive () {
            if (['27'].indexOf(this.packageId) >= 0 && this.platform === 'ios_webview') {
                // 27 分包将直播间改为房间
                return '房间'
            }
            return '直播间'
        }
    },
    created: function () {
        console.log(this.packageId)
        let vm = this
        // 支付成功后回调，app调用
        window.payResultCallback = function (code, errMsg) {
            if (common.getChannel() === 'and-hwly-cps-7') {
                location.reload()
            } else {
                if (code) {
                    hasUnpayOrder = 0

                    layer.closeAll()
                    app.goBuy(true)
                }
            }
        }
        // 用于切换不同的页面时，重新调用自定义右上角信息的接口
        // window.onpageshow ios不兼容，安卓可以
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
                    page: vm.page
                }
            })
                .then((res) => {
                    common.hideLoading()
                    vm.loadTag = true
                    vm.isLineShow = true

                    let data = res.data

                    if (data.errno === 0) {
                        let mountList = vm.listData.concat(data.data.list)
                        // 隐身进场测试Id 403 线上id 325
                        for (let i = 0, len = mountList.length; i < len; i++) {
                            if (mountList[i]['id'] === '325' && this.packageId === '27' && this.platform === 'ios_webview') {
                                mountList[i]['description'] = '隐身进入房间，偷偷低调看语音~'
                                break
                            }
                        }
                        vm.listData = mountList

                        vm.uInfo = data.data.uInfo
                        vm.coin = data.data.uInfo['coin']
                        // 是否是新人
                        vm.isNewBoy = data.data.isNewBoy

                        vm.isEnd = vm.listData === 0 && vm.page === 0
                        if (data.data.list.length < 10 && data.data.list.length !== 0) {
                            vm.isEnd = true
                            vm.isLoading = false
                        }
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

        isShowCorner (isNew, id) {
            if ((id === 1) || (id !== 1 && isNew)) {
                return true
            } else {
                return false
            }
        },

        initBuy (pid, name, cost, priceObj, vpid) {
            let vm = this
            // cnzz统计
            _czc.push(['_trackEvent', '商城座驾', '购买按钮'])

            if (vpid === 10001 && parseInt(this.uInfo.level) >= 17) {
                layer.open({
                    content: '<h4>温馨提示</h4><p>您的等级已有进房隐身特权，无需购买此进场方式哦</p>',
                    btn: ['朕知道了']
                })
                return
            }

            if (pid === 1 && !this.isNewBoy) {
                layer.open({
                    content: `${name}为注册起7天内的用户才可以购买，客官去看看别的座驾吧`,
                    skin: 2,
                    btn: ['确定']
                })
                return
            }

            buyLayer.buy({
                pid,
                vpid, // 虚拟product id， mountid
                pName: name,
                coin: this.coin,
                cost,
                buyArr: priceObj,
                callback: function (buyDays, isThirdPay) {
                    // 更新余额, 非支付方式
                    if (!isThirdPay) {
                        vm.coin = parseInt(vm.coin) - parseInt(priceObj[buyDays])
                    } else {
                        vm.coin = 0
                    }
                    // vm.showFlyAni(pid)
                }
            })
        },

        showFlyAni (pid) {
            let dom = document.querySelector(`li[data-pid="${pid}"]`)

            let my_pos_t = dom.offsetTop

            let my_pos_l = dom.offsetLeft

            let my_pos_w = dom.querySelector('.main_img').offsetWidth

            let my_pos_h = dom.querySelector('.main_img').offsetHeight

            let target_l = window.screen.width

            let dom_img_src = dom.querySelector('.main_img').getAttribute('src')

            let scroll_top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

            let cloneDom = document.createElement('img')
            cloneDom.src = dom_img_src
            cloneDom.className = 'clone_img'
            cloneDom.style.cssText = `position:fixed;
                                    left:${my_pos_l}px;
                                    top:${my_pos_t - scroll_top + my_pos_h}px;
                                    width:${dom.querySelector('.main_img').clientWidth}px;
                                    `

            let $cloneDom = cloneDom
            $('body').append(cloneDom)

            // 运动公式: y= a*x*x + b
            let orgin_x = my_pos_l - target_l

            let orgin_y = -my_pos_t + scroll_top - my_pos_h

            let a = orgin_y / (orgin_x * orgin_x)

            let b = my_pos_h * 0.8
            // 大致为车图片高度

            let target_x = 0

            let offset_x = 0

            let offset_y = 0

            let new_x = orgin_x

            let percent = 0.2 // 运动物体缩放百分比

            window.requestAnimationFrame(_move)
            function _move () {
                if (new_x >= target_x) {
                    window.cancelAnimationFrame(_move)
                    $($cloneDom).remove()
                    return
                }

                let rate = my_pos_l > my_pos_w ? 2 : 5

                new_x += rate
                let new_y =	a * new_x * new_x + b
                offset_x = new_x - orgin_x
                offset_y = new_y - orgin_y

                $cloneDom.style.cssText += `;transform: translate3d(${offset_x}px, -${offset_y}px, 0) scale(${percent});-webkit-transform: translate3d(${offset_x}px, -${offset_y}px, 0) scale(${percent});`

                window.requestAnimationFrame(_move)
            }
        },

        goPreview (item) {
            // 隐身进场不用预览
            if (item.virtualProductId === 10001) return
            // ios分包去掉预览座驾功能
            if (!this.showPreview) return

            let data = this.uInfo
            data.mountId = item.virtualProductId
            data.mountName = item.name
            data.mountAction = item.virtualProductId === 1 ? '骑着' : '开着'
            data.iosMount = typeof (item.iosEffect) === 'undefined' ? '' : item.iosEffect
            data.androidMount = typeof (item.androidEffect) === 'undefined' ? '' : item.androidEffect

            try {
                gBridge.mountPreview(JSON.stringify(data))
                console.log('call gBridge.onEffectPreview successful')
            } catch (e) {
                layer.open({
                    content: e.name + ':' + e.message,
                    skin: 'msg',
                    time: 3
                })
            }

            // cnzz统计
            _czc.push(['_trackEvent', '商城座驾', '预览按钮'])
        },

        inArray (val, arr) {
            for (let i = 0; i < arr.length; i++) {
                if (val == arr[i]) return true
            }
            return false
        }

    }
}

</script>
