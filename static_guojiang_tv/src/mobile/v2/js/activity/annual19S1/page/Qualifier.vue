<template>
    <div class="qualifier">
        <div class="q-rank l-list">
            <!-- tab -->
            <div class="q-r-tab fl-box">
                <div
                    :class="['q-r-tab-i btn qualifier-s', rankType === 'date' ? 'tab-rb-a' : 'tab-rb']"
                    @click="changeATab('date')">日榜</div>
                <div
                    :class="['q-r-tab-i btn qualifier-s', rankType === 'yxs' ? 'tab-yxs-a' : 'tab-yxs']"
                    @click="changeATab('yxs')">预选赛榜</div>
            </div>
            <!-- timeline -->
            <div
                v-if="rankType === 'date'"
                class="q-r-timeline">
                <div class="qualifier-s timeline"/>
                <div
                    class="time-node one btn"
                    @click="changeDate(1)">
                    <div :class="['time-icon qualifier-s', calcDateClass(1)]"/>
                    <div :class="'time-date qualifier-s txt-date-0605' + (currDate < 1 ? '-d' : '')"/>
                </div>
                <div
                    class="time-node two btn"
                    @click="changeDate(2)">
                    <div :class="['time-icon qualifier-s', calcDateClass(2)]"/>
                    <div :class="'time-date qualifier-s txt-date-0606' + (currDate < 2 ? '-d' : '')"/>
                </div>
                <div
                    class="time-node third btn"
                    @click="changeDate(3)">
                    <div :class="['time-icon qualifier-s', calcDateClass(3)]"/>
                    <div :class="'time-date qualifier-s txt-date-0607' + (currDate < 3 ? '-d' : '')"/>
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
                ref="que-rank-scroller"
                :is="scroller"
                :right="3"
                :thumb-color="'#e7ca62'"
                class="l-tbody">
                <div
                    v-for="(item, ind) in ranklist"
                    :key="`que_${rankType}_${showDate}_${ind}`"
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
                                v-if="rankType === 'date' && modRankValue[ind]"
                                class="desc">
                                <span class="txt">{{ modRankDate[showDate] }}结算时奖励{{ modRankValue[ind] }}荣耀值</span>
                            </p>
                        </div>
                    </div>
                    <div class="l-td cell-3 txt-of">{{ item ? item.score : '-' }}</div>
                </div>
            </component>
            <!-- sep -->
            <div class="qualifier-s txt-100-mod"/>
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
                        :key="'qua_si_mod_' + si"
                        class="status-i">
                        <div class="name">{{ currRank.meCenter.pairInfos[s].name }}</div>
                        <div class="value txt-of">{{ currRank.meCenter.pairInfos[s].value }}</div>
                    </div>
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
    .qualifier-s {
        background: url('@{imgUrl}/qualifier.png') no-repeat;
        background-size: 1490/@bf 472/@bf;
        font-size: 0px;
        display: block;
    }

    .timeline {
        .getSprite(827, 6, -653, -10);
    }
    .txt-date-0605 {
        .getSprite(86, 35, -653, -79);
    }
    .txt-100-mod {
        .getSprite(196, 23, -653, -36);
    }
    .txt-date-0605-d {
        .getSprite(86, 35, -759, -79);
    }
    .txt-date-0606 {
        .getSprite(85, 35, -1077, -79);
    }
    .txt-date-0606-d {
        .getSprite(85, 35, -1182, -79);
    }
    .txt-date-0607 {
        .getSprite(86, 35, -865, -79);
    }
    .txt-date-0607-d {
        .getSprite(86, 35, -971, -79);
    }
    .qua-date-i {
        .getSprite(38, 38, -653, -134);
    }
    .qua-date-i-a {
        .getSprite(148, 152, -485, -10);
    }
    .qua-date-i-d {
        .getSprite(38, 38, -711, -134);
    }
    .tab-rb {
        .getSprite(455, 98, -10, -10);
    }
    .tab-rb-a {
        .getSprite(455, 98, -10, -128);
    }
    .tab-yxs {
        .getSprite(455, 98, -10, -246);
    }
    .tab-yxs-a {
        .getSprite(455, 98, -10, -364);
    }
}

.SET_SPRITE();

.qualifier {
    margin-top: 146/@bf;
}

.q-rank {
    width: 1020/@bf;
    margin: 0 auto;
    border: 6/@bf solid #bf9a42;
}

.q-r-tab {
    margin-top: -50/@bf;
}

.q-r-timeline {
    width: 837/@bf;
    padding-top: 50/@bf;
    padding-bottom: 116/@bf;
    margin: 0 auto -20/@bf;
    position: relative;

    .time-node {
        width: 84/@bf;
        height: 114/@bf;
        position: absolute;
        top: 34/@bf;
    }

    .time-node.one {
        left: 136/@bf;
    }

    .time-node.third {
        right: 136/@bf;
    }

    .time-node.two {
        left: 50%;
        transform: translate(-50%);
    }

    .time-icon {
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);

        &.qua-date-i-a {
            top: -3/@bf;
        }
    }

    .time-date {
        position: absolute;
        left: 50%;
        bottom: 12/@bf;
        transform: translateX(-50%);
    }
}

.txt-100-mod {
    margin: 20/@bf auto 20/@bf;
    transform: scale(1.4);
}

.q-rank .l-thead {
    margin-top: 20/@bf;
}

.q-rank .l-tbody {
    height: 2020/@bf;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
</style>

<script>
// 预选赛页面
import { getModRank } from '../service'

export default {
    name: 'QualifierPage',
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
            activityId: '1946', // 预选赛id
            rankType: 'date', // 日榜 , 总榜

            currDate: 0, // 当前时间 0 - 未开始 1 - 第一天 2 - 第二天 3 - 第三天
            showDate: 1, // 显示的日榜期数

            // 榜单
            rankMaxNum: 100,
            currRank: {
                hasNext: true,
                loading: false,
                currPage: 0,
                list: [],
                meCenter: null
            },
            modRankDate: ['', '12日', '13日', '14日'],
            modRankValue: ['2W', '1.5W', '1W', '5000', '5000']
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
                for (let i = 0, len = 100 - this.currRank.list.length; i < len; i++) {
                    holders.push(null)
                }
                return this.currRank.list.concat(holders)
            }
        }
    },
    mounted () {
        this.$root.pageLoad(1)
    },
    updated () {
        if (this.$root.pageType === 'pc') {
            this.$refs['que-rank-scroller'] && this.$refs['que-rank-scroller'].refreshDOM()
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
        console.debug('[Qualifier Page][route] update')
        this.initShare()
        next()
    },
    methods: {
        formatDate (date) {
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
        },
        // 页面初始化 榜单 滚动
        initPage () {
            // 从根节点拿初始化数据
            this.pageInited = true // lock 初始化加锁

            // 设置前三天的日期格式
            let stageTime = this.$root.stageInfos.filter(item => {
                return item.id === this.activityId
            })[0]
            let stageST = new Date(stageTime.startTime.replace(/-/g, '/'))
            this.dateMap = ['']
            this.dateMap.push(this.formatDate(stageST))
            stageST.setDate(stageST.getDate() + 1)
            this.dateMap.push(this.formatDate(stageST))
            stageST.setDate(stageST.getDate() + 1)
            this.dateMap.push(this.formatDate(stageST))

            // 判断当前阶段
            if (this.$root.stage === 0) { // 活动未开始
                this.currDate = 0
                this.showDate = 1
            } else if (this.$root.stage > 1) { // 预选赛已结束
                this.rankType = 'yxs'
                this.currDate = 3
                this.showDate = 3
            } else { // 预选赛期间
                let nowTime = new Date(this.$root.serverTime.replace(/-/g, '/'))

                let stageST = new Date(stageTime.startTime.replace(/-/g, '/'))
                let hours = (nowTime - stageST) / 3600000 // hours
                let dateI = 1
                if (hours >= 12) {
                    dateI = Math.min((hours + 12) / 24 >> 0, 2) + 1
                }

                this.currDate = dateI
                this.showDate = this.currDate
            }

            // 滚动框加载
            this.$root.initScroll(this.$refs['que-rank-scroller'].$el, function () {
                this.loadQuaRank()
            }, this)

            // 加载第一页数据
            this.$root.showLoading()
            this.loadQuaRank().then(() => {
                this.$root.hideLoading()
            })
        },
        initShare () {
            this.$root.setShare(0)
        },
        changeATab (type) {
            this.rankType = type

            this.refreshQuaRank()
        },
        changeDate (dateI) {
            if (dateI > this.currDate) { // 阶段未到
                return
            }
            this.showDate = dateI
            this.refreshQuaRank()
        },
        calcDateClass (dateI) {
            if (this.currDate < dateI) {
                return 'qua-date-i-d'
            }

            if (dateI === this.showDate) {
                return 'qua-date-i-a'
            }

            return 'qua-date-i'
        },
        refreshQuaRank () {
            if (this.$root.pageType === 'pc') { // pc榜单置顶
                this.$nextTick(() => {
                    this.$refs['que-rank-scroller']._resetBox()
                    this.$refs['que-rank-scroller'].refreshDOM()
                })
            }

            this.currRank.hasNext = true
            this.currRank.list = []
            this.currRank.currPage = 0
            this.currRank.loading = false

            this.$root.showLoading()
            this.loadQuaRank().then(() => {
                this.$root.hideLoading()
            })
        },
        // 加载主播榜单 预选赛榜 日榜
        loadQuaRank () {
            let options = {
                activityId: this.activityId
            }
            if (this.rankType === 'date') {
                options.date = this.dateMap[this.showDate]
            }
            return this.$root.loadRank(
                this.currRank,
                getModRank,
                this.rankMaxNum,
                `[QualifierRank][${this.rankType}][${this.showDate}]`,
                options
            )
        },
        // proxy
        goRoom (item) {
            this.$root.goRoom(item)
        }
    }
}
</script>
