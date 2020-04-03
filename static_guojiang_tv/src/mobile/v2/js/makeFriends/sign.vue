<template>
  <section
    class="sign-modal"
    v-if="showSignModal">
    <div
      class="sign-box"
      v-if="showSign">
      <span
        class="close"
        @click="closeBox"/>
      <ul>
        <li
          v-for="(item,index) in signList"
          :key="index"
          class="sign-item">
          <div
            class="signed-box"
            v-if="item.status === 1">
            <div class="signed"/>
          </div>
          <p class="day">第{{ item.day }}天</p>
          <div class="award">
            <div :class="['item'+item.day]"/>
          </div>
          <p class="award-name">{{ item | awardName }}</p>
          <div
            class="current-sign"
            v-if="item.current">
            <div class="radiation"/>
            <div class="current-icon"/>
          </div>
        </li>
      </ul>
      <div
        class="sign-btn"
        @click="sign"
        v-show="!isSigned">立即签到</div>
      <div
        class="sign-btn signed-btn"
        v-show="isSigned">今日已签到</div>
    </div>
    <div
      class="signResult"
      v-if="showSignResult">
      <div class="title"/>
      <div class="result-tips">恭喜你获得</div>
      <div class="coin">
        <div :class="['item'+currentDay]"/>
      </div>
      <div class="current-sign">
        <div class="radiation"/>
        <div class="current-icon"/>
      </div>
      <div class="lucky-coin-num">金币 x{{ luckyCoin }}</div>
      <div
        class="sure-btn"
        @click="closeSignResult">朕知道了</div>
    </div>
    <div
      class="redPackage"
      v-if="showRedPackage">
      <div class="lucky-coin">{{ luckyCoin }}</div>
      <div class="unit">金币</div>
      <div class="lucky-msg lucky">恭喜你</div>
      <div class="lucky-msg">抢到一个签到红包</div>
      <div class="lucky-tips">已发放至账户，快去和ta聊天吧</div>
      <div class="radiation"/>
    </div>
    <div
      class="openBox"
      v-if="showBox">
      <div class="lucky-msg lucky">恭喜你</div>
      <div class="lucky-msg">开启一个签到宝箱</div>
      <div class="lucky-coin">{{ luckyCoin }}</div>
      <div class="unit">金币</div>
      <div class="lucky-tips">已发放至账户，快去和ta聊天吧</div>
      <div class="radiation"/>
    </div>
    <div :class="['svgContainer',showBox?'playSvg':'']"/>
  </section>
</template>

<script>
import axios from 'axios'
import layer from 'layer'
import {closeWebview} from 'common'
import bodymovin from '../component/bodymovin.min.js'
export default {
    filters: {
        awardName (item) {
            if (item.type === 1) {
                return '金币 x' + item.coin
            } else if (item.type === 2) {
                return '抢红包'
            } else if (item.type === 3) {
                return '开宝箱'
            }
        }
    },
    props: {
        isModal: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showSignModal: true,
            showSign: true,
            showRedPackage: false,
            svgContainer: '',
            animItem: '',
            luckyCoin: 0, // 抢红包或开宝箱得金币
            showBox: false,
            isSigned: false,
            currentDay: 1, // 当前签到是第几天
            showSignResult: false, // 展示签到结果弹窗
            signList: []
        }
    },
    created () {
        this.init()
    },
    mounted () {
        this.svgContainer = document.querySelector('.svgContainer')
    },
    methods: {
        init () {
            axios.get('/mfUser/daySignList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        let dataList = data.data
                        for (let i = 0; i < dataList.length; i++) {
                            if (dataList[i]['status'] === 0) {
                                dataList[i]['current'] = true
                                break
                            }
                        }
                        this.signList = dataList
                    } else {
                        layer.open({
                            content: data.msg,
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        closeBox () {
            if (this.isModal) {
                // 关闭任务中心页面弹窗
                this.showSign = false
                this.showSignModal = false
            } else {
                // 关闭交友列表页面弹窗
                closeWebview()
            }
        },
        closeSignResult () {
            this.showSignResult = false
            this.closeBox()
        },
        // 签到操作
        sign () {
            if (!navigator.onLine) {
                layer.open({ time: 3, skin: 'msg', content: '网络不给力' })
                return false
            }
            axios.post('/mfUser/daySign')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.luckyCoin = data.data.coin
                        if (data.data.day === 3) {
                            // 抢红包
                            this.openRedPackage()
                        } else if (data.data.day === 7) {
                            // 开宝箱
                            this.openBox()
                        } else {
                            this.currentDay = data.data.day
                            let current = data.data.day - 1
                            this.signList[current]['status'] = 1
                            this.isSigned = true
                            this.showSign = false
                            this.showSignResult = true
                        }
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        openRedPackage () {
            this.showSign = false
            this.showRedPackage = true
            this.animItem = bodymovin.loadAnimation({
                wrapper: this.svgContainer,
                animType: 'svg',
                loop: false,
                prerender: true,
                autoplay: true,
                path: 'https://static.guojiang.tv/app/effect/H5/star/data.json'
            })
            // 动画播放完成回调
            this.animItem.addEventListener('complete', () => {
                this.svgContainer.innerHTML = ''
                this.showRedPackage = false
                this.closeBox()
            })
        },
        openBox () {
            this.showSign = false
            this.showBox = true
            this.animItem = bodymovin.loadAnimation({
                wrapper: this.svgContainer,
                animType: 'svg',
                loop: false,
                prerender: true,
                autoplay: true,
                path: 'https://static.guojiang.tv/app/effect/H5/star/data.json'
            })
            // 动画播放完成回调
            this.animItem.addEventListener('complete', () => {
                this.svgContainer.innerHTML = ''
                this.showBox = false
                this.closeBox()
            })
        }

    }
}
</script>
