const layout = require('../layouts/layout.js')
const content = require('./privacy2.ejs')
const pageTitle = '用户协议'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
