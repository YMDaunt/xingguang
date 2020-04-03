const layout = require('../layouts/layout.js')
const content = require('./privacy.ejs')
const pageTitle = '隐私授权协议'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
