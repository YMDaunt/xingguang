
const layout = require('../layouts/layout.js')
const content = require('./level.ejs')
const pageTitle = '家族等级'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
