
const layout = require('../layouts/layout.js')
const content = require('./bind.ejs')
const pageTitle = '微信绑定'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ packageId }))
