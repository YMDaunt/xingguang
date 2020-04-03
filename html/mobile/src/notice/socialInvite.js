const layout = require('../layouts/layout.js')
const content = require('./socialInvite.ejs')
const pageTitle = '视频交友邀你入驻'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
