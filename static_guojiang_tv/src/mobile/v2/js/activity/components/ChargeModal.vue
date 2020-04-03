<template>
    <!-- 充值弹框 -->
    <div
        v-show="show"
        class="modal-layer charge">
        <div class="modal-layer-c"><!-- 中间层，为实现一些ui提供容器 -->
            <div
                class="btn btn-close"
                @click="hide">X</div>
            <div class="charge-txt">余额不足，快去充值吧！</div>
            <div class="btn-opt fl-box">
                <div
                    class="btn btn-cancel"
                    @click="hide">不了</div>
                <div
                    class="btn btn-charge"
                    @click="goRecharge">充值</div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
// 样式请在 活动页中指定
// 样式列表模板
// .modal-layer {
//     &.charge {}
//     .btn-close {}
//     .charge-txt {}
//     .btn-opt {}
//     .btn-cancel {}
//     .btn-charge {}
// }
</style>

<script>
/**
 * 充值弹框
 * horace 2019-7-16
 */
export default {
    name: 'ChargeModal',
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        hide () {
            this.$emit('hide')
        },
        goRecharge () {
            this.$root.goRecharge()
        }
    }
}
</script>
