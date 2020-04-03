const layout = require('../layouts/layout.js')
const content = require('./download.ejs')

const pageTitle = '最火交友'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
