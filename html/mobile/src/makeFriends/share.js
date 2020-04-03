const layout = require('../layouts/layout.js')
const content = require('./share.ejs')
const pageTitle = '邀请好友'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
