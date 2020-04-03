const layout = require('../layouts/layout.js')
const content = require('./withdraw.ejs')
const pageTitle = '春节提现通知'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
