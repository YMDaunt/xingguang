const layout = require('../layouts/layout.js')
const content = require('./unlockPM.ejs')
const pageTitle = '我的提醒'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
