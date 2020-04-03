const content = require('./tuholive.ejs')
const pageTitle = '星光直播'

module.exports = content({ app: {
    pageTitle: pageTitle
} })
