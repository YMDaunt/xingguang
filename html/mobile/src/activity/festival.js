const layout = require('../layouts/layout.js')
const content = require('./festival.ejs')
const pageTitle = '月满中秋'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))