const layout = require('../layouts/layout.js')
const content = require('./newyearBless.ejs')
const pageTitle = '大咖云集 祝你新年快乐'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
