import report from 'report'
import '../component/monitor/pageLoadStat.js'
import Vue from 'vue'
/**
 * [监控]：try-catch封装zepto, cmd
*/
report.spyAll()
/**
 * [监控]：上报vue生命周期内发生的异常
*/
Vue.config.errorHandler = function (err, vm, info) {
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    // 2.4.0+可以监控自定义事件内的错误
    let msg = `错误发生在生命周期钩子：${info}中，具体信息：${err.stack}`
    report.jsReport(msg)
}
