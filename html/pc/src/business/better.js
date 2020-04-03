const layout = require('../layouts/better.js')
const content = require('./better.ejs')
const pageTitle = '语玩'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
