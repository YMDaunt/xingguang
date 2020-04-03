const layout = require('../layouts/layout.js')
const content = require('./callLog.ejs')
const pageTitle = '通话记录'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
