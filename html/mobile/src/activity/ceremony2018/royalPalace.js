const layout = require('../../layouts/layout.js')
const content = require('./royalPalace.ejs')
const pageTitle = '2018星光年度盛典荣誉殿堂'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
