const layout = require('../layouts/layout.js')
const content = require('./weekStarShare.ejs')
const pageTitle = '我的成绩单'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))