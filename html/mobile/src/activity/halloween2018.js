const layout = require('../layouts/layout.js')
const content = require('./halloween2018.ejs')
const pageTitle = '万圣节狂欢Party'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
