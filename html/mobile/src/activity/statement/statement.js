const layout = require('../../layouts/layout.js')
const content = require('./statement.ejs')
const pageTitle = '星光直播声明'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
