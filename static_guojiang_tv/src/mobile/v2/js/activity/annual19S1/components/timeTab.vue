<template>
    <div class="time-tab">
        <div
            v-for="(tmClass, ti) in timeTabs"
            :key="'tt_bg_' + ti"
            :class="['time-tab-i bg', 'pos-' + (ti + 1)]">
            <div class="time-tab-bg"/>
        </div>
        <div
            v-for="(tmClass, ti) in timeTabs"
            :key="'tt_i_' + ti"
            :class="['btn time-tab-i pic', 'pos-' + (ti + 1)]"
            @click.passive="changeRoute(ti + 1)">
            <div
                :class="['tt-pic tab-s', tmClass]" />
        </div>
    </div>
</template>

<style lang="less">
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../img/activity/annual19S1';

.getSpritePad (@w, @h, @posx, @posy, @pad) {
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}
.getSprite (@w, @h, @posx, @posy) {
    .getSpritePad(@w, @h, @posx, @posy, 5);
}

.SET_TAB_SPRITE () {
    .tab-s {
        background: url('@{imgUrl}/tab-stage.png') no-repeat;
        background-size: 988/@bf 988/@bf;
        font-size: 0px;
        display: block;
    }

    .tab-stage-5 {
        .getSprite(227, 227, -10, -10);
    }
    .tab-stage-5-a {
        .getSprite(227, 227, -257, -10);
    }
    .tab-stage-5-d {
        .getSprite(227, 227, -10, -257);
    }
    .tab-stage-1 {
        .getSprite(227, 227, -257, -257);
    }
    .tab-stage-1-a {
        .getSprite(227, 227, -504, -10);
    }
    .tab-stage-1-d {
        .getSprite(227, 227, -504, -257);
    }
    .tab-stage-2 {
        .getSprite(227, 227, -10, -504);
    }
    .tab-stage-2-a {
        .getSprite(227, 227, -257, -504);
    }
    .tab-stage-2-d {
        .getSprite(227, 227, -504, -504);
    }
    .tab-stage-3 {
        .getSprite(227, 227, -751, -10);
    }
    .tab-stage-3-a {
        .getSprite(227, 227, -751, -257);
    }
    .tab-stage-3-d {
        .getSprite(227, 227, -751, -504);
    }
    .tab-stage-4 {
        .getSprite(227, 227, -10, -751);
    }
    .tab-stage-4-a {
        .getSprite(227, 227, -257, -751);
    }
    .tab-stage-4-d {
        .getSprite(227, 227, -504, -751);
    }
}
.SET_TAB_SPRITE();

.time-tab {
    width: 892/@bf;
    height: 342/@bf;
    margin: 0 auto;
    position: relative;
}

.time-tab-bg {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    width: 418/@bf;
    height: 389/@bf;
    background: url('@{imgUrl}/stage-bg.png') no-repeat;
    background-size: cover;
    transform: translate(-50%, -50%);
}

.time-tab-i {
    position: absolute;
    z-index: 1;

    width: 160/@bf;
    height: 160/@bf;

    @s: (227 - 160)/2;
    @lr: @s/@bf;
    @tb: @s/@bf;

    &.pos-1 {
        top: @tb;
        left: @lr;
    }

    &.pos-2 {
        bottom: @tb;
        left: (168+@s)/@bf;
    }

    &.pos-3 {
        top: @tb;
        left: 50%;
        transform: translateX(-50%);
    }

    &.pos-4 {
        bottom: @tb;
        right: (168+@s)/@bf;
    }

    &.pos-5 {
        top: @tb;
        right: @lr;
    }
}

.time-tab-i.pic {
    transform: rotate(45deg);
    overflow: hidden;

    &.pos-3 {
        transform: translateX(-50%) rotate(45deg);
    }
}

.tt-pic {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
}
</style>

<script>
export default {
    name: 'TimeTab',
    props: {
        // 活动当前阶段
        stage: {
            type: Number,
            required: true
        },
        // 显示阶段
        showStage: {
            type: Number,
            required: true
        }
    },
    computed: {
        timeTabs () {
            return [1, 2, 3, 4, 5].map((i) => {
                if (i === this.showStage) { // 显示当前阶段
                    return `tab-stage-${i}-a`
                }

                if (i > this.stage) {
                    return `tab-stage-${i}-d`
                }

                return `tab-stage-${i}`
            })
        }
    },
    methods: {
        changeRoute (i) {
            this.$emit('change', i)
        }
    }
}
</script>
