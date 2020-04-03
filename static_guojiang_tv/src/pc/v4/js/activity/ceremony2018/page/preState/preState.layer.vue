<template>
    <rule-layer v-show="layerShow">
        <div
            slot="content"
            ref="layerScroller"
            class="layer-content">
            <div class="layer-title">
                <span
                    :text="currLayer.name"
                    class="linear-txt">{{ currLayer.name }}</span>
            </div>
            <div class="info-list">
                <div
                    v-for="(badge, index) in currLayer.badges"
                    :key="index"
                    :class="['info-i', (badge.icon === 'badge-danmu') ? 'info-danmu' : '']">
                    <div
                        :class="['badge', badge.icon]"
                        @click="badge.hasAnimation && playSvg(badge.animationUrl)">
                        <div
                            v-if="badge.hasAnimation"
                            class="play-mask" />
                    </div>
                    <div class="name">
                        {{ badge.name }}
                        <span
                            v-if="badge.hasInfo"
                            class="icon-sprite icon-qs">
                            <div :class="['tooltips', badge.infoClass]">
                                <template v-if="typeof badge.infoMsg === 'string'">
                                    <div class="info">{{ badge.infoMsg }}</div>
                                </template>
                                <template v-else><!-- 数组 -->
                                    <div class="info">
                                        <p
                                            v-for="(msg, mi) in badge.infoMsg"
                                            :key="mi"
                                            class="txt">{{ msg }}</p>
                                    </div>
                                </template>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </rule-layer>
</template>

<script>
import PCScroller from '../../PCScroller.js'
import bus from '../../bus.js'
import layerConfig from '../../../../../../../mobile/v2/js/activity/ceremony2018/page/preState/preStateIcon.js'
import RuleLayer from '../../components/RuleLayer'

var scroller = null

export default {
    name: 'PreStateLayer',
    components: {
        RuleLayer
    },
    data () {
        return {
            layerShow: false,
            layerType: 0
        }
    },
    computed: {
        currLayer: function () {
            return layerConfig[this.layerType]
        }
    },
    mounted () {
        scroller = new PCScroller(this.$refs.layerScroller)

        bus.$on('showPreStateLayer', this.showLayer)
    },
    updated () {
        scroller.refreshDOM()
    },
    methods: {
        closeLayer () {
            this.layerShow = false
            // this.$refs.layerScroller.scrollTop = 0
            scroller.boxSize.top = 0 // 这里重新刷新 弹框的滚动条位置
        },
        showLayer (type) {
            this.layerShow = true
            this.layerType = type
        },
        playSvg (animationUrl) {
            bus.$emit('playSvg', animationUrl)
        }
    }
}
</script>

<style lang="less" scoped>
@bf: 1px*10/6;
@imgUrl: '../../../../../img/activity/ceremony2018/preState';

.getSprite (@w, @h, @posx, @posy) {
    @pad: 5;
    display: inline-block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}

/* 奖章 */
.badge-sprite {
    background-image: url('@{imgUrl}/badges.png');
    background-repeat: no-repeat;
    background-size: 1305/@bf 1149/@bf;
    font-size: 0;
}
.bd-dzxz {
    .getSprite(234, 130, -10, -490);
}
.bd-jctx {
    .getSprite(153, 153, -171, -787);
}
.bd-dzxz_1 {
    .getSprite(237, 131, -228, -280);
}
.bd-dzxz_2 {
    .getSprite(225, 126, -911, -10);
}
.bd-hby {
    .getSprite(139, 139, -1156, -190);
}
.bd-dzxz_3 {
    .getSprite(233, 130, -264, -490);
}
.bd-lh {
    .getSprite(123, 123, -1156, -508);
}
.bd-hgxjxz {
    .getSprite(225, 126, -911, -156);
}
.bd-gjjsxz {
    .getSprite(228, 127, -658, -475);
}
.bd-play {
    .getSprite(60, 60, -485, -280);
}
.bd-ryjb {
    .getSprite(141, 185, -10, -787);
}
.bd-gggjxz {
    .getSprite(224, 125, -911, -302);
}
.bd-ryzs {
    .getSprite(204, 147, -658, -160);
}
.bd-stt {
    .getSprite(198, 190, -10, -280);
}
.bd-tc {
    .getSprite(186, 122, -344, -787);
}
.bd-tjbq {
    .getSprite(138, 139, -1156, -349);
}
.bd-xgzjxz {
    .getSprite(221, 123, -911, -592);
}
.bd-yybjxz {
    .getSprite(226, 127, -258, -640);
}
.bd-zrhjxz {
    .getSprite(222, 125, -911, -447);
}
.bd-zzhdxz {
    .getSprite(233, 130, -658, -10);
}
.bd-cqqwxz {
    .getSprite(229, 128, -658, -327);
}
.bd-dzkp {
    .getSprite(139, 160, -1156, -10);
}
.bd-zggwxz {
    .getSprite(229, 125, -504, -640);
}
.bd-xxlw {
    .getSprite(110, 133, -1156, -651);
}
.bd-rynj {
    .getSprite(228, 127, -10, -640);
}
.bd-kela {
    .getSprite(102, 135, -1156, -804);
}
.bd-vtag {
    .getSprite(142, 147, -10, -992);
}
.bd-danmu {
    .getSprite(628, 250, -10, -10);
}

.icon-sprite {
    background-image: url('@{imgUrl}/icon.png');
    background-repeat: no-repeat;
    background-size: 952/@bf 724/@bf;
    font-size: 0;
}
.icon-qs {
    .getSprite(24, 24, -860, -448);
}
.icon-close {
    .getSprite(97, 86, -743, -448);
}

.txt-sprite {
    background-image: url('@{imgUrl}/txt.png');
    background-repeat: no-repeat;
    background-size: 1053/@bf 744/@bf;
    font-size: 0;
}

.txt-t_bg_xl {
    .getSprite(657, 60, -10, -167);
}

.icon-g_bg_2 {
    .getSprite(297, 303, -426 - 10, -10 - 30);
}

.layer-content {
    width: 100%;
    height: 100%;
    // overflow-y: auto;
    // -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    border: 3/@bf solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
    background: linear-gradient(to bottom, #000, #1f1703);
    // padding-bottom: 40/@bf;
}

.layer-title {
    .txt-sprite;
    .txt-t_bg_xl;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 667/@bf;
    height: 70/@bf;
    margin: 42/@bf auto 30/@bf;

    span {
        font-size: 36/@bf;
        color: #bf9a42;
    }
}

.info-list {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-bottom: 40/@bf;
}

.info-i {
    width: 160px;
    position: relative;
    padding-top: 30/@bf;

    &:hover {
        z-index: 2;
    }

    .badge {
        width: 100%;
        height: 230/@bf;
        margin: -30/@bf auto 0;
        position: relative;

        &:before {
            .icon-sprite;
            .icon-g_bg_2;
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -41%);
        }

        &:after {
            .badge-sprite;
            content: '';
            position: absolute;
            top: 46%;
            left: 50%;
            // transform: translate(-50%, -50%);
        }
    }

    .name {
        text-align: center;
        font-size: 28/@bf;
        color: #d19300;
        margin-top: 30/@bf;
        word-break: break-all;

        .icon-qs {
            position: relative;
            top: 8/@bf;
            z-index: 4;
            cursor: pointer;

            &:hover {
                .tooltips {
                    display: block;
                }
            }
        }
    }

    .play-mask {
        .badge-sprite;
        .bd-play;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -10%);
        z-index: 1;
        cursor: pointer;
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

    &.bottom {
        transform: translate(-50%, -100%);
        margin-top: -10px;
        margin-left: 2px;

        &:after {
            bottom: -8px;
        }
    }

    &.cbottom {
        transform: translate(-43%, -100%);
        margin-top: -10px;
        margin-left: 2px;

        &:after {
            bottom: -8px;
            left: 146px;
        }

        .info, .txt {
            text-align: center;
        }
    }

    &.tcenter {
        min-width: 260px;
        transform: translate(-88%, -100%);

        .info, .txt {
            text-align: center;
        }
    }

    &.right {
        transform: translate(-90%, -100%);
        margin-top: -10px;
        margin-left: 2px;

        &:after {
            bottom: -8px;
            right: 17px;
        }
    }

    &.left {
        transform: translate(-38%, -100%);
        margin-top: -10px;
        margin-left: 2px;

        &:after {
            bottom: -8px;
            left: 128.5px;
        }
    }
}

// 奖励徽章图标配置
.badge-ryjb:after {
    .bd-ryjb;
    transform: translate(-50%, -35%);
}

.badge-ryzs:after {
    .bd-ryzs;
    transform: translate(-50%, -19%);
}

.badge-dzxz:after {
    .bd-dzxz;
    transform: translate(-53%, -27%);
}

.badge-dzxz-1:after {
    .bd-dzxz_1;
    transform: translate(-53%, -27%);
}
.badge-dzxz-2:after {
    .bd-dzxz_2;
    transform: translate(-53%, -27%);
}
.badge-dzxz-3:after {
    .bd-dzxz_3;
    transform: translate(-53%, -27%);
}

// .badge-xcxk:after,
// .badge-jxk:after,
// .badge-yxk:after,
// .badge-txk:after {
//     .bd-xcxk;
//     transform: translate(-50%, -27%);
// }

.badge-tjbq:after {
    .bd-tjbq;
    transform: translate(-55%, -27%);
}

.badge-dzkp:after {
    .bd-dzkp;
    transform: translate(-58%, -44%);
}

.badge-xxlw:after {
    .bd-xxlw;
    transform: translate(-52%, -27%);
}

.badge-lh:after {
    .bd-lh;
    transform: translate(-52%, -26%);
}

.badge-tc:after,
.badge-defl:after {
    .bd-tc;
    transform: translate(-50%, 0%);
}

.badge-kela:after {
    .bd-kela;
    transform: translate(-50%, -30%);
}

.badge-zzhdxz:after {
    .bd-zzhdxz;
    transform: translate(-54%, -29%);
}

.badge-zggwxz:after {
    .bd-zggwxz;
    transform: translate(-54%, -29%);
}

.badge-cqqwxz:after {
    .bd-cqqwxz;
    transform: translate(-54%, -29%);
}

.badge-gggjxz:after {
    .bd-gggjxz;
    transform: translate(-54%, -29%);
}

.badge-zrhjxz:after {
    .bd-zrhjxz;
    transform: translate(-54%, -29%);
}

.badge-yybjxz:after {
    .bd-yybjxz;
    transform: translate(-54%, -29%);
}

.badge-xgzjxz:after {
    .bd-xgzjxz;
    transform: translate(-54%, -29%);
}

.badge-rynjxz:after {
    .bd-rynj;
    transform: translate(-54%, -29%);
}

.badge-hgxjxz:after {
    .bd-hgxjxz;
    transform: translate(-54%, -29%);
}

.badge-gjjsxz:after {
    .bd-gjjsxz;
    transform: translate(-54%, -29%);
}

.badge-vtag:after {
    .bd-vtag;
    transform: translate(-50%, -20%);
}

.badge-hby:after {
    .bd-hby;
    transform: translate(-50%, -27%);
}

.badge-stt:after {
    .bd-stt;
    transform: translate(-50%, -29%);
}

.badge-jctx:after {
    .bd-jctx;
    transform: translate(-52%, -29%) scale(1.4);
}

.info-danmu {
    width: 638/@bf;
}

.badge-danmu {
    &:before {
        display: none !important;
    }

    width: 638/@bf;
    height: 260/@bf;

    &:after {
        .bd-danmu;
        top: 0px !important;
        left: 0px !important;
    }
}

@media screen and (max-height: 100px) {
    .layer-content {
        max-height: 700px;
    }
}

@media screen and (max-height: 940px) {
    .layer-content {
        max-height: 620px;
    }
}

@media screen and (max-height: 810px) {
    .layer-content {
        max-height: 510px;
    }
}
</style>
