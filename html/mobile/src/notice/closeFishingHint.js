const layout = require('../layouts/layout.js')
const content = require('./closeFishingHint.ejs')
const pageTitle = '捕鱼关闭提示'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
