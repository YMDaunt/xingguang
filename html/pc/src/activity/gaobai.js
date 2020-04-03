const layout = require('../layouts/layout.js')
const content = require('./gaobai.ejs')
const pageTitle = '520 甜蜜告白'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
