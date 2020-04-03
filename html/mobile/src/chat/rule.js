
const layout = require('../layouts/layout.js')
const content = require('./rule.ejs')
const pageTitle = '语聊说明'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
