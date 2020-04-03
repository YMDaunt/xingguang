const layout = require('../layouts/layout.js')
const content = require('./matching.ejs')

const pageTitle = '撩个妹子回家'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content())
