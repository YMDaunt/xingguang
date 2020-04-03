const layout = require('../layouts/layout.js')
const content = require('./anchorConvene.ejs')
const pageTitle = '人气直播招募令'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))