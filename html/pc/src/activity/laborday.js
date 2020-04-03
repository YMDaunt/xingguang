const layout = require('../layouts/layout.js')
const content = require('./laborday.ejs')
const pageTitle = '劳动最光荣'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
