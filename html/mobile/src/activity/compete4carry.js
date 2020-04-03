const layout = require('../layouts/layout.js')
const content = require('./compete4carry.ejs')
const pageTitle = '星光C位争夺战'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
