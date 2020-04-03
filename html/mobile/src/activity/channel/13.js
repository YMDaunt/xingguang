const layout = require('../../layouts/layout.js')
const content = require('./13.ejs')
const pageTitle = '人气直播-至尊版'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))