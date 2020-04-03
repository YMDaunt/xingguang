const layout = require('../layouts/layout.js')
const content = require('./vehicle.ejs')
const pageTitle = '我的座驾'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
