<template>
    <div class="final-page final-rank l-list">
        <!-- tab -->
        <div class="com-r-tab fl-box">
            <div
                :class="['tab-i btn hj-tab-s', rankType === 'hot' ? 'tab-hotr-a' : 'tab-hotr']"
                @click="changeATab('hot')">人气榜</div>
            <div
                :class="['tab-i btn hj-tab-s', rankType === 'joy' ? 'tab-joyr-a' : 'tab-joyr']"
                @click="changeATab('joy')">娱乐榜</div>
        </div>
        <!-- timeline -->
        <div class="f-r-timeline">
            <div class="final-s f-timeline"/>
            <div
                class="time-node btn one"
                @click="changeDate(1)">
                <div :class="['time-icon final-s', calcDateClass(1)]"/>
                <div :class="'time-date final-s date-0624' + (currStage < 1 ? '-d' : '')"/>
                <div :class="'time-range final-s f-range-1' + (currStage < 1 ? '-d' : (showStage === 1 ? '-a' :''))"/>
            </div>
            <div
                class="time-node btn two"
                @click="changeDate(2)">
                <div :class="['time-icon final-s', calcDateClass(2)]"/>
                <div :class="'time-date final-s date-0625' + (currStage < 2 ? '-d' : '')"/>
                <div :class="'time-range final-s f-range-2' + (currStage < 2 ? '-d' : (showStage === 2 ? '-a' :''))"/>
            </div>
        </div>
        <!-- rank list -->
        <div class="l-thead global-s l-head-bg">
            <div class="l-th cell-1"><div class="global-s txt-pm">排名</div></div>
            <div class="l-th cell-2"><div class="global-s txt-mod">主播</div></div>
            <div class="l-th cell-3"><div class="global-s txt-ry-value">荣耀值</div></div>
        </div>
        <!-- rank body -->
        <div :class="['l-tbody', `${rankType}_${showStage}`]">
            <template
                v-for="(item, ind) in ranklist">
                <div
                    :key="`final_${rankType}_${showStage}_${ind}`"
                    :class="['l-tr', 'l-tr-' + ind]">
                    <div class="l-td cell-1">{{ (ind + 1) | rankIndex }}</div>
                    <div class="l-td cell-2">
                        <div class="headpic">
                            <img
                                v-if="item"
                                :src="item.headPic"
                                :alt="item.nickname"
                                class="avatar"
                                @click="goRoom(item)">
                            <span
                                v-else
                                class="avatar-holder" />
                            <span
                                v-show="item && item.isPlaying"
                                class="global-s icon-live"/>
                        </div>
                        <div class="infos">
                            <div class="names fl-ver">
                                <p class="nick txt-of">{{ item ? item.nickname : '虚位以待' }}</p>
                                <span
                                    v-if="item"
                                    :class="'level_icon m_level_icon_' + item.level"/>
                            </div>
                        </div>
                    </div>
                    <div class="l-td cell-3 txt-of">{{ item ? item.score : '-' }}</div>
                </div>
                <div
                    v-if="showStage === 1 && ind === 2"
                    :key="'final_rank_sep_' + ind"
                    :class="['final-txt-rank-sep', currStage === 1 ? 'curr' : 'ago']"/>
            </template>
        </div>
        <!-- sep -->
        <!-- me-center -->
        <div
            v-if="currRank.meCenter"
            class="me-center fl-box">
            <div class="lefter">
                <div class="headpic">
                    <img
                        :src="currRank.meCenter.headPic"
                        :alt="currRank.meCenter.nickName"
                        class="avatar"
                        @click="goRoom(currRank.meCenter)">
                    <span
                        v-if="currRank.meCenter.isPlaying"
                        class="global-s icon-live"/>
                </div>
                <div class="nick fl-box">
                    <div class="name txt-of">{{ currRank.meCenter.nickName }}</div>
                    <span :class="'level_icon m_level_icon_' + currRank.meCenter.level"/>
                </div>
            </div>
            <div class="status fl-box">
                <div
                    v-for="(s, si) in [0, 2, 1, 3]"
                    :key="'lu_si_mod_' + si"
                    class="status-i">
                    <div class="name">{{ currRank.meCenter.pairInfos[s].name }}</div>
                    <div class="value txt-of">{{ currRank.meCenter.pairInfos[s].value }}</div>
                </div>
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
    .final-s {
        background: url('@{imgUrl}/final-s.png') no-repeat;
        background-size: 1881/@bf 258/@bf;
        font-size: 0px;
        display: block;
    }

    .f-hot-2 {
        .getSprite(162, 72, -921, -121);
    }
    .f-hot-3 {
        .getSprite(162, 72, -1103, -121);
    }
    .f-joy-1 {
        .getSprite(162, 72, -1285, -121);
    }
    .f-joy-2 {
        .getSprite(162, 72, -1467, -121);
    }
    .f-joy-3 {
        .getSprite(162, 72, -1649, -121);
    }
    .f-range-1 {
        .getSprite(181, 59, -1335, -36);
    }
    .f-range-1-a {
        .getSprite(187, 65, -921, -36);
    }
    .f-range-2 {
        .getSprite(181, 59, -1536, -36);
    }
    .f-range-2-a {
        .getSprite(187, 65, -1128, -36);
    }
    .f-range-2-d {
        .getSprite(181, 59, -360, -96);
    }
    .f-timeline {
        .getSprite(950, 6, -921, -10);
    }
    .f-tt-sep {
        .getSprite(891, 23, -10, -10);
    }
    .f-tt-sep2 {
        .getSprite(891, 23, -10, -53);
    }
    .date-0624 {
        .getSprite(86, 35, -1028, -213);
    }
    .date-0624-d {
        .getSprite(86, 35, -1134, -213);
    }
    .date-0625 {
        .getSprite(87, 35, -1737, -36);
    }
    .date-0625-d {
        .getSprite(87, 35, -921, -213);
    }
    .f-date-i {
        .getSprite(38, 38, -1831, -121);
    }
    .f-date-i-a {
        .getSprite(148, 152, -10, -96);
    }
    .f-date-i-d {
        .getSprite(38, 38, -561, -96);
    }
    .f-hot-1 {
        .getSprite(162, 72, -178, -96);
    }
}
.SET_SPRITE();

.final-page {
    margin: 146/@bf auto 0;
    width: 1020/@bf;
    border: 6/@bf solid #bf9a42;
    padding-bottom: 20/@bf;

    .l-thead {
        margin-top: 20/@bf;
    }
}

.f-r-timeline {
    width: 960/@bf;
    padding-top: 80/@bf;
    padding-bottom: 96/@bf;
    margin: 0 auto;
    position: relative;

    .time-node {
        width: 230/@bf;
        height: 160/@bf;
        position: absolute;
        top: 20/@bf;
    }

    .time-node.one {
        left: 210/@bf;
    }

    .time-node.two {
        right: 210/@bf;
    }

    .time-icon {
        position: absolute;
        top: 44/@bf;
        left: 50%;
        transform: translateX(-50%);

        &.lu-date-i-a {
            top: 41/@bf;
        }
    }

    .time-date {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
    }

    .time-range {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
    }

    .f-range-1-a,
    .f-range-2-a {
        bottom: -3/@bf;
    }
}

.final-txt-rank-sep {
    @scale: 1.5;
    width: 898/@bf;
    height: 40/@bf;
    margin: 50/@bf auto 26/@bf;
    overflow: hidden;
    position: relative;

    &:before {
        content: '';
        .final-s;
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translateX(-50%) scale(1.5);
    }

    &.curr:before {
        .f-tt-sep;
    }

    &.ago:before {
        .f-tt-sep2;
    }
}
</style>

<script>
// 决赛页面
import { getModRank } from '../service'

export default {
    name: 'FinalPage',
    filters: {
        rankIndex (value) {
            if (value < 10) {
                return '0' + value
            } else {
                return value
            }
        }
    },
    data () {
        return {
            pageInited: false,
            activityId: ['1937', '1936'], // 决赛 id

            rankType: 'hot', // hot - 人气榜 joy - 娱乐榜

            currStage: 1, // 实际阶段
            showStage: 1, // 当前显示阶段

            rankMaxNum: [6, 3],
            currRank: {
                hasNext: true,
                loading: false,
                currPage: 0,
                list: [],
                meCenter: null
            }
        }
    },
    computed: {
        ranklist () {
            // 占位符
            let holders = []
            for (let i = 0, len = this.rankMaxNum[this.showStage - 1] - this.currRank.list.length; i < len; i++) {
                holders.push(null)
            }
            return this.currRank.list.concat(holders)
        }
    },
    mounted () {
        this.$root.pageLoad(5)
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
        console.debug('[Levelup Page][route] update')
        this.initShare()
        next()
    },
    methods: {
        initPage () {
            this.pageInited = true

            // stage = 9 / 10
            this.currStage = this.$root.stage - 8
            this.showStage = this.currStage

            // 加载第一页数据
            this.$root.showLoading()
            this.loadRank().then(() => {
                this.$root.hideLoading()
            })
        },
        initShare () {
            this.$root.setShare(4)
        },
        changeATab (type) {
            if (type === this.rankType) return

            this.rankType = type
            this.showStage = this.currStage

            this.refreshRank()
        },
        calcDateClass (dateI) {
            if (this.currStage < dateI) {
                return 'f-date-i-d'
            }

            if (dateI === this.showStage) {
                return 'f-date-i-a'
            }

            return 'f-date-i'
        },
        changeDate (dateI) {
            if (dateI > this.currStage || dateI === this.showStage) { // 阶段未到
                return
            }
            this.showStage = dateI

            this.refreshRank()
        },
        // 刷新榜单
        refreshRank () {
            this.currRank.hasNext = true
            this.currRank.list = []
            this.currRank.currPage = 0
            this.currRank.loading = false

            this.$root.showLoading()
            this.loadRank().then(() => {
                this.$root.hideLoading()
            })
        },
        // 加载榜单
        loadRank () {
            let activityId = this.activityId[this.showStage - 1]
            return this.$root.loadRank(
                this.currRank,
                getModRank,
                this.rankMaxNum[this.showStage - 1],
                `[FinalRank][${this.showStage}][${this.rankType}]`,
                {
                    activityId,
                    group: this.rankType === 'hot' ? 1 : 2
                }
            )
        },
        // proxy
        goRoom (item) {
            this.$root.goRoom(item)
        }
    }
}
</script>
