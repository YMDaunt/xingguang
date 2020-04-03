const layout = require('../layouts/layout.js')
const content = require('./giftPackage.ejs')
const pageTitle = '新手礼盒'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
