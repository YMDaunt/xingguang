<template>
    <!-- mrzjd 年度盛典排名组件 -->
    <div class="xg-rank xg-rank-single">
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
                                v-if="showCown && iindex === 0"
                                class="cown-top" />
                        </div>
                        <div class="infos">
                            <p class="name">{{ list[iindex].nickname }}</p>
                            <p
                                v-if="showRankDesc"
                                :class="['desc', iindex < 4 && ('desc-' + iindex)]">{{ rankDesc[iindex] || '' }}</p>
                        </div>
                    </div>
                    <div
                        v-else
                        class="rank-l-i cell-zhubo">
                        <div class="avatar">
                            <span class="img-holder" />
                            <div
                                v-if="showCown && iindex === 0"
                                class="cown-top" />
                        </div>
                        <div class="infos">
                            <p class="name">虚位以待</p>
                            <p
                                v-if="showRankDesc"
                                :class="['desc', iindex < 4 && ('desc-' + iindex)]">{{ rankDesc[iindex] || '' }}</p>
                        </div>
                    </div>
                    <div class="rank-l-i cell-value">
                        {{ list[iindex] ? list[iindex].score : '-' }}
                    </div>
                </div>
                <!-- 淘汰信息 -->
                <div
                    v-if="iindex + 1 === winner"
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
.cown1 {
    .getSprite(242, 358, -10, -10);
}
.wings {
    .getSprite(272, 118, -10, -388);
}

.xg-rank-single {
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

    .badge_rq {
        .getSprite(184, 64, -622, -977);
    }
    .badge_yl {
        .getSprite(184, 64, -10, -977);
    }
    .badge_tl {
        .getSprite(184, 64, -214, -977);
    }
    .badge_ox {
        .getSprite(184, 64, -418, -977);
    }
    .badge_fy {
        .getSprite(184, 64, -520, -633);
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

    .rank-ox .rank-row .desc-0 { .badge_ox; }
    .rank-rq .rank-row .desc-0 { .badge_rq; }
    .rank-tl .rank-row .desc-0 { .badge_tl; }
    .rank-yl .rank-row .desc-0 { .badge_yl; }
    .rank-fy .rank-row .desc-0 { .badge_fy; }

    .rank-row .cell-zhubo .infos .desc-1,
    .rank-row .cell-zhubo .infos .desc-2,
    .rank-row .cell-zhubo .infos .desc-3 {
        position: absolute;
        width: 6.2rem;
        white-space: unset;
        overflow: auto;
        text-overflow: initial;
        transform: scale(0.74);
        transform-origin: left top;
        color: #6e5b2e;
        margin-top: 0px;
        line-height: 0.4rem;
        overflow: hidden;
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
            background: url('@{imgUrl}/single/cown_top.png') no-repeat;
            background-size: 248/@bf 356/@bf;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-51%, -58%);
            z-index: 2;
        }
    }
}

</style>

<script>
// 年度盛典 单项赛榜排名组件
import bus from '../bus.js'

export default {
    name: 'XgRankSingle',
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
        'showRankDesc': {
            type: Boolean,
            required: true
        },
        'showCown': {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        rankDesc () {
            var path = this.path[1]
            return [
                `年度${path}主播冠军`,
                `若超级冠军-年度最佳主播出现在${path}赛道，则第二名主播晋级为${path}冠军`,
                `若超级冠军-年度最佳主播出现在${path}赛道，则第三名主播晋级为${path}亚军`,
                `若超级冠军-年度最佳主播出现在${path}赛道，则第四名主播晋级为${path}季军`
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
