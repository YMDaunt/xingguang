const layout = require('../layouts/layout.js')
const content = require('./sweetsummer.ejs')
const pageTitle = '夏日狂欢大作战'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./sweetsummer.mixin.ejs')(), pageTitle }))
