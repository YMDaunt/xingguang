const layout = require('../layouts/layout.js')
const content = require('./liveProtocal.ejs')
const pageTitle = '开播协议'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
