const layout = require('../../layouts/layout.js')
const content = require('./dogMan.ejs')
const pageTitle = '《小动物大机密》汪星人大作战'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))