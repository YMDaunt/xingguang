const layout = require('../../layouts/layout.js')
const content = require('./bigSecret.ejs')
const pageTitle = '小动物大机密—胡耘豪的猫屋奇遇记 '
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))