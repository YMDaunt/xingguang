const layout = require('../../layouts/layout.js')
const content = require('./iceGirl.ejs')
const pageTitle = '星嗨访—霸气冰美人的戏里戏外'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))