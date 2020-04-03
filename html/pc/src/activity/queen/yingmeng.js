const layout = require('../../layouts/layout.js')
const content = require('./yingmeng.ejs')
const pageTitle = '星光女神-樱梦菲儿'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
