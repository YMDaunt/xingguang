const layout = require('../layouts/layout.js')
const content = require('./rechargeRebate.ejs')
const pageTitle = '充值感恩回馈季'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))