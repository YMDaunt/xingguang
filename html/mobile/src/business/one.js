const layout = require('../layouts/layout.js')
const content = require('./one.ejs')
const pageTitle = '老司机直播'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
