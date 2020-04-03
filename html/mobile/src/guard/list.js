const layout = require('../layouts/layout.js')
const content = require('./list.ejs')
const pageTitle = '守护神'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
