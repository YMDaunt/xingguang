const layout = require('../layouts/layout.js')
const content = require('./vivoGuide.ejs')
const pageTitle = '星光直播尊享豪礼'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
