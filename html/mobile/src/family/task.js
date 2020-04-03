
const layout = require('../layouts/layout.js')
const content = require('./task.ejs')
const pageTitle = '家族任务'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
