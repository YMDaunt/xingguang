const layout = require('../layouts/layout.js')
const content = require('./naus.ejs')
const pageTitle = 'NAUS--基於區塊鏈的自演進式--社交網絡生態'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))