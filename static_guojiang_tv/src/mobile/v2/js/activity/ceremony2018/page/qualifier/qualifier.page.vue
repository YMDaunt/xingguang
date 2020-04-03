<template>
    <div class="page-qualifier">
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
                    @click="changeMTab(0)">日榜</div>
                <div
                    :class="['mt-i', page.mTab === 1 && 'active']"
                    @click="changeMTab(1)">预选赛榜</div>
                <div
                    :class="['mt-i', page.mTab === 2 && 'active']"
                    @click="changeMTab(2)">大人物榜</div>
            </div>
            <div class="mt-content">
                <div class="mt-c-inner">
                    <!-- 日榜内容 -->
                    <div
                        v-if="page.mTab === 0"
                        class="mt-c-i">
                        <div class="time-tab">
                            <div
                                v-for="(ttab, ttindex) in global.yxDates"
                                :key="ttindex"
                                :class="['tt-i', page.timeTab === ttindex && 'active', ttindex > page.maxTimeTab && 'disabled']"
                                @click="changeTTab(ttindex)">{{ ttab }}</div>
                        </div>
                        <div class="tt-content">
                            <!-- 对应日期榜单内容 -->
                            <div class="tt-c-i">
                                <xg-rank
                                    :config="dayRankPool.tableConfig"
                                    :list="dayRanks.list"
                                    :has-next="dayRanks.hasNext"
                                    :holder="100"
                                    @loadMore="loadRank('day')" />
                                <div class="rank-sep">仅展示前100名主播</div>
                                <xg-mecenter
                                    v-if="dayRanks.meCenter !== null"
                                    :source="dayRanks.meCenter"
                                    :type="0" />
                            </div>
                        </div>
                    </div>
                    <!-- 预选赛榜内容 -->
                    <div
                        v-if="page.mTab === 1"
                        class="mt-c-i">
                        <xg-rank
                            key="game-ranks"
                            :config="modRanks.tableConfig"
                            :list="modRanks.source.list"
                            :has-next="modRanks.source.hasNext"
                            :holder="100"
                            class="game-ranks"
                            @loadMore="loadRank('mod')" />
                        <div class="rank-sep">仅展示前100名主播</div>
                        <xg-mecenter
                            v-if="modRanks.source.meCenter !== null"
                            :source="modRanks.source.meCenter"
                            :type="0" />
                    </div>
                    <!-- 大人物榜内容 -->
                    <div
                        v-if="page.mTab === 2"
                        class="mt-c-i">
                        <ticket-status :ticket="global.ticket" />
                        <xg-rank
                            key="user-ranks"
                            :config="userRanks.tableConfig"
                            :list="userRanks.source.list"
                            :has-next="userRanks.source.hasNext"
                            :holder="10"
                            class="user-ranks"
                            @loadMore="loadRank('user')" />
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
    </div>
</template>

<script>
// 年度盛典 预选赛
import bus from '../../bus.js'
import Timeline from '../../components/Timeline.vue'
import XgRank from '../../components/XgRank.vue'
import XgMecenter from '../../components/XgMecenter.vue'
import RuleLayer from '../../components/RuleLayer.vue'
import TicketStatus from '../../components/TicketStatus.vue'

import {
    getYXDayRank,
    getYXUserRank,
    getYXModRank
} from '../../service/service.js'

var vm = {
    name: 'QualifierPage',
    components: {
        Timeline, XgRank, XgMecenter, RuleLayer, TicketStatus
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
                timeTab: 0,
                maxTimeTab: false,
                isInited: false // 判断页面是否初始化过
            },
            dayRankPool: {
                tableConfig: [{
                    name: '排名',
                    className: 'cell-rank',
                    type: 'rank'
                }, {
                    name: '主播',
                    className: 'cell-zhubo',
                    type: 'zhubo'
                }, {
                    name: '荣耀值',
                    className: 'cell-value',
                    type: 'value'
                }],
                listData: [] // 日榜数据池
            },
            modRanks: {
                tableConfig: [{
                    name: '排名',
                    className: 'cell-rank',
                    type: 'rank'
                }, {
                    name: '主播',
                    className: 'cell-zhubo',
                    type: 'zhubo2'
                }, {
                    name: '荣耀值',
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
            },
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
        // 预选赛活动时间
        timeRange () {
            if (this.global.yxDates.length === 0) {
                return '预选赛'
            }

            var dates = this.global.yxDates
            var firstDay = dates[0].split('.')
            var lastDay = dates[dates.length - 1].split('.')

            return [
                '预选赛    ',
                firstDay[0],
                '月',
                firstDay[1],
                '日 - ',
                lastDay[0],
                '月',
                lastDay[1],
                '日'
            ].join('')
        },
        // 当前日榜数据
        dayRanks () {
            var listPool = this.dayRankPool.listData
            var timeTab = this.page.timeTab
            if (listPool[timeTab]) {
                if (listPool[timeTab].list[0]) {
                    listPool[timeTab].list[0].desc = '奖励20000张助力票'
                }

                return listPool[timeTab]
            }

            return {
                list: [],
                meCenter: null
            }
        }
    },
    mounted: function () {
        // 页面初始化之后加载 (首屏进入)
        bus.$on('yxInit', () => {
            this.init()
        })
    },
    beforeRouteEnter (to, from, next) {
        next(vm => { // (从其他tab进入)
            if (vm.global.isInited && !vm.page.isInited) {
                vm.init()
            }
        })
    },
    methods: {
        init () {
            if (this.page.isInited) return

            this.page.isInited = true

            var yxDates = this.global.yxDates
            var currDate = this.global.currDate

            if (yxDates.indexOf(currDate) !== -1) {
                this.page.timeTab = yxDates.indexOf(currDate)
                this.page.maxTimeTab = this.page.timeTab
            } else {
                // 进入最后一天
                this.page.timeTab = yxDates.length - 1
                this.page.maxTimeTab = yxDates.length - 1
            }

            // initRank 初始化当前榜单
            this.checkRank()
        },
        // 日榜 预选赛棒 大人物榜 切换
        changeMTab (type) {
            if (type === this.page.mTab) return

            this.page.mTab = type

            this.checkRank()
        },
        // 日榜数据切换
        changeTTab (type, date) {
            if (type === this.page.timeTab) return

            if (type > this.page.maxTimeTab) return

            this.page.timeTab = type

            this.checkRank()
        },
        // 加载榜单 分发入口
        loadRank (type) { // type = 'day' 'mod' 'user'
            switch (type) {
            case 'day': this.loadDayRank(); break
            case 'mod': this.loadModRank(); break
            case 'user': this.loadUserRank(); break
            }
        },
        // 榜单切换时的初始化
        checkRank () {
            if (this.page.mTab === 0 && !this.dayRankPool.listData[this.page.timeTab]) {
                this.loadDayRank()
            }

            if (this.page.mTab === 1 && !this.modRanks.source.isInited) {
                this.loadModRank()
            }

            if (this.page.mTab === 2 && !this.userRanks.source.isInited) {
                this.loadUserRank()
            }
        },
        // 加载日榜
        loadDayRank () {
            if (!this.dayRankPool.listData[this.page.timeTab]) { // 初始化当前日期的榜单
                this.$set(this.dayRankPool.listData, this.page.timeTab, {
                    list: [],
                    isLoading: false,
                    hasNext: true,
                    currPage: 0,
                    meCenter: null
                })
            }

            var currDate = this.global.yxDates[this.page.timeTab].split('.')

            currDate.forEach((item, index) => {
                if (Number(currDate[index]) < 10) {
                    currDate[index] = '0' + currDate[index]
                }
            })

            var currDateStr = ['2018', ...currDate].join('')

            this.loadListFactory(this.dayRankPool.listData[this.page.timeTab], getYXDayRank, '日期榜-' + currDateStr, [currDateStr])
        },
        // 加载主播榜
        loadModRank () {
            this.loadListFactory(this.modRanks.source, getYXModRank, '主播榜', [])
        },
        // 加载用户榜
        loadUserRank () {
            this.loadListFactory(this.userRanks.source, getYXUserRank, '用户榜', [])
        },
        loadListFactory (source, service, name, args) {
            if (source.isLoading) {
                console.info(name + '数据 -> 正在加载上一页: 请稍后')
                return
            }

            if (!source.hasNext) {
                console.info(name + '数据 -> 无更多数据')
                return
            }

            source.isLoading = true
            service && service(...args, source.currPage + 1).then(data => {
                source.isLoading = false
                source.isInited = true
                if (data.errno === 0) {
                    if (source.currPage === 0) {
                        // source.list = data.data.data
                        source.meCenter = data.data.myRank
                    }
                    source.list = source.list.concat(data.data.data)

                    source.currPage += 1
                    source.hasNext = data.data.hasNext
                } else {
                    console.error(data.msg)
                }
                return data
            })
        }
    }
}

export default vm
</script>

<style lang="less">

.page-qualifier {

    .user-ranks .rank-row:first-child {
        margin-top: 0.6rem;
    }
    @import '../../../../../css/activity/ceremony2018/qualifier.less';
}

</style>
