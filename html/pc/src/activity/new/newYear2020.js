const layout = require('../../layouts/layout.js')
const content = require('./newYear2020.ejs')
const pageTitle = '迎财神 贺新春'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
