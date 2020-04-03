
const layout = require('../layouts/layout.js')
const content = require('./moderatorRule.ejs')
const pageTitle = '粉丝体系'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
