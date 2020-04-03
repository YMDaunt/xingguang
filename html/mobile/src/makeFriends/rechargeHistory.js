const layout = require('../layouts/layout.js')
const content = require('./rechargeHistory.ejs')

const pageTitle = '充值记录'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
