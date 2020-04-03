<template>
  <div style="height:100%;">
    <link
      rel="stylesheet"
      type="text/css"
      href="//static.guojiang.tv/mobile/v2/css/lib/swiper-4.1.0.min.css">
    <link
      rel="stylesheet"
      type="text/css"
      href="//static.guojiang.tv/mobile/v2/css/lib/animate.min.css">

    <div class="loading-page slide-0">
      <div class="loading-txt-block">
        加载中<span class="loading-txt"/>
      </div>
    </div>

    <!-- mp3 -->
    <div class="mp3-img music-ani"/>
    <audio
      class="bg-music"
      loop="loop"
      src="//static.guojiang.tv/mobile/v2/img/activity/summary/mp3.mp3"/>

    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide slide-1 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/1.jpg">
          <div
            class="slide-1-b ani"
            swiper-animate-effect="fadeInLeft"/>
          <div
            class="slide-1-a ani"
            swiper-animate-effect="fadeInRight"
            swiper-animate-delay="0.6s"/>
          <div class="slide-1-c">
            <span/>
          </div>
        </div>
        <div
          class="swiper-slide slide-2 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/2.jpg">
          <div
            class="slide-2-a ani"
            swiper-animate-effect="fadeIn"/>
          <div
            class="slide-2-b ani"
            swiper-animate-effect="fadeInLeft">
            <span class="slide-2-txt"/>
          </div>
          <div
            class="slide-2-c ani"
            swiper-animate-effect="fadeInRight"
            swiper-animate-delay="0.6s">
            <span class="slide-2-txt"/>
          </div>
        </div>
        <div
          class="swiper-slide slide-3 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/3.jpg">
          <div
            class="slide-3-a ani"
            swiper-animate-effect="fadeIn"/>
          <div
            class="slide-3-b ani"
            swiper-animate-effect="fadeInLeft">
            <span class="slide-3-time"/>
            <span class="slide-3-count"/>
          </div>
        </div>
        <div
          class="swiper-slide slide-4 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/4.jpg">
          <div
            class="slide-4-a ani"
            swiper-animate-effect="fadeIn"/>
          <div
            class="slide-4-b ani"
            swiper-animate-effect="fadeInUp">
            <span class="slide-4-anchor"/>
            <span class="slide-4-money"/>
            <span class="slide-4-day"/>
          </div>
        </div>
        <div
          class="swiper-slide slide-5 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/5.jpg">
          <div
            class="slide-5-gift ani"
            swiper-animate-effect="fadeInLeft"/>
          <div
            class="slide-5-game ani"
            swiper-animate-effect="fadeInRight">
            <span class="js-allnum"/>
            <span class="js-rank"/>
            <span class="js-ranktag"/>
          </div>
        </div>
        <div
          class="swiper-slide slide-6 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/6.jpg">
          <div
            class="slide-6-a ani"
            swiper-animate-effect="fadeInDown"/>
          <div
            class="slide-6-b ani"
            swiper-animate-effect="fadeInUp"/>
        </div>
        <div
          class="swiper-slide slide-7 lazy-img"
          data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/7.jpg">
          <div
            class="slide-7-a ani"
            swiper-animate-effect="swing"/>
          <div class="tag-block"/>
          <div class="share-btn"/>
          <div class="again-btn"/>
        </div>
      </div>

      <div class="swiper-pagination"/>
    </div>

    <!-- 错过2017 -->
    <div
      class="lazy-img nofind-page slide-8"
      data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/8.jpg">
      <div class="slide-8-a"/>
      <div class="slide-8-b"/>
    </div>

    <!-- 分享的H5 -->
    <div
      class="lazy-img friend-share slide-9"
      data-bg="//static.guojiang.tv/mobile/v2/img/activity/summary/9.jpg">
      <div class="slide-9-a">
        <img src="">
        <div class="slide-9-nickname"/>
      </div>
      <div class="friend-tag-block"/>
      <div class="share-tag"/>
    </div>

  </div>
</template>

<script>
import '../../../../css/activity/summary.less'
import axios from 'axios'
import common from 'common'
import $ from 'webpack-zepto'
export default {
    data () {
        return {

        }
    },
    computed: {

    },
    mounted () {
        function GetQueryString (name) {
			    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
			    var r = window.location.search.substr(1).match(reg)
			    if (r != null) return unescape(r[2]); return null
        }

        // load img
        let nodeLists = document.querySelectorAll('.lazy-img')
        let imgCount = 0
        let imgLength = nodeLists.length
        for (let i = 0, len = nodeLists.length; i < len; i++) {
            const IMG = new Image()
            const src = nodeLists[i].getAttribute('data-bg')
            IMG.src = src
            IMG.onload = function () {
                nodeLists[i].style.backgroundImage = 'url(' + src + ')'
                imgCount++
                if (imgCount === imgLength) {
                    $('.swiper-container').css('opacity', 1)
                    $('.loading-page').hide()

                    // 如果是分享的页面
                    const shareNickName = GetQueryString('nickname')
                    const shareAvator = GetQueryString('avator')
                    const shareTag = GetQueryString('tag')
                    var shareStr = ''
                    if (shareNickName) {
                        $('.slide-9-nickname').html(unescape(shareNickName))
                        $('.slide-9-a img').attr('src', unescape(shareAvator))
                        // 查看我的
                        $('.share-tag').click(function () {
                            location.href = '//m.kuaishouvideo.com/dist/activity/newYear.html'
                        })
                        unescape(shareTag).split('_').forEach(function (value, index) {
                            shareStr += `<div class="tag-item"><em>${value}</em></div>`
                        })
                        $('.friend-tag-block').html(shareStr)
                        return $('.friend-share').show()
                    }

                    // 是否错过2017
                    noData2017++
                    if (noData2017 === 2) {
                        $('.nofind-page').show()
                    }
                }
            }
        }

        // load mp3
        const musicEle = document.querySelector('.bg-music')

        document.documentElement.addEventListener('touchstart', musicPlay, false)
        document.documentElement.addEventListener('click', musicPlay, false)
        function musicPlay () {
            musicEle.play()
            if (!musicEle.paused) {
                document.documentElement.removeEventListener('touchstart', musicPlay)
                document.documentElement.removeEventListener('click', musicPlay)
            } else {
                document.documentElement.removeEventListener('touchstart', musicPlay)
            }
        }

        musicEle.addEventListener('ended', function () {
            musicEle.play()
        })

        document.querySelector('.mp3-img').addEventListener('click', function () {
            if (musicEle.paused) {
                musicEle.play()
                $(this).addClass('music-ani')
            } else {
                $(this).removeClass('music-ani')
                musicEle.pause()
            }
        })

        let mySwiper
        let noData2017 = 0
        axios.get('/NewYear18/GetSummary')
            .then(res => res.data.data)
            .then(data => {
                if (data.uid === '0000') {
                    return common.goLogin()
                }
                const result = data.result
                // 2017年没有数据
                if (!result) {
                    noData2017++
                    if (noData2017 === 2) {
                        $('.nofind-page').show()
                    }
                    return
                }

                $('.slide-1-c span').html(data.nickname)

                let tempRemoveCount = 0
                if (result.firstAttentionModName) {
                    $('.slide-2-b span').html(result.firstAttentionModName)
                } else {
                    tempRemoveCount++
                    $('.slide-2-c').css('top', '6.56rem')
                    $('.slide-2-b').remove()
                }

                if (result.firstSendGiftName) {
                    $('.slide-2-c span').html(result.firstSendGiftName)
                } else {
                    tempRemoveCount++
                    $('.slide-2-c').remove()
                }
                if (tempRemoveCount === 2) {
                    tempRemoveCount = 0
                    $('.slide-2').remove()
                }

                $('.slide-3-time').html(result.activeDays)
                $('.slide-3-count').html(result.preferDuration)
                if (!result.activeDays) {
                    $('.slide-3').remove()
                }

                $('.slide-4-money').html(result.consumeCoinForTa)
                $('.slide-4-day').html(result.accompanyDays)
                $('.slide-4-anchor').html(result.consumeModName)
                if (result.consumeCoinForTa == 0) {
                    $('.slide-4').remove()
                }

                $('.js-allnum').html(result.consumeCoinAll)
                $('.js-rank').html(result.rank.replace('%', ''))
                $('.js-ranktag').html(result.rankTag + '！')

                for (var i in result.sendMostPids) {
                    if (result.sendMostPids[i]) {
                        $('.slide-5-gift').append(`<p class="send-gift-item">“${i}” ${result.sendMostPids[i]}个,</p>`)
                    }
                }

                let tagStr = ''
                let tempTag = ''
                result.tags.forEach((value, index) => {
                    tempTag += '_' + value
                    tagStr += `<div class="tag-item ani" swiper-animate-delay="${index * 0.5}s" swiper-animate-effect="fadeInUp"><em>${value}</em></div>`
                })
                $('.tag-block').html(tagStr)

                // 分享文案
                tempTag = tempTag.slice(1)
                const shareLink = `//m.kuaishouvideo.com/dist/activity/newYear.html?avator=${escape(data['head_pic_1'])}&nickname=${escape(data['nickname'])}&tag=${escape(tempTag)}`
                window.gjShareParam = JSON.stringify({
                    title: '你的星光年度总结新鲜出炉！',
                    content: '有你真好，相伴的这一年！',
                    link: shareLink,
                    imgLink: '//static.guojiang.tv/mobile/v2/img/activity/summary/share.png'
                })
                setTimeout(function () {
                    try {
                        gBridge.setShareData(window.gjShareParam)
                    } catch (e) {}
                }, 510)

                // swiper init
                mySwiper = new Swiper('.swiper-container', {
                    direction: 'vertical',
                    mousewheel: true,
                    pagination: {
                        el: '.swiper-pagination'
                    },
                    on: {
                        init: function () {
                            swiperAnimateCache(this) // 隐藏动画元素
                            swiperAnimate(this) // 初始化完成开始动画
                        },
                        slideChangeTransitionEnd: function () {
							  swiperAnimate(this) // 每个slide切换结束时也运行当前slide动画
                        }
                    }
                })
            })
            .catch(err => console.log(err))

        // 第一页
        let loadingTime = 0
        function loadingTxt () {
            if (loadingTime === 4) {
                loadingTime = 0
                $('.loading-txt').html('')
                return
            }
            loadingTime++
            $('.loading-txt').append('. ')
        }
        setInterval(function () {
            loadingTxt()
        }, 200)

        // 切换到第一页
        $('.again-btn').click(function () {
            mySwiper.slideTo(0, 0)
        })

        // 分享给好友
        $('.share-btn,.slide-8-b').click(function () {
            common.goShare()
        })
    },
    methods: {

    }
}
</script>
