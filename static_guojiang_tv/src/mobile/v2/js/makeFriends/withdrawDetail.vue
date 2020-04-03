<template>
  <div class="withdrawDetail">
    <div class="wdl_title">
      <p>{{ status }}</p>
      <p>{{ items.money }}</p>
    </div>
    <div class="wdl_h2_wrap">
      <p class="wdl_h2">提现进度</p>
    </div>
    <ul class="wdl_ul">
      <li/>
      <li>
        <p>申请提现</p>
        <p>{{ items.add_time }}</p>
        <span class="wdl_circle active"/>
      </li>
      <li>
        <p>官方处理中</p>
        <p>{{ items.add_time }}</p>
        <span class="wdl_circle active"/>
      </li>
      <li>
        <p>{{ result }}</p>
        <span
          class="wdl_circle"
          :class="[classIcon]"/>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    props: {
        item: {
            type: String,
            default: ''
        }
    },
    computed: {
        items () {
            return JSON.parse(this.item)
        },
        status () {
            switch (this.items.status) {
            case '0':
                return '等待审核'
            case '1':
                return '提现成功'
            case '2':
                return '申请提现被驳回'
            case '3':
                return '红包发放失败'
            case '4':
                return '发放中'
            }
        },
        result () {
            switch (this.items.status) {
            case '0':
                return ''
            case '1':
                return '红包发放成功'
            case '2':
                return '申请提现被驳回'
            case '3':
                return '红包发放失败'
            case '4':
                return '发放中'
            }
        },
        classIcon () {
            switch (this.items.status) {
            case '0':
                return ''
            case '1':
                return 'wdl_success'
            case '2':
                return 'wdl_refuse'
            case '3':
                return 'wdl_fail'
            }
        }
    }
}
</script>>
