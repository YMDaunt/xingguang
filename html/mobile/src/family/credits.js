
const layout = require('../layouts/layout.js')
const content = require('./credits.ejs')
const pageTitle = '我的积分'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
