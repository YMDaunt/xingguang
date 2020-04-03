const layout = require('../layouts/layout.js')
const content = require('./thanksGiving2017.ejs')
const pageTitle = '感恩节——火鸡猎场！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))