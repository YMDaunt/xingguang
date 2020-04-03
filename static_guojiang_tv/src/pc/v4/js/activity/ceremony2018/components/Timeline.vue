<template>
    <!-- 弹窗层组件 -->
    <div class="timeline">
        <div
            :class="['tl-i tl-i-1', currStage === 0 && 'active']"
            @click="naviTo(0)" />
        <div
            :class="['tl-i tl-i-btm tl-i-2', stage < 1 && 'disabled', currStage === 1 && 'active']"
            @click="stage < 1 ? toast('预选赛 开启时间为: 12月5日 12:00') : naviTo(1)" />
        <div
            :class="['tl-i tl-i-3', stage < 2 && 'disabled', currStage === 2 && 'active']"
            @click="stage < 2 ? toast('单项赛报名 开启时间为: 12月11日 00:00') : naviTo(2)" />
        <div
            :class="['tl-i tl-i-btm tl-i-4', stage < 3 && 'disabled', currStage === 3 && 'active']"
            @click="stage < 3 ? toast('单项冠军赛 开启时间为: 12月14日 00:00') : naviTo(3)" />
        <div
            :class="['tl-i tl-i-5', stage < 4 && 'disabled', currStage === 4 && 'active']"
            @click="stage < 4 ? toast('超级冠军赛 开启时间为: 12月20日 00:00') : naviTo(4)" />
    </div>
</template>

<style lang="less">
@bf: 1px*10/6;
@imgUrl: '../../../../img/activity/ceremony2018';

.getSprite (@w, @h, @posx, @posy) {
    @pad: 5;
    display: inline-block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}

.icon-sprite {
    background-image: url('@{imgUrl}/qualifier/timeline.png');
    background-repeat: no-repeat;
    background-size: 3060/@bf 244/@bf;
    font-size: 0;
}

.tl_bg {
    .getSprite(769, 224, -2281, -10);
}
.tl_final {
    .getSprite(199, 199, -91, -10);
}
.tl_final_a {
    .getSprite(199, 199, -310, -10);
}
.tl_home {
    .getSprite(199, 199, -529, -10);
}
.tl_home_a {
    .getSprite(199, 199, -748, -10);
}
.tl_pre {
    .getSprite(199, 199, -967, -10);
}
.tl_pre_a {
    .getSprite(199, 199, -1186, -10);
}
.tl_regis {
    .getSprite(199, 199, -1405, -10);
}
.tl_regis_a {
    .getSprite(199, 199, -1624, -10);
}
.tl_single {
    .getSprite(199, 199, -1843, -10);
}
.tl_single_a {
    .getSprite(199, 199, -2062, -10);
}
.lock {
    .getSprite(61, 87, -10, -10);
}

.timeline {
    // display: flex;
    // justify-content: space-around;
    // align-items: flex-start;
    width: 645px;
    transform: scale(1.2);
    margin: 0 auto 100px;

    &:before {
        content: '';
        .icon-sprite;
        .tl_bg;
        position: absolute;
        margin-top: 10/@bf;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
    }

    .tl-i {
        display: inline-block;
        cursor: pointer;

        &:before {
            content: '';
            .icon-sprite;
        }

        &.tl-i-1:before {
            .tl_home;
        }

        &.active.tl-i-1:before {
            .tl_home_a;
        }

        &.tl-i-2:before {
            .tl_pre;
        }

        &.active.tl-i-2:before {
            .tl_pre_a;
        }

        &.tl-i-3:before {
            .tl_regis;
        }

        &.active.tl-i-3:before {
            .tl_regis_a;
        }

        &.tl-i-4:before {
            .tl_single;
        }

        &.active.tl-i-4:before {
            .tl_single_a;
        }

        &.tl-i-5:before {
            .tl_final;
        }

        &.active.tl-i-5:before {
            .tl_final_a;
        }

        &.disabled {
            position: relative;

            &:before {
                opacity: 0.5;
            }

            &:after {
                content: '';
                .icon-sprite;
                .lock;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }

    .tl-i-btm {
        position: relative;
        top: 20px;
    }
}
</style>

<script>
/// 年度盛典 时间轴组件
import bus from '../bus.js'

var route = [
    '/preState',
    '/qualifier',
    '/singleSign',
    '/single',
    '/final'
]

export default {
    name: 'Timeline',
    props: {
        'stage': { // 可用阶段
            type: Number,
            required: true
        },
        'currStage': { // 当前阶段
            type: Number,
            required: true
        }
    },
    methods: {
        toast (msg) {
            this.$parent.toast(msg)
        },
        naviTo (type) {
            // url 页面跳转
            if (!route[type] || type === this.currStage) return

            this.$router.replace(route[type], () => {
                bus.$emit('changeNavi', type)
            })
        }
    }
}
</script>
