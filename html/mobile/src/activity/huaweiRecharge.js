const layout = require('../layouts/layout.js');
const content = require('./huaweiRecharge.ejs');
const pageTitle = '甜蜜七夕，好礼相赠';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));