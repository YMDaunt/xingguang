/*
 * @Date: 2018-09-29 09:58:23
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-02 09:38:36
 */
(function (win) {
    /**
     * @description 设置资源加载错误达到一定次数后在上报，防止因用户断网造成频繁上报
     * @author Jesse
     * @date 2020-01-06
     * @param {*} obj 请求的资源
     * @param {*} src 请求的资源的url
     * @param {*} maxErrorNum 最大错误次数
     */
    function reRequest (obj, src, maxErrorNum) {
        var timer
        if (maxErrorNum > 0) {
            timer = setTimeout(function () {
                obj.onerror = function () {
                    reRequest(obj, src, maxErrorNum - 1)
                }
                obj.onload = function () {
                    clearTimeout(timer)
                }
                obj.src = src
            }, 800)
        } else {
            jsReport(src + ' load error')
        }
    }
    /* 文件访问的报错捕获，比如css,img，js等加载不到的404或500
    */
    win.addEventListener('error', function (msg) {
        if (msg && msg.target) {
            // 懒加载的图片忽略
            if (msg.target.tagName === 'IMG' && msg.target.className.indexOf('lazy') !== -1) {
                return
            }
            // 异步填充imgsrc的忽略
            var pattern = new RegExp(location.href.replace(/\./g, '\\.') + '$', 'g')
            if (msg.target.tagName === 'IMG' && pattern.test(msg.target.src)) return

            var url = msg.target.src || msg.target.href
            if (url && !msg.target.reported) {
                msg.target.reported = true
                reRequest(msg.target, url, 3)
            }
        }
    }, true)

    /**
     * error事件捕获
     * @param {String}  message   错误信息
     * @param {String}  source      出错的文件
     * @param {Long}    lineno     出错代码的行号
     * @param {Long}    colno   出错代码的列号
     * @param {Object}  error       错误的详细信息，Anything
     */
    win.onerror = function (message, source, lineno, colno, error) {
        // 兼容：script error.情况
        if (error) {
            jsReport(error.stack)
        } else {
            jsReport(message)
        }
        return false // 阻止执行默认事件处理函数，不会
    }

    window.gjErrStack = []
    function jsReport (msg) {
        if (typeof gjReport !== 'undefined') {
            // 已加载上报函数，直接上报
            gjReport.jsReport(msg)
        } else {
            // 上报函数还未加载到，将错误信息进行存储（离开页面则不进行上报）
            gjErrStack.push(msg)
        }
    }
}(window))
