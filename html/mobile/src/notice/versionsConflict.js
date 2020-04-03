
const layout = require('../layouts/layout.js')
const content = require('./versionsConflict.ejs')
const pageTitle = '版本检测'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
