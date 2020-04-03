const layout = require('../../layouts/layout.js')
const content = require('./qixi19.ejs')
const pageTitle = '浪漫七夕 情定鹊桥'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle, content: require('./../../../../mobile/src/activity/qixi/qixi19.mixin.ejs')() }))
