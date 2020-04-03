const layout = require('../layouts/layout.js')
const content = require('./flora.ejs')
const pageTitle = '花神之争'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle, content: require('../../../mobile/src/activity/flora.mixin.ejs')() }))
