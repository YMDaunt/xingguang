const layout = require('../../layouts/layout.js')
const content = require('./queen.ejs')
const pageTitle = '女王争霸赛-人气直播-不是所有人都能看的直播'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))