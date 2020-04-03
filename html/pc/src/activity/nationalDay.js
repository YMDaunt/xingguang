const layout = require('../layouts/layout.js')
const content = require('./nationalDay.ejs')
const pageTitle = '国庆每日签 好礼嗨翻天'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
