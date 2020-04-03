
const layout = require('../layouts/layout.js')
const content = require('./stealHeart.ejs')

const pageTitle = '偷心大盗-人气直播-不是所有人都能看的直播'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
