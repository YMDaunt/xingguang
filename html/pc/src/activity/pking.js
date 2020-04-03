const layout = require('../layouts/layout.js')
const content = require('./pking.ejs')
const pageTitle = '谁是PK王'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
