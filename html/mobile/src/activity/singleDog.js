const layout = require('../layouts/layout.js')
const content = require('./singleDog.ejs')
const pageTitle = '进击的11.11'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))