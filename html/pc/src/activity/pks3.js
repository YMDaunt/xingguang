const layout = require('../layouts/layout.js')
const content = require('./pks3.ejs')
const pageTitle = 'PK荣耀赛S3赛季'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
