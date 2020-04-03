const layout = require('../layouts/layout.js')
const content = require('./makeMoney.ejs')
const pageTitle = '如何赚钱'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
