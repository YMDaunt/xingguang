const layout = require('../layouts/layout.js')
const content = require('./yuanxiao.ejs')
const pageTitle = '喜乐元宵'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))