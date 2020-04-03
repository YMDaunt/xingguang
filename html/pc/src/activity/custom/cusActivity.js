const layout = require('../../layouts/layout.js')
const content = require('./cusActivity.ejs')
const pageTitle = '你的世界你做主！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
