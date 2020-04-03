const layout = require('../layouts/layout.js')
const content = require('./recruit.ejs')
const pageTitle = '星光颜值主播招募令！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))