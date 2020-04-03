const layout = require('../layouts/layout.js')
const content = require('./emotion.ejs')
const pageTitle = '《果酱最现场》颜值VS才华，你站谁？'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))