<template>
    <rule-layer
        v-show="layerShow"
        wrap-class="modal-sign">
        <div
            slot="content"
            class="layer-content">
            <p class="msg-title">小主，确定报名{{ pathName }}赛道吗？</p>
            <div class="btns">
                <div
                    class="btn-cancel"
                    @click="cancel" />
                <div
                    class="btn-confirm"
                    @click="sign" />
            </div>
            <p class="msg-tips">提示：报名成功后，无法更改赛道，请谨慎操作！</p>
        </div>
    </rule-layer>
</template>

<script>
// 年度盛典 单项赛报名 活动规则弹框
import bus from '../../bus.js'
import RuleLayer from '../../components/RuleLayer'
import {
    signSingle
} from '../../service/service.js'

export default {
    name: 'SingleSignLayer',
    components: {
        RuleLayer
    },
    data () {
        return {
            layerShow: false,
            pathName: '',
            gid: 0
        }
    },
    mounted () {
        bus.$on('showSignModal', this.showModal)
    },
    methods: {
        closeLayer () {
            this.layerShow = false

            this.pathName = ''
            this.gid = 0
        },
        showModal (data) {
            this.pathName = data.pname
            this.gid = data.gid

            this.layerShow = true
        },
        cancel () {
            this.closeLayer()
        },
        sign () {
            if (!this.gid) return
            signSingle(this.gid).then(data => {
                if (data.errno !== 0) {
                    console.log(data.msg)
                    bus.$emit('toast', data.msg)
                    return
                }

                bus.$emit('toast', `小主，你已经成功报名${data.data.groupName}赛道！祝好运！`)
                bus.$emit('refreshPath', {
                    groupId: data.data.groupId,
                    count: data.data.count
                })
                this.closeLayer()
            })
        }
    }
}
</script>

<style lang="less" scoped>
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../../img/activity/ceremony2018';

// 渐变边框
.gradient-bd (@bW) {
    border: @bW/@bf solid;
    border-image: linear-gradient(to right,#bf9a42, #ffd87d 50%, #bf9a42) 1;
}

.getSprite (@w, @h, @posx, @posy) {
    @pad: 5;
    display: block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}

.pic-sprite {
    background-image: url('@{imgUrl}/singleSign/pics.png');
    background-repeat: no-repeat;
    background-size: 1375/@bf 1060/@bf;
    font-size: 0;
}

.pic-cancel_a {
    .getSprite(255, 69, -703, -775);
}

.pic-cancel {
    .getSprite(255, 69, -703, -864);
}

.pic-confirm_a {
    .getSprite(255, 69, -1110, -10);
}

.pic-confirm {
    .getSprite(255, 69, -1110, -99);
}

.layer-content {
    .gradient-bd(4);
    padding: 64/@bf 60/@bf;
    width: 886/@bf;
    box-sizing: content-box;
    background: url('@{imgUrl}/singleSign/m_bg.png') no-repeat;
    background-size: cover;

    .msg-title {
        text-align: center;
        font-size: 46/@bf;
        color: #ffdb88;
    }

    .btns {
        width: 660/@bf;
        margin: 50/@bf auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn-confirm {
        .pic-sprite;
        .pic-confirm;

        &:active {
            .pic-confirm_a;
        }
    }

    .btn-cancel {
        .pic-sprite;
        .pic-cancel;

        &:active {
            .pic-cancel_a;
        }
    }

    .msg-tips {
        text-align: center;
        font-size: 30/@bf;
        color: #ffdb88;
    }
}
</style>
