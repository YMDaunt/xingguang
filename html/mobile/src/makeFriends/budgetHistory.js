const layout = require('../layouts/layout.js')
const content = require('./budgetHistory.ejs')

const pageTitle = '收支记录'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
