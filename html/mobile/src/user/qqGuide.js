const layout = require('../layouts/layout.js')
const content = require('./qqGuide.ejs')
const pageTitle = '星光直播-附近高颜美女校花热舞'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
