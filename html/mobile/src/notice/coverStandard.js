
const layout = require('../layouts/layout.js')
const content = require('./coverStandard.ejs')
const pageTitle = '人气直播封面规范'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
