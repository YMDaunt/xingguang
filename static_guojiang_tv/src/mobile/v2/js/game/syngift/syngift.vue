<!--
 * @Date: 2020-02-27 18:54:01
 * @LastEditors: Jesse
 * @LastEditTime: 2020-03-09 12:42:01
 -->
<template>
  <div>
    <section
      class="loading"
      v-show="showLoading">
      <div class="logo" />
      <div class="progress-bg">
        <div
          class="progress"
          :style="'width:' + progress + '%'" />
      </div>
      <p class="text">正在努力加载中...</p>
    </section>
    <section v-show="!showLoading">
      <div class="header">
        <div class="title"/>
        <router-link
          to="/manual"
          class="manual-btn fr"
        />
        <router-link
          to="/history"
          class="history-btn fr"
        />
      </div>
      <div class="container">
        <div class="gift-wrap fl">
          <div class="corner-top"/>
          <div class="title">请选择要<br>炼化的礼物</div>
          <ul
            class="gift-list"
            ref="parent">
            <li
              v-for="(item,index) in giftList"
              @click="choose(item,index)"
              ref="currentItem"
              :class="item|giftClass"
              :key="index">
              <img :src="item.img">
              <div class="gift-name">{{ item.name }}</div>
            </li>
            <li class="rare0"/>
          </ul>
          <div class="corner-bottom"/>
        </div>
        <div class="arrow"/>
        <div class="synthesis fr">
          <div class="corner-top"/>
          <p class="title">所需投入的材料</p>
          <div class="progress">
            <p class="progress-tip">当前成功率:{{ successValue }}%</p>
            <div
              class="progress-value"
              :style="{width:successValue+'%'}" />
          </div>
          <div class="common-material-box">
            <div class="need-material fl">
              <div class="num">x{{ currentGift.commonGift.combineNum }}</div>
              <img :src="currentGift.commonGift.img">
              <div class="name">{{ currentGift.commonGift.name }}</div>
            </div>
            <div class="own fr">
              <p class="current-num">当前拥有数量:{{ currentGift.commonGift.num }}</p>
              <p class="current-num">{{ currentGift.commonGift.price }}克拉/1个</p>
              <div
                class="purchase-btn"
                @click="purchase(currentGift.commonGift.productId)">购买</div>
            </div>
          </div>
          <div class="plus"/>

          <div
            class="need-material-box2"
            v-show="currentGift.rareType === '1'|| currentGift.rareType === '2'">
            <div class="material-box">
              <div
                class="subtraction"
                @click="subtract"
              />
              <div class="need-material">
                <div class="num">x{{ currentGift.material.combineNum }}</div>
                <img :src="currentGift.material.img">
                <div class="name">{{ currentGift.material.name }}</div>
              </div>
              <div
                class="plus"
                @click="plus"/>
            </div>
          </div>

          <div
            class="need-material-box3"
            v-if="currentGift.rareType === '3'">
            <div class="material-box">
              <div
                class="subtraction"
                @click="subtract"
              />
              <div class="need-material">
                <div class="num">x{{ currentGift.material.combineNum }}</div>
                <img :src="currentGift.material.img">
                <div class="name">{{ currentGift.material.name }}</div>
              </div>
              <div
                class="plus"
                @click="plus"/>
            </div>
            <div class="material-gift">
              <div class="num">x{{ currentGift.materialGift[0].combineNum }}</div>
              <img :src="currentGift.materialGift[0].img">
              <div class="name">{{ currentGift.materialGift[0].name }}</div>
            </div>
          </div>

          <div
            class="need-material-box4"
            v-if="currentGift.rareType === '4'">
            <div class="material-gift">
              <div class="num">x{{ currentGift.materialGift[0].combineNum }}</div>
              <img :src="currentGift.materialGift[0].img">
              <div class="name">{{ currentGift.materialGift[0].name }}</div>
            </div>
            <div class="material-box">
              <div
                class="subtraction"
                @click="subtract"
              />
              <div class="need-material">
                <div class="num">x{{ currentGift.material.combineNum }}</div>
                <img :src="currentGift.material.img">
                <div class="name">{{ currentGift.material.name }}</div>
              </div>
              <div
                class="plus"
                @click="plus"/>
            </div>
            <div class="material-gift">
              <div class="num">x{{ currentGift.materialGift[1].combineNum }}</div>
              <img :src="currentGift.materialGift[1].img">
              <div class="name">{{ currentGift.materialGift[1].name }}</div>
            </div>
          </div>
          <div
            class="combine-btn"
            @click="combine">合成</div>
          <div class="corner-bottom"/>
        </div>
      </div>
      <div class="material">
        <p class="title">我的炼金材料</p>
        <div class="ma-list">
          <div
            class="time fl"
            v-show="liveStatus.takeAll"
          > 今日材料已全部领取<span class="getit"/></div>
          <div
            class="time fl"
            @click="receive"
            v-show="liveStatus.canTake">
            <span class="canGet">点击领取奖励！</span>
            <img
              class="canReceive"
              :src="materialASrc"
            >x{{ liveStatus.canTakeNum }}
          </div>
          <div
            class="time fl"
            v-show="liveStatus.timeLeft">
            再在线{{ liveStatus.timeLeft }}分钟，可获得
            <img :src="materialASrc">
            x{{ liveStatus.canTakeNum }}
          </div>
          <div
            v-show="showAnimation"
            class="animation">
            <img :src="materialASrc">
          </div>
          <ul class="my-material fr">
            <li
              v-for="(item,index) in materialArr"
              :key="index"
              :class="['material'+index]"
            >
              <img :src="item.img">
              <span>x{{ item.num }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mask"
        v-if="showPopup">
        <div class="popup">
          <div class="corner-top"/>
          <p
            class="msg"
            v-html="popup.msg"/>
          <div class="btn-box">
            <div
              class="cancel fl"
              @click="cancel">取消</div>
            <div
              class="sure fr"
              @click="sure"
            >{{ popup.sureText }}</div>
          </div>
          <div class="corner-bottom"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import layer from 'layer'
import {refreshBackpack} from 'common'

export default {
    filters: {
        giftClass (item) {
            let className = ''
            if (item.isChoose) {
                className += 'active '
            }
            switch (item.rareType) {
            case '1':
                return className + 'rare1'
            case '2':
                return className + 'rare2'
            case '3':
                return className + 'rare3'
            case '4':
                return className + 'rare4'
            }
        }
    },
    props:{
        targetIndex:{
            default:0,
            type:Number
        },
        targetArr:{
            default:[],
            type:Array
        }
    },
    data () {
        return {
            showLoading: true, // 是否展示loading
            // preTimer: 0,
            timer: 0,
            progress: 0,
            currentIndex: 0, // 当前选择的卡片下标
            currentGift: {
                pid: 0, // 合成礼物id
                price: 0,
                commonGift: {
                    pid: 0,
                    name: '',
                    // img: '/',
                    num: 1, // 当前拥有的数量
                    combineNum: 0, // 合成所需要的数量
                    productId: 1001
                },
                rareType: 1, // 稀有类型 1 稀有 2 非凡 3 史诗 4 传说
                material: {
                    id: 0,
                    name: '',
                    num: 0,
                    basePercent: 0,
                    materialId: 0,
                    increasePercent: 0
                },
                materialGift: []
            }, // 当前礼物
            giftList: [], // 要炼化的礼物列表
            progressValue: 0, // 当前进度值
            materialArr: [], // 我的炼金材料
            showPopup: false,
            popup: {
                msg: '',
                sureText: ''
            },
            showAnimation: false, // 展示领取动效
            liveStatus: {
                takeAll: false, // 当日是否已领取完
                canTake: true, // 当前是否可领取
                canTakeNum: 1, // 当前可领取数量
                timeLeft: 30 // 剩余时间
            },
            moveArr: [],
            giftCardNum: 0,
            statusTimer: 0,
            materialASrc: 'https://static.guojiang.tv/app/img/game/gift_combine_material/1.png'
        }
    },
    computed: {
        successValue () {
            const result = this.currentGift.material.basePercent + this.progressValue
            return result >= 100 ? 100 : result
        }

    },
    created () {
        if (this.$route.params.removeLoading === 1) {
            this.showLoading = false
        }
        this.getGiftList()
        this.getMyMaterial()
        this.getLiveStatus()
        this.statusTimer = setInterval(() => {
            this.getLiveStatus()
        }, 60000)
        // this.$nextTick(() => {
        //     this.preTimer = setInterval(()=>{
        //         this.progress++
        //         if (this.progress >= 65) {
        //             clearInterval(this.preTimer)
        //             this.preTimer = null
        //         }
        //     },0)
        // })
    },
    mounted () {
        document.onreadystatechange = this.loading
    },
    destroyed () {
        clearInterval(this.statusTimer)
        this.statusTimer = null
    },
    methods: {
        // 深拷贝
        deepCopy (obj, cache) {
            function find (list, f) {
                return list.filter(f)[0]
            }
            if (cache === void 0) cache = []
            if (obj === null || typeof obj !== 'object') {
                return obj
            }
            var hit = find(cache, function (c) { 
                return c.original === obj 
            })
            if (hit) {
                return hit.copy
            }
            var copy = Array.isArray(obj) ? [] : {}
            cache.push({
                original: obj,
                copy: copy
            })
            Object.keys(obj).forEach((key) => {
                copy[key] = this.deepCopy(obj[key], cache)
            })
            return copy
        },
        loading () {
            if (document.readyState === 'complete') {
                this.timer = setInterval(() => {
                    this.progress++
                    if (this.progress >= 100) {
                        clearInterval(this.timer)
                        this.timer = null
                        this.showLoading = false
                    }
                }, 0)
            }
        },
        // 获取合成礼物列表
        getGiftList (itemIndex) {
            this.axios.get('/giftCombine/giftList')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        let temp = data.data
                        temp.map((item, index) => {
                            if (index === 0) {
                                item.isChoose = true
                            } else {
                                item.isChoose = false
                            }
                            // 设置默认所需炼金材料数量为1
                            item.material.combineNum = 1
                            item.material.num -= 1
                        })
                        this.giftList = data.data
                        this.giftCardNum = this.giftList.length + 1
                        this.currentGift = this.deepCopy(this.giftList[0])
                        if (this.targetIndex) { //组件传过来的当前选中卡片
                            this.moveArr = this.targetArr
                            this.choose(this.giftList[this.targetIndex], this.targetIndex)
                        }
                        if(itemIndex){ // 非组件传过来的当前选中卡片 领取材料时
                            this.choose(this.giftList[itemIndex], itemIndex)
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
        // 获取我的炼金材料
        getMyMaterial () {
            this.axios.get('/giftCombine/myMaterials')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.materialArr = data.data
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
        choose (item, index) {
            this.giftList.map(item => {
                item.isChoose = false
                item.material.combineNum = 1
            })
            this.currentIndex = index
            this.$emit('report-index',index)
            item.isChoose = true
            this.progressValue = 0
            this.currentGift = this.deepCopy(this.giftList[index])
            this.move(index)
        },
        // 当前合成礼物卡片居中
        move (i) {
            if (this.moveArr.length === 0) {
                const itemHeight = parseInt(window.getComputedStyle(this.$refs.currentItem[0]).height)
                const boxHeight = parseInt(window.getComputedStyle(this.$refs.parent).height)
                const moveY = itemHeight - (boxHeight / 2) + (itemHeight / 2)
                this.moveArr = [0, moveY]
                for (let i = 1; i < this.giftCardNum - 1; i++) {
                    this.moveArr.push((itemHeight * i) + moveY)
                }
                this.$emit('report-move-arr',this.moveArr)
            } else {
                this.$nextTick(()=>{
                    this.$refs.parent.scrollTop = this.moveArr[i]
                })
            }
        },
        // 购买
        purchase (pid) {
            if (!navigator.onLine) {
                layer.open({
                    content: '网络不给力',
                    time: 3,
                    skin: 'msg'
                })
                return false
            }
            this.axios.get('/giftCombine/buyProduct', {
                params: {
                    productId: pid,
                    num: 1
                }
            })
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.currentGift.commonGift.num += 1
                        this.giftList[this.currentIndex].commonGift.num += 1
                        // 刷新背包
                        refreshBackpack()
                        layer.open({
                            content: '购买成功，已发放至您的背包',
                            time: 1,
                            skin: 'msg'
                        })
                    } else if (data.errno === 111) {
                        // 余额不足 打开全屏充值页
                        gBridge.recharge()
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
        // 减少一个炼金材料
        subtract () {
            if (this.currentGift.material.combineNum === 1) {
                layer.open({
                    content: '不能低于当前投入数量',
                    skin: 'msg',
                    time: 3
                })
                return false
            }
            this.currentGift.material.num += 1
            this.currentGift.material.combineNum -= 1
            this.progressValue -= this.currentGift.material.increasePercent
        },
        // 增加一个炼金材料
        plus () {
            if (this.currentGift.material.num <= 0) {
                layer.open({
                    content: '没有更多的该炼金材料可以投入',
                    skin: 'msg',
                    time: 3
                })
                return false
            }
            if (this.successValue >= 100) {
                layer.open({
                    content: '本次合成不需要投入更多的材料',
                    skin: 'msg',
                    time: 3
                })
                return false
            }
            this.currentGift.material.num -= 1
            this.currentGift.material.combineNum += 1
            this.progressValue += this.currentGift.material.increasePercent
        },
        combine () {
            if (!navigator.onLine) {
                layer.open({
                    content: '网络不给力',
                    time: 3,
                    skin: 'msg'
                })
                return false
            }

            function noMaterialTips () {
                layer.open({
                    content: '合成材料不足，无法合成',
                    skin: 'msg',
                    time: 3
                })
            }
            // 判断普通合成材料是否充足
            if (this.currentGift.commonGift.num < this.currentGift.commonGift.combineNum) {
                noMaterialTips()
                return false
            }
            // 判断炼金材料是否充足
            if (this.currentGift.material.num < 0) {
                noMaterialTips()
                return false
            }
            // 当有合成礼物材料是判断合成礼物材料是否充足
            if (this.currentGift.materialGift.length > 0) {
                if (this.currentGift.materialGift.some(item =>
                    item.num === 0
                )) {
                    noMaterialTips()
                    return false
                }
            }

            // 计算合成概率传给接口
            this.currentGift.percent = this.successValue
            this.popup = {
                type: 2,
                msg: `当前合成成功率为${this.successValue}%，<br>确认合成吗？`,
                sureText: '确认'
            }
            this.showPopup = true
        },
        // 获取在线状态
        getLiveStatus () {
            this.axios.get('/giftCombine/liveStatus')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.liveStatus = data.data
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
        // 领取炼金材料奖励
        receive () {
            this.axios.get('/giftCombine/addMaterial')
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        this.showAnimation = true
                        setTimeout(() => {
                            this.showAnimation = false
                            this.getGiftList(this.currentIndex)
                            this.getMyMaterial()
                            this.getLiveStatus()
                        }, 1500)
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
        cancel () {
            this.showPopup = false
        },
        sure () {
            this.showPopup = false
            // 合成弹窗
            this.$router.push({
                name: 'combine',
                params: this.currentGift
            })
        }
    }

}
</script>
