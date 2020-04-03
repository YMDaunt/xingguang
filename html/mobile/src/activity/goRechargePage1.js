const layout = require('../layouts/layout.js')
const content = require('./goRechargePage1.ejs')
const pageTitle = '充值返克拉'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))