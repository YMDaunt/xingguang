
const layout = require('../layouts/layout.js')
const content = require('./setFee.ejs')
const pageTitle = '设置点播收费'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
