const layout = require('../../layouts/layout.js')
const content = require('./jiujiu.ejs')
const pageTitle = '星光主播'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))