const layout = require('../layouts/layout.js')
const content = require('./fans.ejs')
const pageTitle = '1元真爱粉'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
