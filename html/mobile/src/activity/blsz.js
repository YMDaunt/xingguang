const layout = require('../layouts/layout.js');
const content = require('./blsz.ejs');
const pageTitle = '冰力十足的夏天';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));