const layout = require('../layouts/layout.js')
const content = require('./first.ejs')
const pageTitle = '首充豪礼'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
