<template>
    <!-- mrzjd 年度盛典排名组件 -->
    <div class="xg-rank xg-rank-final">
        <div class="rank-h">
            <div class="rank-h-i cell-rank">排名</div>
            <div class="rank-h-i cell-zhubo">主播</div>
            <div class="rank-h-i cell-value">荣耀值</div>
        </div>
        <div
            ref="list"
            :class="'rank-list rank-' + path[0]">
            <template v-for="(item, iindex) in holder">
                <div
                    :key="iindex"
                    class="rank-row">
                    <div class="rank-l-i cell-rank">{{ iindex + 1 }}</div>
                    <div
                        v-if="list[iindex]"
                        class="rank-l-i cell-zhubo">
                        <div
                            class="avatar"
                            @click="goRoom(list[iindex].rid)">
                            <img
                                :src="list[iindex].headPic"
                                alt="头像" >
                            <span
                                v-if="list[iindex].isPlaying"
                                class="live">LIVE</span>
                            <div
                                v-if="iindex === 0"
                                class="cown-top" />
                        </div>
                        <div class="infos">
                            <p class="name">{{ list[iindex].nickname }}</p>
                            <span
                                v-if="iindex === 0"
                                class="badge-best" />
                            <p
                                v-if="showRewards"
                                class="desc">{{ rewards[iindex] || '' }}</p>
                        </div>
                    </div>
                    <div
                        v-else
                        class="rank-l-i cell-zhubo">
                        <div class="avatar">
                            <span class="img-holder" />
                            <div
                                v-if="iindex === 0"
                                class="cown-top" />
                        </div>
                        <div class="infos">
                            <p class="name">虚位以待</p>
                            <span
                                v-if="iindex === 0"
                                class="badge-best" />
                            <p
                                v-if="showRewards"
                                class="desc">{{ rewards[iindex] || '' }}</p>
                        </div>
                    </div>
                    <div class="rank-l-i cell-value">
                        {{ list[iindex] ? list[iindex].score : '-' }}
                    </div>
                </div>
                <!-- 淘汰信息 -->
                <div
                    v-if="iindex + 1 === winner && !!sep"
                    :key="iindex + '_tips'"
                    class="sep-tips"><span class="txt">{{ sep }}</span></div>
            </template>
        </div>
    </div>
</template>

<style lang="less">
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../img/activity/ceremony2018';

// Attendtion: 注意这里的样式使用了XgRank的样式进行覆盖 如果引用该组件 请同时引用XgRank
// This is a one-time page. so...

.getSprite (@w, @h, @posx, @posy) {
    .getSpritePad(@w, @h, @posx, @posy, 5);
}
.getSpritePad (@w, @h, @posx, @posy, @pad) {
    display: inline-block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
    font-size: 0;
}

.cown-sps {
    background-image: url('@{imgUrl}/single/cowns.png');
    background-repeat: no-repeat;
    background-size: 512/@bf 516/@bf;
}
.wings {
    .getSprite(272, 118, -10, -388);
}
.single-sps {
    background-image: url('@{imgUrl}/final/pic.png');
    background-repeat: no-repeat;
    background-size: 1335/@bf 984/@bf;
}
.cown_best {
    .getSpritePad(251, 356, -10, -367, 0);
}
.badge_best {
    .getSprite(176, 59, -10, -857);
}

.xg-rank-final {
    .sep-tips {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100/@bf;
        background: #000;
        padding: 20/@bf 0;

        .txt {
            text-align: center;
            color: #6e5b2e;
            font-size: 28/@bf;
            line-height: 44/@bf;
        }

        &:before, &:after {
            content: '';
            display: block;
            width: 320/@bf;
            height: 1px;
            background: #6e5b2e;
        }
    }

    .rank-row .img-holder {
        position: relative;
    }

    .sprite() {
        content: '';
        background-image: url('@{imgUrl}/single/pic.png');
        background-repeat: no-repeat;
        background-size: 1171/@bf 1051/@bf;
    }

    .rank-row .img-holder:before {
        .sprite;
        .getSprite(122, 29, -984, -434);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .rank-row .cell-zhubo .infos .desc-0 {
        .sprite;
        font-size: 0px;
        margin-top: -4px;
        margin-left: -8px;
    }

    .cell-zhubo .infos, .rank-row .cell-zhubo .infos {
        margin-left: 50/@bf;
    }

    &.xg-rank .avatar .live {
        z-index: 3;
    }

    // top1
    .cown-top {
        .cown-sps;
        .wings;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -48%);
        z-index: 2;

        &:before {
            content: '';
            display: block;
            width: 248/@bf;
            height: 356/@bf;
            .single-sps;
            .cown_best;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-51%, -58%);
            z-index: 2;
        }
    }

    .badge-best {
        .single-sps;
        .badge_best;
        margin-top: -10/@bf;
        margin-left: -10/@bf;
    }

    .rank-row .cell-zhubo .infos .desc {
        position: absolute;
        width: 26rem;
        white-space: normal;
        overflow: auto;
        text-overflow: initial;
        transform: scale(0.74);
        transform-origin: left top;
        color: #6e5b2e;
        margin-top: -0.48rem;
        line-height: 1.6rem;
        overflow: hidden;
    }
}

</style>

<script>
// 年度盛典 单项赛榜排名组件
import bus from '../bus.js'

export default {
    name: 'XgRankFinal',
    props: {
        'list': {
            type: Array,
            required: true
        },
        'holder': {
            type: Number,
            required: true
        },
        'winner': {
            type: Number,
            required: true
        },
        'path': {
            type: Array,
            required: true
        },
        'sep': {
            type: String,
            required: false,
            default: ''
        },
        'showRewards': {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            rewards: [
                '第一名主播额外奖励1000000克拉',
                '第二名主播额外奖励800000克拉',
                '第三名主播额外奖励500000克拉'
            ]
        }
    },
    methods: {
        goRoom (rid) {
            bus.$emit('goRoom', rid)
        }
    }
}
</script>
