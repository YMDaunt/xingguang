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
@bf: 1px*10/6;
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
    width: 772px;
    border: 6/@bf solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
    padding: 10/@bf;
    margin: 0px auto;
    max-height: 78%;
    background: #000;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .layer-close {
        position: absolute;
        z-index: 1;
        top: 0px;
        right: 0px;
        transform: translate(5%, -100%);
        cursor: pointer;
        background: url('@{imgUrl}/close.png') no-repeat;
        background-size: cover;
        width: 97/@bf;
        height: 86/@bf;
    }

    &.layer-rule {
        height: 80%;
    }
}

.layer-content {
    box-sizing: border-box;
}

// 滚动条
.scroller-container {
    position: absolute;
    top: 0px;
    right: 2px;
    width: 8px;
    height: 100%;
    padding-bottom: 60px;
    box-sizing: border-box;
}

.scroller-container .scroller-thumb {
    position: relative;
    width: 100%;
    height: 50px;
    background: #ffd87d; /* 可自定义滑块颜色 */
    border-radius: 16px;
    border: 1px solid #bf9a42;
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
