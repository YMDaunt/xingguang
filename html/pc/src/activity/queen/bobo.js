const layout = require('../../layouts/layout.js')
const content = require('./bobo.ejs')
const pageTitle = '星光女神-波波女郎'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
