const layout = require('../layouts/layout.js')
const content = require('./SFStocking.ejs')
const pageTitle = '星光年货节'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
