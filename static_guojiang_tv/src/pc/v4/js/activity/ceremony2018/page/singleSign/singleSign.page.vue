<template>
    <div class="page-singlesign">
        <div class="star-title">
            <span
                :text="timeRange"
                class="linear-txt">{{ timeRange }}</span>
        </div>
        <div class="timecount">
            <span class="label">报名倒计时:</span>
            <span
                ref="timeCount"
                class="time" />
        </div>
        <!-- 报名说明 -->
        <div class="states">
            <p class="states-i">
                <span class="label">报名时间：</span>
                <span class="txt">{{ startTime | formatDate }} - {{ endTime | formatDate }}。</span>
            </p>
            <p class="states-i">
                <span class="label">报名范围：</span>
                <span class="txt">预选赛晋级的100强主播。</span>
            </p>
            <p class="states-i">
                <span class="label">报名说明：</span>
                <span class="txt">1. 100位主播可自由报名赛道，每个赛道最多只能报名20位主播，若在报名时间内有主播未报名，则由系统随机分配到未满赛道。</span>
            </p>
            <p class="states-i">
                <span class="label" />
                <span class="txt">2. 确认报名后，将不可变更赛道。每个主播只能参加其中一条赛道，请谨慎操作！</span>
            </p>
            <p class="states-i">
                <span class="label" />
                <span class="txt">3. 12月13日12:00:00将公布所有赛道主播。</span>
            </p>
        </div>
        <!-- 我的赛道 -->
        <div
            v-if="meInfo != null"
            class="mypath">
            <div class="avatar">
                <img
                    :src="meInfo.headPic"
                    alt="头像" >
            </div>
            <div class="name">我的赛道：{{ meInfo.hasVote ? meInfo.voteName : '还未报名' }}</div>
        </div>
        <!-- 赛道 -->
        <div class="paths">
            <div
                v-for="(path, pi) in paths"
                :key="pi"
                :class="['path-i', classMap[path.groupId]]" >
                <div class="path-banner">
                    <div class="avatar">
                        <div class="pic" />
                        <div class="name" />
                    </div>
                    <div class="status">
                        <div class="progress">{{ path.count }}/{{ path.fullNum }}</div>
                        <!-- 报名已结束 或者 该用户不是一百强 -->
                        <div
                            :class="(!canSign || path.count === path.fullNum ) ? 'btn-regis-disabled' : 'btn-regis'"
                            @click="canSign && path.count !== path.fullNum && showModal(path.groupName, path.groupId)" />
                    </div>
                </div>
                <div :class="['members-box', pathsUi[pi] ? 'down' : 'up']">
                    <div class="members-list">
                        <template v-if="!isShowMod">
                            <!-- v-for path.count -->
                            <div
                                v-for="item in path.count"
                                :key="'taken_' + item"
                                class="member-i">
                                <div class="pic">
                                    <div class="pic-taken" />
                                    <p class="name">名额已占</p>
                                </div>
                            </div>
                            <div
                                v-for="item in (path.fullNum - path.count)"
                                :key="'none_' + item"
                                class="member-i">
                                <div class="pic">
                                    <div class="pic-none" />
                                    <p class="name">虚位以待</p>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div
                                v-for="(member, mi) in path.members"
                                :key="mi"
                                class="member-i">
                                <div class="pic pic-md">
                                    <div
                                        class="avatar"
                                        @click="goRoom(member.mid)">
                                        <img
                                            :src="member.headPic"
                                            alt="头像">
                                        <span
                                            v-if="member.isPlaying"
                                            class="live">LIVE</span>
                                    </div>
                                    <p class="name">{{ member.nickname }}</p>
                                </div>
                            </div>
                        </template>
                    </div>
                    <span
                        class="btn-more"
                        @click="showMore(pi)" />
                </div>
            </div>
        </div>

        <!-- 右侧悬浮栏 -->
        <div class="hover-nav">
            <div class="nav-banner" />
            <div
                :class="['nav-i nav-ox', currAnchor === 0 && 'active']"
                @click="scrollTo('.path-i.ndox', 0)">年度偶像主播</div>
            <div
                :class="['nav-i nav-rq', currAnchor === 1 && 'active']"
                @click="scrollTo('.path-i.ndrq', 1)">年度人气主播</div>
            <div
                :class="['nav-i nav-tl', currAnchor === 2 && 'active']"
                @click="scrollTo('.path-i.ndtl', 2)">年度天籁主播</div>
            <div
                :class="['nav-i nav-yl', currAnchor === 3 && 'active']"
                @click="scrollTo('.path-i.ndyl', 3)">年度娱乐主播</div>
            <div
                :class="['nav-i nav-fy', currAnchor === 4 && 'active']"
                @click="scrollTo('.path-i.ndfy', 4)">年度风云主播</div>
            <div
                class="nav-top"
                @click="scrollTo('.header_wrap')">top</div>
        </div>
    </div>
</template>

<script>
// 年度盛典 单项赛报名页面
import bus from '../../bus.js'
import {
    getSingleSignInit
} from '../../service/service.js'

var con = {
    animTimer: null,
    sTime: null,
    throttleTimer: null
}

var PCMixin = {
    data () {
        return {
            currAnchor: -1
        }
    },
    mounted () {
        this.initPCNav()
    },
    methods: {
        // 初始化PC端侧边栏导航
        initPCNav () {
            var anchorEle = [ // scrollTop从小到大排序
                document.querySelector('.path-i.ndox'),
                document.querySelector('.path-i.ndrq'),
                document.querySelector('.path-i.ndtl'),
                document.querySelector('.path-i.ndyl'),
                document.querySelector('.path-i.ndfy')
            ]
            var self = this
            window.onscroll = function (evt) {
                // clearTimeout(con.throttleTimer)
                if (con.animTimer) return

                // con.throttleTimer = setTimeout(() => {
                var top = (document.documentElement.scrollTop || document.body.scrollTop) + 300
                var flag = -1

                for (var i = 0, len = anchorEle.length; i < len; i++) {
                    if (top >= anchorEle[i].offsetTop) {
                        flag = i
                    }
                }

                self.currAnchor = flag
                // }, 200)
            }
        },
        _tweenEaseInOut (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b
            return -c / 2 * ((--t) * (t - 2) - 1) + b
        },
        animateScroll (attr, targetValue, duration) {
            if (con.animTimer) {
                clearTimeout(con.animTimer)
                con.animTimer = null
            }
            con.sTime = Date.now()
            var initVal = document.body[attr] || document.documentElement[attr]
            var fpsTime = 1000 / 60

            var _run = () => {
                var out = this._tweenEaseInOut(Date.now() - con.sTime, initVal, targetValue - initVal, duration)
                document.body[attr] = out
                document.documentElement[attr] = out

                if (Date.now() - con.sTime < duration) {
                    con.animTimer = setTimeout(_run, fpsTime)
                } else {
                    clearTimeout(con.animTimer)
                    con.animTimer = null
                }
            }

            _run()
        },
        scrollTo (className, anchor) {
            var target = document.querySelector(className)
            if (!target) return

            this.currAnchor = anchor

            this.animateScroll('scrollTop', target.offsetTop, 500)
        }
    }
}

export default {
    name: 'SingleSignPage',
    filters: {
        formatDate (value) {
            return [
                value.getMonth() + 1,
                '.',
                value.getDate(),
                ' ',
                value.toTimeString().split(' ')[0]
            ].join('')
        }
    },
    mixins: [ PCMixin ],
    data () {
        return {
            startTime: new Date('2018/12/11 00:00:00'),
            endTime: new Date('2018/12/12 23:59:59'),
            serverTime: new Date(),
            initTime: Date.now(),
            isEnd: false,
            isShowMod: false,
            paths: [{
                groupId: 1,
                groupName: '年度偶像主播',
                members: [],
                count: 0,
                fullNum: 20
            }, {
                groupId: 2,
                groupName: '年度人气主播',
                members: [],
                count: 0,
                fullNum: 20
            }, {
                groupId: 3,
                groupName: '年度天籁主播',
                members: [],
                count: 0,
                fullNum: 20
            }, {
                groupId: 4,
                groupName: '年度娱乐主播',
                members: [],
                count: 0,
                fullNum: 20
            }, {
                groupId: 5,
                groupName: '年度风云主播',
                members: [],
                count: 0,
                fullNum: 20
            }],
            classMap: {
                1: 'ndox',
                2: 'ndrq',
                3: 'ndtl',
                4: 'ndyl',
                5: 'ndfy'
            },
            pathsUi: [false, false, false, false, false],
            meInfo: null
        }
    },
    computed: {
        timeRange () {
            var startDay = this.startTime.getDate()
            var startMonth = this.startTime.getMonth() + 1

            var endDay = this.endTime.getDate()
            var endMonth = this.endTime.getMonth() + 1
            return [
                '单项赛报名',
                startMonth + '月' + startDay + '日',
                '-',
                endMonth + '月' + endDay + '日'].join(' ')
        },
        canSign () {
            if (!this.$root.page.isLogin) return true
            if (this.isEnd) return false
            if (!this.meInfo) return false
            if (this.meInfo.hasVote) return false

            return true
        }
    },
    mounted () {
        bus.$on('refreshPath', this.refreshPath)

        this.init()
    },
    methods: {
        showMore (pi) {
            this.$set(this.pathsUi, pi, !this.pathsUi[pi])

            var ele = document.querySelector('.bg3-sign')
            if (this.pathsUi[pi]) {
                ele.style.height = ele.clientHeight + 604 + 'px'
            } else {
                ele.style.height = ele.clientHeight - 604 + 'px'
            }
        },
        showModal (pname, gid) {
            if (!this.$root.page.isLogin) {
                bus.$emit('goLogin')
                return
            }
            bus.$emit('showSignModal', {
                pname, gid
            })
        },
        goRoom (rid) {
            bus.$emit('goRoom', rid)
        },
        init () {
            getSingleSignInit().then(data => {
                if (data.errno !== 0) {
                    console.log(data.msg)
                    return
                }

                var res = data.data
                this.startTime = new Date(res.startTime.replace(/-/g, '/'))
                this.endTime = new Date(res.endTime.replace(/-/g, '/'))
                this.serverTime = new Date(res.serverTime.replace(/-/g, '/'))
                this.initTime = Date.now()

                this.meInfo = res.voteInfo

                this.paths = res.group

                if (this.serverTime.getTime() >= this.endTime.getTime()) {
                    this.isEnd = true
                    this.$refs.timeCount.innerText = '00时00分00秒'
                } else {
                    this.ticktock()
                }

                if (this.serverTime.getTime() >= (this.endTime.getTime() + 3600 * 1000 * 12)) {
                    this.isShowMod = true
                }
            })
        },
        ticktock () {
            var leftedTime = this.endTime.getTime() - this.serverTime.getTime()
            var walkedTime = Date.now() - this.initTime

            var needTime = (leftedTime - walkedTime) / 1000 >> 0
            if (needTime < 0) needTime = 0

            var hours = 60 * 60
            var needH = needTime / hours >> 0 // 剩余小时数
            var needMin = (needTime % hours) / 60 >> 0 // 剩余分钟数
            var needSec = needTime % 60 // 剩余秒数

            needH = needH < 10 ? '0' + needH : needH
            needMin = needMin < 10 ? '0' + needMin : needMin
            needSec = needSec < 10 ? '0' + needSec : needSec

            this.$refs.timeCount.innerText = [needH, '时', needMin, '分', needSec, '秒'].join('')

            if (needTime > 0) {
                setTimeout(this.ticktock, 1000)
            } else {
                this.isEnd = true
                // window.location.reload()
            }
        },
        refreshPath (data) {
            for (var i = 0, len = this.paths.length; i < len; i++) {
                if (data.groupId === this.paths[i].groupId) {
                    this.paths[i].count = data.count
                    this.meInfo.hasVote = true
                    this.meInfo.voteName = this.paths[i].groupName
                }
            }
        }
    }
}
</script>

<style lang="less">

.page-singlesign {
    width: 840px;
    margin: 0 auto;

    @import '../../../../../css/activity/ceremony2018/singleSign.less';
}

</style>
