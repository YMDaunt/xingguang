const layout = require('../layouts/layout.js')
const content = require('./privacyProtocal.ejs')
const pageTitle = '隐私协议'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
