const layout = require('../layouts/layout.js')
const content = require('./newYear.ejs')
const pageTitle = '旺财年到,欢聚星光！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))