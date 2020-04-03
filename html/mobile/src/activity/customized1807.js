const layout = require('../layouts/layout.js')
const content = require('./customized1807.ejs')
const pageTitle = '定制你的专属世界'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))