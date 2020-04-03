const layout = require('../layouts/layout.js')
const content = require('./valentine.ejs')
const pageTitle = '爱在七夕'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))