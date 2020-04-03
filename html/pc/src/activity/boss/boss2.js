const layout = require('../../layouts/layout.js')
const content = require('./boss2.ejs')
const pageTitle = '世界BOSS再次登场！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
