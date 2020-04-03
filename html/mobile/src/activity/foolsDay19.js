const layout = require('../layouts/layout.js')
const content = require('./foolsDay19.ejs')
const pageTitle = '愚乐无极限'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ content: require('./foolsDay19.mixin.ejs')(), pageTitle }))
