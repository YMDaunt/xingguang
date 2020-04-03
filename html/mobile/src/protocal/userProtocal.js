const layout = require('../layouts/layout.js')
const content = require('./userProtocal.ejs')
const pageTitle = '用户协议'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
