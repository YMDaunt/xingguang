const layout = require('../layouts/layout.js')
const content = require('./buy.ejs')

const pageTitle = '购买道具'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
