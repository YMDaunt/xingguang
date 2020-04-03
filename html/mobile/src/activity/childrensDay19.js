const layout = require('../layouts/layout.js')
const content = require('./childrensDay19.ejs')
const pageTitle = '超级童趣大派对'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./childrensDay19.mixin.ejs')(), pageTitle }))
