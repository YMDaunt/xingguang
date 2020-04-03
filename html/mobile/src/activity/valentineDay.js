const layout = require('../layouts/layout.js')
const content = require('./valentineDay.ejs')
const pageTitle = '恋上有你的日子'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
