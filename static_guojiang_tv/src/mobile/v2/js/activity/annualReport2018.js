'use strict'

import Vue from 'vue'
import axios from 'axios'
import { goLogin, getPlatformType } from 'common'
import '../../css/activity/annualReport2018.less'

import bg0 from '../../img/activity/annualReport2018/bg0.jpg'
import bg1 from '../../img/activity/annualReport2018/bg1.jpg'
import bg2 from '../../img/activity/annualReport2018/bg2.jpg'
import bg3 from '../../img/activity/annualReport2018/bg3.jpg'
import bg4 from '../../img/activity/annualReport2018/bg4.jpg'
import bg5 from '../../img/activity/annualReport2018/bg5.jpg'
import bg6 from '../../img/activity/annualReport2018/bg6.jpg'
import bg7 from '../../img/activity/annualReport2018/bg7.jpg'
import bg8 from '../../img/activity/annualReport2018/bg8.jpg'
import deco1 from '../../img/activity/annualReport2018/deco_1.png'
import deco2 from '../../img/activity/annualReport2018/deco_2.png'
import icons from '../../img/activity/annualReport2018/icons.png'
import page2deco4 from '../../img/activity/annualReport2018/page-2-deco-4.png'
import page6deco1 from '../../img/activity/annualReport2018/page-6-deco-1.png'
import page8deco2 from '../../img/activity/annualReport2018/page-8-deco-2.png'
import txt from '../../img/activity/annualReport2018/txt.png'

// ios禁止弹性滚动
var platform = getPlatformType()
if (platform.indexOf('ios') !== -1) {
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
    }, { passive: false })
}

var service = function () {
    return axios.get('/annual/summary').then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            throw new Error(res.message)
        }
    })
}

var con = {
    imgCount: 1,
    loadedImgCount: 0,
    dataLoaded: false,
    music: 0, // 音乐
    halfH: 140,
    totalH: window.screen.height,
    currY: 0,
    musicRef: null,
    pageRef: []
}

new Vue({
    el: '#app',
    directives: {
        swiper: {
            inserted (el, binding) {
                var touched = false // closure
                var startY = 0

                el.addEventListener('touchstart', (evt) => {
                    touched = true
                    startY = evt.touches[0].pageY
                })

                el.addEventListener('touchmove', (evt) => {
                    if (touched) {
                        binding.value('move', evt.touches[0].pageY - startY)
                    }
                })

                el.addEventListener('touchcancel', () => {
                    touched = false
                    binding.value('cancel')
                })

                el.addEventListener('touchend', (evt) => {
                    touched = false
                    binding.value('end', evt.changedTouches[0].pageY - startY)
                })
            }
        }
    },
    filters: {
        // 返回年月日
        formatDate (val) {
            var d = new Date(val.replace(/-/g, '/'))
            return (d.getMonth() + 1) + '月' + d.getDate() + '日'
        }
    },
    data: {
        showPage: false,
        loading: true,
        progress: '0%',
        currStage: 0,
        pages: null,
        musicPlay: false,
        musicInited: false,
        autoplay: true,
        login18: true, // 18年是否登陆
        txtMap: {
            '人生赢家': 'rsyj',
            '硬核': 'yh',
            '天秀': 'tx',
            '实力担当': 'sldd',
            '社会人': 'shr',
            '专情': 'zq',
            '持久': 'cj',
            '义气': 'yq',
            '品味': 'pw',
            'skr': 'skr',
            '潜力股': 'qlg',
            '小财主': 'xcz',
            '地主': 'dz',
            '大富豪': 'dfh',
            '神壕': 'sh',
            '捧场王': 'pcw',
            '低调': 'dd',
            '放荡不羁': 'fdbj',
            '守护骑士': 'shqs',
            '浪里个浪': 'llgl'
        }
    },
    computed: {
        showStage: function () {
            if (!this.showPage) {
                return -2
            } else {
                return +con.pageRef[this.currStage].getAttribute('data-page')
            }
        }
    },
    beforeMount: function () {
    },
    mounted: function () {
        // 定义工作流
        var imgSource = [ bg0, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, icons, deco1, deco2, page2deco4, page6deco1, page8deco2, txt ]
        var loader = (data) => {
            this.initData(data)

            con.imgCount = imgSource.length
            imgSource.forEach(url => {
                var img = new Image()
                img.src = url

                img.onabort = img.onerror = this.loadImgFailed

                img.onload = this.loadImg
            })

            var music = this.$refs.audio
            con.musicRef = music

            music.onabort = this.loadMusicFailed
            music.onloadstart = this.loadMusicCanPlay
            music.onprogress = music.onloadeddata = this.loadMusicCanPlay
            music.oncanplay = music.canplaythrough = this.loadMusicCanPlay
            music.onplay = this.onplayMusic
            music.onpause = this.onpauseMusic
            setTimeout(() => {
                this.loadMusicCanPlay()
            }, 2000)
        }

        con.totalH = document.body.clientHeight
        con.halfH = con.totalH * 0.15

        service().then(loader).catch(loader)

        // 读取search
        var search = location.search.slice(1).split('&')
        var searchObj = {}
        search.forEach(val => {
            var kv = val.split('=')
            searchObj[kv[0].trim()] = kv[1] ? kv[1].trim() : ''
        })
        if (searchObj['autoplay'] === 'false' || searchObj['autoplay'] === '0') {
            this.autoplay = false
        }
    },
    methods: {
        loadImg (evt) {
            // console.log('[LoadImg Success]:', evt.path[0].src)
            con.loadedImgCount++

            this.isLoaded()
        },
        loadImgFailed (evt) {
            console.log('[LoadImg Failed]:', evt.path[0].src)
            con.loadedImgCount++

            this.isLoaded()
        },
        loadMusicStart (evt) {
            console.log('[Music Start load]', evt)
        },
        loadMisicFailed (evt) {
            console.log('[LoadMusic Failed]:', evt.path[0].src)
            con.music = 1
            this.isLoaded()
        },
        loadMusicCanPlay (evt) {
            console.log('[MusicCanPlay]')
            if (!con.music) {
                con.music = 1
                this.isLoaded()
            }
        },
        initMusic () {
            if (this.musicInited) return
            this.musicInited = true
            con.musicRef.muted = true
            con.musicRef.play()

            setTimeout(() => {
                con.musicRef.muted = false
                con.musicRef.pause()
            })
        },
        toggleMusic () {
            if (!con.musicRef.paused) {
                con.musicRef.pause()
            } else {
                con.musicRef.play()
            }
        },
        onplayMusic () {
            this.musicPlay = true
        },
        onpauseMusic () {
            this.musicPlay = false
        },
        dispatchMusic () {
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', true, true)
            console.log('dispatchEvent')
            this.$refs.musicIcon.dispatchEvent(e)
        },
        initData (res) {
            console.log('[LoadData Success]')
            con.dataLoaded = true
            this.isLoaded()

            if (res instanceof Error) {
                // 加载错误 或 接口报错
                return
            }

            if (res.errno === 101) { // 未登录
                try {
                    goLogin()
                } catch (e) {
                    location.href = '/user/login?callback=' + window.top.location.href
                }
                return
            }

            if (res.errno === 102) { // 2018未登录
                this.login18 = false
                return
            }

            if (res.errno === 0) {
                var data = res.data

                if (data.sendMostPids) {
                    var pids = []
                    for (var k in data.sendMostPids) {
                        pids.push({
                            name: k,
                            val: data.sendMostPids[k]
                        })
                    }
                    data.sendMostPids = pids.sort((a, b) => {
                        return b.val - a.val
                    })
                }

                this.pages = data
                return
            }

            console.log(data.msg) // 其他错误
        },
        updateProgress () {
            let imgQ = (con.loadedImgCount / con.imgCount) * 100 * 0.6
            let ajaxQ = (con.dataLoaded ? 100 : 0) * 0.2
            let musicQ = con.music * 100 * 0.2

            this.progress = (imgQ + ajaxQ + musicQ).toFixed(2) + '%'
        },
        isLoaded () {
            this.updateProgress()
            if (con.imgCount === con.loadedImgCount && con.dataLoaded && con.music === 1) {
                this.loaded()
            }
        },
        loaded () {
            console.log('[loaded]: 静态资源加载完成 初始化数据加载完成')
            this.start()
        },
        start () {
            [].slice.apply(this.$refs['page-scroller'].querySelectorAll('.page-section')).forEach(ele => {
                ele.style.height = con.totalH + 'px'
                con.pageRef.push(ele)
            })

            this.currStage = this.login18 ? 0 : (con.pageRef.length - 1)
            this.$refs['page-scroller'].style.transform = `translateY(${-((this.currStage - 1) * con.totalH)}px)` // add -1 默认位置
            this.currStage = -1

            setTimeout(() => {
                this.loading = false
                this.currStage = this.login18 ? 0 : (con.pageRef.length - 1)
            }, 1000)
        },
        swiper (evt, changeY) {
            if (this.loading) return

            if (this.currStage > (con.pageRef.length - 2)) return // 默认屏(空数据)不触摸
            if (this.currStage < 1 && changeY > 0) return
            if (this.currStage > (con.pageRef.length - 3) && changeY < 0) return // 最后一屏不能向下

            var baseY = -(this.currStage * con.totalH)

            if (evt === 'move') {
                this.$refs['page-scroller'].style.transform = `translateY(${baseY + changeY}px)`
            }

            if (evt === 'cancel') {
                this.$refs['page-scroller'].style.transform = `translateY(${baseY}px`
            }

            if (evt === 'end') {
                var abs = Math.abs(changeY)

                if (abs >= con.halfH) {
                    changeY < 0 ? this.nextPage() : this.prevPage()
                } else {
                    this.$refs['page-scroller'].style.transform = `translateY(${baseY}px)`
                }
            }
        },
        swiperLoad (evt, changeY) {
            if (this.loading || changeY > 0) return

            var baseY = -((this.currStage - 1) * con.totalH)

            if (evt === 'move') {
                this.$refs['page-loading'].style.transform = `translateY(${changeY}px)`
                this.$refs['page-scroller'].style.transform = `translateY(${baseY + changeY}px)`
            }

            if (evt === 'cancel') {
                this.$refs['page-loading'].style.transform = `translateY(${baseY}px`
            }

            if (evt === 'end') {
                var abs = Math.abs(changeY)

                this.$refs['page-loading'].style.transition = `transform ease 200ms`
                this.$refs['page-scroller'].style.transition = `transform ease 200ms`
                if (abs >= con.halfH) {
                    this.$refs['page-loading'].style.transform = `translateY(-${con.totalH}px)`
                    this.$refs['page-scroller'].style.transform = `translateY(${baseY - con.totalH}px)`
                    this.autoplay && this.toggleMusic()
                } else {
                    this.$refs['page-loading'].style.transform = `translateY(0px)`
                    this.$refs['page-scroller'].style.transform = `translateY(${-baseY}px)`
                }
            }
        },
        nextPage () {
            this.$refs['page-scroller'].style.transition = `transform linear 200ms`
            this.$refs['page-scroller'].style.transform = `translateY(-${++this.currStage * con.totalH}px)`
        },
        prevPage () {
            this.$refs['page-scroller'].style.transition = `transform linear 200ms`
            this.$refs['page-scroller'].style.transform = `translateY(-${--this.currStage * con.totalH}px)`
        },
        // 过渡结束后取消过渡效果 因为drag事件不需要过渡效果
        cancelTrans (evt, cname) {
            if (evt.target.className.indexOf(cname) === -1) return
            evt.target.style.transition = 'none'
        },
        // 过渡结束后隐藏
        hide (evt) {
            evt.target.style.display = 'none'
        },
        leaveLoading (evt) {
            evt.target.style.transition = 'none'
            this.showPage = true
            this.currStage = this.login18 ? 0 : (con.pageRef.length - 1)
        }
    }
})
