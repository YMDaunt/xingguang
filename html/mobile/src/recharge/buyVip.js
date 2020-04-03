
const layout = require('../layouts/layout.js')
const content = require('./buyVip.ejs')
const pageTitle = '开通VIP会员'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
