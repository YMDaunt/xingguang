
const layout = require('../layouts/layout.js');
const content = require('./holiday.ejs');
const pageTitle = '2018春节假期安排';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content());
