<template>
    <!-- mrzjd 年度盛典 助力票领取中心 -->
    <div class="ticket-status">
        <template v-if="isInStage">
            <div class="ticket-i">
                <div class="pic" />
                <span class="value">{{ ticket.first === 2 ? 1 : 0 }}/1</span>
                <span class="desc">今日首次进入直播间</span>
                <div
                    :class="['btn-draw o-sprite', ticket.first === 2 ? 'takein_disabled' : 'takein']"
                    @click="getFirst">领取</div>
            </div>
            <div class="ticket-i">
                <div class="pic" />
                <span class="value">{{ ticket.taked }}/{{ ticket.total }}</span>
                <span class="desc">今日已累计观看直播{{ ticket.watchTime > 25 ? '25' : ticket.watchTime }}分钟</span>
                <div
                    :class="['btn-draw o-sprite', ticket.taked >= ticket.total ? 'takein_disabled' : 'takein' ]"
                    @click="getTicket">领取</div>
                <span class="icon-qs">
                    <div class="tooltips right">
                        <div class="info">每日首次进入直播间以及观看直播赠送的助力票，仅当日有效，次日清零。</div>
                    </div>
                </span>
            </div>
        </template>
        <template v-else>
            <div class="ticket-i">
                <div class="pic" />
                <span class="value">0/1</span>
                <span class="desc">今日首次进入直播间</span>
                <div class="btn-draw o-sprite takein_disabled">领取</div>
            </div>
            <div class="ticket-i">
                <div class="pic" />
                <span class="value">0/{{ ticket.total }}</span>
                <span class="desc">今日已累计观看直播0分钟</span>
                <div class="btn-draw o-sprite takein_disabled">领取</div>
                <span class="icon-qs">
                    <div class="tooltips right">
                        <div class="info">每日首次进入直播间以及观看直播赠送的助力票，仅当日有效，次日清零。</div>
                    </div>
                </span>
            </div>
        </template>
    </div>
</template>

<style lang="less">
@bf: 1px*10/6;
@imgUrl: '../../../../img/activity/ceremony2018';

.ticket-status {
    border-bottom: 3/@bf solid #7e6b3d;
}
.ticket-i {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    padding: 20/@bf 0;
    background: linear-gradient(to bottom, transparent, #1e180b);

    @scale: 0.54;
    .pic {
        position: relative;
        &:before {
            content: '';
            display: block;
            background-image: url('@{imgUrl}/qualifier/g-bg.png');
            background-size: cover;
            width: 396*@scale/@bf;
            height: 378*@scale/@bf;
            margin: 0 auto;
        }

        &:after {
            content: '';
            position: absolute;
            width: 325*@scale/@bf;
            height: 280*@scale/@bf;
            background: url('@{imgUrl}/preState/h-ticket.png') no-repeat;
            background-size: cover;
            top: 36%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .value {
        display: inline-block;
        width: 80/@bf;
        font-size: 36/@bf;
        color: #ffdb88;
        text-align: center;
    }

    .desc {
        display: inline-block;
        width: 800/@bf;
        font-size: 30/@bf;
        color: #ffdb88;
    }

    .btn-draw {
        position: absolute;
        top: 50%;
        right: 70/@bf;
        transform: translateY(-50%);
        cursor: pointer;
    }

    .icon-qs {
        display: block;
        width: 24/@bf;
        height: 24/@bf;
        background: url('@{imgUrl}/qualifier/icon-qs.png') no-repeat;
        background-size: cover;
        position: absolute;
        top: 50%;
        right: 25/@bf;
        transform: translateY(-50%);
        cursor: pointer;

        &:hover {
            .tooltips {
                display: block;
            }
        }
    }
}

.tooltips {
    display: none;
    position: absolute;
    min-width: 320px;
    padding: 6px 10px;
    border: 1px solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
    background: linear-gradient(to bottom, #000, #1f1703);
    transform: translate(-90%, -100%);
    z-index: 29;

    .info, .txt {
        color: #ffdb88;
        font-size: 14px;
        text-align: left;
    }

    &:after {
        content: '';
        border-top: 8px solid #ffd87d;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        position: absolute;
    }

    &.right {
        transform: translate(-93%, -110%);
        margin-top: -10px;
        margin-left: 2px;

        &:after {
            bottom: -8px;
            right: 11px;
        }
    }
}
</style>

<script>
// 年度盛典 助力票领取中心
import bus from '../bus.js'

export default {
    name: 'TicketStatus',
    props: {
        ticket: {
            type: Object,
            required: true
        }
    },
    computed: {
        isInStage () {
            var s = this.$root.page.originStage
            if (s === 1 || s === 4 || s === 6) { // 预选赛 单项赛 决赛
                return true
            }
            return false
        }
    },
    mounted () { },
    methods: {
        showTModal (msg) {
            bus.$emit('showTModal', msg)
        },
        toast (msg) {
            bus.$emit('toast', msg)
        },
        getTicket () {
            if (this.ticket.taked >= this.ticket.total) return
            bus.$emit('getTicket')
        },
        getFirst () {
            if (!this.$root.page.isLogin) {
                bus.$emit('goLogin')
                return
            }

            if (this.ticket.first === 2) {
                return
            }

            if (this.ticket.first === 0) {
                this.toast('您今日还未进入直播间，无法领取哦！')
                return
            }

            if (this.ticket.first === 1) {
                this.toast('一个设备/IP每日仅限一个ID获得观看福利哦！')
            }
        }
    }
}
</script>
