const layout = require('../layouts/layout.js')
const content = require('./travel.ejs')
const pageTitle = '就想和你去旅行'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
