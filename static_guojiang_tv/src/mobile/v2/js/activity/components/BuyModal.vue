<template>
    <!-- 购买弹框 -->
    <div
        v-show="status"
        class="modal-layer buy">
        <div class="modal-layer-c"><!-- 中间层，为实现一些ui提供容器 -->
            <div
                class="btn btn-close"
                @click="hide">X</div>
            <div class="input-box fl-box">
                <span class="txt-buy">购买：</span>
                <input
                    ref="buyInput"
                    :value="forms.buyInput"
                    class="buy-input"
                    type="text"
                    @click="inputFocus"
                    @input="buyInput" >
                <span class="txt-buy-af">个</span>
            </div>
            <p class="buy-price fl-box">
                <span class="txt-price">价格：</span>
                <span class="p-num fl-box">{{ buyPrice }}</span>
                <span class="txt-price-af">克拉</span>
            </p>
            <div
                class="btn btn-buy"
                @click="purchase" />
        </div>
    </div>
</template>

<style lang="less">
// 样式请在 活动页中指定
// 样式列表模板
.modal-layer {
    &.buy {}
    .btn-close {}

    .input-box{}
    .txt-buy {}
    .buy-input {}
    .txt-buy-af {}

    .buy-price {}
    .txt-price {}
    .p-num {}
    .txt-price-af {}

    .btn-cancel {}
    .btn-buy {}
}
</style>

<script>
/**
 * 购买弹框
 * horace 2019-7-16
 */
export default {
    name: 'BuyModal',
    props: {
        price: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            status: false,
            forms: {
                buyInput: 1
            }
        }
    },
    computed: {
        buyPrice () {
            return this.forms.buyInput * this.price
        }
    },
    methods: {
        show () {
            this.forms.buyInput = 1
            this.status = true
        },
        hide () {
            this.status = false
        },
        purchase () {
            this.$emit('purchase', this.forms.buyInput)
        },
        /* input filter 0 - 9999 */
        _inputFilter (value) {
            if (value === '') {
                return 0
            }

            value = +value.replace(/[^0-9]+/g, '')

            if (value > 9999) {
                value = 9999
            }
            if (value <= 0) {
                value = 0
            }

            return value
        },
        inputFocus (evt) {
            evt.target.focus()
        },
        buyInput (evt) {
            var value = this._inputFilter(evt.target.value)

            evt.target.value = value
            this.forms.buyInput = value
        }
    }
}
</script>
