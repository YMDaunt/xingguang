const layout = require('../layouts/layout.js')
const content = require('./iosGuide.ejs')
const pageTitle = '星光直播ios下载引导'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
