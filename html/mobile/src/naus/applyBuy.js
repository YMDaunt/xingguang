const layout = require('../layouts/layout.js')
const content = require('./applyBuy.ejs')
const pageTitle = '私募认购申请'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))