import axios from 'axios'
import Loading from './components/Loading.vue'

var con = {
    toastTimer: null,
    toastDuration: 3000
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
    getRanks: function (type) {
        // type = 'user' 'mod' 'host'
        return axios.get('/HostChallenge/Ranks', {
            params: {
                type,
                pageNo: 1,
                pageSize: 10
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    getRoomScore: function () {
        return axios.get('/HostChallenge/GetHostDateRecords').then(this.apiHandler).then(this.dataHandler)
    }
}

const CommonMixin = {
    components: {
        Loading
    },
    data: {
        toastState: false,
        toastMsg: '',
        ruleState: false,
        scoreState: false,

        currStage: 1,
        currRank: {
            hasNext: true,
            loading: false,
            currPage: 0,
            list: [],
            type: 'host',
            meCenter: null
        },
        rankTabType: 'host', // 'host' 'mod' 'user'
        rankTips: {
            'host': '仅展示前10位主持人',
            'mod': '仅展示前10位主播',
            'user': '仅展示前10位用户'
        },

        roomScore: []
    },
    mounted: function () {
        this.showLoading()
        this.loadRank()
            .then(() => {
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
    },
    computed: {
        currRankList () {
            let padArr = [null, null, null, null, null, null, null, null, null, null]
            let len = this.currRank.list.length
            return this.currRank.list.concat(padArr.slice(0, 10 - len))
        }
    },
    methods: {
        showLoading () {
            this.$refs.loading.showLoading()
        },
        hideLoading () {
            this.$refs.loading.hideLoading()
        },
        // toast
        showToast (msg) {
            if (con.toastTimer) clearTimeout(con.toastTimer)

            this.toastState = true
            this.toastMsg = msg

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
        toastTips (msg) {
            this.toastState = true
            this.toastMsg = msg
        },
        showRule () {
            this.ruleState = true

            this.refreshRule()
        },
        hideRule () {
            this.ruleState = false
        },
        hideScore () {
            this.scoreState = false
            this.roomScore = []
        },
        changeRank (type) {
            if (type === this.rankTabType) return

            this.rankTabType = type
            this.refreshRank()
        },
        showScore () {
            this.scoreState = true
            this.loadScore()
        },
        capClick (evt) {
            let cname = evt.target.className.split(' ')

            if (cname.indexOf('layer-rules') > -1) {
                this.hideRule()
                return
            }

            if (cname.indexOf('modal-rec') > -1) {
                this.hideMyLotRec()
            }
        },
        refreshRank () {
            this.currRank = {
                type: this.rankTabType,
                hasNext: true,
                currPage: 0,
                list: [],
                meCenter: null
            }
            this.showLoading()
            this.loadRank()
                .then(() => {
                    this.hideLoading()
                }).catch(err => {
                    this.hideLoading()
                    this.showToast(err.message)
                })
        },
        loadRank () {
            let type = this.currRank.type
            let source = this.currRank
            if (!source.hasNext) {
                console.log(`[loading ${type}]: 没有更多数据...`)
                return Promise.resolve()
            }
            if (source.loading) {
                console.log(`[load ${type}]: loading 正在加载中... 请稍后`)
                return Promise.resolve()
            }

            if (!source.inited) {
                this.showLoading()
            }
            source.loading = true
            return service.getRanks(type, source.currPage + 1).then(data => {
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
                    source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null

                    this.hideLoading()
                }
            })
        },
        loadScore () {
            this.showLoading()
            service.getRoomScore()
                .then(res => {
                    this.hideLoading()

                    this.roomScore = res.map((rs) => {
                        let date = rs.date.split('月')
                        let month = +date[0]
                        let day = +date[1].split('日')[0]

                        if (month < 10) {
                            month = '0' + month
                        }
                        if (day < 10) {
                            day = '0' + day
                        }

                        rs.icon = 'txt-' + month + day

                        return rs
                    })
                })
                .catch(err => {
                    this.hideLoading()

                    this.showToast(err.message)
                })
        }
    }
}

export default CommonMixin
