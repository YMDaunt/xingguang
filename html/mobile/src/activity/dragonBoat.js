const layout = require('../layouts/layout.js')
const content = require('./dragonBoat.ejs')
const pageTitle = '星光龙舟赛'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))