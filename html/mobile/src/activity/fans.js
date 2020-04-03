const layout = require('../layouts/layout.js');
const content = require('./fans.ejs');
const pageTitle = '集合，准备团战！';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));