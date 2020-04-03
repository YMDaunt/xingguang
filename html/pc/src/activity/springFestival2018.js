const layout = require('../layouts/layout.js')
const content = require('./springFestival2018.ejs')
const pageTitle = '2019，星光来了'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle, content: require('../../../mobile/src/activity/springFestival2018.mixin.ejs')() }))
