/*
 * @Date: 2019-09-12 14:09:27
 * @LastEditors: Jesse
 * @LastEditTime: 2019-09-12 14:09:27
 */
const layout = require('../layouts/layout.js')
const content = require('./greenConvention.ejs')
const pageTitle = '文明公约'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
