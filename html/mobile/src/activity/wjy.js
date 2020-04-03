const layout = require('../layouts/layout.js')
const content = require('./wjy.ejs')
const pageTitle = '吴俊余“夏日骄阳，微笑出击”'
// const packageId = 2

module.exports = layout.init(pageTitle, 0).run(content({ pageTitle }))