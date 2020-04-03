const layout = require('../layouts/layout.js')
const content = require('./dbEleven.ejs')
const pageTitle = '约么？这个光棍节！！！！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
