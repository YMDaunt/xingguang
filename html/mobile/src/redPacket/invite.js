
const layout = require('../layouts/layout.js')
const content = require('./invite.ejs')
const pageTitle = '邀好友，赢红包'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
