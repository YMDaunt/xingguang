const layout = require('../../layouts/layout.js')
const content = require('./index.ejs')
const pageTitle = '2019星光年度盛典第一季'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle, content: require('./../../../../mobile/src/activity/annual19S1/index.mixin.ejs')() }))
