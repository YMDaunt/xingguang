import vue from 'vue'
import common from 'common'
import '../../css/notice/versionsConflict.less'

const boundleIdsArr = ['tv.evan.majiao', 'tv.yuanbao.th', 'tv.yexiaoling.tuhaolive']

new vue({
    el: '.article',
    data: {
        version: '3.0.5',
        desc: ''
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init()
        })
    },
    methods: {
        init: function () {
            this.version = common.getVersion()

            let packageId = common.getPackageId()
            let keyWords = packageId == 0 ? '星光' : '星光'

            let boundleId = common.getBoundleId()
            for (let id of boundleIdsArr) {
                if (id == boundleId) {
                    this.desc = '检测到您还装有一个低版本的' + keyWords + '直播，请把它卸载掉再来使用我吧'
                    break
                }
                this.desc = '检测到您有一个高版本的' + keyWords + '直播，请把我卸载掉去使用它吧'
            }
        }
    }
})
