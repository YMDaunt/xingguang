const layout = require('../layouts/layout.js')
const content = require('./hwpayAct201902.ejs')
const pageTitle = '2019 爱依旧 礼常伴'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
