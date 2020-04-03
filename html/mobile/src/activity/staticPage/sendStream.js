const layout = require('../../layouts/layout.js')
const content = require('./sendStream.ejs')
const pageTitle = '新用户下载送流量'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))