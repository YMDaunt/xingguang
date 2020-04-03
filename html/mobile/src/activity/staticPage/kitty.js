const layout = require('../../layouts/layout.js')
const content = require('./kitty.ejs')
const pageTitle = '《小动物大机密》曹曦月'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))