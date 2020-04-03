const layout = require('../layouts/layout.js');
const content = require('./foolsDay.ejs');
const pageTitle = '大愚乐家';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));