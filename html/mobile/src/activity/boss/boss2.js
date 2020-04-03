const layout = require('../../layouts/layout.js');
const content = require('./boss2.ejs');
const pageTitle = '世界boss再次来袭！';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));