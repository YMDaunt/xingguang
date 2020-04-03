const layout = require('../../layouts/layout.js')
const content = require('./chuyi.ejs')
const pageTitle = '头顶桂冠，尽显女王风范'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))