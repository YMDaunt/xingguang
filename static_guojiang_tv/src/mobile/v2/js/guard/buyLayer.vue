<template>
  <section>
    <div class="buy_layer ">
      <span class="mask"/>
      <div class="buy_layer_content">
        <div class="header">
          <p>开通{{ constsArr[mInfo['type']] }}守护</p>
          <span class="u_nickname">{{ uInfo["nickname"] }}</span>
          <span class="m_nickname">{{ mInfo["nickname"] }}</span>
        </div>
        <div class="content_wrap">
          <content>
            <ul class="privilege_wrap">
              <li>
                <div class="privilege_icon">
                  <span class=" privilege_icon_0"/>
                </div>
                <p>尊贵座席</p>
              </li>
              <li>
                <div class="privilege_icon">
                  <span class="privilege_icon_1"/>
                </div>
                <p>专属勋章</p>
              </li>
              <li>
                <div class="privilege_icon">
                  <span class="privilege_icon_2"/>
                </div>
                <p>炫彩聊天文字</p>
              </li>
              <li>
                <div class="privilege_icon">
                  <span class="privilege_icon_3"/>
                </div>
                <p>进场特效</p>
              </li>
            </ul>
            <ul class="privilege_wrap">
              <li>
                <div class="privilege_icon">
                  <span class="privilege_icon_4"/>
                </div>
                <p>专属礼物</p>
              </li>
              <li class="privilege_ti">
                <div class="privilege_icon">
                  <span class="privilege_icon_5"/>
                </div>
                <p>防禁言</p>
              </li>
              <li class="opacity">
                <div class="privilege_icon">
                  <span class="privilege_icon_3"/>
                </div>
                <p>进场特效</p>
              </li>
            </ul>
            <div class="bookrack_wrap">
              <div class="top"/>
              <div class="bottom"/>
            </div>
            <div class="bookrack_wrap bookrack_wrap_b">
              <div class="top"/>
              <div class="bottom"/>
            </div>
            <ul class="buy_info">
              <li class="clearfix">
                <span class="fl label">购买方式：</span>
                <div class="fl">
                  <div class="time_wrap">
                    <span
                      :class="buyType===0?'active':''"
                      class="month"
                      @click="switchToMonth()">1个月</span>
                    <span
                      :class="buyType===1?'active':''"
                      class="year"
                      @click="switchToYear()"><i>优<br>惠</i>一年</span>
                  </div>
                  <p class="time_hint">{{ timeHint }}</p>
                </div>
              </li>
              <li class="clearfix">
                <span class="fl label">有效期至：</span>
                <div class="fl expiry_date">{{ getExpiryDate }}</div>
              </li>
              <li class="clearfix">
                <span class="fl label">应付金额：</span>
                <div class="fl paopao_num">
                  <p class="pay_coin"><span>{{ getPayCoin }}</span>克拉</p>
                  <p class="remain_num">
                    账户余额{{ uInfo["coin"] }}克拉
                    <span
                      v-show="!isEnoughBalance"
                      class="warn">余额不足</span>
                  </p>
                </div>
              </li>
            </ul>
          </content>
        </div>
        <div class="btn_wrap">
          <div
            v-if="!isEnoughBalance"
            class="btn_innerwrap btn_recharge_wrap">
            <button
              class="cancel"
              @click="closeBuyLayer()">取消</button>
            <a
              href="javascript:;"
              class="btn_recharge"
              @click="initRecharge()"><button>充值</button></a>
          </div>
          <div
            v-else
            class="btn_innerwrap btn_buy_wrap">
            <button
              class="cancel"
              @click="closeBuyLayer()">取消</button>
            <button
              id="goBuy"
              class="btn_buy"
              @click="goBuy()">确认开通</button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="showResult"
      :class="'buy_result_' + resultLayerKey"
      class="buy_layer">
      <span class="mask"/>
      <div class="buy_layer_content">
        <div class="header"/>
        <div class="content_wrap">
          <content>
            <div
              v-if="resultLayerKey === 'fail'"
              :class="resultLayerKey"
              class="result_hint">

              <p class="r_m_nickname">{{ resultFailMsg }}</p>
            </div>

            <div
              v-else
              :class="resultLayerKey"
              class="result_hint">
              <p>成为</p>
              <p class="r_m_nickname">
                {{ mInfo['nickname'] }}
              </p>
              <p>的守护神</p>
            </div>
          </content>
        </div>
        <div class="btn_wrap">
          <button
            :class="resultLayerKey"
            class="layer_ok"
            @click="emitCallback()">确认</button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import common from 'common'
import axios from 'axios'

export default {
    // eslint-disable-next-line vue/require-prop-types
    props: ['uInfo', 'mInfo', 'mCost', 'yCost', 'isIosappInVerify'],
    data: function () {
        return {
            constsArr: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
            buyType: 0, // 0: 按月购买， 1：按年购买
            timeHint: '注：1月按30天计算',
            ajaxFlag: true,
            showResult: false,
            resultFailMsg: '',
            resultLayerKey: ''
        }
    },
    computed: {
        /**
         * 获取过期时间
        */
        getExpiryDate () {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.mInfo['guardEndTime'] = this.mInfo['isOverdue']
                ? common.formatDate((new Date().getTime()) / 1000).split(' ')[0]
                : this.mInfo['guardEndTime']

            return this.getExpiryTime(this.buyType, this.mInfo['guardEndTime'])
        },
        /**
         * 获取需要支付的金额
        */
        getPayCoin () {
            return this.buyType === 0 ? this.mCost : this.yCost
        },
        /**
         * 余额是否充足
        */
        isEnoughBalance () {
            return parseInt(this.uInfo['coin']) - parseInt(this.getPayCoin) >= 0
        }
    },
    mounted: function () {
        let vm = this
        this.$nextTick(function () {
            console.log('uInfo:', vm.uInfo)
        })
    },
    methods: {
        /*	param: timeType
        *	0: month
        *	1: year
        */
        getExpiryTime (timeType, guardEndTime) {
            let gapDay = timeType === 0 ? 30 : 365
            let gapTime = gapDay * 24 * 3600 * 1000

            let nowTime
            if (guardEndTime) {
                nowTime = new Date(guardEndTime).getTime()
            } else {
                nowTime = new Date().getTime()
            }

            let expiryTime = gapTime + nowTime
            return common.formatDate(expiryTime / 1000).split(' ')[0]
        },

        switchToMonth (coin, endDate) {
            this.buyType = 0
            this.timeHint = '注：1月按30天计算'
        },

        switchToYear (coin, endDate) {
            this.buyType = 1
            this.timeHint = '注：1年按365天计算'
        },

        /**
         * 续期购买
        */
        goBuy () {
            let vm = this
            if (!this.ajaxFlag) return
            this.ajaxFlag = false

            common.showLoading()
            axios.get('/guard/addGuard', {
                params: {
                    mid: vm.mInfo['mid'],
                    uid: vm.uInfo['id'],
                    type: vm.mInfo['type'],
                    timeType: vm.buyType
                }
            })
                .then(
                    (res) => {
                        this.ajaxFlag = true
                        common.hideLoading()

                        let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data

                        if (data.errno === -100) {
                            common.goLogin()
                        } else if (data.errno === 0) {
                            vm.showResultLayer(1)
                        } else {
                            vm.showResultLayer(0, data.msg)
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

        /**
         * type: 0: 失败， 1： 成功
         * msg: 失败时的提示
        */
        showResultLayer (type, msg) {
            this.resultLayerKey = type === 0 ? 'fail' : 'success'
            this.showResult = true
            this.resultFailMsg = msg
        },

        emitCallback () {
            this.$emit('buySuccessCallback')
        },

        initRecharge () {
            // 活动页点击充值，调用app统计
            try {
                gBridge.onEvent('__cust_event_4', '{}')
            } catch (e) {
            }

            if (this.isIosappInVerify) {
                layer.open({
                    content: '请到“我的个人主页-克拉充值”页面进行充值后再购买哦~'
                })
                return
            }

            common.goRecharge()
        },

        closeBuyLayer () {
            this.$emit('closeAllLayer')
        }

    }
}
</script>
<style lang="less" scoped>
@import '../../css/guard/buy_layer.less';
</style>
