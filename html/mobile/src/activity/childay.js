const layout = require('../layouts/layout.js')
const content = require('./childay.ejs')
const pageTitle = '童年大富翁'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))