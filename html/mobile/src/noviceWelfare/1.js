const layout = require('../layouts/layout.js')
const content = require('./1.ejs')
const pageTitle = '新手福利'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
