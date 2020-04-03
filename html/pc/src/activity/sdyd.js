const layout = require('../layouts/layout.js')
const content = require('./sdyd.ejs')
const pageTitle = '圣诞•元旦 双蛋来袭'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
