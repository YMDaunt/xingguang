import Vue from 'vue'
import axios from 'axios'

Vue.component('deco-box', {
    props: {
        cname: {
            type: String,
            required: false,
            default: ''
        },
        needWrapper: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    template: document.querySelector('#deco-box')
})

Vue.component('sixangle', {
    template: document.querySelector('#sixangle')
})

var con = {
    toastTimer: null,
    toastDuration: 2000
}

var service = {
    apiHandler: function (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error('[service.apiHandler]:', res.message)
            throw new Error(res.message)
        }
    },
    dataHandler: function (data) {
        if (data.errno === 0) {
            return data.data
        } else {
            console.error('[service.dataHandler]:', data.msg)
            throw new Error(data.msg)
        }
    },
    initPage: function () {
        return axios.get('/Annual/init').then(this.apiHandler).then(this.dataHandler)
    },
    loadZhuboRank: function (pageNo) {
        return axios.get('/Annual/ranks', {
            params: {
                type: 'mod',
                pageNo: pageNo
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    loadUserRank (pageNo) {
        return axios.get('/Annual/ranks', {
            params: {
                type: 'user',
                pageNo: pageNo
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    loadTeamRank () {
        return axios.get('/Annual/GroupRanks').then().then(this.apiHandler).then(this.dataHandler)
    },
    // teamApply 申请信息列表
    applyList (groupId, pageNo) {
        return axios.get('/Annual/applyList', {
            params: {
                groupId, pageNo
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 我的团队 申请信息 (拒绝 或 同意)
    teamReply (applyId, option) {
        return axios.get('/Annual/handle', {
            params: {
                applyId, option
            }
        }).then(this.apiHandler)
    },
    // 搜索团队创建人
    searchTeam (teamId) {
        return axios.get('/Annual/nick', {
            params: {
                groupName: teamId
            }
        }).then(this.apiHandler)
    },
    // 加入团队
    joinTeam (teamId) {
        return axios.get('/Annual/Apply', {
            params: {
                groupName: teamId
            }
        }).then(this.apiHandler)
    },
    // 创建团队
    buildTeam () {
        return axios.get('/Annual/CreateGroup').then(this.apiHandler).then(this.dataHandler)
    },
    // 我的团队
    getMyTeam () {
        return axios.get('/Annual/myGroupMembers').then(this.apiHandler).then(this.dataHandler)
    }
}

export var uxMixins = {
    data: {
        modalShow: false,
        currModal: '', // ['askTeamOpt', 'askBuildTeam', 'buildTeamOk', 'joinTeam', 'myLeaderTeam', 'myMemberTeam']
        ruleState: false,
        ruleTab: 2,
        toastTipShow: false,
        toastTip: '',
        toastState: false,
        toastMsg: '',
        currTeamMore: {
            0: false,
            1: false
        },
        currTeamInd: 2, // 2 / 3
        teamTab: 0
    },
    methods: {
        changeTab (type) {
            if (type === this.currTab) return
            this.currTab = type

            this.resetPCRankS && this.resetPCRankS()
            if (this.currTab === 0) {
                !this.zhuboList.inited && this.loadZhuboRank()
            }
            if (this.currTab === 1) {
                !this.userList.inited && this.loadUserRank()
            }
        },
        changeRuleTab (type) {
            if (type === this.ruleTab) return
            this.ruleTab = type
        },
        changeTeamTab (type) {
            if (type === this.teamTab) return
            this.teamTab = type
        },
        showRule () {
            this.ruleState = true
            this.ruleTab = 0

            this.showPCRule && this.showPCRule()
        },
        closeRule () {
            this.ruleState = false
        },
        showModal (type) {
            this.modalShow = true
            this.currModal = type
        },
        hideModal () {
            this.modalShow = false
            this.currModal = ''
        },
        hideToastTip () {
            this.toastTipShow = false
        },
        /* toast */
        showToast (msg) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toastState = true
            this.toastMsg = msg

            con.toastTimer = setTimeout(() => {
                this.toastState = false
                this.toastMsg = ''
            }, con.toastDuration)
        },
        showMembers (ind) {
            if (ind === 0) {
                this.currTeamMore[0] = true
            }

            if (ind === 1 || ind === 2) {
                this.currTeamMore[1] = true
                this.currTeamInd = (ind + 1)

                var icon = this.$refs['icon-more'][ind === 1 ? 2 : 1]
                icon && (icon.style.display = 'none')
            }
        },
        hideMembers (ind) {
            this.currTeamMore[ind] = false

            if (ind === 1) {
                this.$refs['icon-more'][1].style.display = 'block'
                this.$refs['icon-more'][2] && (this.$refs['icon-more'][2].style.display = 'block')
            }
        },
        buildOrJoinTeam () {
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            if (!this.group.canJoinGroup) {
                this.showToast('只有用户等级≥4级的用户可以参与团拜活动哦~ ')
                return
            }
            this.showModal('askTeamOpt')
        },
        showMyMainTeam () {
            if (this.group.isLeader) {
                this.showModal('myLeaderTeam')
                this.resetTeamAList() // 从0加载起
            } else {
                this.showModal('myLeaderTeam') // 这里还是加载leaderTeam但是不显示tab
            }
        },
        askBuildTeam () {
            if (this.group.canCreateGroup) {
                this.showModal('askBuildTeam')
            } else {
                this.showToast('只有用户等级≥12级的用户可以创建团队哦~')
            }
        },
        askJoinTeam () {
            if (this.group.canJoinGroup) {
                this.showModal('joinTeam')
            } else {
                this.showToast('只有用户等级≥4级的用户可以加入团队哦~')
            }
        },
        copyCode () {
            var span = document.querySelector('#code')
            var range
            if (document.selection) {
                range = document.body.createTextRange()
                range.moveToElementText(span)
                range.select()
            } else if (window.getSelection) {
                var selection = window.getSelection()
                range = document.createRange()
                selection.removeAllRanges()
                range.selectNodeContents(span)
                selection.addRange(range)
            }

            document.execCommand('copy')
            this.showToast('邀请码已成功复制！')
        },
        focusInput (evt) {
            evt.target.focus()
        }
    }
}

export var commonMixins = {
    // mixins: [ uxMixins ],
    data: {
        isLogin: false,
        uid: null,
        running: false,
        isModerator: false,
        school: {
            levelText: '--',
            score: '--',
            need_score: '--',
            days: '--'
        },
        group: {
            hasGroup: false,
            groupId: null,
            groupName: null,
            canCreateGroup: false,
            canJoinGroup: false,
            isLeader: false
        },
        currTab: 0,
        zhuboList: {
            type: 'zhubo',
            inited: false,
            loading: false,
            hasNext: true,
            currPage: 0,
            list: [],
            meCenter: null
        },
        userList: {
            type: 'user',
            inited: false,
            loading: false,
            hasNext: true,
            currPage: 0,
            list: [],
            meCenter: null
        },
        teamRank: {
            list: [],
            meCenter: null
        },
        myTeam: {
            inited: false,
            list: null
        },
        myTeamQuerys: {
            type: 'teamQuerys',
            inited: false,
            loading: false,
            hasNext: true,
            currPage: 0,
            list: []
        },
        inputTid: '',
        searchTeamRes: ''
    },
    computed: {
        currRank: function () {
            if (this.currTab === 0) {
                return this.zhuboList
            }
            if (this.currTab === 1) {
                return this.userList
            }
            return { list: [] }
        },
        currTeam23: function () {
            // 点击NO2 NO3时渲染下面的team数据
            var sMap = {
                2: 1,
                3: 2
            }
            if (!this.currTeamMore[1] || !sMap[this.currTeamInd]) {
                return {
                    members: []
                }
            }

            return this.teamRank.list[sMap[this.currTeamInd]]
        },
        myTeamMbs: function () {
            if (this.myTeam.list) {
                return this.myTeam.list
            } else {
                return []
            }
        },
        myTeamOthers: function () {
            // 这里还要排序
            var others = []
            if (this.myTeam.list) {
                var members = this.myTeam.list
                for (var i = 0, len = members.length; i < len; i++) {
                    if (members[i].uid == this.uid) continue // eslint-disable-line
                    others.push(members[i])
                }
                others.sort((a, b) => {
                    return b.oScore - a.oScore
                })
            }
            return others
        },
        isFullMbs: function () {
            return this.myTeam.list && this.myTeam.list.length >= 10
        }
    },
    mounted: function () {
        this.init()

        this.initScroll()
    },
    methods: {
        init () {
            // 页面初始化数据
            this.initPage()

            // 加载默认榜单
            this.loadZhuboRank()

            // 加载团队榜单
            this.loadTeamRank()
        },
        initPage () {
            // 加载初始化数据
            service.initPage().then(data => {
                this.isModerator = data.isModerator
                data.play && (this.school = data.play)
                this.group = data.group

                this.uid = data.uid
                this.isLogin = data.isLogin
                this.running = data.running

                if (this.group.hasGroup) {
                    this.loadMyTeam() // 加载我的团队信息

                    if (!this.group.isLeader) {
                        this.changeTeamTab(1) // 默认显示我的队员信息
                    }
                }
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        initScroll () {
            var scrollBox = function (ele, cb, ctx) {
                var bh = 150
                var _self = ctx
                var scrollEle = ele

                scrollEle.addEventListener('scroll', function () {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH < bh) {
                        cb.call(_self)
                    }
                }, false)
            }

            var fnMap = {
                'zhubo': 'loadZhuboRank',
                'user': 'loadUserRank'
            }

            scrollBox(this.$refs.scroller, () => {
                console.log('[滚动加载]')

                fnMap[this.currRank.type] && this[fnMap[this.currRank.type]]()
            }, this)

            scrollBox(this.$refs['mtc-records'], () => {
                console.log('[申请信息 滚动加载]')
                this.loadTeamAList()
            }, this)
        },
        attention (infos, ind) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            if (infos.isLoved) return

            axios.get('/chenChen/attention', {
                params: {
                    mid: infos.id
                }
            }).then(service.apiHandler).then(data => {
                if (data.errno === 0) {
                    this.zhuboList.list[ind].isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            })
        },
        // 加载主播榜
        loadZhuboRank () {
            this.loadRank(this.zhuboList, 'loadZhuboRank', 'zhuboList')
        },
        loadUserRank () {
            this.loadRank(this.userList, 'loadUserRank', 'userList')
        },
        // 重新加载申请信息榜
        resetTeamAList () {
            this.myTeamQuerys = {
                type: 'teamQuerys',
                inited: false,
                loading: false,
                hasNext: true,
                currPage: 0,
                list: []
            }

            this.loadTeamAList()
        },
        // 加载申请信息榜
        loadTeamAList () {
            this.loadRank(this.myTeamQuerys, 'applyList', 'teamApplyList', [this.group.groupId])
        },
        loadRank (source, serviceName, tag, args) {
            if (!source.hasNext) {
                console.log(`[loading${tag}]: 没有更多数据...`)
                return
            }
            if (source.loading) {
                console.log(`[load${tag}]: loading 正在加载中... 请稍后`)
                return
            }

            source.loading = true
            var responser = data => {
                var list = source.list.concat(data.data)

                if (list.length > 100) {
                    source.list = list.slice(0, 100)
                    source.hasNext = false
                } else {
                    source.list = list
                    source.hasNext = data.hasNext
                }

                source.currPage += 1
                source.loading = false

                if (!source.inited) {
                    source.inited = true
                    source.meCenter = data.myRank
                }
            }
            if (args) {
                service[serviceName](...args, source.currPage + 1).then(responser)
            } else {
                service[serviceName](source.currPage + 1).then(responser)
            }
        },
        // 团队榜单
        loadTeamRank () {
            service.loadTeamRank().then(data => {
                this.teamRank.list = data.ranks
                this.teamRank.meCenter = data.myRank instanceof Array ? null : data.myRank
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // 加载我的队伍
        loadMyTeam () {
            service.getMyTeam().then(data => {
                this.myTeam.list = data
            }).catch(err => {
                console.log(err.message)
            })
        },
        // 创建团队
        buildTeam () {
            // 点击 "确认申请团队"
            service.buildTeam().then(data => {
                this.initPage()
                this.showModal('buildTeamOk')

                // 刷新我的团队
                this.loadTeamRank()
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        inputTeamId (evt) {
            var val = evt.target.value.replace(/[^0-9]+/g, '')
            if (val.length > 8) {
                val = val.slice(0, 8)
            }
            evt.target.value = val
            this.inputTid = val
            this.searchTeamRes = ''

            // -> 去搜索
            if (val.length !== 8) return
            service.searchTeam(val).then(data => {
                if (data.errno === 0) {
                    this.searchTeamRes = data.data.nickname
                } else {
                    this.searchTeamRes = '输入有误'
                }
            })
        },
        commitJoin () {
            // 点击 "加入团队 - 提交"
            if (!this.inputTid) return
            if (this.inputTid.length !== 8) {
                this.showToast('您输入的邀请码格式有误！')
                return
            }
            service.joinTeam(this.inputTid).then(data => {
                if (data.errno === 0) {
                    this.hideModal()
                    this.showToast(`您的申请已成功发送至团队创建者：${data.data.leaderNick}。`)
                } else if (data.errno === 107) {
                    this.showToast('您所要加入团队人数已满10人，无法加入该团队！')
                } else {
                    this.showToast(data.msg)
                }
            })
        },
        // 拒绝加入信息
        refuseApply (qid, qindex) {
            // 信息消失
            service.teamReply(qid, 2).then(data => {
                if (data.errno === 0 || data.errno === 110) {
                    // 110 加入了其他团队
                    this.myTeamQuerys.list.splice(qindex, 1)
                    return
                }

                throw new Error(data.msg)
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        // 同意加入信息
        allowApply (qid, qindex) {
            // 更新我的团队数据 -> 删除该条信息
            service.teamReply(qid, 1).then(data => {
                if (data.errno === 0) {
                    this.loadMyTeam() // 刷新我的团队数据
                    this.myTeamQuerys.list.splice(qindex, 1)
                    return
                }

                if (data.errno === 110) { // 110 加入了其他团队
                    this.myTeamQuerys.list.splice(qindex, 1)
                }

                throw new Error(data.msg)
            }).catch(err => {
                this.showToast(err.message)
            })
        }
    }
}

export default { uxMixins, commonMixins }
