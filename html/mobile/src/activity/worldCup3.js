const layout = require('../layouts/layout.js')
const content = require('./worldCup3.ejs')
const pageTitle = '一起来看世界杯'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))