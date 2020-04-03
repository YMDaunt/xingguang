const layout = require('../layouts/layout.js')
const content = require('./annualReport2018.ejs')
const pageTitle = '2018，你在星光的日子'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
