/**
 * [TouchTransform touch容器 内容模拟滚动]
 * @param  {string} scrollWrap    [touch容器]
 * @param  {string} scrollContent [transform内容]
 * @param  {Function} cb(distance) [每次触发移动就会发布cb函数；distance：从容器顶部滑动了的距离，符号为负数]
 * @return null
 *
 * @example  ***scrollWrap建议类名.scroll-wrap；scrollContent建议类名.scroll-content***
 *
 * const entity = TouchTransform(".scroll-wrap",".scroll-content",function(distance){
 *
 * });
 */

const os = (function () {
    var ua = navigator.userAgent

    var isWindowsPhone = /(?:Windows Phone)/.test(ua)

    var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone

    var isAndroid = /(?:Android)/.test(ua)

    var isFireFox = /(?:Firefox)/.test(ua)

    var isChrome = /(?:Chrome|CriOS)/.test(ua)

    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))

    var isPhone = /(?:iPhone)/.test(ua) && !isTablet

    var isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    }
}())

export default class TouchTransform {
    constructor (scrollWrap, scrollContent, cb) {
        this.portTouch = {
            sx: 0,
            sy: 0,
            ex: 0,
            ey: 0
        }
        this.pointSE = {
            sx: 0,
            sy: 0,
            ex: 0,
            ey: 0,
            st: 0,
            et: 0
        }
        this.moveDistance = 0
        this.transitionEndStatus = true
        this.scrollWrap = document.querySelector(scrollWrap)
        this.scrollContent = document.querySelector(scrollContent)
        this.scrollWrapHeight = parseFloat(window.getComputedStyle(this.scrollWrap, null).getPropertyValue('height'))
        this.contentHeight = parseFloat(window.getComputedStyle(this.scrollContent, null).getPropertyValue('height'))
        if (this.contentHeight <= this.scrollWrapHeight) return
        this.cb = cb
        this.init()
    }

    init () {
        const that = this
        this.refresh()
        const bool = !('transform' in document.body.style) && !('webkitTransform' in document.body.style)
        if (bool || os.isPc) {
            this.scrollWrap.style.overflowY = 'auto'
            return this.scrollLoad(this.scrollWrap, this.cb)
        }

        this.scrollWrap.addEventListener('touchstart', this.touchstart.bind(this))
        this.scrollWrap.addEventListener('touchmove', this.touchmove.bind(this))
        this.scrollWrap.addEventListener('touchend', this.touchend.bind(this))
        this.scrollWrap.addEventListener('touchcancel', this.touchend.bind(this))

        // 监听动画结束
        this.scrollContent.addEventListener('transitionend', function () {
            that.transitionEndStatus = true
        })
    }

    // fix某些浏览器不支持transfrom属性
    scrollLoad (ele, callback) {
        const _ele = ele
        _ele.addEventListener('scroll', function () {
            const scrollTop = this.scrollTop
            callback && callback(-scrollTop)
        })
    }

    // move content
    translateMove (moveY, slide) {
        this.contentHeight = parseFloat(window.getComputedStyle(this.scrollContent, null).getPropertyValue('height'))
        if (this.contentHeight <= this.scrollWrapHeight) return
        if (this.moveDistance + moveY >= 0) {
            this.moveDistance = 0
        } else if (this.moveDistance + moveY < -this.contentHeight + this.scrollWrapHeight) {
            this.moveDistance = -this.contentHeight + this.scrollWrapHeight
        } else {
            this.moveDistance += moveY
        }
        if (slide) {
            this.scrollContent.setAttribute('style', '-webkit-transform:translate3d(0px, ' + this.moveDistance + 'px, 0px);-webkit-transition:-webkit-transform 0.3s cubic-bezier(0.3333, 0.6666, 0.6666, 1);')
            this.transitionEndStatus = false
        } else {
            this.scrollContent.setAttribute('style', '-webkit-transform:translate3d(0px, ' + this.moveDistance + 'px, 0px);')
        }
        // 移动 发布移动的距离
        this.cb && this.cb(this.moveDistance)
    }

    // 停止自由滚动
    stopSlide () {
        if (!this.transitionEndStatus) {
            var style = window.getComputedStyle(this.scrollContent, null)
            var transform = new WebKitCSSMatrix(style.webkitTransform)
            this.scrollContent.setAttribute('style', '-webkit-transform:translate3d(0px, ' + transform.m42 + 'px, 0px);')
        }
    }

    // 滑动开始
    touchstart (e) {
        this.stopSlide()
        this.portTouch.sx = e.targetTouches[0].clientX
        this.portTouch.sy = e.targetTouches[0].clientY

        this.pointSE.sx = this.portTouch.sx
        this.pointSE.sy = this.portTouch.sy
        this.pointSE.st = +new Date()
    }

    // 滑动ing
    touchmove (e) {
        this.portTouch.ex = e.targetTouches[0].clientX
        this.portTouch.ey = e.targetTouches[0].clientY
        var moveY = this.portTouch.ey - this.portTouch.sy
        if (Math.abs(moveY) > Math.abs(this.portTouch.ex - this.portTouch.sx)) {
            this.translateMove(moveY)
        }

        this.portTouch.sx = this.portTouch.ex
        this.portTouch.sy = this.portTouch.ey

        // 是否取消touch默认事件
        if ((this.moveDistance + moveY > 0) || (this.moveDistance + moveY < -this.contentHeight + this.scrollWrapHeight)) return true
        e.preventDefault()
        e.stopPropagation()
    }

    // 滑动结束
    touchend (e) {
        this.pointSE.ex = this.portTouch.sx
        this.pointSE.ey = this.portTouch.sy
        this.pointSE.et = +new Date()
        var rate = Math.abs(this.pointSE.ey - this.pointSE.sy) / (this.pointSE.et - this.pointSE.st)
        var symbol = this.pointSE.ey - this.pointSE.sy > 0 ? 1 : -1
        rate = parseInt(rate * 100) / 100
        if ((Math.abs(this.pointSE.ey - this.pointSE.sy) > Math.abs(this.pointSE.ex - this.pointSE.sx))/* && rate > 0.7 */) {
            this.translateMove(rate * 300 * symbol, true)
        }
    }

    // 刷新
    refresh () {
        this.moveDistance = 0
        this.translateMove(0)
    }
}
