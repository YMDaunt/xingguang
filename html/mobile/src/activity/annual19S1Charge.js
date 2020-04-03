const layout = require('../layouts/layout.js')
const content = require('./annual19S1Charge.ejs')
const pageTitle = '2019星光年度盛典第一季补给站'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./annual19S1Charge.mixin.ejs')(), pageTitle }))
