<template>
    <div class="me-center">
        <div class="infos">
            <div class="avatar">
                <img
                    :src="status.headPic"
                    class="img"
                    alt="我的头像"
                    @click="goRoom()">
            </div>
            <span
                v-if="type === 'zhubo' && status.isPlaying"
                class="live">LIVE</span>
            <p class="name">
                <span class="txt-name-m txt-of nick">{{ status.nickName }}</span>
                <span :class="['level_icon', (type === 'zhubo' ? 'm_level_icon_' : 'u_level_icon_') + status.level]" />
            </p>
        </div>
        <ul
            v-if="status.pairInfos"
            class="me-status">
            <div class="me-status-i">
                <h5>{{ status.pairInfos[0].name }}</h5>
                <p>{{ status.pairInfos[0].value }}</p>
            </div>
            <div class="me-status-i">
                <h5>{{ status.pairInfos[2].name }}</h5>
                <p>{{ status.pairInfos[2].value }}</p>
            </div>
            <div class="me-status-i">
                <h5>{{ status.pairInfos[1].name }}</h5>
                <p>{{ status.pairInfos[1].value }}</p>
            </div>
            <div class="me-status-i">
                <h5>{{ status.pairInfos[3].name }}</h5>
                <p>{{ status.pairInfos[3].value }}</p>
            </div>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'MeCenter',
    props: {
        status: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    methods: {
        goRoom () {
            this.type === 'zhubo' && this.$emit('goroom', this.status)
        }
    }
}
</script>
