const layout = require('../../layouts/layout.js')
const content = require('./tuanzi19.ejs')
const pageTitle = '星光女神'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./tuanzi19.mixin.ejs')(), pageTitle }))
