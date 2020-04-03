const layout = require('../layouts/layout.js')
const content = require('./moderator.ejs')
const pageTitle = '主播等级'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
