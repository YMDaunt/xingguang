const layout = require('../layouts/layout.js')
const content = require('./suwan.ejs')
const pageTitle = '星光主播签约主播素婉单曲《客栈》首发'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
