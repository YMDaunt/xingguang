const layout = require('../layouts/layout.js')
const content = require('./pks4.ejs')
const pageTitle = 'PK荣耀赛S4赛季'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
