const layout = require('../layouts/layout.js')
const content = require('./pkSong.ejs')
const pageTitle = '歌谣PK一触即发！'
const packageId = 2

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }))
