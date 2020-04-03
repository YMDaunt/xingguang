const layout = require('../../layouts/layout.js')
const content = require('./jiujiu2.ejs')
const pageTitle = '星光直播'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))