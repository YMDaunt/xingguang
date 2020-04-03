const layout = require('../layouts/layout.js')
const content = require('./xgRecall.ejs')
const pageTitle = '星光召回令！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))