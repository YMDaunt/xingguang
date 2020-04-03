
const layout = require('../layouts/layout.js')
const content = require('./creditsDetail.ejs')
const pageTitle = '积分明细'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
