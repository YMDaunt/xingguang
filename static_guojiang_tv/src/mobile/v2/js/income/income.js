import Vue from 'vue'

new Vue({
    el: '.article',
    data: {
        isShowAvatar: false
    },
    mounted: function () {
        console.log(123)
    },
    methods: {
        showAvatar () {
            this.isShowAvatar = !this.isShowAvatar
        }
    }
})
