<template>
  <section>
    <ul class="list">
      <li
        v-for="item in listData.system"
        :class="systemStatus[item.mountId]['isShowing'] ? 'equip' : ''"
        class="clearfix"
        @click="showMountDetail(item)">
        <div class="at_bg fl">
          <img
            class="round_bg"
            src="../../img/store/img_4.png">
          <img
            :src="item.image | filterHttp"
            class="at_img"
            alt="座驾头像" >
        </div>
        <div class="list_desc fl">
          <h3>{{ item.name }}</h3>
          <small>{{ item.description | descFormat(item) }}</small>
        </div>

        <div class="fr btn_wrap">
          <button
            v-show="!systemStatus[item.mountId]['isShowing']"
            @click.stop="goUse(item.mountId, true)">
            装备
          </button>
          <p v-show="systemStatus[item.mountId]['isShowing']">装备中...</p>
        </div>
      </li>

    </ul>

    <p
      v-show="isLineShow"
      class="list_split_line"/>

    <ul
      v-if="!isShopEmpty"
      class="list">
      <li
        v-for="item in listData.user"
        :class="{'equip': (vehicleStatus[item.mountId]['isShowing'] && !isDue(item.expireTime) ), 'overdue' : isDue(item.expireTime) }"
        class="clearfix"
        @click="showMountDetail(item)">

        <div class="at_bg fl">
          <img
            class="round_bg"
            src="../../img/store/img_4.png">
          <img
            :src="item.image | filterHttp"
            class="at_img"
            alt="座驾头像" >
        </div>

        <div class="list_desc fl">
          <h3>{{ item.name }}</h3>
          <small v-if="!isDue(item.expireTime)">
            <span v-show="vehicleStatus[item.mountId]['status'] == 1 || vehicleStatus[item.mountId]['isShowing']" >剩余：</span>
            <span v-show="vehicleStatus[item.mountId]['status'] == 0 && !vehicleStatus[item.mountId]['isShowing']" >有效期：</span>
            {{ getExpireDays(item.mountId) }}天
          </small>
        </div>

        <div class="fr btn_wrap">
          <p v-if="isDue(item.expireTime)">已过期</p>
          <div v-else>
            <button
              v-show="vehicleStatus[item.mountId]['status'] == 1 && !vehicleStatus[item.mountId]['isShowing']"
              @click.stop="goUse(item.mountId, false)">
              装备
            </button>
            <button
              v-show="vehicleStatus[item.mountId]['status'] == 0 && !vehicleStatus[item.mountId]['isShowing']"
              @click.stop="goUse(item.mountId, false)">
              使用
            </button>
            <p v-show="vehicleStatus[item.mountId]['isShowing']">装备中...</p>
          </div>
        </div>
      </li>
    </ul>

    <p
      v-cloak
      v-show="isLoading"
      class="click_load_more" >
      <i v-show="!isEnd"/><span v-show="isEnd">没有更多了哦 ㄒoㄒ~~</span>
    </p>

    <div
      v-if="isShopEmpty"
      class="empty_backpack">
      <p>背包里空空如也<br>不去商城里逛逛吗</p>
      <a href="/dist/store/list.html"/>
    </div>

    <!-- <div class="empty_backpack">
		<span class="eb_icon"></span>
		<p>座驾功能即将上线</p>
	</div> -->

    <div
      v-if="!isShopEmpty"
      class="mount_desc">
      <p
        v-show="isLineShow"
        class="list_split_line"/>

      <h4>座驾攻略</h4>
      <p>1.可以随意选择某一个座驾使用，使用后座驾效果在进直播间时生效。</p>
      <p>2.座驾被使用过1次后，开始计算剩余时间，剩余时间不会因为重新使用了其他座驾而停止。</p>
    </div>
  </section>
</template>

<script type="text/javascript">
import axios from 'axios'
import common from 'common'
import buyLayer from '../store/buyLayer.js'
import $ from 'webpack-zepto'
import 'babel-polyfill'

let vmData = {
    uInfo: [],
    listData: [],
    systemStatus: {},
    vehicleStatus: {},
    isShopEmpty: false,
    page: 0,
    loadTag: true,
    isEnd: false,
    isLoading: false,
    nowTimeStamp: 0,
    isLineShow: false
}
export default {
    filters: {

        descFormat (desc, item) {
            if (item.mountId == 10001) {
                return item.expireDays ? `剩余：${item.expireDays}天` : desc
            }
            return desc
        },

        filterHttp (url) {
            return common.filterHttp(url)
        }
    },
    data: function () {
        return vmData
    },
    computed: {
    },
    mounted: function () {
        this.$nextTick(function () {
            common.showLoading()

            this.getMountList(0)
            // 切换tap时会重新挂载，先把列表置为空
            this.listData = []

            let screenH = $(window).height()

            let vm = this
            if (!this.isShopEmpty) {
                $(window).on('scroll', function () {
                    let scrollT = $(window).scrollTop()

                    let docH = $(document).height()

                    if (docH - scrollT - screenH <= 30 && vm.loadTag) {
                        vm.loadTag = false
                        vm.page++

                        vm.isLoading = true
                        vm.getMountList(vm.page)
                    }
                })
            }
        })
    },
    methods: {
        getMountList (page) {
            axios.get('/backpack/getMountList', {
                params: {
                    page
                }
            })
                .then(
                    (res) => {
                        this.loadTag = true
                        this.isLineShow = true
                        common.hideLoading()

                        let data = res.data
                        if (data.errno == 0) {
                            if (typeof this.listData.user !== 'undefined') {
                                this.listData.user = this.listData.user.concat(data.data.list.user)
                            } else {
                                this.listData = data.data.list
                            }
                            this.uInfo = data.data.uInfo
                            this.nowTimeStamp = data.data.nowTimeStamp * 1000

                            if (data.data.list.user.length != 0) {
                                for (let val of data.data.list.user) {
                                    this.vehicleStatus[val['mountId']] = val
                                }
                            }

                            for (let val of data.data.list.system) {
                                this.systemStatus[val['mountId']] = val
                            }
                            if (this.listData.user.length == 0) {
                                this.isShopEmpty = true
                            }
                        } else if (data.errno == -100) {
                            common.goLogin()
                        } else if (data.errno == 101) {
                            this.isEnd = true

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
                        layer.open({
                            content: err,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },

        isDue (expireTime) {
            // 判断座驾是否过期
            let now_time = this.nowTimeStamp

            let expire_time = common.exchangeTime(expireTime)
            // 未使用的exire_time为0000-00-00 00:00:00
            if (expire_time <= now_time && expire_time > 0) {
                return true
            }
            return false
        },

        getExpireDays (pid) {
            let item = this.vehicleStatus[pid]

            if (item.status == 0 && !item.isShowing) {
                // 未使用状态
                return item.initDays
            } else {
                return item.expireDays
            }
        },

        showMountDetail (item) {
            // 18级以上方可解锁
            if (item.mountId == 10001) {
                let isLegalLevel = this.isLegalLevel()
                if (!isLegalLevel) return

                if (typeof (item.expireDays) !== 'undefined' && item.expireDays == 0) {
                    // 已过期
                    layer.open({
                        content: '用户等级达到18级或通过商城购买才能解锁该功能哦',
                        skin: 'msg',
                        time: 2
                    })
                    return
                }
            }

            let remain_hint = ''

            let btnArr = []

            let statusClass = ''

            let _remain_days

            // 是否可以续期
            let rebuyClass = item.canBuy == 1 ? '' : 'cannot_rebuy'

            // 是否过期
            let isOverdue = this.isDue(item.expireTime)

            if (parseInt(item.mountId) < 10000) {
                // 非默认进场特效吗，获取剩余天数
                _remain_days = this.getExpireDays(item.mountId)
            }

            if (parseInt(item.mountId) > 10000) {
                // 系统设置
                remain_hint = '<span>永久</span>'
                if (item.mountId == 10001) {
                    remain_hint = item.expireDays ? `<span>剩余：${item.expireDays}天</span>` : '<span>永久</span>'
                }

                btnArr = ['装备']

                let system_class = item.mountId == 10002 ? 'system' : ''

                if (item.isShowing) {
                    statusClass = `layer_btn_disabled ${system_class}`
                } else {
                    statusClass = `${system_class}`
                }
            } else if (isOverdue) {
                // 过期
                remain_hint = `已过期`
                btnArr = ['装备', '续期']
                statusClass = 'layer_btn_disabled'
            } else if (item.status == 0 && !item.isShowing) {
                // 未使用状态
                remain_hint = `有效期：${_remain_days}天`
                btnArr = ['使用', '续期']
            } else if (item.status == 1 && !item.isShowing) {
                // 使用过未装备
                remain_hint = `剩余：<span>${_remain_days}天</span>`
                btnArr = ['装备', '续期']
            } else if (item.isShowing && !isOverdue) {
                // 装备中
                remain_hint = `剩余：<span>${_remain_days}天<small>(装备中...)</small></span>`
                btnArr = ['装备', '续期']
                statusClass = 'layer_btn_disabled'
            }

            // 获取座驾信息
            let pInfo = {}
            // 购买和续期是商品用productId, 使用的是座驾用mountId
            pInfo.mid = item.mountId
            pInfo.pid = item.productInfo.id
            if (item.productInfo) {
                pInfo.name = item.productInfo.name
                pInfo.cost = item.productInfo.price
                pInfo.priceObj = item.productInfo.cyclePlan
            }
            pInfo = JSON.stringify(pInfo)

            let avatar_dom = `<img class="at_img" src="${this.$options.filters['filterHttp'](item.image)}" alt="座驾头像" />`
            if (item.mountId == '10002') {
                avatar_dom = `<span class="at_img mo"></span>`
            }

            let content = `
			<div class="avatar_wrap at_bg" data-item='${pInfo}'>
				${avatar_dom}
			</div>
			<h4>${item.name}</h4>
			<p>${item.description}</p>
			<p>${remain_hint}</p>
			`

            let vm = this
            layer.open({
                content: content,
                skin: 2,
                className: `detail_card ${statusClass} ${rebuyClass}`,
                btn: btnArr,
                yes: function (e) {
                    let pInfo = JSON.parse(document.querySelector('.detail_card .avatar_wrap').getAttribute('data-item'))

                    // 座驾装备&使用
                    if (this.className.indexOf('layer_btn_disabled') == -1 && this.className.indexOf('system') == -1) {
                        vm.goUse(pInfo.mid, false)
                    }

                    // 系统默认进场装备
                    if (this.className.indexOf('system') != -1 && this.className.indexOf('layer_btn_disabled') == -1) {
                        vm.goUse(pInfo.mid, true)
                    }
                },
                no: function () {
                    if (this.className.indexOf('cannot_rebuy') != -1) {
                        return false
                    }

                    // 续期
                    let pInfo = JSON.parse(document.querySelector('.detail_card .avatar_wrap').getAttribute('data-item'))

                    buyLayer.buy({
                        pid: pInfo.pid,
                        pName: pInfo.name,
                        coin: vmData.uInfo.coin,
                        cost: pInfo.cost,
                        buyArr: pInfo.priceObj,
                        isReBuy: true,
                        callback: function (addDays, isThirdPay) {
                            // 购买成功后更新有效期
                            vm.vehicleStatus[pInfo.mid]['expireDays'] = parseInt(vm.vehicleStatus[pInfo.mid]['expireDays']) + parseInt(addDays)
                            vm.vehicleStatus[pInfo.mid]['initDays'] = parseInt(vm.vehicleStatus[pInfo.mid]['initDays']) + parseInt(addDays)
                            // 当原来为过期状态时，更新座驾状态
                            if (isOverdue) {
                                vm.vehicleStatus[pInfo.mid]['isShowing'] = 0
                                vm.vehicleStatus[pInfo.mid]['expireTime'] = common.formatDate(new Date().getTime() + parseInt(addDays) * 3600 * 24 * 1000)
                            }
                            // 更新余额, 非支付方式
                            if (!isThirdPay) {
                                vmData.uInfo.coin = parseInt(vmData.uInfo.coin) - parseInt(pInfo.cost)
                            } else {
                                vmData.uInfo.coin = 0
                            }
                        }
                    })
                }
            })
        },

        goUse (pid, isSystem) {
            // 18级以上方可解锁
            if (pid == 10001) {
                let isLegalLevel = this.isLegalLevel()
                if (!isLegalLevel) return
            }

            let vm = this
            buyLayer.goUse(pid, '', function () {
                // 刷新app
                let isLowkeyEnter = pid == 10001
                common.refreshAppInfo({'lowkeyEnter': isLowkeyEnter})

                layer.closeAll()
                vm.switchStatus(pid, isSystem)
            })
        },
        switchStatus (pid, isSystem) {
            for (let key in this.systemStatus) {
                this.systemStatus[key]['isShowing'] = false
            }
            for (let key in this.vehicleStatus) {
                this.vehicleStatus[key]['isShowing'] = false
            }

            if (isSystem) {
                this.systemStatus[pid]['isShowing'] = true
            } else {
                // 座驾进场特效设置
                let targetStatus = this.vehicleStatus[pid]['status']
                if (targetStatus == '0') {
                    this.vehicleStatus[pid]['status'] = '1'

                    // cnzz统计
                    _czc.push(['_trackEvent', '我的背包', '使用按钮'])
                } else {
                    // cnzz统计
                    _czc.push(['_trackEvent', '我的背包', '装备按钮'])
                }
                this.vehicleStatus[pid]['isShowing'] = true
            }
        },

        isLegalLevel () {
            // 用户等级小于18级，且未购买隐身卡
            if (parseInt(this.uInfo.level) < 17 && this.listData.system[0].type != 3) {
                layer.open({
                    content: '用户等级达到18级或通过商城购买才能解锁该功能哦',
                    skin: 'msg',
                    time: 2
                })
                return false
            }
            return true
        }
    }

}
</script>
