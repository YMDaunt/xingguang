const layout = require('../layouts/layout.js')
const content = require('./fishDragon.ejs')
const pageTitle = '鱼跃龙门'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))