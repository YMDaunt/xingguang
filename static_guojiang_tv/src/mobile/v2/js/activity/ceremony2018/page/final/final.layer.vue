<template>
    <!-- 弹窗层 -->
    <rule-layer
        v-show="layerShow"
        wrap-class="layer-rule">
        <div
            slot="content"
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
            <div class="bg-title2"><span class="txt-rules">超级冠军赛规则</span></div>
            <p class="rule-i">
                <span class="label">参赛时间：</span>
                <span class="text">12.20 00:00:00 - 12.21 23:59:59。</span>
            </p>
            <p class="rule-i">
                <span class="label">参赛范围：</span>
                <span class="text">5个单项赛的冠军主播。</span>
            </p>
            <p class="rule-i">
                <span class="label">赛制说明：</span>
                <span class="text">5位主播进行荣耀值排名，决出超级冠军——年度最佳主播。若荣耀值相同，则按先到先得排名。</span>
            </p>
            <p class="rule-i">
                <span class="label" />
                <span class="text">例：若偶像赛道的冠军主播成为年度最佳主播，则偶像赛道的亚军主播自动成为偶像赛道的冠军主播，则偶像赛道的季军主播自动成为偶像赛道的亚军主播，则偶像赛道的第四名主播自动成为偶像赛道的季军主播。
                </span>
            </p>
            <div class="plan-rules">
                <!-- 超级冠军赛晋级时间说明 -->
                <div class="plan-rule-i">
                    <span class="badge badge-4" />
                    <span class="sep" />
                    <span class="time">12月20日 00:00:00 - 12月20日23:59:59</span>
                </div>
                <div class="plan-rule-i">
                    <span class="badge badge-6" />
                    <span class="sep" />
                    <span class="time">12月21日 00:00:00 - 12月21日23:59:59</span>
                </div>
            </div>
            <div class="txt-bg-m rule-label">
                <span
                    class="linear-txt"
                    text="主播玩法">主播玩法</span>
            </div>
            <p class="rule-i with-dot">获得2018星光年度最佳主播的主播，将在12月22日 00:00 全站飘屏通知，并赠送红包雨奖励。</p>
            <p class="rule-i with-dot">超级冠军赛第一名主播额外奖励1000000克拉，第二名主播额外奖励800000克拉，第三名主播额外奖励500000克拉。</p>
            <p class="rule-i with-dot">“5进3”和“3强争霸”的荣耀值不累计。</p>
            <div class="txt-bg-m rule-label">
                <span
                    class="linear-txt"
                    text="用户玩法">用户玩法</span>
            </div>
            <p class="rule-i">1. 年度特惠  经验翻倍</p>
            <p class="rule-i">- 超级冠军赛期间，用户送出年度票、助力票、盛典火箭，产生的经验值为双倍，这个年度，助力用户等级飞升。</p>
            <p class="rule-i">例：用户A送给主播B一个盛典火箭，价值18800克拉。活动榜单超级冠军榜主播A累计1880荣耀值，大人物榜用户A累计1880荣耀值。主播B直播间累计18800星光值。用户A的用户等级经验值累计18800*2=37600。主播B的主播等级经验值累计18800。粉丝亲密度：1克拉=1亲密度不变。</p>
            <p class="rule-i">2. 用户可以通过以下来源获取助力票，获得的助力票会显示在直播间-背包。</p>
            <p class="rule-i">- 观看福利：用户每日首次进入直播间，获得1张助力票，自动下发在背包。在线累计观看直播满5分钟，获得1张助力票，需手动领取，每日上限5张。6张票仅当日有效，次日清空。（在大人物榜榜首显示观看福利领取详情；一个设备/IP每日仅限一个ID获得观看福利；仅记录在直播间时间，大厅停留时间不累计）</p>
            <p class="rule-i">- 充值福利：用户可通过年度充值活动获得。
                <a
                    class="rule-link"
                    href="./charge.html"
                    target="_blank">点击跳转充值活动>>></a></p>
            <p class="rule-i">- 游戏福利：用户可通过年度盛典赛事期间直播间游戏“幸运转盘”、“幸运砸金蛋”获得。</p>
            <p class="rule-i">- 红包雨福利：用户一次性送出1880张年度票或赠送一个盛典火箭，触发直播间红包雨。掉落助力票、克拉。</p>
            <p class="rule-i">注：通过以上来源获得的助力票主播无分成。非赛事期间送出年度礼物，仅增加主播直播间星光值，对年度活动所有榜单不生效。年度结束后，用户通过游戏抽中的盛典火箭不再有红包雨效果，请及时使用。</p>
            <p class="rule-i">榜单说明：超级冠军榜为主播榜，榜单荣耀值不含上个赛段；大人物榜为用户榜，榜单为用户整个年度赛事期间的累计贡献荣耀值。</p>
            <p class="rule-i">温馨提示：</p>
            <p class="rule-i">1. 因年度盛典期间，送礼量大，服务器会有一定程度的延迟，请用户提前10秒偷塔，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单，平台不予补偿，请谅解！</p>
            <p class="rule-i">2. 因年度盛典期间，送礼量大，易造成平台卡顿。为给大家提供更好的直播体验，12月20日和12月21日最后十分钟，全平台送出盛典火箭，无特效显示，红包雨效果不变，对您造成的困扰，请谅解！</p>
        </div>
    </rule-layer>
</template>

<script>
// 年度盛典 单项赛 活动规则弹框
import bus from '../../bus.js'
import RuleLayer from '../../components/RuleLayer'

export default {
    name: 'SingleLayer',
    components: {
        RuleLayer
    },
    data () {
        return {
            layerShow: false
        }
    },
    mounted () {
        bus.$on('showFinalLayer', this.showLayer)
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
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../../img/activity/ceremony2018';

// 渐变边框
.gradient-bd (@bW) {
    border: @bW/@bf solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
}

.getSprite (@w, @h, @posx, @posy) {
    @pad: 5;
    display: inline-block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}
.pic-sprite {
    background-image: url('@{imgUrl}/final/pic.png');
    background-repeat: no-repeat;
    background-size: 1335/@bf 984/@bf;
    font-size: 0px;
}
.rule_4 {
    .getSprite(94, 38, -10, -936);
}
.rule_5_2 {
    .getSprite(150, 38, -681, -743);
}
.tbg_left {
    .getSprite(267, 57, -870, -736);
}
@sW: 70;
.tbg_left_s {
    .getSprite(267 - @sW, 57, -870 - @sW, -736);
}
.tbg_right {
    .getSprite(265, 57, -566, -367);
}
.tbg_right_s {
    .getSprite(265 - @sW, 57, -566, -367);
}
.t_rule_bg {
    .getSprite(192, 64, -566, -522);
}
.txt_gift {
    .getSprite(254, 58, -566, -444);
}
.txt_rules {
    .getSprite(453, 58, -870, -238);
}

// 规则弹窗
.layer-content {
    .gradient-bd(4);
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20/@bf 0px;

    .bg-title,
    .bg-title2 {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40/@bf;
        margin-bottom: 60/@bf;

        &:before {
            content: '';
            .pic-sprite;
            .tbg_left;
        }

        &:after {
            content: '';
            .pic-sprite;
            .tbg_right;
        }

        .txt-gift {
            .pic-sprite;
            .txt_gift;
            position: relative;
            top: 8/@bf;
            margin: 0px 30/@bf;
        }

        .txt-rules {
            .pic-sprite;
            .txt_rules;
            position: relative;
            top: 8/@bf;
            margin: 0px 30/@bf;
        }
    }

    .bg-title2 {
        &:before {
            .tbg_left_s;
        }

        &:after {
            .tbg_right_s;
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
        font-size: 36/@bf;
        color: #ffdb88;
        margin: 34/@bf 20/@bf;
        line-height: 52/@bf;

        .label {
            display: inline-block;
            width: 190/@bf;
            white-space: nowrap;
            vertical-align: top;
        }

        .text {
            display: inline-block;
            width: 700/@bf;
        }

        &.with-dot:before {
            content: '';
            display: inline-block;
            width: 15/@bf;
            height: 15/@bf;
            background: #ffdb88;
            border-radius: 50%;
            margin-right: 16/@bf;
            transform: translateY(-10/@bf);
        }
    }

    .rule-link {
        font-size: 36/@bf;
        color: #ffdb88;
        text-decoration: underline;
    }

    .rule-label {
        font-size: 36/@bf;
        margin-top: 80/@bf;
    }

    .plan-rule-i {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 24/@bf;
        padding: 0px 20/@bf;

        .badge {
            width: 202/@bf;
            height: 74/@bf;
            position: relative;

            &:before {
                content: '';
                .pic-sprite;
                .t_rule_bg;
            }

            &:after {
                content: '';
                .pic-sprite;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .badge-4:after {
            .rule_4;
        }
        .badge-6:after {
            .rule_5_2;
        }

        .sep {
            width: 60/@bf;
            height: 1px;
            background: #f1ca70;
            margin-left: 10/@bf;
            margin-right: 10/@bf;
        }

        .time {
            font-size: 30/@bf;
            color: #f7d176;
            font-style: italic;
            // white-space: nowrap
        }
    }
}
</style>
