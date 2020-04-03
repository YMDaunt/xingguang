const layout = require('../../../layouts/layout.js')
const content = require('./spread1.ejs')
const pageTitle = '周星推广'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
