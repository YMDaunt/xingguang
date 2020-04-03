const layout = require('../../layouts/layout.js')
const content = require('./sushi.ejs')
const pageTitle = '私厨日记之《Miss &Mr·Sushi (寿司先生和女士)》'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))