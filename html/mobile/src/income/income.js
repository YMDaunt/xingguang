
const layout = require('../layouts/layout.js')
const content = require('./income.ejs')
const pageTitle = '我的收入'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ packageId }))
