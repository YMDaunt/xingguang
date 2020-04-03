const layout = require('../layouts/layout.js')
const content = require('./christmas17.ejs')
const pageTitle = '圣诞节响叮当'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))