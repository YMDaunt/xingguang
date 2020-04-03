const layout = require('../layouts/layout.js')
const content = require('./prop.ejs')
const pageTitle = '我的道具'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
