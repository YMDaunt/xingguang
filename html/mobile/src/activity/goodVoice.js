const layout = require('../layouts/layout.js')
const content = require('./goodVoice.ejs')
const pageTitle = '恋上好声音'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))