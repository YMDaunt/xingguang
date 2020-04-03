const layout = require('../layouts/layout.js')
const content = require('./laborDay19.ejs')
const pageTitle = '我劳动我光荣'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./laborDay19.mixin.ejs')(), pageTitle }))
