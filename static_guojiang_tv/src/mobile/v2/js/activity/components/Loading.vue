<template>
    <div
        v-show="status"
        class="loading" />
</template>

<script>
export default {
    name: 'Loading',
    data: () => ({
        status: false
    }),
    methods: {
        show () {
            this.status = true
        },
        hide () {
            this.status = false
        }
    }
}
</script>

<style lang="less">
@bf: 1px*10/7;
.loading {
    background: url('../../../img/activity/loading.png') no-repeat;
    background-size: cover;
    width: 50/@bf;
    height: 50/@bf;
    position: fixed;
    z-index: 22;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: loading 1.2s ease-out infinite;
}

@keyframes loading {
    0% {
        transform: translate(-50%, -50%) rotate(0);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>
