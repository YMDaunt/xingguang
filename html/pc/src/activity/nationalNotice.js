const layout = require('../layouts/layout.js')
const content = require('./nationalNotice.ejs')
const pageTitle = '中秋国庆假期安排'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
