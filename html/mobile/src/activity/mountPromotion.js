const layout = require('../layouts/layout.js')
const content = require('./mountPromotion.ejs')
const pageTitle = '领取座驾活动'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())