const layout = require('../layouts/social.js')
const content = require('./social.ejs')
const pageTitle = '全民交友'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
