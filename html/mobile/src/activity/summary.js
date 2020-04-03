const layout = require('../layouts/layout.js')
const content = require('./summary.ejs')
const pageTitle = '你的星光年度总结新鲜出炉！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))