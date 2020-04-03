<template>
    <div class="page-final">
        <div class="banner-txt" />

        <div class="star-title">
            <span
                :text="timeRange"
                class="linear-txt">{{ timeRange }}</span>
        </div>

        <!-- 榜单 -->
        <div class="ranks">
            <div class="main-tab">
                <div
                    :class="['mt-i', page.mTab === 0 && 'active']"
                    @click="changeMTab(0)">超级冠军榜</div>
                <div
                    :class="['mt-i', page.mTab === 1 && 'active']"
                    @click="changeMTab(1)">大人物榜</div>
            </div>
            <div class="mt-content">
                <div class="mt-c-inner">
                    <!-- 单项赛榜内容 -->
                    <div
                        v-if="page.mTab === 0"
                        class="mt-c-i">
                        <!-- 赛程进制 -->
                        <div class="stage-line">
                            <div
                                v-for="(stage, si) in stageConfig"
                                :key="'si_' + si"
                                class="stage-i">
                                <span class="time">{{ stage.time }}</span>
                                <span
                                    :class="['btn-stage stage' + (si + 1), page.stageTab === si && 'active', page.currStage < (si + 1) && 'disable']"
                                    @click="page.currStage >= (si + 1) && changeSTab(si)">{{ stage.name }}</span>
                            </div>
                        </div>
                        <!-- 赛道榜单 -->
                        <div class="tab-path-c">
                            <!-- content -->
                            <!-- stagePathRank.list -->
                            <xg-rank-final
                                key="stage-ranks"
                                :list="stagePathRank.list"
                                :path="['', '']"
                                :winner="stageConfig[page.stageTab].winner"
                                :holder="stageConfig[page.stageTab].holder"
                                :sep="currRankTips"
                                :show-rewards="showRewards"
                                class="stage-ranks" />
                        </div>
                    </div>
                    <!-- 大人物榜内容 -->
                    <div
                        v-if="page.mTab === 1"
                        class="mt-c-i">
                        <ticket-status :ticket="global.ticket" />
                        <xg-rank
                            key="user-ranks"
                            :config="userRanks.tableConfig"
                            :list="userRanks.source.list"
                            :has-next="userRanks.source.hasNext"
                            :holder="10"
                            :need-scroller="false"
                            class="user-ranks"
                            @loadMore="() => {}" />
                        <div class="rank-sep">仅展示年度TOP10大人物</div>
                        <xg-mecenter
                            v-if="userRanks.source.meCenter !== null"
                            :source="userRanks.source.meCenter"
                            :type="1" />
                    </div>
                </div>
            </div>
        </div>

        <!-- copy -->
        <p class="copyright">本活动最终解释权归平台运营团队所有</p>

        <!-- floater -->
        <div
            class="floater btn-rules"
            @click="showRules" />
    </div>
</template>

<script>
// 年度盛典 单项赛
import bus from '../../bus.js'
import XgRankFinal from '../../components/XgRankFinal.vue'
import XgRank from '../../components/XgRank.vue'
import XgMecenter from '../../components/XgMecenter.vue'
import TicketStatus from '../../components/TicketStatus.vue'

import {
    getYXUserRank,
    finalInit,
    getFinalRank
} from '../../service/service.js'

export default {
    name: 'SinglePage',
    components: {
        XgRankFinal, XgRank, XgMecenter, TicketStatus
    },
    props: {
        global: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            page: {
                mTab: 0,
                currStage: 0, // [0, 1, 2, 3] -> 0 未开始 [1 2] 两个阶段 3 结束
                stageTab: 0 // tab [0, 1] -> 两个阶段
            },
            timeRange: '超级冠军赛 12月20日-12月21日',
            stageRank: {
                listPool: [
                    // listPool[stage]
                ]
            },
            // 赛程配置
            stageConfig: [{
                stage: 0,
                time: '12.20',
                name: '5进3',
                winner: 3,
                holder: 5
            }, {
                stage: 1,
                time: '12.21',
                name: '3强争霸',
                winner: 1,
                holder: 3
            }],
            userRanks: {
                tableConfig: [{
                    name: '排名',
                    className: 'cell-rank',
                    type: 'rank'
                }, {
                    name: '用户',
                    className: 'cell-user',
                    type: 'user'
                }, {
                    name: '贡献荣耀值',
                    className: 'cell-value',
                    type: 'value'
                }],
                source: {
                    isInited: false,
                    list: [],
                    isLoading: false,
                    hasNext: true,
                    currPage: 0,
                    meCenter: null
                }
            }
        }
    },
    computed: {
        stagePathRank () {
            var target = this.stageRank.listPool
            var stageTab = this.page.stageTab
            return target[stageTab] ? target[stageTab] : {
                isInited: false,
                list: []
            }
        },
        currRankTips () {
            var currS = this.page.currStage
            if (this.page.stageTab >= 1) { // 最后一期
                return ''
            }

            if (currS - this.page.stageTab >= 2) {
                return '以下已被淘汰'
            } else {
                return '以下将被淘汰'
            }
        },
        showRewards () {
            return this.page.stageTab >= 1
        }
    },
    mounted () {
        finalInit().then(data => {
            if (data.errno !== 0) {
                console.log(data.msg)
                return
            }

            var currStage = data.data.subStage

            this.page.currStage = currStage
            if (currStage < 1) {
                this.page.stageTab = 0
            } else if (currStage > 2) {
                this.page.stageTab = 1
            } else {
                this.page.stageTab = currStage - 1
            }

            // 开始加载默认榜单
            this.changeRankH()

            this.checkRank()
        })
    },
    methods: {
        showRules () {
            bus.$emit('showFinalLayer')
        },
        // 单项赛榜 大人物榜 切换
        changeMTab (type) {
            if (type === this.page.mTab) return

            this.page.mTab = type

            this.changeRankH()

            this.checkRank()
        },
        // 赛程切换
        changeSTab (type) {
            if (type === this.page.stageTab) return

            this.page.stageTab = type

            this.changeRankH()

            this.checkRank()
        },
        checkRank () {
            if (this.page.mTab === 0 && this.page.currStage > 0 && !this.stageRank.listPool[this.page.stageTab]) {
                this.loadStageRank()
            }

            if (this.page.mTab === 1 && !this.userRanks.source.isInited) {
                this.loadUserRank()
            }
        },
        changeRankH () {
            // PC样式调整
            if (this.page.mTab === 1) { // 大人物榜
                bus.$emit('changeFRankH', {
                    stage: 4,
                    cname: 'final-1'
                })
                return
            }

            if (this.page.stageTab === 1) {
                bus.$emit('changeFRankH', {
                    stage: 4,
                    cname: 'final-3'
                })
                return
            }

            bus.$emit('changeFRankH', {
                stage: 4,
                cname: ''
            })
        },
        // 加载赛程榜
        loadStageRank () {
            var stage = this.page.stageTab
            var target = this.stageRank.listPool
            this.$set(target, stage, {
                isInited: false,
                list: []
            })
            this.loadListFactory(target[stage], getFinalRank, '[赛程榜] stage=' + stage, [stage])
        },
        // 加载用户榜
        loadUserRank () {
            this.loadListFactory(this.userRanks.source, getYXUserRank, '用户榜', [])
        },
        // 榜单数据较少 无需分页
        loadListFactory (source, service, name, args) {
            console.info(name + ' 数据 -> 加载')

            service && service(...args).then(data => {
                source.isInited = true
                if (data.errno === 0) {
                    if (name === '用户榜') {
                        source.meCenter = data.data.myRank
                    }
                    source.list = data.data.data
                } else {
                    console.error(data.msg)
                }
                return data
            })
        }
    }
}
</script>

<style lang="less">
.page-final {
    width: 840px;
    margin: 0 auto;

    @import '../../../../../css/activity/ceremony2018/final.less';
}
</style>
