/*
 * @Date: 2019-09-02 16:02:13
 * @LastEditors: Jesse
 * @LastEditTime: 2020-03-09 11:42:38
 */
const layout = require('../layouts/layout.js')
const content = require('./rebate.ejs')
const pageTitle = '暖春回馈 充值有礼'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
