
const layout = require('../layouts/layout.js')
const content = require('./chenqiushi.ejs')
const pageTitle = '爱的轰趴馆'
const packageId = 0

module.exports = layout.init(pageTitle, packageId).run(content())
