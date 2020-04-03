const layout = require('../layouts/layout.js')
const content = require('./upgrade.ejs')
const pageTitle = '通知'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
