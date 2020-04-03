
const layout = require('../layouts/layout.js')
const content = require('./iosSign.ejs')
const pageTitle = '下载'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
