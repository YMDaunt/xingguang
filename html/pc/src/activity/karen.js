const layout = require('../layouts/layout.js')
const content = require('./karen.ejs')
const pageTitle = '星光男神'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
