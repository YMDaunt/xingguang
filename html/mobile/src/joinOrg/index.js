
const layout = require('../layouts/layout.js')
const content = require('./index.ejs')
const pageTitle = '成为公会主播'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
