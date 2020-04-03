const layout = require('../layouts/layout.js')
const content = require('./adultShow.ejs')
const pageTitle = '食色性也'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))