/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2018-08-14 17:49:06
 */
/* eslint-disable */
import '../../css/chat/setFee.less'

import Vue from 'vue'
import axios from 'axios'
import keyboard from '../component/gj.keyboard.js'

let vm = new Vue({
    el: '#app',

    filters: {
        filterNum (num) {
            return num.toFixed(1)
        }
    },
    data: {
        feeNum: 50,
        isInputError: false,
        isSaveSuccess: false,
        Keyboard: null
    },
    created: function () {
        this.getFee()
    },
    mounted: function () {
        this.$nextTick(function () {

        })
    },
    methods: {
        inputNum () {
            this.Keyboard = new keyboard({
                placeholder: vm.feeNum,
                model: 1,
                yes: function (num) {
	            	console.log('num:', num)
	            	num = parseInt(num)
	            	vm.feeNum = num

	            	if (num < 30 || num > 1000) {
	            		vm.isInputError = true
	            	} else {
	            		vm.isInputError = false
	            	}
                }
            })
        },

        getFee () {
            axios.get('/chat/GetChatFee')
                .then(
                    (res) => {
                        let data = res.data
                        if (data.errno == 0) {
                            vm.feeNum = data.data.fee
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: '3'
                            })
                        }
                    }
                )
        },

        setFee () {
            this.keyboard && this.Keyboard.remove()
            axios.get('/chat/ModifyChatFee', {
                params: {
                    chatFee: this.feeNum
                }
            })
                .then(
                    (res) => {
                        let data = res.data
                        if (data.errno == 0) {
                            vm.isSaveSuccess = true
                            layer.open({
                                content: '已保存',
                                skin: 'msg',
                                time: '3'
                            })
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: '3'
                            })
                        }
                    }
                )
        }
    }
})
