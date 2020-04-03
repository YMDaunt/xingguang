
const layout = require('../layouts/layout.js')
const content = require('./list.ejs')
const pageTitle = '粉丝徽章'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
