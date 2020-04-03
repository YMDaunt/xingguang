import '../../css/myProps/index.less'
import common from 'common'
import layer from 'layer'
import Vue from 'vue'
import axios from 'axios'

console.log('guojiang')

var vm = new Vue({
    el: '.content',
    data: {
        cardNum: 0
    },
    mounted: function () {
        this.$nextTick(function () {
            vm.getCardNum()
        })
    },
    methods: {
        getCardNum: function () {
            let that = this
            axios.get('/myProps/GetPrivateLetterNum')
                .then(function (res) {
                    let data = res.data
                    if (data.errno == -100) {
                        common.goLogin()
                    } else if (data.errno == 0) {
                        that.cardNum = data.data.num
                    } else {
                        layer.open({
                            content: data.msg,
                            skin: 'msg',
                            time: 2
                        })
                    }
                }, function (err) {
                    console.log(err)
                })
        }
    }
})
