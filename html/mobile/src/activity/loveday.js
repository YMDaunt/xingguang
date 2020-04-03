const layout = require('../layouts/layout.js')
const content = require('./loveday.ejs')
const pageTitle = '520告白日'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))