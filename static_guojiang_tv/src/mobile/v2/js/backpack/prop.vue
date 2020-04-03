<template>
  <section class="prop">
    <!-- 	<p class="head_hint"><span></span>请到直播间礼物面板-背包中使用礼物哦</p> -->

    <ul
      v-if="!isGiftsEmpty"
      class="list">
      <li
        v-for="item in listData "
        class="clearfix"
        @click="showGiftDetail(item)">
        <div class="avatar_wrap circle_outer fl">
          <div class="circle_mask">

            <div class="circle_outer circle_inner">
              <div class="circle_mask">
                <div class="at_bg">
                  <img
                    class="round_bg"
                    src="../../img/store/img_4.png">
                  <img
                    :src="item.image | filterHttp"
                    :alt="item.name"
                    class="at_img" >
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="list_desc fl">
          <h3>{{ item.name }}<span> x{{ item.num }}</span></h3>
          <p>有效期：<span v-html="item.expire"/></p>
          <small>{{ item.description }}</small>
        </div>

      </li>

    </ul>

    <div
      v-if="isGiftsEmpty"
      class="empty_backpack">
      <p>背包里空空如也<br>不去商城里逛逛吗</p>
      <a href="/dist/store/list.html"/>
    </div>

  </section>
</template>

<script>
import axios from 'axios'
import common from 'common'

let vmData = {
    listData: {},
    packageId: common.getPackageId(),
    unit:common.getUnit(),
    isGiftsEmpty: false
}
export default {

    filters: {
        filterHttp (url) {
            return common.filterHttp(url)
        }
    },
    data: function () {
        return vmData
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getGiftsList()
        })
    },
    methods: {
        getGiftsList () {
            axios.get('/backpack/GetUserProperty')
                .then(
                    (res) => {
                        let data = res.data
                        if (data.errno == 0) {
                            this.listData = data.data.list

                            if (this.listData.length == 0) {
                                this.isGiftsEmpty = true
                            }
                        } else if (data.errno == -100) {
                            common.goLogin()
                        } else {
                            layer.open({
                                content: data.msg,
                                skin: 'msg',
                                time: 3
                            })
                        }
                    },
                    (err) => {
                        layer.open({
                            content: err,
                            skin: 'msg',
                            time: 3
                        })
                    }
                )
        },
        showGiftDetail (item) {
            if (item.type == 9) {
                return
            }

            let content = `<div class="avatar_wrap circle_outer">
				<div class="circle_mask">
					<div class="circle_outer circle_inner">
						<div class="circle_mask">
							<div class="at_bg">
								<img class="at_img" src="${this.$options.filters['filterHttp'](item.image)}" alt="${item.name}" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<h4>${item.name}</h4>
			<p>数量：${item.num}</p>
			<p>单价：<span>${item.price}${this.unit}</span></p>
			`
            layer.open({
                content: content,
                skin: 2,
                className: `detail_card gifts_card`
            })
        }
    }
}
</script>
