const layout = require('../../layouts/layout.js')
const content = require('./preState.ejs')
const pageTitle = '2018星光年度盛典强势来袭！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
