import '../../css/naus/applyBuy.less'

import Vue from 'vue'
import axios from 'axios'
import nationality from '../component/nationality.js'
import common from 'common'
import './line-round.js'

const queryString = require('querystring')
// ios中激活active伪类
document.body.addEventListener('touchstart', function () {})

let vm = new Vue({
    el: 'article',
    data: {
        enInfo: {
            lan: '中文',
            title: 'Private Placement Application',
            inputTitle_1: 'Your name:',
            inputTitle_2: 'Your email:',
            inputTitle_3: 'Your nationality:',
            inputTitle_4: 'Your ETH adress:',
            inputTitle_5: 'Your Intended investment:',
            inputTitle_6: 'The coin be used to invent:',
            inputTitle_7: 'Your Telegram username:',
            inputTitle_8: 'Your Twitter username:',
            unit: 'USD',
            rule: 'NAUS has never partnered with any third-party agencies for the token sales. Any potential buyer of the token will go through strict KYC procedure. NAUS token sale is not open to China, US and any other countries and regions where such activities are prohibited.',
            btn: 'Submit',
            placeholder: 'Please enter ...',
            searchInput: 'Input Chinese/English/code search'
        },
        zhInfo: {
            lan: 'English',
            title: '私募认购申请',
            inputTitle_1: '您的名字:',
            inputTitle_2: '您的郵箱:',
            inputTitle_3: '您的國籍:',
            inputTitle_4: '您的ETH地址:',
            inputTitle_5: '您的投資預期:',
            inputTitle_6: '您用來投資的幣種:',
            inputTitle_7: '您的Telegram用戶名:',
            inputTitle_8: '您的Twitter用戶名:',
            unit: '美元',
            rule: 'NAUS從未與任何第三方機構合作進行代幣銷售。代幣的任何潛在買家都將通過嚴格的KYC程序審核。NAUS代幣銷售不對中國、美國以及禁止此類活動的任何其他國家和地區開放。',
            btn: '提交',
            placeholder: '請輸入...',
            searchInput: '输入中英文/代码搜索'
        },
        info: {},
        isChinese: true,
        input: {
            name: '',
            email: '',
            country: '',
            ethadr: '',
            invest: 0,
            currency: 0,
            telename: '',
            twittername: ''
        },
        investItems: ['0-500', '500-2000', '2000-10000', '10000-50000'],
        investClickIndex: 0,
        currencyItems: ['BTC', 'ETH'],
        currencyClickIndex: 0,
        isAllInput: false,
        isShowSearchLayer: false,
        searchCountry: {},
        ajaxFlag: false
    },
    watch: {
        input: {
            handler () {
                let self = this
                let keys = Object.keys(this.input)

                for (var i = 0; i < keys.length; i++) {
                    if (self.input[keys[i]] === '') {
                        self.isAllInput = false
                        break
                    }

                    if (self.input[keys[keys.length - 1]] != '') {
                        self.isAllInput = true
                    }
                }
            },
            deep: true
        }
    },
    created: function () {
        this.info = this.isChinese ? this.zhInfo : this.enInfo
    },
    mounted: function () {
        let that = this
        this.$nextTick(function () {
            $('.control-nationality-suggest').each(function () {
			    var input = $(this).find('.country_input')
			    var list = $(this).find('.nationality-suggest-list')
			    that.searchCountry = new nationality({
			    	input: input,
			    	list: list,
			    	cb: function (id, en, cn) {
			    		that.input.country = cn
			    		that.isShowSearchLayer = !that.isShowSearchLayer
			    	}
			    })
            })
        })
    },
    methods: {
        switchLan () {
            this.isChinese = !this.isChinese
            this.info = this.isChinese ? this.zhInfo : this.enInfo
            document.title = this.info.title
        },

        submit () {
            if (!this.isAllInput) return

            let emailTest = common.regExpTest(this.input.email, 'email')
            if (!emailTest.errno) {
                let text = vm.isChinese ? '請填寫正確的郵箱' : 'Please enter the right email'
                layer.open({
                    content: text,
                    type: 'msg',
                    time: 3
                })
                return
            }

            if (this.ajaxFlag) return
            this.ajaxFlag = true

            common.showLoading()
            let data = queryString.stringify({
                name: this.input.name,
                email: this.input.email,
                country: this.input.country,
                walletAddress: this.input.ethadr,
                buyScale: this.input.invest,
                coinType: this.input.currency,
                telegramUsername: this.input.telename,
                twitterUsername: this.input.twittername
            }, '&')

            axios.post('/apply/add', data)
                .then(
                    (res) => {
                        vm.ajaxFlag = false
                        common.hideLoading()

                        let data = res.data
                        if (data.errCode == 0) {
                            let text = vm.isChinese ? '提交成功' : 'Submit successfully'
                            layer.open({
                                content: text,
                                type: 'msg',
                                time: 3
                            })
                        } else {
                            alert(data.errMsg)
                        }
                    },
                    (err) => {
                        vm.ajaxFlag = false
                        common.hideLoading()
                        alert(err)
                    }
                )
        },

        showSearchCountryLayer () {
            this.isShowSearchLayer = !this.isShowSearchLayer
            setTimeout(function () {
                $('.control-nationality-suggest input').focus()
                $('.control-nationality-suggest input').select()
            })
        }
    }
})
