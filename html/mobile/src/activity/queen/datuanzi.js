const layout = require('../../layouts/layout.js')
const content = require('./datuanzi.ejs')
const pageTitle = '星光女神'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))