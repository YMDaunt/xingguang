const layout = require('../layouts/layout.js')
const content = require('./pking2.ejs')
const pageTitle = 'PK荣耀赛'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
