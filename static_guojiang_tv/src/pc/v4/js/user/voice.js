/*
 * @Date: 2018-08-14 17:49:08
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 16:22:34
 */
/* eslint-disable */
import '../../css/user/voice.less'
import Vue from 'vue'
import bodymovin from '../component/bodymovin.min.js'

let vm = new Vue({
    el: 'article',
    data: {
        showDownLayer: false,
        voiceArr: [
            {id: 1, time: 14, name: '诗曼', ext: 'flv', isPlaying: false},
            {id: 2, time: 13, name: '薇漾', ext: 'flv', isPlaying: false},
            {id: 3, time: 5, name: '喵喵', ext: 'flv', isPlaying: false},
            {id: 4, time: 20, name: '暖暖', ext: 'flv', isPlaying: false},
            {id: 5, time: 16, name: '愿你是我永远的听众', ext: 'flv', isPlaying: false},
            {id: 6, time: 19, name: '等着你', ext: 'flv', isPlaying: false},
            {id: 7, time: 19, name: '小野猫', ext: 'flv', isPlaying: false},
            {id: 8, time: 9, name: '我只等你', ext: 'flv', isPlaying: false},
            {id: 9, time: 12, name: '你好我就好', ext: 'flv', isPlaying: false},
            {id: 10, time: 18, name: '心颖等你', ext: 'flv', isPlaying: false},
            {id: 11, time: 13, name: '我的缘分在哪里', ext: 'flv', isPlaying: false},
            {id: 12, time: 13, name: '小娃娃', ext: 'flv', isPlaying: false},
            {id: 13, time: 19, name: '甜甜等你下单哦', ext: 'flv', isPlaying: false},
            {id: 14, time: 19, name: '迷香小姐姐', ext: 'flv', isPlaying: false},
            {id: 15, time: 17, name: '小蛮腰+大长腿', ext: 'flv', isPlaying: false},
            {id: 16, time: 11, name: '宝宝约吗', ext: 'flv', isPlaying: false},
            {id: 17, time: 15, name: '楠楠在等你', ext: 'flv', isPlaying: false},
            {id: 18, time: 20, name: '愿得一人心', ext: 'flv', isPlaying: false},
            {id: 19, time: 18, name: '我梦见了你', ext: 'flv', isPlaying: false},
            {id: 20, time: 14, name: '想起你会笑', ext: 'flv', isPlaying: false},
            {id: 21, time: 13, name: '治愈系小仙女', ext: 'flv', isPlaying: false},
            {id: 22, time: 7, name: '小仙女么么哒', ext: 'flv', isPlaying: false},
            {id: 23, time: 4, name: '请允许我一厢情愿', ext: 'flv', isPlaying: false},
            {id: 24, time: 10, name: '喜欢我就找我', ext: 'flv', isPlaying: false},
            {id: 25, time: 13, name: '我好无聊啊', ext: 'flv', isPlaying: false},
            {id: 26, time: 15, name: '每晚7点不见不散', ext: 'flv', isPlaying: false},
            {id: 27, time: 16, name: '相识是缘', ext: 'flv', isPlaying: false},
            {id: 28, time: 9, name: '妲己', ext: 'flv', isPlaying: false},
            {id: 29, time: 20, name: '小魔女(_ ￣3)(ε￣ _)', ext: 'flv', isPlaying: false},
            {id: 30, time: 11, name: '爱情顾问❀', ext: 'flv', isPlaying: false},
            {id: 31, time: 20, name: 'Hello陌生人❤', ext: 'flv', isPlaying: false},
            {id: 32, time: 20, name: '婉儿', ext: 'flv', isPlaying: false},
            {id: 33, time: 19, name: '无可救药', ext: 'flv', isPlaying: false},
            {id: 34, time: 16, name: '来找我哦', ext: 'flv', isPlaying: false},
            {id: 35, time: 4, name: '我听见你叫我', ext: 'mp4', isPlaying: false},
            {id: 36, time: 6, name: '今夜我的我属于谁', ext: 'mp4', isPlaying: false},
            {id: 37, time: 3, name: '非诚者勿扰', ext: 'mp4', isPlaying: false},
            {id: 38, time: 6, name: '可爱小公举', ext: 'mp4', isPlaying: false},
            {id: 39, time: 6, name: '萌妹纸', ext: 'mp4', isPlaying: false},
            {id: 40, time: 6, name: '粘人小妖精', ext: 'mp4', isPlaying: false},
            {id: 41, time: 3, name: '性感小迷妹', ext: 'mp4', isPlaying: false},
            {id: 42, time: 4, name: '新人求守护', ext: 'mp4', isPlaying: false},
            {id: 43, time: 18, name: '擦掉眼泪继续撸', ext: 'flv', isPlaying: false},
            {id: 44, time: 6, name: '热辣红唇', ext: 'mp4', isPlaying: false},
            {id: 45, time: 14, name: '-黯然销魂药', ext: 'flv', isPlaying: false},
            {id: 46, time: 13, name: '哥哥们想你', ext: 'flv', isPlaying: false},
            {id: 47, time: 18, name: '宝儿', ext: 'flv', isPlaying: false},
            {id: 48, time: 13, name: '歌姬九儿❀', ext: 'flv', isPlaying: false},
            {id: 49, time: 20, name: '淼淼之声', ext: 'flv', isPlaying: false},
            {id: 50, time: 15, name: '倾听者', ext: 'flv', isPlaying: false},
            {id: 51, time: 19, name: '我是橙橙啊', ext: 'flv', isPlaying: false},
            {id: 52, time: 15, name: '大家好', ext: 'flv', isPlaying: false},
            {id: 53, time: 20, name: '期待有缘人', ext: 'flv', isPlaying: false},
            {id: 54, time: 16, name: '萌宝宝', ext: 'flv', isPlaying: false},
            {id: 55, time: 3, name: '要跟你在一起', ext: 'mp4', isPlaying: false},
            {id: 56, time: 18, name: '转身遇见你', ext: 'flv', isPlaying: false},
            {id: 57, time: 18, name: '这次是你吗', ext: 'flv', isPlaying: false},
            {id: 58, time: 20, name: '送你一首歌', ext: 'flv', isPlaying: false},
            {id: 59, time: 16, name: '这次别走', ext: 'flv', isPlaying: false},
            {id: 60, time: 3, name: '哈哈哈', ext: 'mp4', isPlaying: false}
        ],
        sideList: [
            {id: 1, name: '火舞'},
            {id: 2, name: '大眼萌妹'},
            {id: 3, name: '婉婉求守护'},
            {id: 4, name: '新手上路'},
            {id: 5, name: '最佳前女友'},
            {id: 6, name: 'Delores'},
            {id: 7, name: '爱妃'},
            {id: 8, name: '谜一般的小汤圆'},
            {id: 9, name: '大溪舞蹈'},
            {id: 10, name: '晏子'}
        ],
        connectMembersNum: 5298,
        uConnectAvatar: '',
        mConnectAvatar: ''
    },
    created: function () {
    },
    mounted: function () {
        this.$nextTick(function () {
            this.initPhoneSvg()
            this.getConnectMembersNum()
            this.getUserConnectAvatar()
        })
    },
    methods: {
        initPhoneSvg () {
            var svgContainer = document.getElementById('phoneAnimation')
            bodymovin.loadAnimation({
                wrapper: svgContainer,
                animType: 'svg',
                loop: true,
                autoplay: true,
                path: '//static.guojiang.tv/pc/v4/img/user/voice/mobile/data.json'
            })
        },

        startVoice (id) {
            this.voiceArr.forEach(function (val) {
                val['isPlaying'] = false
            })

            this.voiceArr[id - 1]['isPlaying'] = true

            var flashvars = {
                f: `//static.guojiang.tv/pc/v4/img/user/voice/voice/${id}.${this.voiceArr[id - 1]['ext']}`,
                c: 0,
                p: 1
            }
            var params = {bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'transparent'}
            CKobject.embedSWF('//static.guojiang.tv/pc/js/ckplayer/ckplayer.swf', 'voiceVideo', 'ckRoomPlayer', '640', '480', flashvars, params)

            setTimeout(function () {
                vm.voiceArr[id - 1]['isPlaying'] = false
            }, vm.voiceArr[id - 1]['time'] * 1000)
        },

        getContentAvatar (id) {
            return `//static.guojiang.tv/pc/v4/img/user/voice/avatar/(${id}).jpg`
        },

        getSideAvatar (id) {
            return `//static.guojiang.tv/pc/v4/img/user/voice/avatar/(${62 + id}).jpg`
        },

        getSideMaskImg (id) {
            return `//static.guojiang.tv/pc/v4/img/user/voice/0${id}.png`
        },

        getLabel () {
            let temLabel = ['温柔', '清纯', '甜美', '性感', '火辣', '迷人', '幽默', '可爱', '女神', '娇柔', '妩媚', '治愈', '高冷', '性感', '成熟', '温婉', '幽默', '可爱', '呆萌', '娇羞', '女神']
            let len = temLabel.length
            let labelArr = []
            for (let i = 0; i < 3; i++) {
                len -= i
                let randomId = parseInt(Math.random() * len)

                labelArr.push(temLabel[randomId])
                temLabel.splice(randomId, 1)
            }

            return `<span>${labelArr[0]}</span><span>${labelArr[1]}</span><span>${labelArr[2]}</span>`
        },

        getChatNum () {
            return parseInt(Math.random() * 490) + 10
        },

        getStatus () {
            let num = parseInt(Math.random() * 2)
            if (num == 0) {
                return true
            }
            return false
        },

        getConnectMembersNum () {
            let base = 5000

            setInterval(function () {
                let x = parseInt(Math.random() * 200 + 300)
                let y = parseInt(Math.random() * 50)
                let symbol = parseInt(Math.random() * 2)

                vm.connectMembersNum = symbol === 0 ? base + x + y : base + x - y
            }, 1000)
        },

        getUserConnectAvatar () {
            function run () {
                let num = parseInt(Math.random() * 10) + 1
                vm.uConnectAvatar = `//static.guojiang.tv/pc/v4/img/user/voice/user/${num}.jpg`

                vm.mConnectAvatar = `//static.guojiang.tv/pc/v4/img/user/voice/avatar/(${num + 62}).jpg`
            }
            run()
            setInterval(run, 3000)
        },

        qqLogin () {
            location.href = '/user/qqLogin?callback=' + callback
        }
    }
})
