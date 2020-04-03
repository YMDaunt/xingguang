const layout = require('../layouts/layout.js')
const content = require('./goddess.ejs')
const pageTitle = '八月·女神季'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))