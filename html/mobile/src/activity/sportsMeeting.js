const layout = require('../layouts/layout.js')
const content = require('./sportsMeeting.ejs')
const pageTitle = '星光冬季运动会！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))