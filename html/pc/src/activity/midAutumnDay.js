const layout = require('../layouts/layout.js')
const content = require('./midAutumnDay.ejs')
const pageTitle = '浓情中秋'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
