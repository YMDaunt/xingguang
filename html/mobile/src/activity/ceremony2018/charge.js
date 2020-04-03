const layout = require('../../layouts/layout.js')
const content = require('./charge.ejs')
const pageTitle = '2018星光年度补给站'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
