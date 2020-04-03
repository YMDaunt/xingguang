const layout = require('../layouts/layout.js')
const content = require('./taskCenter.ejs')

const pageTitle = '任务中心'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
