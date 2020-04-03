<template>
    <div class="levelup-page levelup-rank l-list">
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
        <div class="level-timeline">
            <div class="levelup-s lu-timeline"/>
            <div
                class="time-node btn one"
                @click="changeDate(1)">
                <div :class="['time-icon levelup-s', calcDateClass(1)]"/>
                <div :class="'time-date levelup-s date-0910' + (currStage < 1 ? '-d' : '')"/>
                <div :class="'time-range levelup-s t-range-1' + (currStage < 1 ? '-d' : (showStage === 1 ? '-a' :''))"/>
            </div>
            <div
                class="time-node btn two"
                @click="changeDate(2)">
                <div :class="['time-icon levelup-s', calcDateClass(2)]"/>
                <div :class="'time-date levelup-s date-11' + (currStage < 2 ? '-d' : '')"/>
                <div :class="'time-range levelup-s t-range-2' + (currStage < 2 ? '-d' : (showStage === 2 ? '-a' :''))"/>
            </div>
            <div
                class="time-node btn third"
                @click="changeDate(3)">
                <div :class="['time-icon levelup-s', calcDateClass(3)]"/>
                <div :class="'time-date levelup-s date-12' + (currStage < 3 ? '-d' : '')"/>
                <div :class="'time-range levelup-s t-range-3' + (currStage < 3 ? '-d' : (showStage === 3 ? '-a' :''))"/>
            </div>
            <div
                class="time-node btn four"
                @click="changeDate(4)">
                <div :class="['time-icon levelup-s', calcDateClass(4)]"/>
                <div :class="'time-date levelup-s date-13' + (currStage < 4 ? '-d' : '')"/>
                <div :class="'time-range levelup-s t-range-4' + (currStage < 4 ? '-d' : (showStage === 4 ? '-a' :''))"/>
            </div>
        </div>
        <!-- rank list -->
        <div class="l-thead global-s l-head-bg">
            <div class="l-th cell-1"><div class="global-s txt-pm">排名</div></div>
            <div class="l-th cell-2"><div class="global-s txt-mod">主播</div></div>
            <div class="l-th cell-3"><div class="global-s txt-ry-value">荣耀值</div></div>
        </div>
        <!-- rank body -->
        <component
            ref="lu-rank-scroller"
            :is="scroller"
            :right="3"
            :thumb-color="'#e7ca62'"
            :class="['l-tbody', 'stage-' + showStage]">
            <template
                v-for="(item, ind) in ranklist">
                <div
                    :key="`levelup_${rankType}_${showStage}_${ind}`"
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
                            <p
                                v-if="rankDesc(ind)"
                                class="desc">
                                <span class="txt">{{ rankDesc(ind) }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="l-td cell-3 txt-of">{{ item ? item.score : '-' }}</div>
                </div>
                <div
                    v-if="ind === (rankMaxNum[showStage] - 1)"
                    :key="'lu_rank_sep_' + ind"
                    class="levelup-s txt-rank-sep">以下进入复活赛</div>
            </template>
        </component>
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
                    :key="`lu_si_mod_${si}`"
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
    .levelup-s {
        background: url('@{imgUrl}/levelup-s.png') no-repeat;
        background-size: 1138/@bf 388/@bf;
        font-size: 0px;
        display: block;
    }

    .date-0910-d {
        .getSprite(188, 35, -178, -121);
    }
    .lu-date-i {
        .getSprite(38, 38, -10, -340);
    }
    .lu-date-i-a {
        .getSprite(148, 152, -10, -10);
    }
    .lu-date-i-d {
        .getSprite(38, 38, -68, -340);
    }
    .lu-timeline {
        .getSprite(950, 6, -178, -10);
    }
    .t-range-2 {
        .getSprite(181, 59, -10, -182);
    }
    .date-11 {
        .getSprite(87, 35, -1006, -36);
    }
    .date-11-d {
        .getSprite(87, 35, -1015, -182);
    }
    .date-12 {
        .getSprite(87, 35, -412, -261);
    }
    .date-12-d {
        .getSprite(87, 35, -519, -261);
    }
    .date-13 {
        .getSprite(87, 35, -626, -261);
    }
    .date-13-d {
        .getSprite(87, 35, -733, -261);
    }
    .date-0910 {
        .getSprite(188, 35, -386, -121);
    }
    .t-range-4-d {
        .getSprite(181, 59, -211, -182);
    }
    .t-range-4-a {
        .getSprite(187, 65, -178, -36);
    }
    .t-range-4 {
        .getSprite(181, 59, -412, -182);
    }
    .t-range-3-a {
        .getSprite(187, 65, -385, -36);
    }
    .t-range-3-d {
        .getSprite(181, 59, -613, -182);
    }
    .t-range-3 {
        .getSprite(181, 59, -814, -182);
    }
    .t-range-2-a {
        .getSprite(187, 65, -592, -36);
    }
    .t-range-2-d {
        .getSprite(181, 59, -10, -261);
    }
    .t-range-1-a {
        .getSprite(187, 65, -799, -36);
    }
    .txt-rank-sep {
        .getSprite(155, 23, -594, -121);
    }
    .t-range-1 {
        .getSprite(181, 59, -211, -261);
    }
}
.SET_SPRITE();

.levelup-page {
    margin: 146/@bf auto 0;
    width: 1020/@bf;
    border: 6/@bf solid #bf9a42;
}

.level-timeline {
    width: 960/@bf;
    padding-top: 80/@bf;
    padding-bottom: 116/@bf;
    margin: 0 auto;
    position: relative;

    .time-node {
        width: 230/@bf;
        height: 160/@bf;
        position: absolute;
        top: 20/@bf;
    }

    .time-node.one {
        left: 10/@bf;
    }

    .time-node.two {
        left: 50%;
        transform: translateX(-100%);
    }

    .time-node.third {
        right: 50%;
        transform: translateX(100%);
    }

    .time-node.four {
        right: 10/@bf;
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
}

.levelup-rank {
    .txt-rank-sep {
        margin: 10/@bf auto 20/@bf;
        transform: scale(1.4);
    }

    .txt-rank-sep + .l-tr {
        border-top: none;
    }

    .l-tbody {
        margin-bottom: 20/@bf;
        height: 2020/@bf;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .l-tbody.stage-4 {
        height: auto;
    }

    .t-range-1-a,
    .t-range-2-a,
    .t-range-3-a,
    .t-range-4-a {
        bottom: -3/@bf;
    }
}
</style>

<script>
// 晋级赛阶段
import { getModRank } from '../service'

export default {
    name: 'LevelupPage',
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
            activityId: ['1943', '1942', '1941', '1940'], // 晋级赛id

            currStage: 1, // 当前阶段
            showStage: 1, // 显示阶段 1-50to20 2-20to10 3-10to7 4-7to3

            rankType: 'hot', // hot - 人气榜 joy - 娱乐榜

            rankMaxNum: [50, 20, 10, 7, 3],
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
        scroller () {
            return this.$root.scroller
        },
        ranklist () {
            if (this.currRank.hasNext) {
                return this.currRank.list
            } else {
                // 占位符
                let holders = []
                for (let i = 0, len = this.rankMaxNum[this.showStage - 1] - this.currRank.list.length; i < len; i++) {
                    holders.push(null)
                }
                return this.currRank.list.concat(holders)
            }
        }
    },
    mounted () {
        this.$root.pageLoad(3)
    },
    updated () {
        if (this.$root.pageType === 'pc') {
            this.$refs['lu-rank-scroller'] && this.$refs['lu-rank-scroller'].refreshDOM()
        }
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
            if (this.$root.stage < 3) { // 阶段未开始
                this.currStage = 1
                this.showStage = 1
            } else if (this.$root.stage > 6) { // 阶段已结束
                this.currStage = 4
                this.showStage = 4
            } else { // 正在进行显示当前日期
                this.currStage = this.$root.stage - 2
                this.showStage = this.currStage
            }

            // 滚动框加载
            this.$root.initScroll(this.$refs['lu-rank-scroller'].$el, function () {
                this.loadLURank()
            }, this)

            // 加载第一页数据
            this.$root.showLoading()
            this.loadLURank().then(() => {
                this.$root.hideLoading()
            })
        },
        initShare () {
            this.$root.setShare(2)
        },
        changeATab (type) {
            if (type === this.rankType) return

            this.rankType = type
            this.showStage = this.currStage // 重置为最新日期的榜单

            this.refreshLURank()
        },
        changeDate (dateI) {
            if (dateI > this.currStage || dateI === this.showStage) { // 阶段未到
                return
            }
            this.showStage = dateI

            this.refreshLURank()
        },
        calcDateClass (dateI) {
            if (this.currStage < dateI) {
                return 'lu-date-i-d'
            }

            if (dateI === this.showStage) {
                return 'lu-date-i-a'
            }

            return 'lu-date-i'
        },
        rankDesc (index) {
            // 前三轮才显示
            if (this.showStage > 3) return false

            if (this.showStage === 1 && index > 19) return false // 非前20

            if (this.showStage === 2 && index > 9) return false // 非前10

            if (this.showStage === 3 && index > 6) return false // 非前7

            if (index === 0) {
                return '本轮结算时奖励2W荣耀值'
            }
            if (index === 1) {
                return '本轮结算时奖励1.5W荣耀值'
            }
            if (index === 2) {
                return '本轮结算时奖励1W荣耀值'
            }
            if (index < 5) {
                return '本轮结算时奖励5000荣耀值'
            }
            if (index < 10) {
                return '本轮结算时奖励3000荣耀值'
            }
            if (index < 20) {
                return '本轮结算时奖励2000荣耀值'
            }

            return false
        },
        // 刷新榜单
        refreshLURank () {
            if (this.$root.pageType === 'pc') { // pc榜单置顶
                this.$nextTick(() => {
                    this.$refs['lu-rank-scroller']._resetBox()
                    this.$refs['lu-rank-scroller'].refreshDOM()
                })
            }

            this.currRank.hasNext = true
            this.currRank.list = []
            this.currRank.currPage = 0
            this.currRank.loading = false

            this.$root.showLoading()
            this.loadLURank().then(() => {
                this.$root.hideLoading()
            })
        },
        // 加载榜单
        loadLURank () {
            let activityId = this.activityId[this.showStage - 1]
            return this.$root.loadRank(
                this.currRank,
                getModRank,
                this.rankMaxNum[this.showStage - 1],
                `[LevelUpRank][${this.rankType}][${activityId}]`,
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
