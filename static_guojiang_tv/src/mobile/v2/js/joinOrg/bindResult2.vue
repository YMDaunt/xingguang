<template>
  <section class="s_3">
    <span class="icon"/>
    <p class="icon_hint">加入成功</p>

    <p class="result_hint">快去下载APP开播，赚取收益吧</p>

    <a
      class="btn"
      @click="download">去下载</a>
  </section>
</template>

<script>
export default {
    methods: {
        getPlatformType () {
            if (/android/i.test(navigator.userAgent)) {
                return 'android'
            } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                return 'ios'
            }
        },
        download () {
            let type = this.getPlatformType()
            if (type === 'ios') {
                location.href = 'http://m.tuho.tv/dist/download/iosSign.html?v=5.2.0'
            } else if (type === 'android') {
                location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tuhao.kuaishou'
            }
        }
    }
}
</script>
