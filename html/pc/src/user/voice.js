const layout = require('../layouts/user.js')
const content = require('./voice.ejs')
const pageTitle = '语聊'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
