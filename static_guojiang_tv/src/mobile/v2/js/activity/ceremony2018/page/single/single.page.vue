<template>
    <div class="page-single">
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
                    @click="changeMTab(0)">单项赛榜</div>
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
                        <!-- 赛道切换 -->
                        <div class="tab-path">
                            <div
                                v-for="(path, pi) in pathConfig"
                                :key="'pi_' + pi"
                                :class="['tab-path-i path-' + path[0], page.pathTab === pi && 'active']"
                                @click="changeSPath(pi)">{{ path[1] }}</div>
                        </div>
                        <!-- 赛道榜单 -->
                        <div class="tab-path-c">
                            <!-- content -->
                            <!-- stagePathRank.list -->
                            <xg-rank-single
                                key="stage-ranks"
                                :list="stagePathRank.list"
                                :path="pathConfig[page.pathTab]"
                                :winner="stageConfig[page.stageTab].winner"
                                :holder="stageConfig[page.stageTab].holder"
                                :sep="currRankTips"
                                :show-rank-desc="showRankDesc"
                                :show-cown="showCown"
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
import XgRankSingle from '../../components/XgRankSingle.vue'
import XgRank from '../../components/XgRank.vue'
import XgMecenter from '../../components/XgMecenter.vue'
import TicketStatus from '../../components/TicketStatus.vue'

import {
    getYXUserRank,
    singleInit,
    getSingleRank
} from '../../service/service.js'

export default {
    name: 'SinglePage',
    components: {
        XgRankSingle, XgRank, XgMecenter, TicketStatus
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
                currStage: 0, // [0, 1, 2, 3, 4, 5] -> 0 未开始 [1 2 3 4] 四个阶段 5 结束
                stageTab: 0, // tab [0, 1, 2, 3] -> 四个阶段
                pathTab: 0
            },
            timeRange: '单项冠军赛 12月14日-12月18日',
            stageRank: {
                listPool: [
                    // listPool[stage][path]
                    [], [], [], []
                ]
            },
            // 赛程配置
            stageConfig: [{
                stage: 0,
                time: '12.14-12.15',
                name: '20进10',
                winner: 10,
                holder: 20
            }, {
                stage: 1,
                time: '12.16',
                name: '10进7',
                winner: 7,
                holder: 10
            }, {
                stage: 2,
                time: '12.17',
                name: '7进4',
                winner: 4,
                holder: 7
            }, {
                stage: 3,
                time: '12.18',
                name: '四强争霸',
                winner: 3,
                holder: 4
            }],
            // 赛道配置
            pathConfig: [['ox', '偶像'], ['rq', '人气'], ['tl', '天籁'], ['yl', '娱乐'], ['fy', '风云']],
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
            var pathT = this.page.pathTab
            return target[stageTab][pathT] ? target[stageTab][pathT] : {
                isInited: false,
                list: []
            }
        },
        currRankTips () {
            var currS = this.page.currStage
            if (this.page.stageTab >= 3) { // 最后一期
                return `18日23:59:59结算时，以上主播将成为年度${this.pathConfig[this.page.pathTab][1]}主播冠亚季军`
            }

            if (currS - this.page.stageTab >= 2) {
                return '以下已被淘汰'
            } else {
                return '以下将被淘汰'
            }
        },
        // 是否显示主播的详情
        showRankDesc () {
            if (this.page.currStage > 4 && this.page.stageTab === 3) {
                return true
            }

            if (this.page.currStage - this.page.stageTab === 1) {
                return true
            }

            return false
        },
        // 是否显示主播榜第一名的皇冠
        showCown () {
            if (this.page.stageTab === 3) {
                return true
            }

            return false
        }
    },
    mounted () {
        singleInit().then(data => {
            if (data.errno !== 0) {
                console.log(data.msg)
                return
            }

            var currStage = data.data.subStage

            this.page.currStage = currStage
            if (currStage < 1) {
                this.page.stageTab = 0
            } else if (currStage > 4) {
                this.page.stageTab = 3
            } else {
                this.page.stageTab = currStage - 1
            }

            // 开始加载默认榜单
            this.checkRank()
        })
    },
    methods: {
        showRules () {
            bus.$emit('showSingleLayer')
        },
        // 单项赛榜 大人物榜 切换
        changeMTab (type) {
            if (type === this.page.mTab) return

            this.page.mTab = type

            this.checkRank()
        },
        // 赛程切换
        changeSTab (type) {
            if (type === this.page.stageTab) return

            this.page.stageTab = type
            this.page.pathTab = 0 // 默认偶像赛道

            this.checkRank()
        },
        // 赛道切换
        changeSPath (type) {
            if (type === this.page.pathTab) return

            this.page.pathTab = type

            this.checkRank()
        },
        checkRank () {
            if (this.page.mTab === 0 && this.page.currStage > 0 && !this.stageRank.listPool[this.page.stageTab][this.page.pathTab]) {
                this.loadStageRank()
            }

            if (this.page.mTab === 1 && !this.userRanks.source.isInited) {
                this.loadUserRank()
            }
        },
        // 加载赛程赛道榜
        loadStageRank () {
            var stage = this.page.stageTab
            var pathTab = this.page.pathTab
            var target = this.stageRank.listPool[this.page.stageTab]
            this.$set(target, pathTab, {
                isInited: false,
                list: []
            })
            this.loadListFactory(target[pathTab], getSingleRank, '[赛程赛道榜] stage=' + stage + ' path=' + pathTab, [stage, pathTab + 1])
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
.page-single {
    @import '../../../../../css/activity/ceremony2018/single.less';
}
</style>
