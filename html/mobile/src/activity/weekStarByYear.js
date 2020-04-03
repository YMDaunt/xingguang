const layout = require('../layouts/layout.js')
const content = require('./weekStarByYear.ejs')
const pageTitle = '年度周星争夺赛'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))