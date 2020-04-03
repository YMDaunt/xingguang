const layout = require('../layouts/layout.js')
const content = require('./burnCalorie.ejs')
const pageTitle = '燃烧我的卡路里'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./burnCalorie.mixin.ejs')(), pageTitle }))
