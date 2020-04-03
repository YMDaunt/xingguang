<template>
    <!-- 弹窗层 -->
    <rule-layer
        v-show="layerShow"
        wrap-class="layer-rule">
        <div
            slot="content"
            ref="ruleLayer"
            class="layer-content">
            <!-- TODO: 活动礼物组建抽离 -->
            <div class="bg-title"><span class="txt-gift">活动礼物</span></div>
            <div class="gifts">
                <div class="gifts-i">
                    <div class="pic pic-ticket" />
                    <div class="name txt-bg-m">
                        <span
                            class="linear-txt"
                            text="年度票">年度票</span>
                    </div>
                    <div class="val">1张年度票=10克拉=1荣耀值</div>
                </div>
                <div class="gifts-i">
                    <div class="pic pic-rocket" />
                    <div class="name txt-bg-m">
                        <span
                            class="linear-txt"
                            text="盛典火箭">盛典火箭</span>
                    </div>
                    <div class="val">1个盛典火箭=18800克拉=1880荣耀值</div>
                </div>
                <div class="gifts-i">
                    <div class="pic pic-ticket-user" />
                    <div class="name txt-bg-m">
                        <span
                            class="linear-txt"
                            text="助力票">助力票</span>
                    </div>
                    <div class="val">1张助力票=10克拉=1荣耀值</div>
                </div>
            </div>
            <div class="bg-title txt-rules"><span class="txt-rules">预选赛规则</span></div>
            <p class="rule-i">
                <span class="label">参赛时间：</span>
                <span class="text">12.5 12:00:00- 12.10 23:59:59。</span>
            </p>
            <p class="rule-i">
                <span class="label">参赛范围：</span>
                <span class="text">平台所有主播无需报名，即可参赛。</span>
            </p>
            <p class="rule-i">
                <span class="label">赛制说明：</span>
                <span class="text">按主播累计荣耀值排名，晋级前100名主播。若荣耀值相同，则按先到先得排名。</span>
            </p>
            <div class="txt-bg-m rule-label">
                <span
                    class="linear-txt"
                    text="主播玩法">主播玩法</span>
            </div>
            <p class="rule-i">1. 主播每日日榜第一名奖励助力票20000张，每日23:59:59结算。奖励的助力票主播无分成，自动算入主播当日活动日榜，以及预选赛榜。对主播直播间榜单不生效，仅对主播活动榜单生效。</p>
            <p class="rule-i">2. 日榜每日的TOP100主播，次日都将获得“年度100强”推荐标签。最终晋级的100名主播，推荐标签有效期：12.11 00:00:00 - 12.15 23:59:59。</p>
            <div class="txt-bg-m rule-label">
                <span
                    class="linear-txt"
                    text="用户玩法">用户玩法</span>
            </div>
            <p class="rule-i">用户可以通过以下来源获取助力票，获得的助力票会显示在直播间-背包。</p>
            <p class="rule-i">- 观看福利：用户每日首次进入直播间，获得1张助力票，自动下发在背包。在线累计观看直播满5分钟，获得1张助力票，需手动领取，每日上限5张。6张票仅当日有效，次日清空。（在大人物榜榜首显示观看福利领取详情；一个设备/IP每日仅限一个ID获得观看福利；仅记录在直播间时间，大厅停留时间不累计）</p>
            <p class="rule-i">- 充值福利：用户可通过年度充值活动获得。
                <a
                    class="rule-link"
                    href="./charge.html"
                    target="_blank">点击跳转充值活动>>></a></p>
            <p class="rule-i">- 游戏福利：用户可通过年度盛典赛事期间直播间游戏“幸运转盘”、“幸运砸金蛋”获得。</p>
            <p class="rule-i">- 红包雨福利：用户一次性送出1880张年度票或赠送一个盛典火箭，触发直播间红包雨。掉落助力票、克拉。</p>
            <p class="rule-i">注：通过以上来源获得的助力票主播无分成。非赛事期间送出年度礼物，仅增加主播直播间星光值，对年度活动所有榜单不生效。</p>
            <p class="rule-i">榜单说明：预选赛榜为主播榜，预选赛结束后。榜单荣耀值不累计至下个赛段；大人物榜为用户榜，榜单贡献荣耀值累计至超级冠军赛。</p>
            <p class="rule-i">温馨提示：因年度盛典期间，送礼量大，服务器会有一定程度的延迟，请用户提前10秒偷塔，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单，平台不予补偿，请谅解。</p>
        </div>
    </rule-layer>
</template>

<script>
// 年度盛典 预选赛 活动规则弹框
import bus from '../../bus.js'
import RuleLayer from '../../components/RuleLayer'
import PCScroller from '../../PCScroller.js'

var scroller = null

export default {
    name: 'QualifierLayer',
    components: {
        RuleLayer
    },
    data () {
        return {
            layerShow: false
        }
    },
    mounted () {
        scroller = new PCScroller(this.$refs.ruleLayer)

        bus.$on('showQualifierLayer', this.showLayer)
    },
    updated () {
        // PCScroller._scrollers.forEach(s => {
        scroller.refreshDOM()
        // })
    },
    methods: {
        closeLayer () {
            this.layerShow = false
        },
        showLayer (type) {
            this.layerShow = true
        }
    }
}
</script>

<style lang="less" scoped>
@bf: 1px*10/6;
@imgUrl: '../../../../../img/activity/ceremony2018';

// 渐变边框
.gradient-bd (@bW) {
    border: @bW/@bf solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
}

.o-sprite {
    background-image: url('@{imgUrl}/qualifier/icons.png');
    background-repeat: no-repeat;
    background-size: 341/@bf 1548/@bf;
    font-size: 0;
}

.getSprite (@w, @h, @posx, @posy) {
    @pad: 5;
    display: inline-block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}

.tbg_right {
    .getSprite(265, 57, -10, -132);
}
.txt_gift {
    .getSprite(254, 58, -10, -286);
}
.txt_rules {
    .getSprite(321, 58, -10, -364);
}
.tbg_left {
    .getSprite(267, 57, -10, -209);
}

// 规则弹窗
.layer-content {
    .gradient-bd(4);
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20/@bf;

    .bg-title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40/@bf;
        margin-bottom: 60/@bf;

        &:before {
            content: '';
            .o-sprite;
            .tbg_left;
        }

        &:after {
            content: '';
            .o-sprite;
            .tbg_right;
        }

        .txt-gift {
            .o-sprite;
            .txt_gift;
            position: relative;
            top: 8/@bf;
            margin: 0px 30/@bf;
        }

        .txt-rules {
            .o-sprite;
            .txt_rules;
            position: relative;
            top: 8/@bf;
            margin: 0px 30/@bf;
        }
    }

    .txt-bg-m {
        background: url('@{imgUrl}/qualifier/t_bg_m.png') no-repeat;
        background-size: 322/@bf 60/@bf;
        width: 322/@bf;
        height: 60/@bf;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20/@bf auto 10/@bf;
        font-size: 36/@bf;
    }

    .gifts {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin: 50/@bf 0 30/@bf;
    }

    .gifts-i {
        width: 470/@bf;
        margin: 0px 20px;
        text-align: center;

        .pic {
            position: relative;
            &:before {
                content: '';
                display: block;
                background-image: url('@{imgUrl}/qualifier/g-bg.png');
                background-size: 396/@bf 378/@bf;
                width: 396/@bf;
                height: 378/@bf;
                margin: 0 auto;
            }

            &:after {
                content: '';
                position: absolute;
            }
        }

        .pic-ticket:after {
            width: 325/@bf;
            height: 280/@bf;
            background: url('@{imgUrl}/preState/a-ticket.png') no-repeat;
            background-size: cover;
            top: 36%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .pic-ticket-user:after {
            width: 325/@bf;
            height: 280/@bf;
            background: url('@{imgUrl}/preState/h-ticket.png') no-repeat;
            background-size: cover;
            top: 36%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .pic-rocket:after {
            width: 647/@bf;
            height: 642/@bf;
            background: url('@{imgUrl}/preState/rocket.png') no-repeat;
            background-size: cover;
            top: 50%;
            left: 50%;
            transform: translate(-61%, -39%);
        }

        .name {
            // font-size: 0px;
            color: #bf9a42;
        }

        .val {
            display: block;
            font-size: 36/@bf;
            color: #f1ca70;
            text-align: center;
        }
    }

    .txt-rules {
        margin-top: 80/@bf;
    }

    .rule-i {
        font-size: 32/@bf;
        color: #ffdb88;
        margin: 34/@bf 20/@bf;
        line-height: 52/@bf;

        .label {
            display: inline-block;
            width: 160/@bf;
            white-space: nowrap;
            vertical-align: top;
        }

        .text {
            display: inline-block;
            width: 610px;
        }
    }

    .rule-link {
        font-size: 32/@bf;
        color: #ffdb88;
        text-decoration: underline;
    }

    .rule-label {
        font-size: 36/@bf;
        margin-top: 80/@bf;
    }
}
</style>
