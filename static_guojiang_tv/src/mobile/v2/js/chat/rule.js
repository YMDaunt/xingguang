/*
 * @Date: 2018-08-14 17:49:06
 * @LastEditors: Jesse
 * @LastEditTime: 2019-08-22 17:58:30
 */
/* eslint-disable */
import '../../css/chat/rule.less'
import common from 'common'

document.getElementById('btn').addEventListener('click', function () {
    common.closeWebview()
})

window.pageOnShow = function () {
    if (common.getPlatformType() == 'ios_webview') {
        common.hideIosMenu()
    }
}
