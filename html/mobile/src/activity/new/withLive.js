const layout = require('../../layouts/layout.js')
const content = require('./withLive.ejs')
const pageTitle = '这一年，都发生了什么'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
