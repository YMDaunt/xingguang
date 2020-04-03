const layout = require('../../layouts/layout.js')
const content = require('./qixi.ejs')
const pageTitle = '缘定七夕'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
