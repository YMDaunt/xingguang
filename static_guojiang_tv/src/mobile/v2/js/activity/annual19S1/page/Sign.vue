<template>
    <div class="sign-page">
        <div
            v-show="!signEnded"
            class="counting sign-s tc-bg">
            <div
                ref="counttime"
                class="time"/>
        </div>
        <p class="rule-p flex">
            <span class="label">报名时间：</span>
            <span class="text">6.15 00:00:00 - 6.15 19:59:59。</span>
        </p>
        <p class="rule-p flex">
            <span class="label">报名范围：</span>
            <span class="text">预选赛晋级的100强主播。</span>
        </p>
        <p class="rule-p flex m-btm">
            <span class="label">报名说明：</span>
            <span class="text">1. 100位主播可自由报名人气/娱乐赛道，每个赛道最多只能报名50位主播，若在报名时间内有主播未报名，则由系统随机分配到未满赛道。<br><i class="text-sep"/>2. 确认报名后，将不可变更赛道。每个主播只能参加其中一条赛道，请谨慎操作！<br><i class="text-sep"/>3. 6月15日22:00:00将公布所有赛道主播。</span>
        </p>

        <!-- 我的赛道 -->
        <div
            v-if="canSignUp"
            class="my-path">
            <div class="headpic">
                <img
                    :src="myInfos.headpic"
                    alt=""
                    class="avatar">
            </div>
            <span class="sign-s txt-my-path">我的赛道</span>
            <span class="sign-value">{{ groupName }}</span>
        </div>

        <!-- 年度人气主播 -->
        <div class="mod-list hot-mod">
            <div class="mod-list-head fl-box">
                <div class="mod-pic hot-mod-pic">年度人气主播</div>
                <div class="mod-status">
                    <p class="progress">{{ hotSignedNum }}/50</p>
                    <div
                        v-if="canSignUp"
                        :class="['btn sign-s', (!signEnded && myGroup === -1) ? 'btn-sign' : 'btn-sign-d']"
                        @click="(!signEnded && myGroup === -1) && toggleModal(1)">报名</div>
                </div>
            </div>
            <!-- list -->
            <div :class="['list-wrap', hotModShow && 'show-all']">
                <template v-if="!showResult">
                    <div
                        v-for="(i, ind) in 50"
                        :key="'hot-mod-' + ind"
                        :class="['list-i sign-s', ind < hotSignedNum ? 'avatar-token' : 'avatar-holder']"/>
                </template>
                <template v-else>
                    <div
                        v-for="(i, ind) in hotList"
                        :key="'hot-mod-' + ind"
                        class="list-i list-mod"
                        @click="goRoom(i)">
                        <img
                            :src="i.headPic"
                            :alt="i.nickname"
                            class="avatar" >
                        <span
                            v-show="i.isPlaying"
                            class="global-s icon-live"/>
                    </div>
                </template>
            </div>
            <!-- status toggle btn -->
            <div
                :class="['sign-s line-more btn btn-more', hotModShow && 'active']"
                @click="showAll('hotModShow')"/>
        </div>

        <!-- 年度娱乐主播 -->
        <div class="mod-list joy-mod">
            <div class="mod-list-head fl-box">
                <div class="mod-pic joy-mod-pic">年度娱乐主播</div>
                <div class="mod-status">
                    <p class="progress">{{ joySignedNum }}/50</p>
                    <div
                        v-if="canSignUp"
                        :class="['btn sign-s', (!signEnded && myGroup === -1) ? 'btn-sign' : 'btn-sign-d']"
                        @click="(!signEnded && myGroup === -1) && toggleModal(2)">报名</div>
                </div>
            </div>
            <!-- list -->
            <div :class="['list-wrap', joyModShow && 'show-all']">
                <template v-if="!showResult">
                    <div
                        v-for="(i, ind) in 50"
                        :key="'joy-mod-' + ind"
                        :class="['list-i sign-s', ind < joySignedNum ? 'avatar-token' : 'avatar-holder']"/>
                </template>
                <template v-else>
                    <div
                        v-for="(i, ind) in joyList"
                        :key="'joy-mod-' + ind"
                        class="list-i list-mod"
                        @click="goRoom(i)">
                        <img
                            :src="i.headPic"
                            :alt="i.nickname"
                            class="avatar" >
                        <span
                            v-show="i.isPlaying"
                            class="global-s icon-live"/>
                    </div>
                </template>
            </div>
            <!-- status toggle btn -->
            <div
                :class="['sign-s line-more btn btn-more', joyModShow && 'active']"
                @click="showAll('joyModShow')"/>
        </div>

        <!-- confirm modal -->
        <div
            v-show="modalShow"
            class="modal-layer">
            <div class="modal-content">
                <div
                    class="global-s btn-close btn"
                    @click="toggleModal"/>
                <p class="modal-h">小主，确定报名年度{{ signType === 1 ? '人气' : '娱乐' }}主播赛道吗？</p>
                <div class="modal-opt fl-box">
                    <div
                        class="sign-s btn sign-cancel"
                        @click="signCancel"/>
                    <div
                        class="sign-s btn sign-confirm"
                        @click="signConfirm"/>
                </div>
                <p class="modal-tips">提示：报名成功后，无法更改赛道，请谨慎操作！</p>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../img/activity/annual19S1';

.getSpritePad (@w, @h, @posx, @posy, @pad) {
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}
.getSprite (@w, @h, @posx, @posy) {
    .getSpritePad(@w, @h, @posx, @posy, 5);
}

.SET_SPRITE () {
    .sign-s {
        background: url('@{imgUrl}/sign-s.png') no-repeat;
        background-size: 1637/@bf 348/@bf;
        font-size: 0px;
        display: block;
    }

    .line-more {
        .getSprite(802, 36, -825, -10);
    }
    .tc-bg {
        .getSprite(795, 101, -10, -10);
    }
    .txt-my-path {
        .getSprite(177, 38, -1199, -174);
    }
    .sign-cancel {
        .getSprite(253, 88, -383, -131);
    }
    .sign-confirm {
        .getSprite(254, 88, -1199, -66);
    }
    .avatar-holder {
        .getSprite(167, 167, -825, -66);
    }
    .avatar-token {
        .getSprite(167, 167, -1012, -66);
    }
    .btn-sign {
        .getSprite(212, 71, -10, -267);
    }
    .btn-sign-d {
        .getSprite(212, 71, -242, -267);
    }
    .icon-wing2 {
        .getSprite(353, 116, -10, -131);
    }
}

.SET_SPRITE();

.sign-page {
    margin-top: 100/@bf;

    .counting {
        margin: 0 auto 50/@bf;
        padding-left: 390/@bf;
        display: flex;
        align-items: center;
    }

    .time {
        font-size: 50/@bf;
        color: #ff5f57;
        transform: skewX(-10deg);
    }

    .m-btm {
        margin-bottom: 60/@bf;
    }

    .my-path {
        width: 1039/@bf;
        height: 318/@bf;
        background: url('@{imgUrl}/path-bg.jpg') no-repeat;
        background-size: cover;
        margin: 0 auto 40/@bf;
        position: relative;

        .headpic {
            width: 245/@bf;
            height: 245/@bf;
            border: 6/@bf solid #d0ad5a;
            padding: 6/@bf;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-112%, -50%);

            &:after {
                content: '';
                .sign-s;
                .icon-wing2;
                position: absolute;
                top: 38%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .avatar {
            display: block;
            width: 100%;
            height: 100%;
            border: 3/@bf solid #d0ad5a;
            border-radius: 50%;
            overflow: hidden;
            background: #601607;
        }

        .txt-my-path {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(60/@bf, -100%);
        }

        .sign-value {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(140/@bf, 10%) skewX(-10deg);
            font-size: 40/@bf;
            color: #ffe476;
        }
    }

    .mod-list {
        width: 1038/@bf;
        margin: 0 auto 40/@bf;
        border: 1px solid #f9ea95;
        border-radius: 12/@bf;
        background: #28100d;
        overflow: hidden;
    }

    .mod-list-head {
        height: 404/@bf;
        background: url('@{imgUrl}/sign-bg.jpg') no-repeat;
        background-size: cover;
    }

    .mod-pic {
        font-size: 0px;
        margin-left: 60/@bf;
    }

    .hot-mod-pic {
        width: 355/@bf;
        height: 400/@bf;
        background: url('@{imgUrl}/pic-hot-mod.png') no-repeat;
        background-size: cover;
    }

    .joy-mod-pic {
        width: 336/@bf;
        height: 408/@bf;
        background: url('@{imgUrl}/pic-joy-mod.png') no-repeat;
        background-size: cover;
    }

    .mod-status {
        width: 422/@bf;
        display: flex;
        flex-direction: column;
        align-items: center;

        .progress {
            font-size: 50/@bf;
            color: #ffe476;
            text-align: center;
            font-weight: bold;
            transform: skewX(-10deg);
        }
    }

    .btn-sign, .btn-sign-d {
        margin-top: 30/@bf;
    }

    .list-wrap {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20/@bf;
        height: 184/@bf;
        overflow: hidden;

        &.show-all {
            height: 1960/@bf;
        }
    }

    .list-i {
        margin: 10/@bf 14/@bf;
    }

    .list-mod {
        width: 172/@bf;
        height: 172/@bf;
        border: 6/@bf solid #C19B3F;
        padding: 2px;
        border-radius: 50%;
        position: relative;

        .avatar {
            display: block;
            width: 100%;
            height: 100%;
            border: 1px solid #C19B3F;
            border-radius: 50%;
            overflow: hidden;
        }

        .icon-live {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(15%, 10%);
        }
    }

    .btn-more {
        margin: 40/@bf auto 20/@bf;

        &.active {
            transform: rotate(-180deg);
        }
    }

    .modal-content {
        width: 920/@bf;
        height: 375/@bf;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &:before {
            content: '';
            display: block;
            width: 1080/@bf;
            height: 626/@bf;
            background: url('@{imgUrl}/modal-bg.png') no-repeat;
            background-size: cover;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);;
            z-index: -1;
        }

        .btn-close {
            position: absolute;
            top: 0px;
            right: 0px;
            z-index: 22;
            transform: translateY(-100%);
        }
    }

    .modal-h {
        font-size: 46/@bf;
        color: #ffe476;
        text-align: center;
        margin-top: 74/@bf;
    }

    .modal-opt {
        margin-top: 50/@bf;

        .btn {
            margin: 0px 70/@bf;
        }
    }

    .modal-tips {
        margin-top: 16/@bf;
        font-size: 30/@bf;
        text-align: center;
        color: #ffe476;
        opacity: .5;
        transform: skewX(-10deg);
    }
}
</style>

<script>
// 赛道报名阶段
import { getSignList, signPath } from '../service'

export default {
    name: 'SignPage',
    data () {
        return {
            pageInited: false, // lock
            activityId: '1945', // 赛道报名id

            hotModShow: false,
            joyModShow: false,

            modalShow: false,

            canSignUp: false,
            myGroup: -1,
            myInfos: {
                headpic: ''
            },

            signType: -1,

            signEnded: false,
            showResult: false, // 是否显示结果列表
            hotSignedNum: 0, // 人气赛道 已报名人数
            joySignedNum: 0, // 娱乐赛道 已报名人数
            hotList: [],
            joyList: []
        }
    },
    computed: {
        groupName () {
            if (this.myGroup === -1) {
                return '还未报名'
            }

            if (this.myGroup === 1) {
                return '人气赛道'
            }

            if (this.myGroup === 2) {
                return '娱乐赛道'
            }

            return ''
        }
    },
    mounted () {
        this.$root.pageLoad(2)
    },
    beforeRouteEnter (to, from, next) {
        // 在进入时触发一次 后续触发update
        next(vm => {
            vm.initShare()

            vm.$root.inited && !vm.pageInited && vm.initPage() // 页面从其他跳转过来 root 没有初始化相关信息
        })
    },
    beforeRouteUpdate (to, from, next) {
        // 离开改页面后 重新进入时触发
        console.debug('[Qualifier Page][route] update')
        this.initShare()
        next()
    },
    methods: {
        initPage () {
            this.pageInited = true // lock 初始化加锁

            if (this.$root.stage > 2) {
                this.showResult = true
                this.signEnded = true
            } else {
                // 时间相关信息判断
                let stageTime = this.$root.stageInfos.filter(item => {
                    return item.id === this.activityId
                })[0]
                let stageST = new Date(stageTime.startTime.replace(/-/g, '/'))
                let signET = new Date(stageST.getTime() + 20 * 3600000) // 计算 报名结束时间
                let showET = new Date(stageST.getTime() + 22 * 3600000) // 计算 显示时间
                let nowTime = new Date(this.$root.serverTime.replace(/-/g, '/'))
                nowTime.setMilliseconds(nowTime.getMilliseconds() + Date.now() - new Date(this.$root.initTime)) // 当前时间修正

                // 已经结束
                if (nowTime > showET) { // 全部结束
                    this.showResult = true
                    this.signEnded = true
                } else if (nowTime > signET) { // 报名结束
                    this.signEnded = true
                } else { // 未结束
                    this.counttime(signET - nowTime) // 倒计时
                }
            }

            this.$root.showLoading()
            this.initSign().then(() => {
                this.$root.hideLoading()
            }) // 初始化我的报名信息
        },
        initShare () {
            this.$root.setShare(1)
        },
        signCancel () {
            this.modalShow = false
        },
        signConfirm () {
            this.$root.showLoading()
            signPath(this.signType).then(data => {
                this.myGroup = this.signType
                let pathName = ''
                if (this.signType === 1) {
                    this.hotSignedNum = data.num
                    pathName = '人气'
                } else {
                    this.joySignedNum = data.num
                    pathName = '娱乐'
                }
                this.$root.showToast(`小主，你已经成功报名年度${pathName}主播赛道！祝好运！`)
            }).then(() => {
                this.$root.hideLoading()
                this.modalShow = false
            }).catch(err => {
                this.$root.hideLoading()
                this.$root.showToast(err.message)
            })
        },
        toggleModal (type) {
            this.modalShow = !this.modalShow

            if (this.modalShow) {
                this.signType = type
            }
        },
        showAll (type) {
            this[type] = !this[type]
        },
        initSign () {
            return getSignList().then(data => {
                // ! test node
                // data.canEnroll = true

                this.hotSignedNum = data.popularityCurrentNum
                this.joySignedNum = data.entertainmentCurrentNum
                this.canSignUp = data.canEnroll || data.isEnrolled

                if (this.canSignUp) { // 能报名
                    this.myInfos.headpic = data.headPic

                    if (data.isEnrolled) { // 已报名
                        this.myGroup = data.myGroup
                    } else { // 未报名
                        this.myGroup = -1
                    }
                }

                if (this.signEnded) { // 报名已结束
                    this.hotList = data.popularity
                    this.joyList = data.entertainment
                }
            })
        },
        // 倒计时
        counttime (time) {
            let self = this
            let timeEl = this.$refs.counttime
            let sT = time
            let beginT = Date.now() // closure

            function run () {
                let nowT = Date.now()
                let leftT = (sT - (nowT - beginT)) / 1000 >> 0 // 倒计时间 s
                let hs = leftT / 3600 >> 0 // hours
                let mins = (leftT % 3600) / 60 >> 0 // mins
                let secs = leftT % 60
                let timeText = `${hs}时${mins}分${secs}秒`

                timeEl.innerText = timeText

                if (leftT > 0) {
                    setTimeout(run, 1000)
                } else { // 倒计时结束
                    self.signEnded = true
                    self.initSign()
                }
            }

            run()
        },
        // proxy
        goRoom (item) {
            this.$root.goRoom(item)
        }
    }
}
</script>
