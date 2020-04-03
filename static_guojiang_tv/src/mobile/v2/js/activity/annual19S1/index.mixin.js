import Loading from '../components/Loading.vue'
import TimeTab from './components/timeTab.vue'
import { path } from './router'
import '../ceremony2018/loader'

// service
import { init, getUserRank, getTicketInfos, takeTicket } from './service'

// 分享文案 及标题
var gjShare = [{
    title: '2019星光年度盛典第一季预选赛',
    content: '这场王者之战已经打响，到底谁能笑到最后，我们拭目以待！',
    imgLink: require('../../../img/activity/annual19S1/share-1.jpg')
}, {
    title: '2019星光年度盛典第一季赛道报名',
    content: '王者之路，从此时的选择才真正的开始。',
    imgLink: require('../../../img/activity/annual19S1/share-2.jpg')
}, {
    title: '2019星光年度盛典第一季晋级赛',
    content: '强强对决，最激烈的厮杀，玩的就是刺激！',
    imgLink: require('../../../img/activity/annual19S1/share-3.jpg')
}, {
    title: '2019星光年度盛典第一季复活赛',
    content: '热血复活赛，争夺3个晋级决赛名额。你最希望哪位主播能够复活，快来星光支持她吧！',
    imgLink: require('../../../img/activity/annual19S1/share-4.jpg')
}, {
    title: '2019星光年度盛典第一季决赛',
    content: '年度第一季决赛到底谁能杀出重围，问鼎冠军宝座，让我们拭目以待！',
    imgLink: require('../../../img/activity/annual19S1/share-5.jpg')
}]

var con = {
    toastTimer: null,
    toastDuration: 3000,
    svgAniUrl: [
        '//static.guojiang.tv/app/gift/pc_animation/annual19S1mount/top1_zhizun/data.json',
        '//static.guojiang.tv/app/gift/pc_animation/annual19S1mount/top2_wangzhe/data.json',
        '//static.guojiang.tv/app/gift/pc_animation/annual19S1mount/top3_zuanshi/data.json',
        '//static.guojiang.tv/app/gift/pc_animation/annual19S1mount/top4_huangjin/data.json'
    ],
    currSvgAniIns: [null, null, null, null],
    rLine: []
}

const CommonMixin = {
    components: {
        Loading,
        TimeTab
    },
    filters: {
        rankIndex (value) {
            if (value < 10) {
                return '0' + value
            } else {
                return value
            }
        }
    },
    data: {
        inited: false, // 初始化接口是否加载

        stage: 0, // 活动阶段
        timeRangeStage: 0, // 显示的最大阶段
        showStage: 0, // 显示阶段

        // activityRunning: false, // 活动是否正在进行

        path: path, // 路由路径
        stageInfos: null, // 各个活动阶段的时间信息

        isLogin: false, // 是否登录
        isMod: false, // 是否是主播

        toastState: false,
        toastMsg: '',

        ruleState: false, // 活动规则 & 奖励 layer
        ruleTab: 'reward', // 规则 rule / 奖励 reward tab
        rwTab: 'mod', // 奖励 用户 / 主播 tab

        ruleStage: 0, // 活动规则显示阶段

        // 大人物榜
        urankState: false,
        userRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            meCenter: null
        },
        userRankBadge: {
            1: 'b-zzsh',
            2: 'b-wzsh',
            3: 'b-wzsh',
            4: 'b-zssh',
            5: 'b-zssh',
            6: 'b-hjsh',
            7: 'b-hjsh',
            8: 'b-hjsh',
            9: 'b-hjsh',
            10: 'b-hjsh'
        },

        // 助力票信息
        tickInfos: {
            first: 0, // 0 未进入直播间 1 进入未领取 2 已领取
            watchTime: 0, // 观看时长
            received: 0, // 已领取助力票次数
            cumTotal: 5, // 可以领取次数
            inDrawTime: false // 是否在领取期间
        },

        svgLayer: false, // svg show state

        // 主播奖励
        modRewards: [
            {
                name: '赛道TOP1 2019年度人气主播冠军 2019年度娱乐主播冠军',
                hIcon: 'txt-rw-u-top1',
                rws: [
                    {
                        name: '1000, 000克拉',
                        icon: 'g-kela'
                    },
                    {
                        name: '荣誉奖杯',
                        icon: 'g-globet'
                    },
                    {
                        name: '荣誉证书',
                        icon: 'g-cert'
                    },
                    {
                        name: '定制勋章<br/>（90日）',
                        icon: 'g-mod-ub-1'
                    },
                    {
                        name: '定制推荐标签<br/>（90日）',
                        icon: 'g-label'
                    },
                    {
                        name: '定制开屏<br/>(2日）',
                        icon: 'g-dzkp'
                    },
                    {
                        name: '定制广告位<br/>（2日）',
                        icon: 'g-banner'
                    },
                    {
                        name: '全站专属形象礼物<br/>（90日）',
                        icon: 'g-xx-gift'
                    },
                    {
                        name: '全站开播飘屏<br/>（20条）',
                        icon: 'g-kb-dm'
                    },
                    {
                        name: '荣耀殿堂展示',
                        icon: 'g-royal'
                    },
                    {
                        name: '2019星光年度盛典12月预选赛免赛权',
                        icon: 'g-ticket'
                    }
                ]
            },
            {
                name: '赛道TOP2 2019年度人气主播亚军 2019年度娱乐主播亚军',
                hIcon: 'txt-rw-u-top2',
                rws: [
                    {
                        name: '500, 000克拉',
                        icon: 'g-kela'
                    },
                    {
                        name: '荣誉奖杯',
                        icon: 'g-globet'
                    },
                    {
                        name: '荣誉证书',
                        icon: 'g-cert'
                    },
                    {
                        name: '定制勋章<br/>（60日）',
                        icon: 'g-mod-ub-2'
                    },
                    {
                        name: '定制推荐标签<br/>（60日）',
                        icon: 'g-label'
                    },
                    {
                        name: '全站开播飘屏<br/>（10条）',
                        icon: 'g-kb-dm'
                    },
                    {
                        name: '定制广告位<br/>（2日）',
                        icon: 'g-banner'
                    },
                    {
                        name: '荣耀殿堂展示',
                        icon: 'g-royal'
                    }
                ]
            },
            {
                name: '赛道TOP3 2019年度人气主播季军 2019年度娱乐主播季军',
                hIcon: 'txt-rw-u-top3',
                rws: [
                    {
                        name: '300, 000克拉',
                        icon: 'g-kela'
                    },
                    {
                        name: '荣誉奖杯',
                        icon: 'g-globet'
                    },
                    {
                        name: '荣誉证书',
                        icon: 'g-cert'
                    },
                    {
                        name: '定制勋章<br/>（30日）',
                        icon: 'g-mod-ub-3'
                    },
                    {
                        name: '定制推荐标签<br/>（30日）',
                        icon: 'g-label'
                    },
                    {
                        name: '全站开播飘屏<br/>（5条）',
                        icon: 'g-kb-dm'
                    },
                    {
                        name: '定制广告位<br/>（2日）',
                        icon: 'g-banner'
                    },
                    {
                        name: '荣耀殿堂展示',
                        icon: 'g-royal'
                    }
                ]
            }
        ],
        // 用户奖励
        userRewards: [
            {
                name: 'TOP1 至尊神豪',
                hIcon: 'txt-rw-top1',
                rws: [
                    {
                        name: '自选8位<br/>永久靓号',
                        icon: 'g-lh',
                        tips: '运营会在年度结束的7个工作日内和奖励用户确定靓号号码。用户按照大人物榜的名次，依次选择靓号。'
                    },
                    {
                        name: '至尊神豪勋章<br/>（90日）',
                        icon: 'g-badge-zzsh'
                    },
                    {
                        name: '加V标识<br/>（90日）',
                        icon: 'g-vip',
                        tips: '2019星光年度盛典第一季大人物第一名：至尊神豪'
                    },
                    {
                        name: '红包雨',
                        icon: 'g-rb',
                        tips: '红包雨于6.26 00:00之后每周用户首次进入直播间，下发到用户背包，每周3个，共42个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2019年9月30日23:59:59，请及时使用。'
                    },
                    {
                        name: '年度弹幕<br/>（90日）',
                        icon: 'g-dm-zzsh',
                        tips: '年度弹幕，超稀有奖励。只为彰显您尊贵身份而设计。'
                    },
                    {
                        name: '上头条*30个',
                        icon: 'g-stt'
                    },
                    {
                        name: '龙游天下座驾<br/>（90日）',
                        icon: 'g-zj-sh',
                        tips: '座驾会在活动结束后运营和用户联系座驾中放入的头像，再给用户下发。',
                        animation: true
                    }
                ]
            },
            {
                name: 'TOP2-3 王者神豪',
                hIcon: 'txt-rw-top23',
                rws: [
                    {
                        name: '自选8位<br/>永久靓号',
                        icon: 'g-lh',
                        tips: '运营会在年度结束的7个工作日内和奖励用户确定靓号号码。用户按照大人物榜的名次，依次选择靓号。'
                    },
                    {
                        name: '王者神豪勋章<br/>（60日）',
                        icon: 'g-badge-wzsh'
                    },
                    {
                        name: '加V标识<br/>（60日）',
                        icon: 'g-vip',
                        tips: '2019星光年度盛典第一季大人物第X名：王者神豪'
                    },
                    {
                        name: '红包雨',
                        icon: 'g-rb',
                        tips: '红包雨于6.26 00:00之后每周用户首次进入直播间，下发到用户背包，每周2个，共26个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2019年9月30日23:59:59，请及时使用。'
                    },
                    {
                        name: '年度弹幕<br/>（60日）',
                        icon: 'g-dm-wzsh',
                        tips: '年度弹幕，超稀有奖励。只为彰显您尊贵身份而设计。'
                    },
                    {
                        name: '上头条*20个',
                        icon: 'g-stt'
                    },
                    {
                        name: '龙游天下座驾<br/>（60日）',
                        icon: 'g-zj-sh',
                        tips: '座驾会在活动结束后运营和用户联系座驾中放入的头像，再给用户下发。',
                        animation: true
                    }
                ]
            },
            {
                name: 'TOP4-5 钻石神豪',
                hIcon: 'txt-rw-top45',
                rws: [
                    {
                        name: '红包雨',
                        icon: 'g-rb',
                        tips: '红包雨于6.26 00:00之后每周用户首次进入直播间，下发到用户背包，每周2个，共16个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2019年9月30日23:59:59，请及时使用。'
                    },
                    {
                        name: '钻石神豪勋章<br/>（30日）',
                        icon: 'g-badge-zssh'
                    },
                    {
                        name: '加V标识<br/>（30日）',
                        icon: 'g-vip',
                        tips: '2019星光年度盛典第一季大人物第X名：钻石神豪'
                    },
                    {
                        name: '年度弹幕<br/>（30日）',
                        icon: 'g-dm-zssh',
                        tips: '年度弹幕，超稀有奖励。只为彰显您尊贵身份而设计。'
                    },
                    {
                        name: '上头条*20个',
                        icon: 'g-stt'
                    },
                    {
                        name: '龙游天下座驾<br/>（30日）',
                        icon: 'g-zj-sh',
                        tips: '座驾会在活动结束后运营和用户联系座驾中放入的头像，再给用户下发。',
                        animation: true
                    }
                ]
            },
            {
                name: 'TOP6-10 黄金神豪',
                hIcon: 'txt-rw-top610',
                rws: [
                    {
                        name: '红包雨',
                        icon: 'g-rb',
                        tips: '红包雨于6.26 00:00之后每周用户首次进入直播间，下发到用户背包，每周1个，共8个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2019年9月30日23:59:59，请及时使用。'
                    },
                    {
                        name: '黄金神豪勋章<br/>（20日）',
                        icon: 'g-badge-hjsh'
                    },
                    {
                        name: '加V标识<br/>（20日）',
                        icon: 'g-vip',
                        tips: '2019星光年度盛典第一季大人物第X名：黄金神豪'
                    },
                    {
                        name: '年度弹幕<br/>（20日）',
                        icon: 'g-dm-hjsh',
                        tips: '年度弹幕，超稀有奖励。只为彰显您尊贵身份而设计。'
                    },
                    {
                        name: '上头条*10个',
                        icon: 'g-stt'
                    },
                    {
                        name: '龙游天下座驾<br/>（20日）',
                        icon: 'g-zj-sh',
                        tips: '座驾会在活动结束后运营和用户联系座驾中放入的头像，再给用户下发。',
                        animation: true
                    }
                ]
            }
        ]
    },
    mounted: function () {
        /* init 初始化数据 */
        this.showLoading()
        this.initInfos().then(() => {
            this.hideLoading()
            this.inited = true // 初始化接口已加载
            this.$refs.page && this.$refs.page.initPage() // 激活页面初始化信息
        }).catch(err => {
            this.hideLoading()
            this.showToast(err.message)
        })
    },
    computed: {
    },
    methods: {
        /* 全局bus */
        pageLoad (stage) {
            // 加载当前router-view hooks
            var loadPageEnterHooks = (stage) => {
                if (stage > this.timeRangeStage) { // 可能出现初始化信息还未加载完成
                    // 该路由未到时间开放
                    this.$router.replace(path[this.timeRangeStage === 0 ? 0 : this.timeRangeStage - 1].path)
                    return
                }

                this.showStage = stage
                this.ruleStage = this.showStage
            }

            if (this.inited) {
                loadPageEnterHooks(stage)
            } else {
                con.rLine.push(() => {
                    loadPageEnterHooks(stage)
                })
            }
        },
        /* 全局方法 */
        setShare (pathI) {
            if (this.pageType === 'pc') return

            window.gjShareObj.title = gjShare[pathI].title
            window.gjShareObj.content = gjShare[pathI].content
            window.gjShareObj.link = location.href
            window.gjShareObj.imgLink = location.protocol + gjShare[pathI].imgLink

            window.gjShareParam = JSON.stringify(window.gjShareObj)

            typeof gBridge !== 'undefined' && gBridge.setShareData(window.gjShareParam) // eslint-disable-line

            document.title = gjShare[pathI].title
        },
        calcTimeStage (stage) {
            if (stage <= 1) {
                return 1
            }
            if (stage === 2) {
                return 2
            }
            if (stage <= 6) {
                return 3
            }
            if (stage <= 8) { // 复活赛 休赛期
                return 4
            }
            return 5
        },
        // 初始化
        initInfos () {
            return init().then(data => {
                // console.debug('[api][init] done', data)
                // ! debug point
                // data.activityStatus = 10
                // data.serverTime = '2019-06-12 19:59:50' // ! debug node 测试拥有日榜的阶段用

                this.stage = data.activityStatus === -1 ? 10 : data.activityStatus
                this.stageInfos = data.allActivityTime

                this.timeRangeStage = this.calcTimeStage(this.stage)
                this.ruleStage = this.calcTimeStage(this.stage)
                this.isLogin = data.isLogin
                this.isMod = data.isMod

                this.startTime = data.startTime
                this.endTime = data.endTime
                this.serverTime = data.serverTime
                this.initTime = new Date().toString()

                // * router 在这里检测是否匹配到路由
                // * 如果是非法路劲 则 重定向到目前阶段 (非法路径: 该路径不存在)
                // * 如果已经匹配成功 则 不做处理
                if (this.$route.name === 'redirect') { // 路径不存在 或者 未开放
                    this.showStage = this.calcTimeStage(this.stage)
                    // console.debug('[router redirect to]:', path[this.showStage - 1].path)
                    this.$router.replace(path[this.showStage - 1].path)
                }

                con.rLine.length !== 0 && con.rLine.pop()() // load page

                // 判断活动是否处于进行阶段 (未开始 结束 休赛)
                // if (data.activityStatus === 0 || data.activityStatus === -1 || data.activityStatus === 8) {
                //     this.activityRunning = false
                // } else {
                //     this.activityRunning = true
                // }
            })
        },
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        // 滚动加载
        initScroll (ele, cb, ctx) {
            var bh = 150
            var _self = ctx
            var scrollEle = ele

            console.log('** init scroller loader **')
            scrollEle.addEventListener('scroll', function () {
                var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                if (toBottomH < bh) {
                    cb.call(_self)
                }
            }, false)
        },
        // 榜单加载工厂方法
        loadRank (source, serviceFn, maxNum, tag, options) {
            if (!source.hasNext) {
                console.log(`[loading ${tag}]: 没有更多数据...`)
                return
            }
            if (source.loading) {
                console.log(`[load ${tag}]: loading 正在加载中... 请稍后`)
                return
            }

            source.loading = true
            var responser = data => {
                source.loading = false
                source.meCenter = (data.myRank && !(data.myRank instanceof Array) && data.myRank.uid !== '') ? data.myRank : null

                // 判断是否有下一页 // 通常为15条一页, 防止拉黑数据缺失, 这里指定量为10
                if (data.ranks.length < 10) {
                    source.hasNext = false
                }

                var list = source.list.concat(data.ranks)
                if (list.length > maxNum) {
                    source.list = list.slice(0, maxNum)
                    source.hasNext = false
                } else {
                    source.list = list
                }

                source.currPage += 1
            }
            if (options) {
                return serviceFn(source.currPage + 1, options).then(responser)
            }
            return serviceFn(source.currPage + 1).then(responser)
        },
        /* component */
        changeRoute (i) {
            if (i === this.showStage) return

            if (i > this.timeRangeStage) {
                let path = this.path[i - 1]
                let st = path.startTime

                let h = st.getHours()
                let m = st.getMinutes()

                h = h < 10 ? '0' + h : h
                m = m < 10 ? '0' + m : m

                this.showToast(`${path.name}开启时间为${st.getMonth() + 1}月${st.getDate()}日 ${h}:${m}`)
                return
            }

            // console.debug('[changeRoute]', this.path[i - 1])
            this.$router.push(this.path[i - 1].path)
        },
        changeRuleStage (i) {
            this.ruleStage = i

            this.resetRRule()
        },
        /* module */
        toggleRule () {
            this.ruleState = !this.ruleState

            if (this.ruleState) { // 置为默认阶段
                this.ruleStage = this.showStage
            }
        },
        changeRTab (type) {
            this.ruleTab = type

            this.resetRRS() // 重置高度
        },
        changeRWTab (type) {
            this.rwTab = type

            this.resetRRS() // 重置高度
        },
        toggleURank () {
            this.urankState = !this.urankState

            if (this.urankState) {
                this.resetURLayer() // 充值高度

                this.showLoading()
                Promise.all([
                    this.loadTicketInfo(),
                    this.loadUserRank()
                ]).then(() => {
                    this.hideLoading()
                }).catch(err => {
                    this.hideLoading()
                    this.showToast(err.message)
                })
            }
        },
        // toast
        showToast (msg, type) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toastState = true
            this.toastMsg = msg

            if (type === 'tips') return // tips 则不定时消失

            con.toastTimer = setTimeout(() => {
                this.toastState = false
                this.toastMsg = ''
            }, con.toastDuration)
        },
        hideToast () {
            clearTimeout(con.toastTimer)
            this.toastState = false
            this.toastMsg = ''
        },
        // class calc
        getUserBadge (ind) {
            if (ind === 0) return 'b-zzsh'

            if (ind < 3) return 'b-wzsh'

            if (ind < 5) return 'b-zssh'

            if (ind < 10) return 'b-hjsh'

            return ''
        },
        playSvg (i) {
            loader.require('//static.guojiang.tv/pc/v3/js/component/bodymovin.js', () => { // eslint-disable-line
                this.svgLayer = true

                if (con.currSvgAniIns[i]) {
                    con.currSvgAniIns[i].show()
                    con.currSvgAniIns[i].play()
                    return
                }

                var el = this.$refs['svgContainer']
                var playSvg = function (path) {
                    return bodymovin.loadAnimation({ // eslint-disable-line
                        wrapper: el,
                        animType: 'html',
                        loop: true,
                        autoplay: true,
                        path: path
                    })
                }

                con.currSvgAniIns[i] = playSvg(con.svgAniUrl[i])
            }, function () {})
        },
        stopSvg () {
            this.svgLayer = false

            con.currSvgAniIns.forEach(ins => {
                if (ins) {
                    ins.stop()
                    ins.hide()
                    // con.currSvgAniIns.destroy()
                    // con.currSvgAniIns = null
                }
            })
        },
        // service api
        // 加载大人物榜 每次点击显示时加载
        loadUserRank () {
            // 加载前重置 reset
            this.userRank = {
                hasNext: true,
                loading: false,
                currPage: 0,
                list: [],
                meCenter: null
            }

            return this.loadRank(
                this.userRank,
                getUserRank,
                10,
                '[Top10UserRank]'
            ).then(() => {
                this.userRank.hasNext = false
            })
        },
        // 加载助力票信息
        loadTicketInfo () {
            if (!this.isLogin) {
                return new Promise((resolve, reject) => {
                    resolve()
                }).then(() => {
                    if (this.stage === 0 || this.stage === 2 || this.stage === 8) {
                        this.tickInfos.inDrawTime = false
                    } else {
                        this.tickInfos.inDrawTime = true
                    }
                })
            }

            return getTicketInfos().then(data => {
                this.tickInfos.first = data.first
                this.tickInfos.watchTime = data['watch_time']
                this.tickInfos.received = data.received
                this.tickInfos.cumTotal = data['cumulate_total']
                this.tickInfos.inDrawTime = data.isAvailableTime
            })
        },
        // 领取助力票
        drawTicket (type) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }

            if (type === 1 && this.tickInfos.first === 0) {
                this.showToast('您今日还未进入直播间，无法领取哦！')
                return
            }
            this.showLoading()
            return takeTicket(type).then(data => {
                this.hideLoading()
                if (type === 1) {
                    this.tickInfos.first = 2 // 变为已领取
                }

                if (type === 2) {
                    this.tickInfos.received += data.recNum

                    if (this.tickInfos.received === this.tickInfos.cumTotal) {
                        this.showToast(`本次领取${data.recNum}张助力票，您已领取全部助力票。`)
                    } else {
                        this.showToast(`本次领取${data.recNum}张助力票，还有${data.canNum}张助力票可领取，加油哦！`)
                    }
                }
            }).catch(err => {
                // type === 2 在线累计观看直播每满5分钟，才能领取1张助力票哦！
                this.hideLoading()
                this.showToast(err.message)
            })
        }
    }
}

export default CommonMixin
