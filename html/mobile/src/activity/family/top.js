const layout = require('../../layouts/layout.js')
const content = require('./top.ejs')
const pageTitle = 'TOP家族2周年庆'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
