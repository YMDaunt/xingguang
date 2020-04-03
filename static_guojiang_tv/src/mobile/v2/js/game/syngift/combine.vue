<!--
 * @Date: 2020-03-03 11:24:50
 * @LastEditors: Jesse
 * @LastEditTime: 2020-03-07 18:56:40
 -->
<template>
  <section class="combine-mod">
    <div class="header">
      <div class="title" />
      <router-link
        to="/manual"
        v-show="showResult"
        class="manual-btn fr" />
      <router-link
        to="/history"
        v-show="showResult"
        class="history-btn fr" />
    </div>
    <div
      class="combining"
      v-show="!showResult">
      <div id="svgContainer" />
      <div class="progress-mod">
        <div class="progress" />
      </div>
      <p class="text">正在努力合成</p>
    </div>
    <div
      class="combine-success"
      v-show="showResult && combineSuccess">
      <div class="success">
        <div :class="combineGiftClass">
          <img :src="combineGift.img" >
          <div class="gift-name">{{ combineGift.name }}</div>
        </div>
      </div>
      <p>
        恭喜您合成<span :style="{color:rareTypeColor}">{{ rareType }}</span>限定礼物：{{ combineGift.name }} x1
        <br >请到您的背包中查看
      </p>
      <div
        class="goBack"
        @click="goBack">确定</div>
    </div>
    <div
      class="combine-failed"
      v-show="showResult && !combineSuccess">
      <div class="failed" />
      <p>哎呀，炼化失败！失去了炼金材料：{{ params.material.name }} x{{ params.material.combineNum }}<br>
      不要灰心，再接再厉吧~</p>
      <div
        class="goBack"
        @click="goBack">确定</div>
    </div>
  </section>
</template>
<script>
import bodymovin from '../../component/bodymovin.min.js'
import layer from 'layer'
import {refreshBackpack} from 'common'
export default {
    data () {
        return {
            svgContainer: null,
            combining: true,
            showResult: false,
            combineSuccess: false, // 是否合成成功
            combineGift: {
                // 合成成功的礼物
                img: '',
                name: ''
            },
            params: this.$route.params,
            parameters: JSON.stringify(this.$route.params)
        }
    },
    computed: {
        combineGiftClass () {
            return `rareType rare${this.params.rareType}`
        },
        rareType () {
            switch (this.params.rareType) {
            case '1':
                return '稀有级'
            case '2':
                return '非凡级'
            case '3':
                return '史诗级'
            case '4':
                return '传说级'
            }
        },
        rareTypeColor () {
            switch (this.params.rareType) {
            case '1':
                return '#ced3e1'
            case '2':
                return '#efb48a'
            case '3':
                return '#f8df88'
            case '4':
                return '#d096fd'
            }
        }

    },
    mounted () {
        // console.log(this.parameters)
        this.svgContainer = document.getElementById('svgContainer')
        this.getCombineResult()
    },
    methods: {
        getCombineResult () {
            this.axios
                .post('/giftCombine/combine', `params=${this.parameters}`)
                .then(res => {
                    let data = res.data
                    if (data.errno === 0) {
                        // 合成成功
                        this.playSvg(() => {
                            this.showResult = true
                            this.combineSuccess = true
                            refreshBackpack()
                            this.combineGift = data.data
                        })
                    } else if (data.errno === 1) {
                        // 合成失败
                        this.playSvg(() => {
                            this.showResult = true
                            this.combineSuccess = false
                        })
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 3
                        })
                        this.goBack()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 播放合成动画
        playSvg (callback) {
            this.animItem = bodymovin.loadAnimation({
                wrapper: this.svgContainer,
                animType: 'svg',
                loop: false,
                prerender: true,
                autoplay: true,
                path:
          'https://static.guojiang.tv/app/gift/h5_animation/combine/data.json'
            })
            // 动画播放完成回调
            this.animItem.addEventListener('complete', () => {
                callback()
            })
        },
        goBack () {
            this.$router.push({
                name: 'home',
                params: { removeLoading: 1 }
            })
        }
    }
}
</script>>
<style lang="less">
@bf: 108rem;
.progress-mod {
  width: 690 / @bf;
  height: 20 / @bf;
  border-radius: 10 / @bf;
  margin: 650 / @bf auto 10/@bf;
  background-color: #6b7ea1;
  .progress {
    height: 100%;
    border-radius: 10 / @bf;
    background-color: #eecf93;
    animation: progress 3.5s linear;
  }
}
.text {
  font-size: 32 / @bf;
  color: #ced3e1;
  text-align: center;
}
@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
#svgContainer {
    position:absolute;
    top:0;
    left:0;
  width: 100%;
  height: 830 / @bf;
}
.success {
  width: 832 / @bf;
  height: 503 / @bf;
  margin: 20 / @bf auto;
  background: url("../../../img/game/syngift/success.png") no-repeat 0 0 scroll;
    background-size: contain;
    overflow: hidden;
  .rareType {
    width: 204 / @bf;
    height: 204 / @bf;
    margin:155/@bf auto 0;
    background: url("../../../img/game/syngift/css_sprites_2.png") no-repeat 0 0 scroll;
    background-size: 704/@bf 703/@bf;
    overflow: hidden;
    img{
        width:130/@bf;
        height: 110/@bf;
        display: block;
        margin: 40/@bf auto 0;
    }
    .gift-name{
        font-size: 26/@bf;
        text-align: center;
    }
  }
  .rare1{
    background-position: -485/@bf -230/@bf;
        .gift-name{
            color:#ced3e1;
        }
    }
    .rare2{
        background-position: -486/@bf -6/@bf;
        .gift-name{
            color:#efb48a;
        }
    }
    .rare3{
        background-position:  -6/@bf -485/@bf;
        .gift-name{
            color:#f8df88;
        }
    }
    .rare4{
        background-position: -246/@bf -485/@bf;
        .gift-name{
            color:#d096fd;
        }
    }
}
.failed {
  width: 832 / @bf;
  height: 503 / @bf;
  margin: 20 / @bf auto;
  background: url("../../../img/game/syngift/failed.png") no-repeat 0 0 scroll;
  background-size: contain;
}
.combine-success,.combine-failed{
    margin-top:30/@bf;
    p {
        color: #ced3e1;
        font-size: 32 / @bf;
        text-align: center;
    }
}
.goBack {
  width: 298 / @bf;
  height: 92 / @bf;
  margin: 40 / @bf auto 0;
  font-size: 36 / @bf;
  line-height: 92 / @bf;
  text-align: center;
  color: #63460d;
  background-image: url("../../../img/game/syngift/css_sprites.png");
  background-size: 1100 / @bf 349 / @bf;
  background-position: -230 / @bf -226 / @bf;
}
</style>
