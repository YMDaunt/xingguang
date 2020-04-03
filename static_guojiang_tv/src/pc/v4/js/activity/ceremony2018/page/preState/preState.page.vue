<template>
    <div class="page-view">
        <!-- 赛事安排 -->
        <div class="t-title t-plan" />
        <div class="plans">
            <!-- 预选赛 -->
            <div class="plan-i">
                <div class="plan-title">
                    <div class="name">
                        <span
                            class="linear-txt"
                            text="预选赛">预选赛</span>
                    </div>
                    <div class="time">12月5日-12月10日</div>
                </div>
                <div class="plan-p">
                    <div class="label">参赛范围：</div>
                    <div class="txt">平台所有主播。</div>
                </div>
                <div class="plan-p">
                    <div class="label">赛制说明：</div>
                    <div class="txt">按照荣耀值排名，晋级100名主播。</div>
                </div>
            </div>
            <!-- 单项赛报名 -->
            <div class="plan-i">
                <div class="plan-title">
                    <div class="name">
                        <span
                            class="linear-txt"
                            text="单项赛报名">单项赛报名</span>
                    </div>
                    <div class="time">12月11日-12月12日</div>
                </div>
                <div class="plan-p">
                    <div class="label">报名范围：</div>
                    <div class="txt">预选赛100强主播。</div>
                </div>
                <div class="plan-p">
                    <div class="label">报名说明：</div>
                    <div class="txt">100位主播可自由报名赛道，每个赛道最多只能报名20位主播，若在报名时间内有主播未报名，则由系统随机分配到未满赛道。</div>
                </div>
                <div class="plan-p">
                    <div class="label">赛道名称：</div>
                    <div class="txt">年度偶像主播、年度人气主播、年度天籁主播、年度娱乐主播、年度风云主播。</div>
                </div>
            </div>
            <!-- 单项冠军赛 -->
            <div class="plan-i">
                <div class="plan-title">
                    <div class="name">
                        <span
                            class="linear-txt"
                            text="单项冠军赛">单项冠军赛</span>
                    </div>
                    <div class="time">12月14日-12月18日</div>
                </div>
                <div class="plan-p">
                    <div class="label">参赛范围：</div>
                    <div class="txt">预选赛100强主播。</div>
                </div>
                <div class="plan-p">
                    <div class="label">赛制说明：</div>
                    <div class="txt">5个赛道的比赛同时进行，按照荣耀值排名，决出每个赛道的冠亚季军主播。</div>
                </div>
                <div class="plan-p">
                    <div class="label">赛道名称：</div>
                    <div class="txt">年度偶像主播、年度人气主播、年度天籁主播、年度娱乐主播、年度风云主播。</div>
                </div>
                <div class="plan-rules">
                    <!-- 单项赛晋级时间说明 -->
                    <div class="plan-rule-i">
                        <span class="badge badge-1" />
                        <span class="sep" />
                        <span class="time">12月14日 00:00:00 - 12月15日23:59:59</span>
                    </div>
                    <div class="plan-rule-i">
                        <span class="badge badge-2" />
                        <span class="sep" />
                        <span class="time">12月16日 00:00:00 - 12月16日23:59:59</span>
                    </div>
                    <div class="plan-rule-i">
                        <span class="badge badge-3" />
                        <span class="sep" />
                        <span class="time">12月17日 00:00:00 - 12月17日23:59:59</span>
                    </div>
                    <div class="plan-rule-i">
                        <span class="badge badge-5" />
                        <span class="sep" />
                        <span class="time">12月18日 00:00:00 - 12月18日23:59:59</span>
                    </div>
                </div>
            </div>
            <!-- 超级冠军赛 -->
            <div class="plan-i">
                <div class="plan-title">
                    <div class="name">
                        <span
                            class="linear-txt"
                            text="超级冠军赛">超级冠军赛</span>
                    </div>
                    <div class="time">12月20日-12月21日</div>
                </div>
                <div class="plan-p">
                    <div class="label">参赛范围：</div>
                    <div class="txt">5个单项赛的冠军主播。</div>
                </div>
                <div class="plan-p">
                    <div class="label">赛制说明：</div>
                    <div class="txt">5位主播进行荣耀值排名，决出超级冠军——年度最佳主播。</div>
                </div>
                <div class="plan-p">若A赛道的冠军主播成为年度最佳主播，则A赛道的亚军主播自动成为A赛道的冠军主播，季军主播自动成为亚军主播。</div>
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
            </div>
        </div>

        <!-- 活动礼物 -->
        <div class="gifts">
            <div class="t-title t-gift" />
            <div class="gifts-box">
                <div class="gifts-i">
                    <div class="pic-ticket pic" />
                    <p class="txt-sprite txt-bg-m name">
                        <span
                            text="年度票"
                            class="linear-txt">年度票</span>
                    </p>
                    <div class="vals">1张年度票=10克拉=1荣耀值</div>
                </div>
                <div class="gifts-i">
                    <div class="pic-rocket pic" />
                    <p class="txt-sprite txt-bg-m name">
                        <span
                            text="盛典火箭"
                            class="linear-txt">盛典火箭</span>
                    </p>
                    <div class="vals">1个盛典火箭=18800克拉=1880荣耀值</div>
                </div>
                <div class="gifts-i">
                    <div class="pic-ticket2 pic" />
                    <p class="txt-sprite txt-bg-m name">
                        <span
                            text="助力票"
                            class="linear-txt">助力票</span>
                    </p>
                    <div class="vals">1张助力票=10克拉=1荣耀值</div>
                </div>
            </div>
            <div class="gifts-desc">
                <div class="label">助力票获得来源：</div>
                <div class="phrase">- 用户可通过参加11月20日“火鸡盛宴”感恩节活动获得。</div>
                <div class="phrase">- 用户可通过年度盛典赛事期间观看直播获得。</div>
                <div class="phrase">- 用户可通过年度盛典充值活动获得。</div>
                <div class="phrase">- 用户可通过年度盛典赛事期间直播间游戏“幸运转盘”、“幸运砸金蛋”获得。</div>
                <div class="tips">注：通过以上来源获得的助力票会下发至背包，主播无分成。</div>
            </div>
        </div>

        <!-- 荣誉奖励 -->
        <div class="t-title t-rewards" />
        <div class="rewards">
            <div class="rewards-i rewards-i-top">
                <div class="cown cown-0" />
                <div class="name">
                    <span
                        class="linear-txt"
                        text="超级冠军--年度最佳主播">超级冠军--年度最佳主播</span>
                </div>
                <div
                    class="btn-check"
                    @click="showLayer(0)">查看奖励</div>
            </div>
            <div class="rewards-i">
                <div class="cown cown-1" />
                <div class="name">单项赛冠军</div>
                <div
                    class="btn-check"
                    @click="showLayer(1)">查看奖励</div>
            </div>
            <div class="rewards-i">
                <div class="cown cown-2" />
                <div class="name">单项赛亚军</div>
                <div
                    class="btn-check"
                    @click="showLayer(2)">查看奖励</div>
            </div>
            <div class="rewards-i">
                <div class="cown cown-3" />
                <div class="name">单项赛季军</div>
                <div
                    class="btn-check"
                    @click="showLayer(3)">查看奖励</div>
            </div>
        </div>

        <!-- 年度大人物 -->
        <div class="celebrities">
            <div class="t-title2 t-cele" />
            <div class="cele-desc">年度盛典赛事期间，用户送出活动礼物，即可贡献荣耀值，TOP10的年度大人物可获得以下奖励。</div>
            <div class="cele-list">
                <div class="cele-i cele-i-top">
                    <div class="cown dcown-0" />
                    <div class="name">2018年度盛典大人物第一名：至尊皇帝</div>
                    <div
                        class="btn-check"
                        @click="showLayer(4)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-1" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_1">第二名：尊贵国王</div>
                    <div
                        class="btn-check"
                        @click="showLayer(5)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-2" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_2">第三名：传奇亲王</div>
                    <div
                        class="btn-check"
                        @click="showLayer(6)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-3" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_3">第四名：高贵公爵</div>
                    <div
                        class="btn-check"
                        @click="showLayer(7)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-4" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_4">第五名：尊荣侯爵</div>
                    <div
                        class="btn-check"
                        @click="showLayer(8)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-5" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_5">第六名：英勇伯爵</div>
                    <div
                        class="btn-check"
                        @click="showLayer(9)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-6" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_6">第七名：显贵子爵</div>
                    <div
                        class="btn-check"
                        @click="showLayer(10)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-7" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_7">第八名：荣誉男爵</div>
                    <div
                        class="btn-check"
                        @click="showLayer(11)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-8" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_8">第九名：华贵勋爵</div>
                    <div
                        class="btn-check"
                        @click="showLayer(12)">查看奖励</div>
                </div>
                <div class="cele-i">
                    <div class="cown dcown-9" />
                    <div class="tt">2018年度盛典大人物</div>
                    <div class="rank txt-sprite txt-rank_9">第十名：高级爵士</div>
                    <div
                        class="btn-check"
                        @click="showLayer(13)">查看奖励</div>
                </div>
            </div>
        </div>

        <!-- 注意事项 -->
        <div class="attentions">
            <div class="t-title2 t-atte" />
            <div class="attent-txt"><span class="label">1</span>违规或不当竞争的主播，平台有权取消其参赛成绩。</div>
            <div class="attent-txt"><span class="label">2</span>平台有权清除活动中的违规非法数据。</div>
            <div class="attent-txt"><span class="label">3</span>活动奖励于年度结束后的7-15个工作日内陆续发放。</div>
            <div class="attent-txt"><span class="label">4</span>本活动最终解释权归平台运营团队所有。</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../../../../css/activity/ceremony2018/preState.less';
</style>

<script>
// 年度盛典预告页面
import bus from '../../bus.js'

export default {
    name: 'PreStatePage',
    data: () => {
        return {
            ui: {
                layer: false,
                layerType: 0,
                toast: false,
                toastMsg: ''
            }
        }
    },
    mounted: function () {
    },
    methods: {
        showLayer (type) {
            bus.$emit('showPreStateLayer', type)
        }
    }
}
</script>
