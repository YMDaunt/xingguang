<template>
  <article class="id_article">
    <p class="id_list clearfix">
      <span class="fl">{{ type }}</span>
      <span class="fr">{{ items.income_coin }}</span>
    </p>
    <em class="id_line"/>
    <p class="id_list clearfix">
      <span class="fl">类型</span>
      <span
        class="fr"
        v-if="items.to_uid">{{ items.action_message.slice(0,4) }}{{ items.nickname }}({{ items.to_uid }}){{ items.action_message.slice(4) }}</span>
      <span
        class="fr"
        v-else>{{ items.action_message }}</span>
    </p>

    <p class="id_list clearfix">
      <span class="fl">时间</span>
      <span class="fr">{{ items.add_time }}</span>
    </p>

  </article>
</template>

<script>
export default {
    props: {
        item: {
            type: String,
            default: '123'
        }
    },
    computed: {
        items () {
            return JSON.parse(this.item)
        },
        type () {
            if (this.items.action === 'add') {
                return '入账金额'
            } else {
                return '出账金额'
            }
        }
    }
}
</script>>
