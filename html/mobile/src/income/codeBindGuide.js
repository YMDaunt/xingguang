
const layout = require('../layouts/layout.js')
const content = require('./codeBindGuide.ejs')
const pageTitle = '绑定账号'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ packageId }))
