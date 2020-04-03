<template>
    <!-- mrzjd 年度盛典排名组件 -->
    <div class="xg-rank">
        <div class="rank-h">
            <div
                v-for="(ci, cindex) in config"
                :key="cindex"
                :class="['rank-h-i', ci.className]">
                <span
                    :text="ci.name"
                    class="linear-txt">{{ ci.name }}</span>
            </div>
        </div>
        <div
            ref="list"
            class="rank-list">
            <div
                v-for="(item, iindex) in list"
                :key="iindex"
                class="rank-row">
                <!-- 定义列类型 -->
                <div
                    v-for="(ci, cindex) in config"
                    :key="cindex"
                    :class="['rank-l-i', ci.className]">
                    <!-- 排名列 -->
                    <template v-if="ci.type === 'rank'">
                        {{ iindex + 1 }}
                    </template>
                    <!-- 主播列 1 -->
                    <template v-if="ci.type === 'zhubo'">
                        <div class="avatar">
                            <img
                                :src="item.headPic"
                                alt="头像"
                                @click="goRoom(item.rid)" >
                            <span
                                v-if="item.isPlaying"
                                class="live">LIVE</span>
                        </div>
                        <div class="infos">
                            <p class="name">{{ item.nickname }}</p>
                            <p class="desc">{{ item.desc }}</p>
                        </div>
                    </template>
                    <!-- 主播列 2 -->
                    <template v-if="ci.type === 'zhubo2'">
                        <div class="avatar">
                            <img
                                :src="item.headPic"
                                alt="头像"
                                @click="goRoom(item.rid)" >
                            <span
                                v-if="item.isPlaying"
                                class="live">LIVE</span>
                        </div>
                        <div class="infos">
                            <p class="name">{{ item.nickname }}</p>
                        </div>
                    </template>
                    <!-- 用户列 -->
                    <template v-if="ci.type === 'user'">
                        <div class="avatar">
                            <img
                                :src="item.headPic"
                                alt="头像">
                            <div
                                v-if="iindex < 3"
                                :class="'decos decos-' + iindex" />
                        </div>
                        <div class="infos">
                            <p class="name">{{ item.nickname }}</p>
                            <p
                                v-if="iindex < 10"
                                :class="['badge', 'badge-' + iindex]" />
                        </div>
                    </template>
                    <!-- 荣耀值列 -->
                    <template v-if="ci.type === 'value'">
                        {{ item.score }}
                    </template>
                </div>
            </div>
            <template v-if="!hasNext">
                <div
                    v-for="(item, iindex) in holders"
                    :key="iindex + '_holder'"
                    class="rank-row">
                    <!-- 定义占位列类型 -->
                    <div
                        v-for="(ci, cindex) in config"
                        :key="cindex + '_holder_cell'"
                        :class="['rank-l-i', ci.className]">
                        <!-- 排名列 -->
                        <template v-if="ci.type === 'rank'">
                            {{ iindex + list.length + 1 }}
                        </template>
                        <!-- 主播列 1 2 -->
                        <template v-if="ci.type === 'zhubo' || ci.type === 'zhubo2'">
                            <div class="avatar">
                                <span class="img-holder">虚位<br>以待</span>
                            </div>
                            <div class="infos">
                                <p class="name">{{ item.nickname }}</p>
                            </div>
                        </template>
                        <!-- 用户列 -->
                        <template v-if="ci.type === 'user'">
                            <div class="avatar">
                                <span class="img-holder">虚位以待</span>
                            </div>
                            <div class="infos">
                                <p class="name">{{ item.nickname }}</p>
                                <p
                                    v-if="iindex < 10"
                                    :class="['badge', 'badge-' + (iindex + list.length)]" />
                            </div>
                        </template>
                        <!-- 荣耀值列 -->
                        <template v-if="ci.type === 'value'">
                            {{ item.score }}
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="less">
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../img/activity/ceremony2018';

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
.cown2 {
    .getSprite(66, 76, -272, -220);
}
.cown3 {
    .getSprite(68, 69, -358, -220);
}
.cown_bg {
    .getSprite(239, 190, -272, -10);
}
.cown1 {
    .getSprite(242, 358, -10, -10);
}
.wings {
    .getSprite(272, 118, -10, -388);
}

// 主播头像
.xg-rank .avatar,
.me-center .avatar {
    width: 170/@bf;
    height: 170/@bf;
    border-radius: 50%;
    // background: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42);
    border: 8/@bf solid #ffd87d;
    position: relative;

    &:before {
        content: '';
        display: block;
        width: 160/@bf;
        height: 160/@bf;
        border-radius: 50%;
        background: #000;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .img-holder, img {
        display: block;
        width: 156/@bf;
        height: 156/@bf;
        border-radius: 50%;
        border: 1px solid #ffd87d;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        z-index: 1;
    }

    .img-holder {
        background: linear-gradient(to bottom, transparent, #3a2f14);
        // color: #ffdb88;
        font-size: 0px;
    }

    .live {
        position: absolute;
        color: #fff;
        font-size: 40/@bf;
        background: linear-gradient(to left, #9c0e3d, #f83877, #9c0e3d);
        padding: 2/@bf 8/@bf;
        top: 0px;
        right: 0px;
        border-radius: 10/@bf;
        transform: translate(40%, 20%) scale(0.8);
        z-index: 2;
    }
}

.rank-h {
    height: 100/@bf;
}

.rank-row {
    background: linear-gradient(to bottom, transparent, #1e180b);
}

.rank-h,
.rank-row {
    display: flex;
    justify-content: space-around;
    align-items: center;

    // 表头cell
    .rank-h-i {
        text-align: center;
        color: #fed77c;
        font-size: 36/@bf;

        &.cell-zhubo,
        &.cell-user {
            justify-content: center;
        }
    }

    // 数据cell
    .rank-l-i {
        font-size: 36/@bf;
    }

    // 排名列
    .cell-rank {
        width: 140/@bf;
        text-align: center;
        color: #ffdb88;
    }

    // 主播列
    .cell-zhubo,
    .cell-user {
        width: 620/@bf;
        display: flex;
        align-items: center;
        padding: 16/@bf 0;

        .infos {
            margin-left: 40/@bf;
            max-width: 360/@bf;

            .name, .desc {
                font-size: 34/@bf;
                color: #ffdb88;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 10/@bf 0;
            }
        }
    }

    .cell-user .infos {
        margin-left: 60/@bf;
        max-width: 340/@bf;
    }

    // 得分列
    .cell-value {
        width: 220/@bf;
        color: #ffdb88;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

// 大人物榜 前三名
.user-ranks .rank-row:first-child {
    margin-top: 0.2rem;
}

.user-ranks .rank-row:nth-child(2) {
    padding-top: 0.45rem;
}

.user-ranks .rank-row:nth-child(3) {
    padding-top: 0.45rem;
}

.user-ranks .decos {
    .cown-sps;
    .wings;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -48%);
    z-index: 2;

    &:before {
        content: '';
        .cown-sps;
        .cown_bg;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -96%);
        z-index: 2;
    }

    &:after {
        content: '';
        .cown-sps;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -59%);
        z-index: 3;
    }
}

.user-ranks .decos-0:after { .cown1; }
.user-ranks .decos-1:after {
    .cown2;
    transform: translate(-44%, -190%);
}
.user-ranks .decos-2:after {
    .cown3;
    transform: translate(-44%, -190%);
}
</style>

<script>
// 年度盛典排名组件
import bus from '../bus.js'

export default {
    name: 'XgRank',
    props: {
        'config': {
            type: Array,
            required: true
        },
        'list': {
            type: Array,
            required: true
        },
        'hasNext': {
            type: Boolean,
            required: false,
            default: true
        },
        'holder': {
            type: Number,
            required: false,
            default: 0
        }
    },
    computed: {
        holders () {
            if (this.hasNext) return []

            var len = this.holder - this.list.length
            if (len <= 0) return []

            var output = []
            for (var i = 0; i < len; i++) {
                output.push({
                    nickname: '虚位以待',
                    headPic: '',
                    score: '-'
                })
            }

            return output
        }
    },
    mounted () {
        this.initScrollBox(this.loadMore)
    },
    methods: {
        initScrollBox (cb) {
            var bh = 150
            var _self = this
            var scrollEle = this.$refs.list

            scrollEle.addEventListener('scroll', function () {
                var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                if (toBottomH < bh) {
                    cb.call(_self)
                }
            }, false)
        },
        loadMore () {
            this.$emit('loadMore')
        },
        goRoom (rid) {
            bus.$emit('goRoom', rid)
        }
    }
}
</script>
