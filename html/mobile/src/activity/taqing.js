const layout = require('../layouts/layout.js')
const content = require('./taqing.ejs')
const pageTitle = '一起踏青趣'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))