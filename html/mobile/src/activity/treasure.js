const layout = require('../layouts/layout.js');
const content = require('./treasure.ejs');
const pageTitle = '欢乐夺宝';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));