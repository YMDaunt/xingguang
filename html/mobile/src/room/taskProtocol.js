
const layout = require('../layouts/layout.js')
const content = require('./taskProtocol.ejs')
const pageTitle = '任务互动协议'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
