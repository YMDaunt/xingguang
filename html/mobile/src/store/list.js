
const layout = require('../layouts/layout.js')
const content = require('./list.ejs')
const pageTitle = '商城'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
