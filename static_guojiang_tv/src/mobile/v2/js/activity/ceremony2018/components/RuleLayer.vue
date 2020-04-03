<template>
    <!-- 弹窗层 -->
    <div class="layer">
        <div :class="['layer-wrap', wrapClass]">
            <div
                class="layer-close"
                @click="closeLayer" />
            <slot name="content" />
        </div>
    </div>
</template>

<style lang="less">
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../img/activity/ceremony2018';

.layer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 20;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.layer-wrap {
    border: 6/@bf solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
    position: relative;
    padding: 10/@bf;
    margin: 0px 40/@bf;
    max-height: 80%;
    background: #000;

    .layer-close {
        position: absolute;
        z-index: 1;
        top: 0px;
        right: 0px;
        transform: translate(5%, -99%);
        background: url('@{imgUrl}/close.png') no-repeat;
        background-size: cover;
        width: 97/@bf;
        height: 86/@bf;
    }

    &.layer-rule {
        height: 80%;
    }
}
</style>

<script>
// 年度盛典 活动规则弹框外层
export default {
    name: 'RuleLayer',
    props: {
        'wrapClass': {
            type: String,
            required: false,
            default: ''
        }
    },
    methods: {
        closeLayer: function () {
            this.$parent.closeLayer()
        }
    }
}
</script>
