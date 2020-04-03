const layout = require('../layouts/layout.js')
const content = require('./MCBattle.ejs')
const pageTitle = '来聊天！赢取百万克拉大礼！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./MCBattle.mixin.ejs')(), pageTitle }))
