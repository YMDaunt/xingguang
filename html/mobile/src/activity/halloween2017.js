const layout = require('../layouts/layout.js')
const content = require('./halloween2017.ejs')
const pageTitle = '不给糖，就捣蛋！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))