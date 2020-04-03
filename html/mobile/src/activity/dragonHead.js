const layout = require('../layouts/layout.js')
const content = require('./dragonHead.ejs')
const pageTitle = '二月二，龙抬头'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))