const layout = require('../layouts/layout.js')
const content = require('./gameCenter.ejs')
const pageTitle = 'gameCenter'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
