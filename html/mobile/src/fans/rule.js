
const layout = require('../layouts/layout.js')
const content = require('./rule.ejs')
const pageTitle = '粉丝体系'

module.exports = layout.init(pageTitle).run(content())
