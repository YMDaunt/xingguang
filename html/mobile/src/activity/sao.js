const layout = require('../layouts/layout.js');
const content = require('./sao.ejs');
const pageTitle = 'Sao家族2周年庆';
const packageId = 2;

module.exports = layout.init(pageTitle, packageId).run(content({ pageTitle }));