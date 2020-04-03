const layout = require('../layouts/layout.js')
const content = require('./history.ejs')

const pageTitle = '购买记录'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
