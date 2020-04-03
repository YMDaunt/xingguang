const layout = require('../../layouts/layout.js')
const content = require('./wangxuejing.ejs')
const pageTitle = '《王雪晶星嗨访》'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))