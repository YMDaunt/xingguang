const layout = require('../../layouts/layout.js')
const content = require('./12.ejs')
const pageTitle = '土豪免费送流量'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))