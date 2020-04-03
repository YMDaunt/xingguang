const layout = require('../layouts/layout.js')
const content = require('./myLevel.ejs')
const pageTitle = '我的等级'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
