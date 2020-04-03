const layout = require('../../layouts/layout.js')
const content = require('./boss1.ejs')
const pageTitle = '世界boss初次登场'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
