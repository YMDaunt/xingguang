const layout = require('../../layouts/layout.js')
const content = require('./queen8.ejs')
const pageTitle = '周星大作战'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))