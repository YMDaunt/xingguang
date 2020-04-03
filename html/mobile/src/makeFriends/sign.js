const layout = require('../layouts/layout.js')
const content = require('./sign.ejs')

const pageTitle = '签到'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
