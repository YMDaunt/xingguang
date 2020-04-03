const layout = require('../layouts/layout.js')
const content = require('./ricePudding.ejs')
const pageTitle = '甜糯腊八节'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))