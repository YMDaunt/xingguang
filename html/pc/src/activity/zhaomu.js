const layout = require('../layouts/layout.js')
const content = require('./zhaomu.ejs')
const pageTitle = '星光直播招募令'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
