<template>
    <div class="repe-page repe-rank l-list">
        <!-- tab -->
        <div class="com-r-tab fl-box">
            <div
                :class="['tab-i btn hj-tab-s', rankType === 'hot' ? 'tab-hotr-a' : 'tab-hotr']"
                @click="changeATab('hot')">人气榜</div>
            <div
                :class="['tab-i btn hj-tab-s', rankType === 'joy' ? 'tab-joyr-a' : 'tab-joyr']"
                @click="changeATab('joy')">娱乐榜</div>
        </div>
        <!-- rank list -->
        <div class="l-thead global-s l-head-bg">
            <div class="l-th cell-1"><div class="global-s txt-pm">排名</div></div>
            <div class="l-th cell-2"><div class="global-s txt-mod">主播</div></div>
            <div class="l-th cell-3"><div class="global-s txt-ry-value">荣耀值</div></div>
        </div>
        <!-- rank body -->
        <component
            ref="repe-rank-scroller"
            :is="scroller"
            :right="3"
            :thumb-color="'#e7ca62'"
            class="l-tbody">
            <template
                v-for="(item, ind) in ranklist">
                <div
                    :key="`repe_${rankType}_${ind}`"
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
                    v-if="ind === 2"
                    :key="'repe_rank_sep_' + ind"
                    class="repe-txt-rank-sep">15日23:59:59结算时，前3名晋级决赛</div>
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
    .repe-s {
        // background: url('@{imgUrl}/levelup-s.png') no-repeat;
        // background-size: 1613/@bf 472/@bf;
        font-size: 0px;
        display: block;
    }
}
.SET_SPRITE();

.repe-page {
    margin: 146/@bf auto 0;
    width: 1020/@bf;
    border: 6/@bf solid #bf9a42;
    padding-bottom: 20/@bf;

    .l-thead {
        margin-top: 20/@bf;
    }

    .l-tbody {
        height: 2020/@bf;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
}

.repe-txt-rank-sep {
    @scale: 1.5;
    width: 898/@bf;
    height: 40/@bf;
    margin: 50/@bf auto 26/@bf;
    background: url('@{imgUrl}/repe-rank-sep.png') no-repeat;
    background-size: 898*@scale/@bf 26*@scale/@bf;
    background-position: center;
    font-size: 0;
}
</style>

<script>
// 复活赛页面
import { getModRank } from '../service'

export default {
    name: 'RepePage',
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
            activityId: '1939', // 淘汰赛 id

            rankType: 'hot', // hot - 人气榜 joy - 娱乐榜

            rankMaxNum: 47,
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
                for (let i = 0, len = this.rankMaxNum - this.currRank.list.length; i < len; i++) {
                    holders.push(null)
                }
                return this.currRank.list.concat(holders)
            }
        }
    },
    mounted () {
        this.$root.pageLoad(4)
    },
    updated () {
        if (this.$root.pageType === 'pc') {
            this.$refs['repe-rank-scroller'] && this.$refs['repe-rank-scroller'].refreshDOM()
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

            // 滚动框加载
            this.$root.initScroll(this.$refs['repe-rank-scroller'].$el, function () {
                this.loadRank()
            }, this)

            // 加载第一页数据
            this.$root.showLoading()
            this.loadRank().then(() => {
                this.$root.hideLoading()
            })
        },
        initShare () {
            this.$root.setShare(3)
        },
        changeATab (type) {
            if (type === this.rankType) return

            this.rankType = type

            this.refreshRank()
        },
        // 刷新榜单
        refreshRank () {
            if (this.$root.pageType === 'pc') { // pc榜单置顶
                this.$nextTick(() => {
                    this.$refs['repe-rank-scroller']._resetBox()
                    this.$refs['repe-rank-scroller'].refreshDOM()
                })
            }

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
            return this.$root.loadRank(
                this.currRank,
                getModRank,
                this.rankMaxNum,
                `[RepeRank][${this.rankType}]`,
                {
                    activityId: this.activityId,
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
