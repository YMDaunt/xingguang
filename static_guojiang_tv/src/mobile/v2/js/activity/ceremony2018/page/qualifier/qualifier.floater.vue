<template>
    <div
        class="floater btn-rules"
        @click="showRules" />
</template>

<script>
import bus from '../../bus.js'

export default {
    name: 'QualifierFloater',
    methods: {
        showRules () {
            bus.$emit('showQualifierLayer')
        }
    }
}
</script>

<style lang="less" scoped>
@bf: 108rem; // 1080px -> fontSize -> 108px
@imgUrl: '../../../../../img/activity/ceremony2018';

.getSprite (@w, @h, @posx, @posy) {
    @pad: 5;
    display: inline-block;
    background-position: (@posx + @pad)/@bf (@posy + @pad)/@bf;
    width: (@w + @pad*2)/@bf;
    height: (@h + @pad*2)/@bf;
}
.o-sprite {
    background-image: url('@{imgUrl}/qualifier/icons.png');
    background-repeat: no-repeat;
    background-size: 341/@bf 1548/@bf;
    font-size: 0;
}
.btn_rules {
    .getSprite(216, 220, -10, -1318);
}

.floater{
    position: fixed;
    right: 0px;
    bottom: 37%;
    z-index: 10;

    &.btn-rules {
        .o-sprite;
        .btn_rules;
    }
}
</style>
