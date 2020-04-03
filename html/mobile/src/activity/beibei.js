const layout = require('../layouts/layout.js')
const content = require('./beibei.ejs')
const pageTitle = '北北3亿了'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
