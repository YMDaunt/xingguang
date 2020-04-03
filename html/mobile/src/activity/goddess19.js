const layout = require('../layouts/layout.js')
const content = require('./goddess19.ejs')
const pageTitle = '女神驾到'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
