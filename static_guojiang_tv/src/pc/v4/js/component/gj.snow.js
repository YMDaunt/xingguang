(function webpackUniversalModuleDefinition (root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') { module.exports = factory() } else if (typeof define === 'function' && define.amd) { define([], factory) } else {
        var a = factory()
        for (var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i]
    }
})(typeof self !== 'undefined' ? self : this, function () {
    return /******/ (function (modules) { // webpackBootstrap
        /******/ // The module cache
        /******/ var installedModules = {}
        /******/
        /******/ // The require function
        /******/ function __webpack_require__ (moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) {
                /******/ return installedModules[moduleId].exports
                /******/ }
            /******/ // Create a new module (and put it into the cache)
            /******/ var module = installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: false,
                /******/ exports: {}
                /******/ }
            /******/
            /******/ // Execute the module function
            /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
            /******/
            /******/ // Flag the module as loaded
            /******/ module.l = true
            /******/
            /******/ // Return the exports of the module
            /******/ return module.exports
            /******/ }
        /******/
        /******/
        /******/ // expose the modules object (__webpack_modules__)
        /******/ __webpack_require__.m = modules
        /******/
        /******/ // expose the module cache
        /******/ __webpack_require__.c = installedModules
        /******/
        /******/ // define getter function for harmony exports
        /******/ __webpack_require__.d = function (exports, name, getter) {
            /******/ if (!__webpack_require__.o(exports, name)) {
                /******/ Object.defineProperty(exports, name, {
                    /******/ configurable: false,
                    /******/ enumerable: true,
                    /******/ get: getter
                    /******/ })
                /******/ }
            /******/ }
        /******/
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function (module) {
            /******/ var getter = module && module.__esModule
            /******/ ? function getDefault () { return module['default'] }
            /******/ : function getModuleExports () { return module }
            /******/ __webpack_require__.d(getter, 'a', getter)
            /******/ return getter
            /******/ }
        /******/
        /******/ // Object.prototype.hasOwnProperty.call
        /******/ __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property) }
        /******/
        /******/ // __webpack_public_path__
        /******/ __webpack_require__.p = '/dist/'
        /******/
        /******/ // Load entry module and return exports
        /******/ return __webpack_require__(__webpack_require__.s = 0)
        /******/ })
    /************************************************************************/
    /******/ ([
        /* 0 */
        /***/ function (module, __webpack_exports__, __webpack_require__) {
            'use strict'
            Object.defineProperty(__webpack_exports__, '__esModule', { value: true })
            /**
 * class Snow [canvas draw snow]
 */
            var setTimeTask = (function () {
                return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60)
        }
            })()
            var Snow = /** @class */ (function () {
                function Snow (_a) {
                    var level = _a.level; var imgBox = _a.imgBox
                    /**
         * [imgEnityBox 图片元素集合]
         * @type {Array<HTMLElement>}
         */
                    this.imgEnityBox = []
                    this.snowSum = 0
                    /**
         * [imgRandomBox 下雪图片数量容器，用于取图片概率]
         * @type {Array<HTMLImageElement>}
         */
                    this.imgRandomBox = []
                    /**
         * [snowWrap 雪花集合]
         */
                    this.snowWrap = []
                    this.level = level
                    this.imgBox = imgBox
                    this.canvas = document.querySelector('canvas')
                    this.ctx = this.canvas.getContext('2d')
                    this.cW = parseInt(window.getComputedStyle(this.canvas, null).getPropertyValue('width'))
                    console.log(this.cW)
                    this.cH = parseInt(window.getComputedStyle(this.canvas, null).getPropertyValue('height'))
                    this.init()
                }
                Snow.prototype.init = function () {
                    var _this = this
                    var imgLoadCount = 0
                    var k = 0.04
                    this.snowSum = this.cW * this.level * k
                    this.imgBox.forEach(function (value, index) {
                        var img = new Image()
                        img.onload = function () {
                            _this.imgEnityBox[index] = img
                            imgLoadCount++
                            if (imgLoadCount === _this.imgBox.length) {
                                _this.snowRandom()
                                for (var i = 0; i < _this.snowSum; i++) {
                                    _this.generatorSnow(true)
                                }
                                _this.raf()
                            }
                        }
                        img.src = value
                    })
                }
                Snow.prototype.snowRandom = function () {
                    var _this = this
                    var len = this.imgEnityBox.length
                    this.imgEnityBox.forEach(function (value, index) {
                        var newArr = new Array(len - index)
                        for (var i = 0; i < len - index; i++) {
                            newArr.push(value)
                        }
                        _this.imgRandomBox = _this.imgRandomBox.concat(newArr)
                    })
                }
                Snow.prototype.generatorSnow = function (init) {
                    if (!this.imgRandomBox.length) { return }
                    if (this.snowWrap.length >= this.snowSum) { return }
                    var x = ~~(Math.random() * this.cW)
                    var y = 0
                    if (init) { y = ~~(Math.random() * this.cH) }
                    var img = this.imgRandomBox[~~(Math.random() * this.imgRandomBox.length)]
                    var direct = !(Math.random() > 0.5)
                    var speed = Math.ceil(Math.random() * 3)
                    this.snowWrap.push({
                        x: x,
                        y: y,
                        img: img,
                        direct: direct,
                        speed: speed
                    })
                }
                Snow.prototype.move = function () {
                    var _this = this
                    var ctx = this.ctx
                    var tempWrap = []
                    ctx.clearRect(0, 0, 3000, 3000)
                    ctx.fillStyle = 'rgba(255,255,255,0)'
                    ctx.fillRect(0, 0, this.cW, this.cH)
                    this.snowWrap.forEach(function (value) {
                        var distance = 1
                        var x = value.x + (value.direct ? distance * 0.1 : -distance * 0.1)
                        var y = value.y + distance * value.speed * 0.5
                        if (x < 0 || x > _this.cW || y > _this.cH) { return }
                        tempWrap.push({
                            x: x,
                            y: y,
                            img: value.img,
                            direct: value.direct,
                            speed: value.speed
                        })
                        ctx.moveTo(x, y)
                        value.img && ctx.drawImage(value.img, x, y, 12, 16)
                    })
                    this.snowWrap = tempWrap
                    tempWrap = null
                }
                Snow.prototype.raf = function () {
                    setTimeTask(function () {
                        this.generatorSnow()
                        this.move()
                        this.raf()
                    }.bind(this))
                }
                return Snow
            }())
            /* harmony default export */ __webpack_exports__['default'] = (Snow)
            window.Snow = Snow
            /***/ }
        /******/ ])
})
