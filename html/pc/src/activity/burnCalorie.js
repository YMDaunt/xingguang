const layout = require('../layouts/layout.js')
const content = require('./burnCalorie.ejs')
const pageTitle = '燃烧我的卡路里'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle, content: require('../../../mobile/src/activity/burnCalorie.mixin.ejs')() }))
