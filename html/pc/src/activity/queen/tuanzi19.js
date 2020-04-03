const layout = require('../../layouts/layout.js')
const content = require('./tuanzi19.ejs')
const pageTitle = '星光女神'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle, content: require('./../../../../mobile/src/activity/queen/tuanzi19.mixin.ejs')() }))
