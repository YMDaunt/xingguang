import axios from 'axios'
import common from 'common'
import $ from 'webpack-zepto'

require('../../css/activity/summary.less')

document.body.addEventListener('touchstart', function () {})

function GetQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(decodeURIComponent(r[2])); return null
}

function loadImg (src, callback) {
    const IMG = new Image()
    IMG.src = src
    IMG.onload = function () {
        callback && callback()
    }
}

function loadScript (src, callback) {
    const script = document.createElement('script')
    script.src = src
    script.onload = function () {
        callback && callback()
    }
    document.body.appendChild(script)
}

function sourceLoad (callback) {
    let imgCount = 0
    let nodeLists = document.querySelectorAll('[data-bg]')
    let bL = nodeLists.length
    let jsCout = 0
    let scriptLists = document.querySelectorAll('[data-js]')
    let sL = scriptLists.length

    for (let i = 0; i < bL; i++) {
        const src = nodeLists[i].getAttribute('data-bg')
        nodeLists[i].removeAttribute('data-bg')
        nodeLists[i].style.backgroundImage = 'url(' + src + ')'
        loadImg(src, function () {
            imgCount++
            if (bL + sL === imgCount + jsCout) {
                callback && callback()
            }
        })
    }
    for (let j = 0; j < sL; j++) {
        const jsSrc = scriptLists[j].getAttribute('data-js')
        scriptLists[j].removeAttribute('data-js')
        loadScript(jsSrc, function () {
            jsCout++
            if (bL + sL === imgCount + jsCout) {
                callback && callback()
            }
        })
    }
}

// load mp3
function loadMusic () {
    const musicEle = document.querySelector('.bg-music')
    musicEle.setAttribute('src', musicEle.getAttribute('data-src'))

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
}

function initXHR () {
    axios.get('/NewYear18/GetSummary')
        .then(res => res.data.data)
        .then(data => {
            if (data.uid === '0000') {
                return common.goLogin()
            }

            // 分享给好友
            $('.share-btn,.slide-8-b').click(function () {
                try {
                    _czc.push(['_trackEvent', '分享年度总结按钮', '分享次数'])
                } catch (err) {}
                common.goShare()
            })

            const result = data.result
            // 2017年没有数据
            const nofindEle = document.querySelector('.nofind-page')
            if (!result) {
                const nofindEleBg = nofindEle.getAttribute('data-bg')
                loadImg(nofindEleBg, function () {
                    nofindEle.style.backgroundImage = 'url(' + nofindEleBg + ')'
                    nofindEle.style.display = 'block'
                })
                loadMusic()
                return
            }
            nofindEle.removeAttribute('data-bg')

            sourceLoad(function () {
                $('.swiper-container').css('opacity', 1)
                $('.loading-page').hide()

                // swiper init
                const mySwiper = new Swiper('.swiper-container', {
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

                // 切换到第一页
                $('.again-btn').click(function () {
                    mySwiper.slideTo(0, 0)
                })

                loadMusic()
            })

            $('.slide-1-c div').html(data.nickname)

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
            $('.slide-4-nickname').html(result.consumeModName)
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
            const shareLink = `//m.kuaishouvideo.com/dist/activity/summary.html?avator=${encodeURIComponent(data['head_pic_1'])}&nickname=${encodeURIComponent(data['nickname'])}&tag=${encodeURIComponent(tempTag)}`
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
        })
        .catch(err => console.log(err))
}

// 加载页
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

// 如果是分享的页面
const shareNickName = GetQueryString('nickname')
const friendShareEle = document.querySelector('.friend-share')
if (shareNickName && shareNickName !== 'undefined') {
    let shareStr = ''
    const shareAvator = GetQueryString('avator')
    const shareTag = GetQueryString('tag')
    $('.slide-9-nickname').html(unescape(shareNickName))
    $('.slide-9-a img').attr('src', unescape(shareAvator))
    // 查看我的
    $('.share-tag').click(function () {
        location.href = '//m.kuaishouvideo.com/dist/activity/summary.html'
    })
    unescape(shareTag).split('_').forEach(function (value, index) {
        shareStr += `<div class="tag-item"><em>${value}</em></div>`
    })
    $('.friend-tag-block').html(shareStr)

    const shareBg = friendShareEle.getAttribute('data-bg')
    loadImg(shareBg, function () {
        friendShareEle.style.backgroundImage = 'url(' + shareBg + ')'
        friendShareEle.removeAttribute('data-bg')
        $('.friend-share').show()
        loadMusic()
    })
} else {
    friendShareEle.removeAttribute('data-bg')
    initXHR()
}
