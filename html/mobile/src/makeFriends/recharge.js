const layout = require('../layouts/layout.js')
const content = require('./recharge.ejs')

const pageTitle = '充值'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
