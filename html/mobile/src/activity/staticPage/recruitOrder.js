const layout = require('../../layouts/layout.js')
const content = require('./recruitOrder.ejs')
const pageTitle = '主播招募令'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))