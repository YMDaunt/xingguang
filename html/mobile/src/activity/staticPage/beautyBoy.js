const layout = require('../../layouts/layout.js')
const content = require('./beautyBoy.ejs')
const pageTitle = '烘焙花美男'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))