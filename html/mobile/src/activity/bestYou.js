const layout = require('../layouts/layout.js')
const content = require('./bestYou.ejs')
const pageTitle = '《最好的你们2.0》蔡照&陈秋实 贰周年粉丝答谢会'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))