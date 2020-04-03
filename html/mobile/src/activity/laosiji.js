const layout = require('../layouts/layout.js')
const content = require('./laosiji.ejs')
const pageTitle = 'laosiji'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
