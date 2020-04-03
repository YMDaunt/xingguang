const layout = require('../../layouts/layout.js')
const content = require('./pkGame2.ejs')
const pageTitle = 'PK荣耀赛S2赛季'
const packageId = 2
const mixins = require('./pkGame2.mixin.ejs')

module.exports = layout.init(pageTitle, packageId).run(content({ content: mixins(), pageTitle }))
