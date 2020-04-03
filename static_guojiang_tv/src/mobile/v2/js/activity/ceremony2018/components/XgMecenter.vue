<template>
    <!-- mrzjd 年度盛典 榜单个人中心 -->
    <div class="me-center">
        <div class="pic">
            <div class="avatar">
                <img
                    :src="source.headPic"
                    alt="头像"
                    @click="type === 0 && goRoom(source.rid)" >
                <span
                    v-if="type === 0 && source.isPlaying"
                    class="live">LIVE</span>
            </div>
            <p class="name">{{ source.nickName }}</p>
        </div>
        <div class="details">
            <div
                v-for="(pi, pindex) in pairInfos"
                :key="pindex"
                class="details-i">
                <p class="label linear-txt">
                    <!-- <span
                        :text="pi.name"
                        class="linear-txt">{{ pi.name }}</span> -->
                    <span>{{ pi.name }}</span>
                </p>
                <p class="value">{{ pi.value }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@bf: 108rem; // 1080px -> fontSize -> 108px

.me-center {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 3/@bf solid #7e6b3d;
    background: linear-gradient(to bottom, transparent, #1e180b);
    padding: 30/@bf;

    .pic {
        width: 340/@bf;

        .avatar {
            margin: 0 auto;
        }

        .name {
            font-size: 34/@bf;
            color: #ffdb88;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 24/@bf;
        }
    }

    .details {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }

    .details-i {
        width: 50%;
        margin: 12/@bf 0;
        .label, .value {
            text-align: center;
            font-size: 34/@bf;
            color: #ffdb88;
            margin: 4/@bf 0;
        }
    }
}
</style>

<script>
// 年度盛典 榜单个人中心
import bus from '../bus.js'

export default {
    name: 'XgMecenter',
    props: {
        'source': {
            type: Object,
            required: true
        },
        'type': {
            type: Number,
            required: true
        }
    },
    computed: {
        pairInfos () {
            return [
                this.source.pairInfos[0],
                this.source.pairInfos[2],
                this.source.pairInfos[1],
                this.source.pairInfos[3]
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
