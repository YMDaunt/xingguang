const layout = require('../layouts/layout.js')
const content = require('./thk2018.ejs')
const pageTitle = '感恩节——火鸡盛宴'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
