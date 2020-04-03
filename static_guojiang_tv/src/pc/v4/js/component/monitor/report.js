/*
 * @Date: 2018-09-29 09:58:23
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-02 09:28:48
 */
/**
 * 代码异常监控上报
 * 1. js错误捕获上报
 * 2. http接口信息上报
 * @Author   smy
 * @DateTime 2018-06-27T14:55:33+0800
 */
(function (global) {
    /**
     * Promise catch错误上报，需要在使用promise的地方显示调用.catch()，否则不会捕获错误
     */
    if (typeof Promise !== 'undefined') {
        var _promiseCatch = Promise.prototype.catch
        Promise.prototype.catch = function (foo) {
            return _promiseCatch.call(this, catCatch(foo))
        }
    }
    function catCatch (foo) {
        return function (args) {
            let msg = args.stack ? args.stack : args
            jsReport(msg)
            foo && foo.call(this, args)
        }
    }

    /**
     * 监听promise未处理的reject错误, 跨域情况下监控不到
    */
    window.addEventListener('unhandledrejection', event => {
        jsReport(event.reason)
    })

    /**
     * 拦截接口请求，上报接口信息
     */
    // 统一拦截ajax请求
    var startTime = 0

    var gapTime = 0 // 计算请求延时
    window.addEventListener('ajaxReadyStateChange', function (e) {
        var xhr = e.detail

        var status = xhr.status

        var readyState = xhr.readyState

        var responseText = xhr.responseText

        /**
         * 计算请求延时
         */
        if (readyState == 1) {
            startTime = (new Date()).getTime()
        }
        if (readyState == 4) {
            gapTime = (new Date()).getTime() - startTime
        }
        /**
         * 上报请求信息
         */
        if (readyState == 4) {
            httpReport(gapTime, status, xhr.responseURL)
        }
    })

    /**
     * 对globalMonitor.js全局错误栈内的错误上报
    */
    if (gjErrStack && gjErrStack.length !== 0) {
        gjErrStack.forEach(err => {
            jsReport(err)
        })
    }

    /**
     * @description 获取cookie
     * @author Jesse
     * @date 2019-03-11
     * @returns
     */
    function getCookie () {
        var cookie = {}
        var all = document.cookie
        if (all === '') return cookie
        var list = all.split(';')
        for (var i = 0; i < list.length; i++) {
            var item = list[i].trim()
            var p = item.indexOf('=')
            var name = item.substring(0, p)
            name = decodeURIComponent(name)
            var value = item.substring(p + 1)
            value = decodeURIComponent(value)
            cookie[name] = value
        }
        return cookie
    }
    var cookie = getCookie()

    /**
     * [jsReport] 上报js错误
     * @Author   smy
     * @DateTime 2018-06-25T16:56:33+0800
     */
    function jsReport (message) {
        // 设置需要忽略上报的错误信息
        var ignore = ['vipPayCallback']
        for (var i = 0; i < ignore.length; i++) {
            var ele = ignore[i]
            if (message.toString().indexOf(ele) !== -1) {
                return
            }
        }
        var msg = {'c': {'content': '', 'url': '', 'uid': ''}, 'channel': '', 'e': 'jserror', 'packageId': '', 'plat': '', 't': '', 'v': '', 'type': 'pfm', 'ua': ''}
        msg.c.content = message
        msg.c.uid = cookie.uid || '0'
        msg.c.url = location.href
        msg.channel = getChannel()
        msg.packageId = getPackageId()
        msg.plat = getPlatformType()
        msg.t = (new Date()).getTime()
        msg.v = getVersion()
        msg.ua = navigator.userAgent
        report(msg)
    }

    /**
     * [httpReport] http接口访问信息上报
     * @Author   smy
     * @DateTime 2018-06-26T17:44:16+0800
     * @param    {[type]}                 message [description]
     * @return   {[type]}                         [description]
     */
    function httpReport (gapTime, httpCode, url) {
        var msg = {'c': {'uid': '', 'time': '', 'deviceId': '', 'httpCode': 200, 'url': ''}, 'channel': '', 'e': 'httpStatus', 'packageId': '', 'plat': '', 't': '', 'v': '', 'type': 'pfm'}
        var re = new RegExp('^(http|https)://' + location.host, 'i')
        msg.c.time = gapTime
        msg.c.httpCode = httpCode
        msg.c.uid = cookie.uid || '0'
        msg.c.url = url.replace(re, '')
        msg.channel = getChannel()
        msg.packageId = getPackageId()
        msg.plat = getPlatformType()
        msg.t = (new Date()).getTime()
        msg.v = getVersion()
        report(msg)
    }

    /**
     * [webloadReport] 页面加载时间上报
     * @Author   smy
     * @DateTime 2018-06-29T14:29:39+0800
     * @param    {string}                 loadTime  页面加载时间：dom结构完全加载并所有图片等资源加载完毕，不等待异步ajax接口请求完毕
     */
    function webloadReport (loadTime) {
        var msg = {'c': {'uid': '', 'time': 0, 'url': ''}, 'channel': '', 'e': 'webPageLoad', 'packageId': '', 'plat': '', 't': '', 'v': '', 'type': 'pfm'}
        var re = new RegExp('^(http|https)://' + location.host, 'i')
        msg.c.time = loadTime
        msg.c.uid = cookie.uid || '0'
        msg.c.url = location.href.replace(re, '')
        msg.channel = getChannel()
        msg.packageId = getPackageId()
        msg.plat = getPlatformType()
        msg.t = (new Date()).getTime()
        msg.v = getVersion()
        report(msg)
    }

    /**
     * 数据埋点上报
     * @Author   smy
     * @DateTime 2018-08-09T12:10:16+0800
     * @param    {string}                 eventId 事件ID
     */
    function stat (eventId) {
        var msg = {'c': {'content': '', 'uid': ''}, 'channel': '', 'e': '', 'packageId': '', 'plat': '', 't': '', 'v': '', 'type': 'stat'}
        msg.e = eventId
        msg.c.uid = cookie.uid || '0'
        msg.channel = getChannel()
        msg.packageId = getPackageId()
        msg.plat = getPlatformType()
        msg.t = (new Date()).getTime()
        msg.v = getVersion()
        report(msg)
    }

    function report (msg) {
        var win = window
        var n = +(new Date())

        var img = win[n] = new Image()

        img.onload = img.onerror = function () {
            win[n] = null // 清除内存
        }

        img.src = 'https://stat.guojiang.tv/data/web?reportData=' + encodeURIComponent(JSON.stringify(msg))
    }

    // 获取app version
    function getVersion () {
        var version
        if (navigator.userAgent.indexOf('guojiang_version') > 0) {
            version = navigator.userAgent.split('guojiang_version/')[1].split(' ')[0]
        } else {
            version = '0'
        }
        return version
    }

    // 获取app channel
    function getChannel () {
        var channel
        if (navigator.userAgent.indexOf('guojiang_channel') > 0) {
            channel = navigator.userAgent.split('guojiang_channel/')[1].split(' ')[0]
        } else {
            channel = '0'
        }
        return channel
    }

    // 获取app packageId
    function getPackageId () {
        var packageId
        if (navigator.userAgent.indexOf('guojiang_package') > 0) {
            packageId = navigator.userAgent.split('guojiang_package/')[1].split(' ')[0]
        } else {
            packageId = '0'
        }
        return packageId
    }

    // 获取平台类型
    function getPlatformType () {
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            // 这是微信平台下浏览器
            return 'wechat'
        } else if (/QQ\//i.test(navigator.userAgent)) {
            // qq客户端
            return 'qq'
        } else if (/guojiang_android/i.test(navigator.userAgent)) {
            return 'android_webview'
        } else if (/android/i.test(navigator.userAgent)) {
            return 'android'
        } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
            return 'ios_webview'
        } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return 'ios'
        } else {
            return 'pc'
        }
    }

    /**
    @description JS错误捕捉部分，由于跨域拿不到错误信息，这里使用try catch包裹。
    包裹内容有：seajs.use, define, setTimeout, setInterval, jquery的on, off, ajax等
    代码逻辑借鉴badjs: https://github.com/BetterJS/badjs-report
    @author smy
    @date 2018-08-28
     */

    var _onthrow = function (errObj) {
        // 同一错误出现3次以上不上报
        if (isRepeat(errObj)) return

        if (typeof (errObj) === 'object' && errObj.stack) {
            jsReport(errObj.stack)
        } else {
            jsReport(errObj.toString())
        }
    }

    var _log_map = {}
    var isRepeat = function (error) {
        var msg = error.toString()
        // 以错误消息为key，消息次数为value，进行记录，相同key的会把次数加1，重复超过3次不上报
        var times = _log_map[msg] = (parseInt(_log_map[msg], 10) || 0) + 1
        return times > 3
    }

    var timeoutkey
    var cat = function (foo, args) {
        return function () {
            try {
                return foo.apply(this, args || arguments)
            } catch (error) {
                _onthrow(error)

                // some browser throw error (chrome) , can not find error where it throw,  so print it on console;
                if (error.stack && console && console.error) {
                    console.error('[REPORT]', error.stack)
                }

                // hang up browser and throw , but it should trigger onerror , so rewrite onerror then recover it
                // 不重复触发window.onerror的上报
                if (!timeoutkey) {
                    var orgOnerror = window.onerror
                    window.onerror = function () { }
                    timeoutkey = setTimeout(function () {
                        window.onerror = orgOnerror
                        timeoutkey = null
                    }, 50)
                }
                throw error
            }
        }
    }

    var catArgs = function (foo) {
        return function () {
            var arg; var args = []
            for (var i = 0, l = arguments.length; i < l; i++) {
                arg = arguments[i]
                _isFunction(arg) && (arg = cat(arg))
                args.push(arg)
            }
            return foo.apply(this, args)
        }
    }

    var catTimeout = function (foo) {
        return function (cb, timeout) {
            // for setTimeout(string, delay)
            if (typeof cb === 'string') {
                try {
                    cb = new Function(cb)
                } catch (err) {
                    throw err
                }
            }
            // 取第三个及其之后的参数，Array.prototype.slice === [].slice
            var args = [].slice.call(arguments, 2)
            // for setTimeout(function, delay, param1, ...)
            cb = cat(cb, args.length && args)
            return foo(cb, timeout)
        }
    }

    // merge
    var _merge = function (org, obj) {
        for (var key in obj) {
            org[key] = obj[key]
        }
    }

    // function or not
    var _isFunction = function (foo) {
        return typeof foo === 'function'
    }

    /**
     * makeArgsTry
     * wrap a function's arguments with try & catch
     * @param {Function} foo
     * @param {Object} self
     * @returns {Function}
     */
    var makeArgsTry = function (foo, self) {
        return function () {
            var arg; var tmp; var args = []
            for (var i = 0, l = arguments.length; i < l; i++) {
                arg = arguments[i]
                if (_isFunction(arg)) {
                    if (arg.tryWrap) {
                        arg = arg.tryWrap
                    } else {
                        tmp = cat(arg)
                        arg.tryWrap = tmp
                        arg = tmp
                    }
                }
                args.push(arg)
            }
            return foo.apply(self || this, args)
        }
    }

    /**
     * makeObjTry
     * wrap a object's all value with try & catch
     * @param {Function} foo
     * @param {Object} self
     * @returns {Function}
     */
    var makeObjTry = function (obj) {
        var key, value
        for (key in obj) {
            value = obj[key]
            if (_isFunction(value)) obj[key] = cat(value)
        }
        return obj
    }

    /**
     * wrap amd or commonjs of function  ,exp :  define , require ,
     * @returns {Function}
     */
    var global = window
    var spyModules = function () {
        var _require = global.require

        var _define = global.define
        if (_define && _define.amd && _require) {
            global.require = catArgs(_require)
            _merge(global.require, _require)
            global.define = catArgs(_define)
            _merge(global.define, _define)
        }

        if (global.seajs && _define) {
            global.define = function () {
                var arg; var args = []
                for (var i = 0, l = arguments.length; i < l; i++) {
                    arg = arguments[i]
                    if (_isFunction(arg)) {
                        arg = cat(arg)
                        // seajs should use toString parse dependencies , so rewrite it
                        arg.toString = (function (orgArg) {
                            return function () {
                                return orgArg.toString()
                            }
                        }(arguments[i]))
                    }
                    args.push(arg)
                }
                return _define.apply(this, args)
            }

            global.seajs.use = catArgs(global.seajs.use)

            _merge(global.define, _define)
        }
    }

    /**
     * wrap jquery async function ,exp : event.add , event.remove , ajax
     * @returns {Function}
     */
    var spyJquery = function () {
        var _$ = global.$

        if (!_$ || !_$.event) {
            return
        }

        var _add, _remove
        if (_$.zepto) {
            _add = _$.fn.on, _remove = _$.fn.off

            _$.fn.on = makeArgsTry(_add)
            _$.fn.off = function () {
                var arg; var args = []
                for (var i = 0, l = arguments.length; i < l; i++) {
                    arg = arguments[i]
                    _isFunction(arg) && arg.tryWrap && (arg = arg.tryWrap)
                    args.push(arg)
                }
                return _remove.apply(this, args)
            }
        } else if (window.jQuery) {
            _add = _$.event.add, _remove = _$.event.remove

            _$.event.add = makeArgsTry(_add)
            _$.event.remove = function () {
                var arg; var args = []
                for (var i = 0, l = arguments.length; i < l; i++) {
                    arg = arguments[i]
                    _isFunction(arg) && arg.tryWrap && (arg = arg.tryWrap)
                    args.push(arg)
                }
                return _remove.apply(this, args)
            }
        }

        var _ajax = _$.ajax

        if (_ajax) {
            _$.ajax = function (url, setting) {
                if (!setting) {
                    setting = url
                    url = undefined
                }
                makeObjTry(setting)
                if (url) return _ajax.call(_$, url, setting)
                return _ajax.call(_$, setting)
            }
        }
    }

    /**
     * wrap async of function in window , exp : setTimeout , setInterval
     * @returns {Function}
     */
    var spySystem = function () {
        global.setTimeout = catTimeout(global.setTimeout)
        global.setInterval = catTimeout(global.setInterval)
    }

    /**
     * wrap custom of function ,
     * @param obj - obj or  function
     * @returns {Function}
     */
    var spyCustom = function (obj) {
        if (_isFunction(obj)) {
            return cat(obj)
        } else {
            return makeObjTry(obj)
        }
    }

    /**
     * run spyJquery() and spyModules() and spySystem()
     * @returns {Function}
     */
    var spyAll = function () {
        spySystem()
        spyModules()
        spyJquery()
    }

    global.gjReport = {
        jsReport: jsReport,
        httpReport: httpReport,
        webloadReport: webloadReport,
        stat: stat,
        spyAll: spyAll,
        spyCustom: spyCustom
    }
}(window))
export default gjReport
