import '../../css/family/credits.less'

import Vue from 'vue'
import axios from 'axios'

new Vue({
    el: 'article',
    data: {
        myCredits: 0
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getMyInfo()
        })
    },
    methods: {
        getMyInfo () {
            axios.get('/family/userpoint')
                .then(
                    (res) => {
                        res = res.data
                        if (res.errno == 0) {
                            this.myCredits = res.data.points
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (err) => {
                        alert(err)
                    }
                )
        }
    }
})
